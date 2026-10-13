import {Text} from '@astryxdesign/core/Text';

import type {CatalogServiceRow} from '@/actions/users/services';
import {PLATFORM_LABELS} from '@/app/components/platformMeta';
import type {PlatformKey} from '@/app/components/landing/BrandIcon';
import {formatAmount} from '@/app/user/add-funds/format';
import {ListingList, ListingMeta, ListingRow} from '@/app/components/catalog/ListingRow';
import {PlatformTile} from '@/app/components/catalog/PlatformTile';

import {OrderNowButton} from './OrderNowButton';

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US', {notation: 'compact', maximumFractionDigits: 1}).format(value);
}

/** One row per service in a single divided panel, marketplace style. */
export function ServicesListing({services}: {services: CatalogServiceRow[]}) {
  return (
    <ListingList label="Services">
      {services.map((service) => {
        const platformKey = service.platform.toLowerCase() as PlatformKey;
        const features = [
          service.refill ? 'Refillable' : null,
          service.cancel ? 'Cancellable' : null,
        ].filter(Boolean);

        return (
          <ListingRow
            key={service.id}
            media={<PlatformTile platform={platformKey} />}
            title={service.name}
            description={service.description || undefined}
            meta={
              <ListingMeta>
                <Text type="supporting" color="primary" weight="medium">
                  {PLATFORM_LABELS[platformKey]}
                </Text>
                <Text type="supporting">· {formatCount(service.minOrder)}–{formatCount(service.maxOrder)} per order</Text>
                {features.length > 0 ? <Text type="supporting">· {features.join(' · ')}</Text> : null}
              </ListingMeta>
            }
            price={formatAmount(service.price, 'INR')}
            priceNote="per 1,000"
            action={<OrderNowButton serviceId={service.id} />}
          />
        );
      })}
    </ListingList>
  );
}
