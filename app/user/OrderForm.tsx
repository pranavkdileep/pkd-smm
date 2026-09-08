'use client';

import {useMemo, useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/navigation';
import {Search} from 'lucide-react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Link} from '@astryxdesign/core/Link';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {
  Typeahead,
  TypeaheadItem,
  type SearchableItem,
  type SearchSource,
} from '@astryxdesign/core/Typeahead';
import {VStack} from '@astryxdesign/core/VStack';

import {createOrder} from '@/actions/users/orders';
import {searchOrderServices, type OrderServiceDetails} from '@/actions/users/services';
import {BrandIcon, type PlatformKey} from '@/app/components/landing/BrandIcon';
import {PLATFORM_LABELS, PLATFORM_TINTS} from '@/app/components/platformMeta';
import {formatAmount} from '@/app/user/add-funds/format';

type ServiceItem = SearchableItem<OrderServiceDetails>;

type Feedback =
  | {type: 'error'; title: string}
  | {type: 'success'; title: string; description: string};

function toItem(service: OrderServiceDetails): ServiceItem {
  return {id: service.id, label: service.name, auxiliaryData: service};
}

function platformKeyOf(service: OrderServiceDetails): PlatformKey {
  return service.platform.toLowerCase() as PlatformKey;
}

/** Mirrors the server-side billing formula in actions/users/orders.ts — price is per 1K. */
function chargeFor(service: OrderServiceDetails, quantity: number): number {
  return Math.ceil((service.price * quantity) / 10) / 100;
}

function ServiceDetails({service}: {service: OrderServiceDetails}) {
  const platformKey = platformKeyOf(service);
  const perks = [service.refill ? 'Refillable' : '', service.cancel ? 'Cancellable' : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <VStack gap={3}>
      <HStack gap={2} vAlign="center">
        <HStack
          width={9}
          height={9}
          hAlign="center"
          vAlign="center"
          className={`rounded-lg ${PLATFORM_TINTS[platformKey]}`}
        >
          <BrandIcon platform={platformKey} size="md" />
        </HStack>
        <VStack gap={0}>
          <Text size="sm" color="secondary">
            {PLATFORM_LABELS[platformKey]}
          </Text>
          <Heading level={4}>{service.name}</Heading>
        </VStack>
      </HStack>
      {service.description ? (
        <Text size="sm" color="secondary">
          {service.description}
        </Text>
      ) : null}
      <VStack gap={1} className="border-t border-border pt-3">
        <HStack justify="between" width="100%">
          <Text size="sm" color="secondary">
            Rate
          </Text>
          <Text size="sm" weight="bold">
            {formatAmount(service.price, 'INR')} / 1K
          </Text>
        </HStack>
        <HStack justify="between" width="100%">
          <Text size="sm" color="secondary">
            Limits
          </Text>
          <Text size="sm">
            {service.minOrder.toLocaleString()} – {service.maxOrder.toLocaleString()}
          </Text>
        </HStack>
        {perks ? (
          <HStack justify="between" width="100%">
            <Text size="sm" color="secondary">
              Guarantees
            </Text>
            <Text size="sm">{perks}</Text>
          </HStack>
        ) : null}
      </VStack>
    </VStack>
  );
}

/**
 * New-order form: typeahead service search backed by a server action, the
 * service's dynamic order-form fields, quantity with live charge calculation,
 * and balance-aware submission via the createOrder server action.
 */
export function OrderForm({
  initialService,
  balance,
}: {
  initialService: OrderServiceDetails;
  balance: number;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<ServiceItem | null>(() => toItem(initialService));
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(initialService.minOrder);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchSource = useMemo<SearchSource<ServiceItem>>(
    () => ({
      search: async (query) => (await searchOrderServices(query)).map(toItem),
      bootstrap: async () => (await searchOrderServices('')).map(toItem),
    }),
    []
  );

  const service = selected?.auxiliaryData ?? null;
  const charge = service ? chargeFor(service, quantity) : null;
  const isInsufficient = charge !== null && charge > balance;

  function handleSelect(item: ServiceItem | null) {
    setSelected(item);
    setFeedback(null);
    setInputErrors({});
    setInputs({});
    setQuantity(item?.auxiliaryData?.minOrder ?? 1);
  }

  function handleInputChange(slug: string, value: string) {
    setInputs((prev) => ({...prev, [slug]: value}));
    setInputErrors((prev) => {
      if (!prev[slug]) {
        return prev;
      }
      const next = {...prev};
      delete next[slug];
      return next;
    });
  }

  async function handleSubmit() {
    if (!service || isSubmitting) {
      return;
    }

    const errors: Record<string, string> = {};
    for (const [slug, label] of Object.entries(service.inputs)) {
      if (!(inputs[slug] ?? '').trim()) {
        errors[slug] = `${label} is required.`;
      }
    }
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      setFeedback({type: 'error', title: 'Fill in the highlighted fields to continue.'});
      return;
    }
    if (quantity < service.minOrder || quantity > service.maxOrder) {
      setFeedback({
        type: 'error',
        title: `Quantity must be between ${service.minOrder.toLocaleString()} and ${service.maxOrder.toLocaleString()}.`,
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const result = await createOrder({
        serviceId: service.id,
        quantity,
        inputs: Object.fromEntries(
          Object.entries(service.inputs).map(([slug]) => [slug, (inputs[slug] ?? '').trim()])
        ),
      });
      if (!result.success) {
        setFeedback({type: 'error', title: result.error ?? 'Could not place the order. Try again.'});
        return;
      }
      setFeedback({
        type: 'success',
        title: 'Order placed',
        description: `Order #${result.orderId?.slice(0, 8)} is pending — fulfillment starts in the background.`,
      });
      setInputs({});
      setQuantity(service.minOrder);
      // Re-render the layout so the top-bar balance reflects the debit.
      router.refresh();
    } catch {
      setFeedback({type: 'error', title: 'Something went wrong. Try again.'});
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <Grid columns={{minWidth: 320, max: 2}} gap={4}>
      <Card padding={4} elevation="low">
        <VStack gap={4}>
          <Heading level={3}>Service</Heading>
          <Typeahead
            label="Search services"
            searchSource={searchSource}
            value={selected}
            onChange={handleSelect}
            placeholder="Search by name or keyword…"
            description="Start typing to search every active service."
            startIcon={Search}
            hasEntriesOnFocus
            hasClear
            maxMenuItems={8}
            debounceMs={200}
            emptySearchResultsText="No services match that search"
            isDisabled={isSubmitting}
            width="100%"
            renderItem={(item) => {
              const entry = item.auxiliaryData;
              if (!entry) {
                return <TypeaheadItem item={item} />;
              }
              const platformKey = platformKeyOf(entry);
              return (
                <TypeaheadItem
                  item={item}
                  icon={<BrandIcon platform={platformKey} size="sm" />}
                  description={`${PLATFORM_LABELS[platformKey]} · ${formatAmount(entry.price, 'INR')} / 1K`}
                />
              );
            }}
          />
          {service ? (
            <ServiceDetails service={service} />
          ) : (
            <Text size="sm" color="secondary">
              Pick a service above to see its rate, limits, and order form.
            </Text>
          )}
        </VStack>
      </Card>

      <Card padding={4} elevation="low">
        <VStack gap={4}>
          <Heading level={3}>Order details</Heading>

          {feedback?.type === 'error' ? <Banner status="error" title={feedback.title} /> : null}
          {feedback?.type === 'success' ? (
            <Banner
              status="success"
              title={feedback.title}
              description={feedback.description}
              isDismissable
              onDismiss={() => setFeedback(null)}
              endContent={
                <Link as={NextLink} href="/user/orders" isStandalone>
                  Track order
                </Link>
              }
            />
          ) : null}

          {service ? (
            <>
              {Object.entries(service.inputs).map(([slug, label]) => (
                <TextInput
                  key={slug}
                  label={label}
                  value={inputs[slug] ?? ''}
                  onChange={(value) => handleInputChange(slug, value)}
                  htmlName={slug}
                  isRequired
                  isDisabled={isSubmitting}
                  status={
                    inputErrors[slug] ? {type: 'error', message: inputErrors[slug]} : undefined
                  }
                  width="100%"
                />
              ))}

              <NumberInput
                label="Quantity"
                value={quantity}
                onChange={setQuantity}
                min={service.minOrder}
                max={service.maxOrder}
                isIntegerOnly
                hasNumberSteppers
                isWheelEnabled={false}
                isRequired
                isDisabled={isSubmitting}
                description={`Min ${service.minOrder.toLocaleString()} · Max ${service.maxOrder.toLocaleString()}`}
                width="100%"
              />

              <VStack gap={2} className="rounded-lg border border-border bg-surface p-4">
                <HStack justify="between" width="100%">
                  <Text size="sm" color="secondary">
                    {formatAmount(service.price, 'INR')} / 1K × {quantity.toLocaleString()}
                  </Text>
                  <Text size="sm" color="secondary">
                    Balance {formatAmount(balance, 'INR')}
                  </Text>
                </HStack>
                <HStack
                  justify="between"
                  vAlign="center"
                  width="100%"
                  className="border-t border-border pt-2"
                >
                  <Text weight="bold">Total charge</Text>
                  <Heading level={3}>{formatAmount(charge ?? 0, 'INR')}</Heading>
                </HStack>
              </VStack>

              {isInsufficient ? (
                <Banner
                  status="warning"
                  title="Insufficient balance"
                  description="Top up your wallet to cover this order."
                  endContent={
                    <Link as={NextLink} href="/user/add-funds" isStandalone>
                      Add funds
                    </Link>
                  }
                />
              ) : null}

              <Button
                label="Place order"
                variant="primary"
                width="100%"
                isLoading={isSubmitting}
                isDisabled={isInsufficient}
                onClick={handleSubmit}
              />
              <Text size="sm" color="secondary">
                The total is debited from your balance right away — orders that fail upstream are
                refunded automatically.
              </Text>
            </>
          ) : (
            <Text size="sm" color="secondary">
              No service selected. Search and pick one to configure your order.
            </Text>
          )}
        </VStack>
      </Card>
    </Grid>
  );
}

