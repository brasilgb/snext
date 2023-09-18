'use client';
import './globals.css';
import { usePathname } from 'next/navigation';
import { checkIsPublicRoute } from '@/functions/check-is-public-route';
import PrivateRoute from '@/components/PrivateRoute';
import { AuthProvider } from '@/contexts/auth';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = checkIsPublicRoute(pathname!);
  return (
    <html lang="en">
      <body>
        <main>
        <AuthProvider>
          {isPublicPage && children}
          {!isPublicPage && (
            <PrivateRoute>{children}</PrivateRoute>
          )}
        </AuthProvider>
        </main>
      </body>
    </html>
  );
}
