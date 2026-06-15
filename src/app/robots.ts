import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://billbook.in'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/auth/signin', '/auth/signup'],
        disallow: ['/dashboard', '/invoices', '/clients', '/settings', '/billing', '/api/', '/invoice/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
