'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/i18n/context'

export default function ClementBanner() {
  const [active, setActive] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setActive(document.documentElement.getAttribute('data-theme') === 'clement')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  function exit() {
    const prev = document.documentElement.getAttribute('data-prev-theme') ?? 'light'
    document.documentElement.setAttribute('data-theme', prev)
    localStorage.setItem('theme', prev)
  }

  if (!active) return null

  return (
    <div className="clement-banner" id="clementBanner" role="status" aria-live="polite">
      <span>
        <b>{t.banner.label}</b> · {t.banner.crt} · type{' '}
        <span style={{ fontFamily: 'var(--font-mono)' }}>clement</span>{' '}{t.banner.typeAgain}
      </span>
      <button type="button" id="clementExit" onClick={exit}>
        {t.banner.exit}
      </button>
    </div>
  )
}
