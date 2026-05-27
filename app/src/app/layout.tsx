import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/src/components/providers'

export const metadata: Metadata = {
  title: 'tradelog · Discipline · Insight · Growth',
  description: 'AI-powered trading journal and behavioral coach for retail forex traders on MT5.',
  keywords: ['trading journal', 'forex', 'MT5', 'India', 'discipline', 'trading psychology'],
  openGraph: {
    title: 'tradelog',
    description: 'Discipline · Insight · Growth',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
