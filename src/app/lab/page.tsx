import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lab',
  description: 'Interactive experiments at the intersection of AI, agents, and software.',
  alternates: { canonical: 'https://clementbacle.com/lab' },
  openGraph: {
    title: 'Lab — Clément Bacle',
    description: 'Interactive experiments at the intersection of AI, agents, and software.',
    url: 'https://clementbacle.com/lab',
  },
}

const LAB_PROJECTS = [
  {
    slug: 'agent-patterns',
    num: '001',
    title: 'Agent Patterns Studio',
    desc: 'Interactive canvas for learning LLM agent patterns — Augmented LLM, Routing, Orchestrator-workers, Evaluator-optimizer. 7 real industry use cases with animated flows and progressive complexity layers.',
    tags: 'agents · patterns · interactive',
    year: '2026',
  },
]

export default function LabPage() {
  return (
    <div className="shell" style={{ paddingTop: 'var(--s-8)', paddingBottom: 'var(--s-9)' }}>
      <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>~/lab · experiments</div>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 600, lineHeight: 1.05, marginBottom: 'var(--s-4)' }}>
        Interactive<br /><em>experiments.</em>
      </h1>
      <p style={{ color: 'var(--fg2)', maxWidth: '480px', marginBottom: 'var(--s-8)', fontSize: '15px', lineHeight: 1.6 }}>
        Tools I build to understand things — agents, patterns, systems. Not products, not prototypes. Just thinking made interactive.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        {LAB_PROJECTS.map(p => (
          <Link
            key={p.slug}
            href={`/lab/${p.slug}`}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', padding: '20px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit', transition: 'opacity 0.15s' }}
          >
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--fg3)', paddingTop: '3px', minWidth: '40px' }}>
              № {p.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, marginBottom: '6px' }}>{p.title} ↗</div>
              <div style={{ fontSize: '13px', color: 'var(--fg2)', lineHeight: 1.55, maxWidth: '560px', marginBottom: '10px' }}>{p.desc}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--fg3)', letterSpacing: '0.06em' }}>{p.tags}</div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--fg3)', paddingTop: '3px' }}>{p.year}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
