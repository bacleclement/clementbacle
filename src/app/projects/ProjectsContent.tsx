'use client'

import { useLang } from '@/i18n/context'
import styles from './projects.module.scss'

export default function ProjectsContent() {
  const { t } = useLang()

  return (
    <div className="shell">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.pageHead}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>
            {t.projects.eyebrow}
          </div>
          <h1>{t.projects.h1a}<em>{t.projects.h1em}</em><br />{t.projects.h1b}</h1>
        </div>
        <p className={styles.lede}>{t.projects.lede}</p>
      </header>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div className={styles.legend}>
        <span><span className={`${styles.dot} ${styles.ok}`}></span>{t.projects.legend.active}</span>
        <span><span className={`${styles.dot} ${styles.wip}`}></span>{t.projects.legend.wip}</span>
        <span><span className={`${styles.dot} ${styles.archive}`}></span>{t.projects.legend.archived}</span>
        <span style={{ marginLeft: 'auto' }}>{t.projects.updated}</span>
      </div>

      {/* ── Active project list ─────────────────────────────── */}
      <section className={styles.projList}>
        <a
          className={styles.projRow}
          href="https://github.com/bacleclement/kitt"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.projRowNum}>№ 001</div>
          <div className={styles.projRowName}>Kitt <span className={styles.ext}>↗</span></div>
          <div className={styles.projRowDesc}>{t.projects.kitt}</div>
          <div className={styles.projRowStack}>typescript · mcp · anthropic</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.wip}`}></span>{t.projects.legend.wip}</div>
          <div className={styles.projRowYear}>2025 →</div>
        </a>
        <a
          className={styles.projRow}
          href="https://github.com/bacleclement/claudin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.projRowNum}>№ 002</div>
          <div className={styles.projRowName}>ClaudIn <span className={styles.ext}>↗</span></div>
          <div className={styles.projRowDesc}>{t.projects.claudin}</div>
          <div className={styles.projRowStack}>claude code · skills · oss</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.ok}`}></span>{t.projects.legend.active}</div>
          <div className={styles.projRowYear}>2026</div>
        </a>
        <a
          className={styles.projRow}
          href="https://github.com/bacleclement/hive"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.projRowNum}>№ 003</div>
          <div className={styles.projRowName}>Hive <span className={styles.ext}>↗</span></div>
          <div className={styles.projRowDesc}>{t.projects.hive}</div>
          <div className={styles.projRowStack}>nestjs · multi-agent</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.wip}`}></span>{t.projects.legend.wip}</div>
          <div className={styles.projRowYear}>2026</div>
        </a>
      </section>

      {/* ── Archive ────────────────────────────────────────── */}
      <section className={styles.archiveList}>
        <h2><i>{t.projects.archiveHead}</i></h2>
        <div className={styles.archRow}>
          <div className={styles.archY}>2018&ndash;22</div>
          <div className={styles.archN}>Oscare</div>
          <div className={styles.archD}>{t.projects.oscare}</div>
          <div className={styles.archS}>react · nestjs</div>
        </div>
      </section>

    </div>
  )
}
