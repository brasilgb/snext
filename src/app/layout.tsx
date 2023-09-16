'use client'
import './globals.css'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import { checkIsPublicRoute } from "@/functions/check-is-public-route"
import PrivateRoute from "@/components/PrivateRoute"
import { AuthProvider } from "@/contexts/auth"
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname();
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
