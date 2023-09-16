'use client'
import './globals.css'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import { checkIsPublicRoute } from "@/functions/check-is-public-route"
import PrivateRoute from "@/components/PrivateRoute"
<<<<<<< HEAD
import { AuthProvider } from "@/contexts/auth"
=======
import { AuthProvider, useAuthContext } from "@/contexts/auth"

>>>>>>> 8b442f1ba2b5d6d3c6186d67f6bd4fe3f691e2e2
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
const {authenticated, user} = useAuthContext();
  const pathname = usePathname();
  console.log(pathname, user);
  const isPublicPage = checkIsPublicRoute(pathname!)

  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <div>
            <AuthProvider>
              {isPublicPage && children}
              {!isPublicPage && <PrivateRoute>{children}</PrivateRoute>}
            </AuthProvider>
          </div>
        </main>
      </body>
    </html>
  )
}
