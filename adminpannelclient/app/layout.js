// Add this directive at the top
import AuthProvider from '@/context/AuthProvider';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="bg-gray-100">
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}