import {Fragment} from 'react';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {List, ListItem} from '@astryxdesign/core/List';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Token} from '@astryxdesign/core/Token';
import {Banner} from '@astryxdesign/core/Banner';

import {getSupportTicketDetail} from '@/actions/support/list';
import {SUPPORT_COMMENT_PAGE_SIZES} from '@/lib/database';

import {CloseTicketButton} from './CloseTicketButton';
import {ReplyForm} from './ReplyForm';
import {UrlPagination} from '@/app/components/support/UrlPagination';
import {
  CATEGORY_LABELS,
  CATEGORY_TOKEN_COLORS,
  PRIORITY_LABELS,
  PRIORITY_TOKEN_COLORS,
  formatCommentTimestamp,
  formatTicketDate,
  ticketRef,
} from '@/app/components/support/ticketMeta';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Support ticket · ${siteConfig.name}`,
};

type Params = Promise<{id: string}>;
type SearchParams = Promise<{[key: string]: string | string[] | undefined}>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : undefined;
}

/** Message body with line breaks preserved — ReactNode keeps ListItem wrapping. */
function MessageBody({message}: {message: string}) {
  return (
    <Text type="body" color="primary">
      {message.split('\n').map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </Text>
  );
}

export default async function SupportTicketPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const {id} = await params;
  const commentParams = await searchParams;
  const page = parsePositiveInt(firstParam(commentParams.page));
  const pageSizeParam = parsePositiveInt(firstParam(commentParams.pageSize));
  const pageSize =
    pageSizeParam && (SUPPORT_COMMENT_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;

  const result = await getSupportTicketDetail(id, {page, pageSize});
  if (!result) {
    notFound();
  }

  const {
    ticket,
    comments,
    totalComments,
    page: commentPage,
    pageSize: commentPageSize,
    totalPages,
  } = result;
  const isOpen = ticket.status === 'open';
  const closedDescription = ticket.closedAt
    ? `Closed ${formatTicketDate(ticket.closedAt)}. Open a new ticket if you still need help.`
    : 'Open a new ticket if you still need help.';

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <HStack justify="between" vAlign="start" wrap="wrap" gap={3} width="100%">
        <VStack gap={2}>
          <Link href="/user/support" className="text-sm text-secondary hover:text-blue-vivid">
            <HStack gap={1} vAlign="center">
              <ArrowLeft size={14} aria-hidden="true" />
              All tickets
            </HStack>
          </Link>
          <VStack gap={1}>
            <Heading level={1}>{ticket.title}</Heading>
            <HStack gap={2} vAlign="center" wrap="wrap">
              <Text size="sm" color="secondary">
                {ticketRef(ticket.id)}
              </Text>
              <Token
                label={CATEGORY_LABELS[ticket.category] ?? ticket.category}
                color={CATEGORY_TOKEN_COLORS[ticket.category] ?? 'gray'}
                size="sm"
              />
              <Token
                label={`${PRIORITY_LABELS[ticket.priority] ?? ticket.priority} priority`}
                color={PRIORITY_TOKEN_COLORS[ticket.priority] ?? 'gray'}
                size="sm"
              />
              <HStack gap={1.5} vAlign="center">
                <StatusDot
                  variant={isOpen ? 'accent' : 'neutral'}
                  label={isOpen ? 'Open' : 'Closed'}
                />
                <Text size="sm">{isOpen ? 'Open' : 'Closed'}</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Opened {formatTicketDate(ticket.createdAt)} · last activity{' '}
                {formatTicketDate(ticket.updatedAt)}
              </Text>
            </HStack>
          </VStack>
        </VStack>
        {isOpen ? <CloseTicketButton ticketId={ticket.id} /> : null}
      </HStack>

      <List
        header={
          <HStack justify="between" vAlign="center" wrap="wrap" gap={2} width="100%">
            <Heading level={2}>Conversation</Heading>
            <Text size="sm" color="secondary">
              {totalComments.toLocaleString()} {totalComments === 1 ? 'message' : 'messages'}
            </Text>
          </HStack>
        }
        hasDividers
      >
        {comments.length === 0 ? (
          <ListItem label="No messages yet" />
        ) : (
          comments.map((comment) => (
            <ListItem
              key={comment.id}
              label={comment.authorType === 'admin' ? 'Support team' : 'You'}
              description={<MessageBody message={comment.message} />}
              endContent={
                <Text size="sm" color="secondary">
                  {formatCommentTimestamp(comment.createdAt)}
                </Text>
              }
            />
          ))
        )}
      </List>

      {totalPages > 1 ? (
        <HStack justify="end" wrap="wrap">
          <UrlPagination
            label="Conversation pagination"
            page={commentPage}
            pageSize={commentPageSize}
            total={totalComments}
            totalPages={totalPages}
            pageSizes={SUPPORT_COMMENT_PAGE_SIZES}
          />
        </HStack>
      ) : null}

      {isOpen ? (
        <ReplyForm
          ticketId={ticket.id}
          page={commentPage}
          pageSize={commentPageSize}
          totalComments={totalComments}
        />
      ) : (
        <Banner status="info" title="This ticket is closed" description={closedDescription} />
      )}
    </VStack>
  );
}
