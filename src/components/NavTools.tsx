'use client'

import { useEffect, useState } from 'react'
import { useLang, type Lang } from '@/i18n/context'

export default function NavTools() {
  const { lang, setLang } = useLang()
  const [theme, setTheme] = useState<string>('light')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme)
    }

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') ?? 'light')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    setTheme(document.documentElement.getAttribute('data-theme') ?? 'light')
    return () => observer.disconnect()
  }, [])

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') ?? 'light'
    const next = current === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  function toggleLang() {
    setLang(lang === 'fr' ? 'en' : 'fr' as Lang)
  }

  const isDarkish = theme === 'dark' || theme === 'clement'

  return (
    <div className="nav__tools">
      <button className="icon-btn" onClick={toggleLang}>
        {lang === 'fr' ? 'FR · en' : 'fr · EN'}
      </button>
      <button className="icon-btn" id="theme" title="Toggle theme" onClick={toggleTheme}>
        {isDarkish ? '◐ dark' : '◐ light'}
      </button>
    </div>
  )
}
