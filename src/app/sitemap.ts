import { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl()

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/auth/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/auth/signin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
