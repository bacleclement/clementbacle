import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticles, type Article } from '@/lib/articles'
import styles from './writing.module.scss'

export const metadata: Metadata = {
  title: 'Writing — Clément Bacle',
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

function groupByYear(articles: Article[]): Map<string, Article[]> {
  const map = new Map<string, Article[]>()
  for (const a of articles) {
    const year = a.date_written.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(a)
  }
  return map
}

const COLOR_VAR: Record<string, string> = {
  brick:    'var(--c-brick)',
  prussian: 'var(--c-prussian)',
  ocher:    'var(--c-ocher)',
  forest:   'var(--c-forest)',
  plum:     'var(--c-plum)',
}

export default function WritingPage() {
  const articles = getArticles()
  const latest5 = articles.slice(0, 5)
  const byYear = groupByYear(articles)
  const totalRead = articles.reduce((s, a) => s + a.readingTime, 0)

  return (
    <div className="shell">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.pageHead}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>
            ~/writing &mdash; {articles.length} essay{articles.length !== 1 ? 's' : ''} · 2021–2026
          </div>
          <h1>Notes from <em>shipping</em><br />agents in production.</h1>
        </div>
        <p className={styles.lede}>
          Long-form essais on AI agents, context engineering, MCP, NestJS,
          and the long bumpy road from &ldquo;demo&rdquo; to &ldquo;actually used by people who pay.&rdquo;
        </p>
      </header>

      {/* ── Featured covers strip ───────────────────────────── */}
      {latest5.length > 0 && (
        <section className={styles.strip}>
          <div className={styles.stripHead}>
            <span>★ recently · last {latest5.length}</span>
          </div>
          <div className={styles.stripGrid}>
            {latest5.map((a, i) => (
              <Link key={a.slug} href={`/article/${a.slug}`}>
                <div className={`cover ${a.coverColor}`}>
                  <div className="cover__num">№ {String(articles.length - i).padStart(3, '0')}</div>
                  <div><div className="cover__title">{a.title}</div></div>
                  <div className="cover__foot">
                    <span>{formatDate(a.date_written)}</span>
                    <span>{a.readingTime}′</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Filter bar (static — search/filter P2) ─────────── */}
      <div className={styles.filterbar}>
        <div className={styles.tagsRow}>
          <span className="tag is-active">all · {articles.length}</span>
          {Array.from(new Set(articles.flatMap(a => a.tags))).slice(0, 6).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* ── Year-grouped entries ────────────────────────────── */}
      {Array.from(byYear.entries()).map(([year, yearArticles]) => {
        const totalMin = yearArticles.reduce((s, a) => s + a.readingTime, 0)
        return (
          <section key={year} className={styles.yearBlock}>
            <div className={styles.yearHead}>
              <h3>{year}</h3>
              <div className={styles.meta}>{yearArticles.length} essay{yearArticles.length !== 1 ? 's' : ''} · ~{totalMin} min total</div>
            </div>
            {yearArticles.map((a, i) => {
              const globalNum = articles.indexOf(a)
              return (
                <Link key={a.slug} className={styles.entry} href={`/article/${a.slug}`}>
                  <div className={styles.entryDate}>{formatDate(a.date_written)}</div>
                  <div className={styles.entryNum}>№ {String(articles.length - globalNum).padStart(3, '0')}</div>
                  <div className={styles.entryTitle}>
                    <span className={styles.entrySwatch} style={{ background: COLOR_VAR[a.coverColor] }}></span>
                    {a.title}
                  </div>
                  <div className={styles.entryTags}>{a.tags.slice(0, 3).join(' · ')}</div>
                  <div className={styles.entryRead}>{a.readingTime} min</div>
                </Link>
              )
            })}
          </section>
        )
      })}

      {articles.length === 0 && (
        <p style={{ padding: 'var(--s-9) 0', fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
          no articles yet.
        </p>
      )}

    </div>
  )
}
