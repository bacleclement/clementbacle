'use client'

import { useEffect, useState } from 'react'

export default function NavTools() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') ?? 'light'
  })
  const [lang, setLang] = useState<string>(() => {
    if (typeof window === 'undefined') return 'fr'
    return localStorage.getItem('lang') ?? 'fr'
  })

  useEffect(() => {
    // Apply persisted theme to DOM — MutationObserver picks it up and calls setTheme
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme)
    }

    // Sync React state whenever data-theme changes (from toggle, terminal, etc.)
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') ?? 'light')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') ?? 'light'
    const next = current === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  function toggleLang() {
    const next = lang === 'fr' ? 'en' : 'fr'
    setLang(next)
    localStorage.setItem('lang', next)
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
