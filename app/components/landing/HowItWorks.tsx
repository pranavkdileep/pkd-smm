import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Badge} from '@astryxdesign/core/Badge';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import type {ReactNode} from 'react';
import {HOW_IT_WORKS} from './content';
import {NamedIcon} from './NamedIcon';
import {SectionIntro} from './SectionIntro';

function StepCopy({step, title, body}: {step: string; title: string; body: string}) {
  return (
    <VStack gap={3} align="start">
      <HStack
        width={12}
        height={12}
        hAlign="center"
        vAlign="center"
        className="rounded-lg bg-blue-subtle text-sm font-bold text-blue-vivid"
      >
        {step}
      </HStack>
      <Heading level={3}>{title}</Heading>
      <Text as="p" color="secondary">
        {body}
      </Text>
      <HStack width={16} height={1} className="rounded-full bg-accent" />
    </VStack>
  );
}

function FieldRow({iconName, value}: {iconName: 'mail' | 'link' | 'user-plus'; value: string}) {
  return (
    <HStack gap={2} vAlign="center" className="rounded-md border border-border bg-card px-3 py-2">
      <NamedIcon name={iconName} size="sm" className="shrink-0 text-secondary" />
      <Text size="xsm" color="secondary">
        {value}
      </Text>
    </HStack>
  );
}

/** Step 01 — registration form with instant verification. */
function MockSignup() {
  return (
    <VStack gap={2}>
      <Text size="xsm" weight="bold" color="secondary" className="uppercase">
        Create your account
      </Text>
      <FieldRow iconName="mail" value="you@example.com" />
      <FieldRow iconName="user-plus" value="@yourbrand" />
      <HStack
        hAlign="center"
        vAlign="center"
        className="rounded-md bg-accent px-3 py-2 text-xs font-bold text-on-accent"
      >
        Create free account
      </HStack>
      <HStack gap={1.5} vAlign="center">
        <NamedIcon name="check-circle" size="sm" className="text-green-vivid" />
        <Text size="xsm" weight="semibold">
          Email verified instantly
        </Text>
      </HStack>
    </VStack>
  );
}

const PAYMENT_OPTIONS = [
  {name: 'Visa', icon: 'credit-card' as const},
  {name: 'Stripe', icon: 'landmark' as const},
  {name: 'Crypto', icon: 'bitcoin' as const},
];

/** Step 02 — payment selector with instant balance credit. */
function MockPayment() {
  return (
    <VStack gap={2}>
      <Text size="xsm" weight="bold" color="secondary" className="uppercase">
        Top up your balance
      </Text>
      <HStack gap={2} wrap="wrap">
        {PAYMENT_OPTIONS.map((option, index) => (
          <HStack
            key={option.name}
            gap={1.5}
            vAlign="center"
            className={`rounded-md border px-3 py-2 ${
              index === 0 ? 'border-blue-ring bg-blue-subtle' : 'border-border bg-card'
            }`}
          >
            <NamedIcon
              name={option.icon}
              size="sm"
              className={index === 0 ? 'text-blue-vivid' : 'text-secondary'}
            />
            <Text size="xsm" weight="semibold">
              {option.name}
            </Text>
          </HStack>
        ))}
      </HStack>
      <HStack
        justify="between"
        vAlign="center"
        className="rounded-md border border-border bg-card px-3 py-2"
      >
        <HStack gap={1.5} vAlign="center">
          <NamedIcon name="wallet" size="sm" className="text-secondary" />
          <Text size="xsm">Balance credited instantly</Text>
        </HStack>
        <Text size="xsm" weight="bold" className="text-green-vivid">
          +$25.00
        </Text>
      </HStack>
    </VStack>
  );
}

/** Step 03 — service picker with a live price calculator. */
function MockOrderForm() {
  return (
    <VStack gap={2}>
      <Text size="xsm" weight="bold" color="secondary" className="uppercase">
        New order
      </Text>
      <HStack justify="between" vAlign="center" className="rounded-md border border-border bg-card px-3 py-2">
        <Text size="xsm" weight="semibold">
          Instagram · Real Followers
        </Text>
        <NamedIcon name="chevron-down" size="sm" className="text-secondary" />
      </HStack>
      <FieldRow iconName="link" value="https://instagram.com/yourprofile" />
      <HStack justify="between" vAlign="center" className="rounded-md bg-body px-3 py-2">
        <Text size="xsm" color="secondary">
          1,000 × $0.49 / 1K
        </Text>
        <Text size="xsm" weight="bold">
          $0.49 total
        </Text>
      </HStack>
    </VStack>
  );
}

/** Step 04 — live order progress tracker. */
function MockTracking() {
  return (
    <VStack gap={2}>
      <HStack justify="between" vAlign="center">
        <Text size="xsm" weight="bold" color="secondary" className="uppercase">
          Order #48291
        </Text>
        <Badge variant="success" label="Delivering" />
      </HStack>
      <ProgressBar label="Order delivery progress" value={72} hasValueLabel variant="accent" />
      <HStack gap={1.5} vAlign="center">
        <NamedIcon name="check-circle" size="sm" className="text-green-vivid" />
        <Text size="xsm">Start count confirmed</Text>
        <HStack className="ml-auto">
          <Text size="xsm" color="secondary">
            720 / 1,000
          </Text>
        </HStack>
      </HStack>
      <HStack gap={1.5} vAlign="center">
        <NamedIcon name="shield-check" size="sm" className="text-blue-vivid" />
        <Text size="xsm">30-day refill window active</Text>
      </HStack>
    </VStack>
  );
}

const STEP_MOCKS: Record<string, ReactNode> = {
  '01': <MockSignup />,
  '02': <MockPayment />,
  '03': <MockOrderForm />,
  '04': <MockTracking />,
};

/** Mock browser chrome built from components — no external screenshots. */
function MockWindow({step, className}: {step: string; className?: string}) {
  return (
    <VStack className={`overflow-hidden rounded-lg border border-border bg-card shadow-md ${className ?? ''}`}>
      <HStack gap={2} vAlign="center" className="border-b border-border bg-surface px-4 py-3">
        <HStack gap={1}>
          <HStack width={3} height={3} className="rounded-full bg-red-vivid" />
          <HStack width={3} height={3} className="rounded-full bg-yellow-vivid" />
          <HStack width={3} height={3} className="rounded-full bg-green-vivid" />
        </HStack>
        <HStack
          gap={1.5}
          vAlign="center"
          className="flex-1 justify-center rounded-full bg-body px-4 py-1.5"
        >
          <NamedIcon name="lock" size="sm" className="text-secondary" />
          <Text size="3xs" weight="semibold" color="secondary">
            pkd-smm.panel/dashboard/step-{step.toLowerCase()}
          </Text>
        </HStack>
      </HStack>

      <VStack padding={4} className="bg-body">
        {STEP_MOCKS[step]}
      </VStack>
    </VStack>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-label="How it works" className="scroll-mt-24 bg-body py-16 md:py-24">
      <VStack maxWidth={1280} gap={10} className="mx-auto w-full px-6">
        <SectionIntro eyebrow="How it works" title="Four steps to your first boost" />

        {HOW_IT_WORKS.map((item, index) => {
          const copy = <StepCopy step={item.step} title={item.title} body={item.body} />;
          // Copy always comes first in the DOM so mobile reading order is
          // correct; on md+ alternating rows pull the mockup ahead via order.
          const reversed = index % 2 === 1;
          return (
            <Grid
              key={item.step}
              columns={{minWidth: 380, max: 2}}
              gap={8}
              align="center"
              aria-label={`Step ${item.step}: ${item.title}`}
            >
              {copy}
              <MockWindow step={item.step} className={reversed ? 'md:order-first' : undefined} />
            </Grid>
          );
        })}
      </VStack>
    </section>
  );
}
