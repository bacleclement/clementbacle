'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

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
  const [lines, setLines] = useState<LogLine[]>([
    { id: lineId++, html: '<span class="p">~ $</span> <span class="dim">welcome. type</span> <span class="kw">help</span> <span class="dim">to list commands.</span>' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [, setHIdx] = useState(-1)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines])

  const out = useCallback((html: string) => {
    setLines((prev) => [...prev, { id: lineId++, html }])
  }, [])

  const nav = useCallback(
    (href: string) => {
      out(`<span class="dim">→ navigating to ${escHtml(href)}…</span>`)
      setTimeout(() => router.push(href), 220)
    },
    [out, router],
  )

  const CMDS = useCallback((): Record<string, (arg?: string) => void> => ({
    help: () => {
      out('<span class="ok">available commands</span>')
      out(
        '<table>' +
          '<tr><td>help</td><td><span class="dim">show this list</span></td></tr>' +
          '<tr><td>ls</td><td><span class="dim">list pages</span></td></tr>' +
          '<tr><td>cd &lt;path&gt;</td><td><span class="dim">go to page · /home /writing /projects /about</span></td></tr>' +
          '<tr><td>/home</td><td><span class="dim">shortcut · same for /writing /projects …</span></td></tr>' +
          '<tr><td>whoami</td><td><span class="dim">about clement</span></td></tr>' +
          '<tr><td>cat skills.txt</td><td><span class="dim">stack &amp; skills</span></td></tr>' +
          '<tr><td>cat focus.txt</td><td><span class="dim">current focus</span></td></tr>' +
          '<tr><td>contact</td><td><span class="dim">how to reach me</span></td></tr>' +
          '<tr><td>theme</td><td><span class="dim">toggle dark / light</span></td></tr>' +
          '<tr><td>clear</td><td><span class="dim">clear log</span></td></tr>' +
          '</table>',
      )
    },
    ls: () => {
      out('<span class="ok">pages</span>')
      out(
        '<table>' +
          '<tr><td>~/home</td><td><span class="dim">landing</span></td></tr>' +
          '<tr><td>~/writing</td><td><span class="dim">essais &amp; notes</span></td></tr>' +
          '<tr><td>~/projects</td><td><span class="dim">things I built</span></td></tr>' +
          '<tr><td>~/about</td><td><span class="dim">bio &amp; stack</span></td></tr>' +
          '</table>',
      )
    },
    whoami: () => {
      out('clément bacle — senior <b style="color: var(--fg);">fullstack</b> &amp; software engineer.')
      out('<span class="dim">ten years shipping web. ex-founder (12 ppl). currently at hublo (healthtech).</span>')
    },
    contact: () => {
      out('email · <span class="kw">clement [at] clementbacle.dev</span>')
      out('github · <span class="kw">@clementbacle</span>')
      out('<span class="dim">no DMs about freelance — salarié heureux.</span>')
    },
    theme: () => {
      const root = document.documentElement
      const current = root.getAttribute('data-theme') ?? 'dark'
      const next = current === 'light' ? 'dark' : 'light'
      root.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
      out(`<span class="ok">theme · ${next}</span>`)
    },
    clear: () => setLines([]),
    clement: () => {
      const root = document.documentElement
      const cur = root.getAttribute('data-theme')
      if (cur === 'clement') {
        const prev = root.getAttribute('data-prev-theme') ?? 'dark'
        root.setAttribute('data-theme', prev)
        localStorage.setItem('theme', prev)
        out(`<span class="ok">&gt; phosphor mode disengaged. back to ${prev}.</span>`)
        return
      }
      root.setAttribute('data-prev-theme', cur ?? 'dark')
      root.setAttribute('data-theme', 'clement')
      localStorage.setItem('theme', 'clement')
      out('<span class="ok">&gt; engaging CRT phosphor mode...</span>')
      setTimeout(
        () =>
          out(
            '<span class="dim">scanlines synced. type</span> <span class="kw">clement</span> <span class="dim">again or click exit to revert.</span>',
          ),
        200,
      )
    },
    cat: (arg?: string) => {
      const f = (arg ?? '').toLowerCase().replace(/^\.\//, '')
      if (f === 'skills.txt' || f === 'skills') {
        out('<span class="ok">~/skills.txt</span>')
        out(
          '<table>' +
            '<tr><td>front</td><td>react · angular · svelte · typescript</td></tr>' +
            '<tr><td>back</td><td>nestjs · node · express</td></tr>' +
            '<tr><td>data</td><td>mongodb · postgresql · redis</td></tr>' +
            '<tr><td>ai</td><td>anthropic · openai · mcp · langchain</td></tr>' +
            '<tr><td>infra</td><td>docker · gh actions · vercel · fly.io</td></tr>' +
            '</table>',
        )
      } else if (f === 'focus.txt' || f === 'focus') {
        out('<span class="ok">~/focus.txt</span>')
        out('› ai agents · context engineering · mcp · nestjs · entrepreneuriat')
      } else if (!f) {
        out('<span class="err">cat: missing operand</span>')
      } else {
        out(`<span class="err">cat: ${escHtml(f)}: no such file</span>`)
      }
    },
  }), [out])

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      if (!cmd) return
      out(`<span class="p">~ $</span> ${escHtml(cmd)}`)

      if (cmd.startsWith('/')) {
        const route = ROUTES[cmd] ?? ROUTES[cmd.toLowerCase()]
        if (route) return nav(route)
        out('<span class="err">no such page · try ls</span>')
        return
      }

      const [name, ...rest] = cmd.split(/\s+/)
      if (name === 'cd') {
        const target = rest[0] ?? '/home'
        const key = target.startsWith('/') ? target : '/' + target.replace(/^~\/?/, '')
        const route = ROUTES[key] ?? ROUTES[key.toLowerCase()]
        if (route) return nav(route)
        out(`<span class="err">cd: ${escHtml(target)}: no such directory</span>`)
        return
      }

      const cmds = CMDS()
      const fn = cmds[name]
      if (fn) {
        fn(rest.join(' '))
        return
      }
      out(`<span class="err">${escHtml(name)}: command not found · try </span><span class="kw">help</span>`)
    },
    [out, nav, CMDS],
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
    }
  }

  return (
    <div className="termi" aria-label="interactive terminal" onClick={() => inputRef.current?.focus()}>
      <div className="termi__head">
        <span className="termi__dot"></span>
        <span>
          ~/home &mdash; type a command · try <span className="kw">help</span>
        </span>
        <span style={{ marginLeft: 'auto', opacity: 0.6 }}>⏎</span>
      </div>
      <div className="termi__log" ref={logRef}>
        {lines.map((line) => (
          <div key={line.id} className="line" dangerouslySetInnerHTML={{ __html: line.html }} />
        ))}
      </div>
      <form className="termi__input" onSubmit={handleSubmit} autoComplete="off">
        <span className="p">~ $</span>
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
  )
}
