// components/SessionChecker.jsx
'use client';

import { useSessionCheck } from '@/hooks/useSessionCheck';

export default function SessionChecker({ children }) {
  useSessionCheck();
  return <>{children}</>;
}