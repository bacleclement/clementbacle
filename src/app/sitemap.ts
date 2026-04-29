import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/articles'

const BASE = 'https://clementbacle.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/writing`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/projects`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const articleRoutes: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${BASE}/article/${a.slug}`,
    lastModified: new Date(a.date_written),
    changeFrequency: 'yearly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...articleRoutes]
}
