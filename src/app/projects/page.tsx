import type { Metadata } from 'next'
import styles from './projects.module.scss'

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Projets sélectionnés : Kitt (moteur de workflows IA), ClaudIn (automatisation LinkedIn open-source), Hive (framework multi-agents NestJS).',
  alternates: { canonical: 'https://clementbacle.com/projects' },
  openGraph: {
    title: 'Projets — Clément Bacle',
    description: 'Projets sélectionnés : Kitt, ClaudIn, Hive — outillage IA et moteurs de workflows.',
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
            ~/projects &mdash; 3 actifs &middot; archives ci-dessous
          </div>
          <h1>Ce que j&apos;ai <em>construit</em><br />&amp; laissé en ligne.</h1>
        </div>
        <p className={styles.lede}>
          Le code vit sur GitHub &mdash; ceci n&apos;est que l&apos;index. Chaque nom pointe vers
          le repo où le README fait foi. Les anciens projets sont épinglés en bas.
        </p>
      </header>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div className={styles.legend}>
        <span><span className={`${styles.dot} ${styles.ok}`}></span>actif</span>
        <span><span className={`${styles.dot} ${styles.wip}`}></span>en cours</span>
        <span><span className={`${styles.dot} ${styles.archive}`}></span>archivé</span>
        <span style={{ marginLeft: 'auto' }}>mis à jour · 14 avr. 2026</span>
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
          <div className={styles.projRowDesc}>Kitt Intelligence and Tooling Toolkit &mdash; moteur de workflows IA réutilisable. Co-pilote de code MCP-aware avec mémoire persistante.</div>
          <div className={styles.projRowStack}>typescript · mcp · anthropic</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.wip}`}></span>en cours</div>
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
          <div className={styles.projRowDesc}>Prospection LinkedIn open-source et gratuite &mdash; remplace Waalaxy par Claude. Un ensemble de skills Claude Code qui pilotent LinkedIn via Claude in Chrome.</div>
          <div className={styles.projRowStack}>claude code · skills · oss</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.ok}`}></span>actif</div>
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
          <div className={styles.projRowDesc}>Framework NestJS pour les workflows multi-agents &mdash; pattern reine-et-ouvrières avec planificateur, agents spécialisés et critique.</div>
          <div className={styles.projRowStack}>nestjs · multi-agent</div>
          <div className={styles.projRowStatus}><span className={`${styles.dot} ${styles.wip}`}></span>en cours</div>
          <div className={styles.projRowYear}>2026</div>
        </a>
      </section>

      {/* ── Archive ────────────────────────────────────────── */}
      <section className={styles.archiveList}>
        <h2><i>~/archive</i> &mdash; anciens &amp; épinglés pour mémoire</h2>
        <div className={styles.archRow}>
          <div className={styles.archY}>2018&ndash;22</div>
          <div className={styles.archN}>Oscare</div>
          <div className={styles.archD}>SaaS e-santé pour digitaliser l&apos;éducation thérapeutique. Co-fondé, monté à 12, exited. Lille.</div>
          <div className={styles.archS}>react · nestjs</div>
        </div>
      </section>

    </div>
  )
}
