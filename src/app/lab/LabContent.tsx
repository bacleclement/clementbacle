'use client'

import Link from 'next/link'
import { useLang } from '@/i18n/context'

export default function LabContent() {
  const { t } = useLang()

  return (
    <div className="shell" style={{ paddingTop: 'var(--s-8)', paddingBottom: 'var(--s-9)' }}>
      <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>{t.lab.index.eyebrow}</div>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 600, lineHeight: 1.05, marginBottom: 'var(--s-4)' }}>
        {t.lab.index.h1a}<br /><em>{t.lab.index.h1em}</em>
      </h1>
      <p style={{ color: 'var(--fg2)', maxWidth: '480px', marginBottom: 'var(--s-8)', fontSize: '15px', lineHeight: 1.6 }}>
        {t.lab.index.lede}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        <Link
          href="/lab/agent-patterns"
          style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', padding: '20px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit', transition: 'opacity 0.15s' }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--fg3)', paddingTop: '3px', minWidth: '40px' }}>
            № 001
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, marginBottom: '6px' }}>
              Agent Patterns Studio ↗
            </div>
            <div style={{ fontSize: '13px', color: 'var(--fg2)', lineHeight: 1.55, maxWidth: '560px', marginBottom: '10px' }}>
              {t.lab.index.projDesc}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--fg3)', letterSpacing: '0.06em' }}>
              {t.lab.index.tags}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--fg3)', paddingTop: '3px' }}>2026</div>
        </Link>
      </div>
    </div>
  )
}
