import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import '@atm0s-media-sdk/ui/globals.css'
import { RecoilProvider, ThemeProvider } from '@atm0s-media-sdk/ui/providers/index'
import { MainLayout } from '@/layouts'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'OMEET',
  description: 'OMEET - Online Meeting',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} id="id--full-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RecoilProvider>
            <MainLayout>{children}</MainLayout>
          </RecoilProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
