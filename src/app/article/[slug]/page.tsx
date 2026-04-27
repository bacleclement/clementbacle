import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticles, getArticle } from '@/lib/articles'
import styles from './article.module.scss'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getArticles().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  return { title: `${article.title} — Clément Bacle` }
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

function extractToc(html: string): { id: string; text: string }[] {
  const matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  return matches.map((m, i) => ({
    id: `s${i + 1}`,
    text: m[1].replace(/<[^>]+>/g, ''),
  }))
}

function injectHeadingIds(html: string): string {
  let i = 0
  return html.replace(/<h2([^>]*)>/gi, (_, attrs) => `<h2${attrs} id="s${++i}">`)
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const allArticles = getArticles()
  const globalIndex = allArticles.findIndex(a => a.slug === slug)
  const num = String(allArticles.length - globalIndex).padStart(3, '0')

  const toc = extractToc(article.contentHtml)
  const bodyHtml = injectHeadingIds(article.contentHtml)

  return (
    <div className="shell">
      <Link href="/writing" className={styles.backLink}>← writing</Link>

      {/* Cover hero */}
      <div className={styles.coverHero}>
        <div className={`cover ${article.coverColor}`}>
          <div className="cover__num">№ {num}</div>
          <div><div className="cover__title">{article.title}</div></div>
          <div className="cover__foot">
            <span>{formatDate(article.date_written)}</span>
            <span>{article.readingTime}′</span>
          </div>
        </div>
        <div>
          <div className={styles.heroMeta}>
            <span>{formatDate(article.date_written)}</span>
            <span>{article.readingTime} min</span>
            {article.language === 'fr' && <span>fr</span>}
            {article.tags.slice(0, 3).map(t => (
              <Link key={t} href={`/writing?tag=${t}`}>{t}</Link>
            ))}
          </div>
          <h1 className={styles.heroTitle}>{article.title}</h1>
          {article.series && (
            <div className={styles.byline}>
              <span>série · <b>{article.series}</b></span>
            </div>
          )}
        </div>
      </div>

      {/* Body + TOC sidebar */}
      <div className={styles.articleLayout}>
        <article
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {toc.length > 0 && (
          <aside className={styles.toc}>
            <h4>sommaire</h4>
            {toc.map(h => (
              <a key={h.id} href={`#${h.id}`}>{h.text}</a>
            ))}
          </aside>
        )}
      </div>

      {/* Sources */}
      {article.sources_factuelles && article.sources_factuelles.length > 0 && (
        <div className={styles.sources}>
          <h4>sources</h4>
          {article.sources_factuelles.map(url => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          ))}
        </div>
      )}

      <Link href="/writing" className={styles.backLink}>← back to writing</Link>
    </div>
  )
}
