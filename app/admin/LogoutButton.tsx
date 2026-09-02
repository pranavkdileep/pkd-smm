'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@astryxdesign/core/Button';

import {logout} from '@/actions/auth/logout';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      label="Sign out"
      variant="secondary"
      isDisabled={isPending}
      isLoading={isPending}
      onClick={async () => {
        setIsPending(true);
        try {
          await logout();
          router.push('/');
        } finally {
          setIsPending(false);
        }
      }}
    />
  );
}
