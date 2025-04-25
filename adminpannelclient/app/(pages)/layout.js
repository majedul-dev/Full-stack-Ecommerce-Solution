// app/(pages)/layout.js
import SessionChecker from '@/components/SessionChecker';

export default function Layout({ children }) {
  return (
      <SessionChecker>
        {children}
    </SessionChecker>
  );
}