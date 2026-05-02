'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import NavTools from '@/components/NavTools'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <nav className={`nav${open ? ' nav--open' : ''}${scrolled ? ' nav--scrolled' : ''}`} aria-label="primary">
      <div className="shell">
        <div className="nav__brand">
          <b>Clément Bacle</b>
        </div>
        <div className="nav__links">
          <Link className="nav-link" href="/" onClick={close}>~/home</Link>
          <Link className="nav-link" href="/writing" onClick={close}>~/writing</Link>
          <Link className="nav-link" href="/projects" onClick={close}>~/projects</Link>
          <Link className="nav-link" href="/lab" onClick={close}>~/lab</Link>
          <Link className="nav-link" href="/about" onClick={close}>~/about</Link>
        </div>
        <NavTools />
        <button
          className="nav__burger icon-btn"
          aria-label={open ? 'close menu' : 'open menu'}
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen(o => !o)}
        >
          {open ? '×' : '≡'}
        </button>
      </div>

      <div id="nav-drawer" className="nav__drawer-wrap">
        <div className="shell">
          <div className="nav__drawer-prompt">
            <span className="p">~ $</span>{' '}ls ~/pages
          </div>
          <Link className="nav-link" href="/" onClick={close}>~/home</Link>
          <Link className="nav-link" href="/writing" onClick={close}>~/writing</Link>
          <Link className="nav-link" href="/projects" onClick={close}>~/projects</Link>
          <Link className="nav-link" href="/lab" onClick={close}>~/lab</Link>
          <Link className="nav-link" href="/about" onClick={close}>~/about</Link>
          <div className="nav__drawer-tools">
            <NavTools />
          </div>
        </div>
      </div>
    </nav>
  )
}
