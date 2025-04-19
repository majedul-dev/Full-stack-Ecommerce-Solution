// hooks/useSessionCheck.js
'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export const useSessionCheck = () => {
  const { data: session } = useSession();

  const clearAuthData = () => {
    // Clear accessible cookies
    const cookieNames = [
      'next-auth.callback-url',
      'next-auth.csrf-token'
    ];
    
    cookieNames.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });

    // Clear storage
    localStorage.removeItem('nextauth.message');
    sessionStorage.clear();
  };

  useEffect(() => {
    if (session?.expires) {
      const expirationTime = new Date(session.expires).getTime();
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration <= 0) {
        clearAuthData();
        signOut({ callbackUrl: '/login' });
      } else {
        const timer = setTimeout(() => {
          clearAuthData();
          signOut({ callbackUrl: '/login' });
        }, timeUntilExpiration);

        return () => clearTimeout(timer);
      }
    }
  }, [session]);
};