// hooks/useSessionCheck.js
'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export const useSessionCheck = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.expires) {
      const expirationTime = new Date(session.expires).getTime();
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration <= 0) {
        signOut({ callbackUrl: '/login' });
      } else {
        const timer = setTimeout(() => {
          signOut({ callbackUrl: '/login' });
        }, timeUntilExpiration);

        return () => clearTimeout(timer);
      }
    }
  }, [session]);
};