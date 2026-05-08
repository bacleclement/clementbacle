'use client'

import Link from 'next/link'
import { useLang } from '@/i18n/context'
import styles from './writing.module.scss'
import type { Article } from '@/lib/articles'

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

interface Props {
  articles: Article[]
}

export default function WritingContent({ articles }: Props) {
  const { t } = useLang()
  const latest5 = articles.slice(0, 5)
  const byYear = groupByYear(articles)

  return (
    <div className="shell">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.pageHead}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>
            {t.writing.eyebrow(articles.length)}
          </div>
          <h1>{t.writing.h1a}<em>{t.writing.h1em}</em><br />{t.writing.h1b}</h1>
        </div>
        <p className={styles.lede}>{t.writing.lede}</p>
      </header>

      {/* ── Featured covers strip ───────────────────────────── */}
      {latest5.length > 0 && (
        <section className={styles.strip}>
          <div className={styles.stripHead}>
            <span>{t.writing.recently(latest5.length)}</span>
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

      {/* ── Category filter bar ─────────────────────────────── */}
      <div className={styles.filterbar}>
        <div className={styles.tagsRow}>
          <span className="tag is-active">all · {articles.length}</span>
          {(['business', 'ai', 'software', 'tech'] as const).map(cat => {
            const count = articles.filter(a => a.category === cat).length
            return count > 0 ? (
              <span key={cat} className="tag">{cat} · {count}</span>
            ) : null
          })}
        </div>
      </div>

      {/* ── Year-grouped entries ────────────────────────────── */}
      {Array.from(byYear.entries()).map(([year, yearArticles]) => {
        const totalMin = yearArticles.reduce((s, a) => s + a.readingTime, 0)
        return (
          <section key={year} className={styles.yearBlock}>
            <div className={styles.yearHead}>
              <h3>{year}</h3>
              <div className={styles.meta}>{t.writing.yearMeta(yearArticles.length, totalMin)}</div>
            </div>
            {yearArticles.map((a) => {
              const globalNum = articles.indexOf(a)
              return (
                <Link key={a.slug} className={styles.entry} href={`/article/${a.slug}`}>
                  <div className={styles.entryDate}>{formatDate(a.date_written)}</div>
                  <div className={styles.entryNum}>№ {String(articles.length - globalNum).padStart(3, '0')}</div>
                  <div className={styles.entryTitle}>
                    <span className={styles.entrySwatch} style={{ background: COLOR_VAR[a.coverColor] }}></span>
                    {a.title}
                  </div>
                  <div className={styles.entryTags}>
                    {a.category && <span className={styles.entryCat}>{a.category}</span>}
                    {a.tags.slice(0, 2).join(' · ')}
                  </div>
                  <div className={styles.entryRead}>{a.readingTime} min</div>
                </Link>
              )
            })}
          </section>
        )
      })}

      {articles.length === 0 && (
        <p style={{ padding: 'var(--s-9) 0', fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
          {t.writing.empty}
        </p>
      )}

    </div>
  )
}
