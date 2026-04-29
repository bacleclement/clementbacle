import { ImageResponse } from 'next/og'
import { getArticle, getArticles } from '@/lib/articles'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getArticles().map(a => ({ slug: a.slug }))
}

const CATEGORY_COLOR: Record<string, string> = {
  business: '#E85C30',
  ai:       '#5B8FE8',
  software: '#4CAF7D',
  tech:     '#B8860B',
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  const title = article?.title ?? 'Article'
  const category = article?.category ?? ''
  const accent = CATEGORY_COLOR[category] ?? '#E85C30'
  const readTime = article?.readingTime ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F0F12',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          {category ? (
            <div
              style={{
                display: 'flex',
                color: accent,
                fontSize: 11,
                fontFamily: 'monospace',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: `1px solid ${accent}`,
                padding: '4px 10px',
                borderRadius: 3,
              }}
            >
              {category}
            </div>
          ) : null}
          <div style={{ display: 'flex', color: '#636059', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.08em' }}>
            clementbacle.com
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              color: '#F5F0EB',
              fontSize: title.length > 60 ? 44 : 56,
              fontFamily: 'serif',
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40,
          }}
        >
          <div style={{ display: 'flex', color: '#636059', fontSize: 14, fontFamily: 'monospace' }}>
            Clément Bacle
          </div>
          {readTime > 0 ? (
            <div style={{ display: 'flex', color: '#636059', fontSize: 14, fontFamily: 'monospace' }}>
              {readTime} min read
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  )
}
