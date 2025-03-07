// Add this directive at the top
import AuthProvider from '@/context/AuthProvider';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="bg-gray-100">
          <Toaster />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}