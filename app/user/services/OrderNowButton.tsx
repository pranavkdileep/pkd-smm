'use client';

import NextLink from 'next/link';
import {Button} from '@astryxdesign/core/Button';

/**
 * "Order now" deep link rendered as a button. Must be a client component:
 * passing next/link as the Button `as` component from a server component would
 * send a function across the RSC boundary.
 */
export function OrderNowButton({serviceId}: {serviceId: string}) {
  return (
    <Button
      as={NextLink}
      href={`/user?service=${encodeURIComponent(serviceId)}`}
      label="Order now"
      size="sm"
    />
  );
}
