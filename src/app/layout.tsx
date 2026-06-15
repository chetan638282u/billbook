import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BillBook.in — Free GST Invoice Generator for Indian Businesses',
    template: '%s | BillBook.in',
  },
  description: 'Create professional GST-compliant invoices in 60 seconds. Free for Indian freelancers, small businesses and consultants. CGST, SGST, IGST auto-calculated.',
  keywords: ['GST invoice generator India', 'free billing software India', 'online invoice maker', 'GST billing tool', 'freelancer invoice India'],
  authors: [{ name: 'BillBook.in' }],
  creator: 'BillBook.in',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://billbook.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'BillBook.in',
    title: 'BillBook.in — Free GST Invoice Generator for Indian Businesses',
    description: 'Create professional GST-compliant invoices in 60 seconds. Free for Indian freelancers and small businesses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BillBook.in — Free GST Invoice Generator',
    description: 'GST-compliant invoices in 60 seconds. Free for Indian businesses.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
