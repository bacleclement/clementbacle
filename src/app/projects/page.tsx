import type { Metadata } from 'next'
import styles from './projects.module.scss'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected projects: Kitt (AI workflow engine), ClaudIn (open-source LinkedIn automation), Hive (NestJS multi-agent framework).',
  alternates: { canonical: 'https://clementbacle.com/projects' },
  openGraph: {
    title: 'Projects — Clément Bacle',
    description: 'Selected projects: Kitt, ClaudIn, Hive — AI tooling and workflow engines.',
    url: 'https://clementbacle.com/projects',
  },
}

export default function ProjectsPage() {
  return (
    <div className="shell">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.pageHead}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>
            ~/projects &mdash; 3 active &middot; archive below
          </div>
          <h1>Things I&apos;ve <em>built</em><br />&amp; left online.</h1>
        </div>
        <p className={styles.lede}>
          Code lives on GitHub &mdash; this is just the index. Each name links out to
          the repo where the README is the source of truth. Older work pinned at the bottom.
        </p>
      </header>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div className={styles.legend}>
        <span><span className={`${styles.dot} ${styles.ok}`}></span>active</span>
        <span><span className={`${styles.dot} ${styles.wip}`}></span>in-progress</span>
        <span><span className={`${styles.dot} ${styles.archive}`}></span>archived</span>
        <span style={{ marginLeft: 'auto' }}>last updated · 14 apr 2026</span>
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
          <div className={styles.projRowDesc}>Kitt Intelligence and Tooling Toolkit &mdash; reusable AI workflow engine. MCP-aware coding co-pilot with persistent memory.</div>
          <div className={styles.projRowStack}>typescript · mcp · anthropic</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.wip}`}></span>in-progress</div>
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
          <div className={styles.projRowDesc}>Free open-source LinkedIn outreach &mdash; replace Waalaxy with Claude. A bundle of Claude Code skills that pilot LinkedIn through Claude in Chrome.</div>
          <div className={styles.projRowStack}>claude code · skills · oss</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.ok}`}></span>active</div>
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
          <div className={styles.projRowDesc}>A NestJS framework for multi-agent workflows &mdash; queen-and-workers pattern with planner, specialised workers, and critic.</div>
          <div className={styles.projRowStack}>nestjs · multi-agent</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.wip}`}></span>in-progress</div>
          <div className={styles.projRowYear}>2026</div>
        </a>
      </section>

      {/* ── Archive ────────────────────────────────────────── */}
      <section className={styles.archiveList}>
        <h2><i>~/archive</i> &mdash; older &amp; pinned for memory</h2>
        <div className={styles.archRow}>
          <div className={styles.archY}>2018&ndash;22</div>
          <div className={styles.archN}>Oscare</div>
          <div className={styles.archD}>e-health SaaS to digitise patient education. Co-founded, scaled to 12, exited. Lille.</div>
          <div className={styles.archS}>react · nestjs</div>
        </div>
      </section>

    </div>
  )
}
