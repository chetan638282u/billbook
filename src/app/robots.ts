import { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppUrl()

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
