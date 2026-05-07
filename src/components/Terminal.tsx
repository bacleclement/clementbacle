'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { initGame, processCommand as gameCmd, INTRO, type GameState } from '../lib/game-lovecraft'
import { useLang } from '@/i18n/context'

interface LogLine {
  id: number
  html: string
}

const ROUTES: Record<string, string> = {
  '/home': '/',
  '/': '/',
  '/writing': '/writing',
  '/projects': '/projects',
  '/about': '/about',
}

let lineId = 0

function escHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] ?? c))
}

export default function Terminal() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLang()
  const [collapsed, setCollapsed] = useState(true)
  const [navH, setNavH] = useState(57)
  const [inGame, setInGame] = useState(false)
  const gameRef = useRef<GameState | null>(null)

  useEffect(() => {
    if (pathname.startsWith('/lab')) {
      setCollapsed(true)
    } else if (window.innerWidth >= 900) {
      queueMicrotask(() => setCollapsed(false))
    }
  }, [pathname])

  useEffect(() => {
    function update() {
      const open = !collapsed && window.innerWidth >= 900
      document.documentElement.style.setProperty('--sidebar-w', open ? '300px' : '0px')
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      document.documentElement.style.setProperty('--sidebar-w', '0px')
    }
  }, [collapsed])

  const [lines, setLines] = useState<LogLine[]>([
    { id: lineId++, html: `<span class="p">~ $</span> <span class="dim">${t.terminal.welcome}</span>` },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [, setHIdx] = useState(-1)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathnameRef = useRef(pathname)

  useEffect(() => { pathnameRef.current = pathname }, [pathname])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    if (!collapsed) inputRef.current?.focus()
  }, [collapsed])

  useEffect(() => {
    const nav = document.querySelector('nav')
    if (nav) queueMicrotask(() => setNavH(nav.offsetHeight))
  }, [])

  const currentPath = pathname === '/' ? '~/home' : '~' + pathname
  const promptPath = inGame ? '[miskatonic]' : currentPath

  const out = useCallback((html: string) => {
    setLines((prev) => [...prev, { id: lineId++, html }])
  }, [])

  const nav = useCallback(
    (href: string) => {
      out(t.terminal.nav(escHtml(href)))
      setTimeout(() => router.push(href), 220)
    },
    [out, router, t],
  )

  const CMDS = useCallback((): Record<string, (arg?: string) => void> => ({
    help: () => {
      out(`<span class="ok">${t.terminal.help.header}</span>`)
      out(
        '<table>' +
          t.terminal.help.rows
            .map(([cmd, desc]) => `<tr><td>${cmd}</td><td><span class="dim">${desc}</span></td></tr>`)
            .join('') +
          '</table>',
      )
    },
    ls: () => {
      out(`<span class="ok">${t.terminal.ls.header}</span>`)
      out(
        '<table>' +
          t.terminal.ls.rows
            .map(([path, desc]) => `<tr><td>${path}</td><td><span class="dim">${desc}</span></td></tr>`)
            .join('') +
          '</table>',
      )
    },
    whoami: () => {
      t.terminal.whoami.forEach(line => out(line))
    },
    contact: () => {
      t.terminal.contact.forEach(line => out(line))
    },
    theme: () => {
      const root = document.documentElement
      const current = root.getAttribute('data-theme') ?? 'light'
      const next = current === 'light' ? 'dark' : 'light'
      root.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
      out(t.terminal.theme(next))
    },
    clear: () => setLines([]),
    clement: () => {
      const root = document.documentElement
      const cur = root.getAttribute('data-theme')
      if (cur === 'clement') {
        const prev = root.getAttribute('data-prev-theme') ?? 'light'
        root.setAttribute('data-theme', prev)
        localStorage.setItem('theme', prev)
        out(t.terminal.clement.disengage(prev))
        return
      }
      root.setAttribute('data-prev-theme', cur ?? 'light')
      root.setAttribute('data-theme', 'clement')
      localStorage.setItem('theme', 'clement')
      out(t.terminal.clement.engage)
      setTimeout(() => out(t.terminal.clement.synced('clement')), 200)
    },
    play: () => {
      const s = initGame()
      gameRef.current = s
      setInGame(true)
      INTRO.forEach(l => out(l))
    },
    cat: (arg?: string) => {
      const f = (arg ?? '').toLowerCase().replace(/^\.\//, '')
      if (f === 'skills.txt' || f === 'skills') {
        out(`<span class="ok">${t.terminal.cat.skills.header}</span>`)
        out(
          '<table>' +
            t.terminal.cat.skills.rows
              .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
              .join('') +
            '</table>',
        )
      } else if (f === 'focus.txt' || f === 'focus') {
        out(`<span class="ok">${t.terminal.cat.focus.header}</span>`)
        out(t.terminal.cat.focus.text)
      } else if (!f) {
        out(t.terminal.cat.missing)
      } else {
        out(t.terminal.cat.notFound(escHtml(f)))
      }
    },
  }), [out, t])

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      if (!cmd) return

      // ── Game mode ─────────────────────────────────────────────────────────────
      const gs = gameRef.current
      if (gs !== null && !gs.over) {
        out(`<span class="p">[miskatonic] $</span> ${escHtml(cmd)}`)
        const result = gameCmd(cmd, gs)
        result.lines.forEach(l => out(l))
        gameRef.current = result.next
        if (result.next.over) {
          gameRef.current = null
          setInGame(false)
        }
        return
      }

      // ── Normal mode ───────────────────────────────────────────────────────────
      const path = pathnameRef.current === '/' ? '~/home' : '~' + pathnameRef.current
      out(`<span class="p">${escHtml(path)} $</span> ${escHtml(cmd)}`)

      if (cmd.startsWith('/')) {
        const route = ROUTES[cmd] ?? ROUTES[cmd.toLowerCase()]
        if (route) return nav(route)
        out(t.terminal.errors.noSuchPage)
        return
      }

      const [name, ...rest] = cmd.split(/\s+/)
      if (name === 'cd') {
        const target = rest[0] ?? '/home'
        const key = target.startsWith('/') ? target : '/' + target.replace(/^~\/?/, '')
        const route = ROUTES[key] ?? ROUTES[key.toLowerCase()]
        if (route) return nav(route)
        out(t.terminal.errors.cdNotFound(escHtml(target)))
        return
      }

      const cmds = CMDS()
      const fn = cmds[name]
      if (fn) {
        fn(rest.join(' '))
        return
      }
      out(t.terminal.errors.notFound(escHtml(name)))
    },
    [out, nav, CMDS, t],
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = input
    if (v.trim()) {
      setHistory((prev) => [v, ...prev])
      setHIdx(-1)
    }
    run(v)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHIdx((prev) => {
        const next = Math.min(prev + 1, history.length - 1)
        setInput(history[next] ?? '')
        return next
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHIdx((prev) => {
        if (prev <= 0) { setInput(''); return -1 }
        const next = prev - 1
        setInput(history[next] ?? '')
        return next
      })
    } else if (e.key === 'Escape') {
      setCollapsed(true)
    }
  }

  if (pathname.startsWith('/lab')) return null

  return (
    <aside
      className={`termi-sidebar${collapsed ? ' termi-sidebar--collapsed' : ''}`}
      style={{ top: navH, height: `calc(100dvh - ${navH}px - var(--banner-h, 0px))` }}
    >
      <button
        className="termi-sidebar__tab"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'open terminal' : 'close terminal'}
        title={collapsed ? 'open terminal' : 'close terminal'}
      >
        {collapsed ? '>_' : '×'}
      </button>

      <div
        className="termi"
        aria-label="interactive terminal"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="termi__head">
          <span className="termi__dot"></span>
          <span>
            {promptPath} &mdash;{' '}
            {inGame
              ? <>text adventure · type <span className="kw">help</span></>
              : <>type · <span className="kw">help</span></>
            }
          </span>
          <button
            type="button"
            className="termi__close"
            onClick={(e) => { e.stopPropagation(); setCollapsed(true) }}
            aria-label="close terminal"
          >
            ×
          </button>
        </div>
        <div className="termi__log" ref={logRef}>
          {lines.map((line) => (
            <div key={line.id} className="line" dangerouslySetInnerHTML={{ __html: line.html }} />
          ))}
        </div>
        <form className="termi__input" onSubmit={handleSubmit} autoComplete="off">
          <span className="p">{promptPath} $</span>
          <input
            ref={inputRef}
            id="termiCmd"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            aria-label="terminal command"
          />
          <span className="caret"></span>
        </form>
      </div>
    </aside>
  )
}
