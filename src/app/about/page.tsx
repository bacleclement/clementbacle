import type { Metadata } from 'next'
import styles from './about.module.scss'

export const metadata: Metadata = {
  title: 'About',
  description: 'Senior fullstack engineer, ex-founder (Oscare, 12 people, exited). Currently at Hublo. Writing about software, AI, and entrepreneurship.',
  alternates: { canonical: 'https://clementbacle.dev/about' },
  openGraph: {
    title: 'About — Clément Bacle',
    description: 'Senior fullstack engineer, ex-founder (Oscare, 12 people, exited). Currently at Hublo.',
    url: 'https://clementbacle.dev/about',
  },
}

export default function AboutPage() {
  return (
    <div className="shell">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.aboutHead}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>
          ~/about · v3.2 — last edit 02·feb·26
        </div>
        <h1>
          Clément Bacle,<br />
          writes &amp; <em>builds</em>.
        </h1>
        <p className={styles.lede}>
          Senior front-end &amp; NestJS, ex-founder, currently full-time at a healthtech.
          Lille, France &mdash; ten years from Sublime Text 2 to Claude.
        </p>
      </header>

      {/* ── Bio ────────────────────────────────────────────── */}
      <section className={styles.bio}>
        <div>
          <p className="dropcap">
            I started writing JavaScript in 2014, in a school in Lille, on a laptop that
            couldn&apos;t run Photoshop. By 2018 I was the front-end half of a small startup;
            by 2021 it had twelve employees and I&apos;d accidentally become a manager. We
            sold the company in 2023, and I kept the parts of the work I&apos;d actually liked
            — shipping things, writing about them, getting opinions wrong in public.
          </p>
          <p>
            Today I build front-ends and NestJS services at <b style={{ color: 'var(--fg)' }}>Hublo</b>, the french
            healthtech platform that connects hospitals and care homes to a network of
            flexible medical staff &mdash; nurses, caregivers, midwives. ~700k professionals
            on the platform; the alternative our establishments are escaping is, literally,
            the fax machine. Before that I co-founded <b style={{ color: 'var(--fg)' }}>Oscare</b>, a tool that pulled
            structured intelligence (officers, capital, beneficial owners, filings) on french
            companies from open data &mdash; SIRET, INPI, Pappers, INSEE. On the side I work
            on agents — voice, text, MCP — and write essais about what survives contact with
            production.
          </p>
          <p>
            I write because I think clearer when I&apos;m forced to commit a sentence. Most of
            what I publish here started as a Notion page, lost a third of its words, and
            became something I&apos;d let a friend read. I prefer pieces that are wrong but
            specific to pieces that are vague but&nbsp;safe.
          </p>
          <p>
            If you&apos;ve read this far, you probably want to know what I&apos;m not. I&apos;m not a
            consultant. This site is not a sales page. There is no &ldquo;hire me&rdquo; button at
            the bottom of this paragraph, on purpose.
          </p>
        </div>
        <aside className={styles.bioMeta}>
          <b>based</b>Lille, FR
          <b>at</b>Hublo (healthtech) · 2024 →
          <b>before</b>Co-founder, Oscare · 2018–2023
          <b>education</b>HEI Lille, dipl. 2015
          <b>writing</b>23 essays · since 2021
          <b>shipping</b>4 projects active
          <b>speaking</b>fr · en
          <b>not</b>available for freelance
        </aside>
      </section>

      {/* ── Stack ──────────────────────────────────────────── */}
      <section className={styles.stackBlock}>
        <h2>Current<br /><i>stack</i></h2>
        <div className={styles.stackCols}>
          <div>
            <h4>~/work</h4>
            <ul>
              <li>NestJS 10 <i>backend</i></li>
              <li>React 19 + RSC <i>front</i></li>
              <li>Postgres 16 <i>db</i></li>
              <li>Anthropic SDK <i>llm</i></li>
              <li>Tailwind v4 <i>style</i></li>
              <li>Astro 4 <i>static</i></li>
            </ul>
          </div>
          <div>
            <h4>~/local</h4>
            <ul>
              <li>Ghostty <i>terminal</i></li>
              <li>Helix <i>editor</i></li>
              <li>Claude Code <i>pair</i></li>
              <li>Linear <i>tasks</i></li>
              <li>Obsidian <i>notes</i></li>
              <li>Things 3 <i>todos</i></li>
            </ul>
          </div>
          <div>
            <h4>~/listening</h4>
            <ul>
              <li>Boards of Canada <i>repeat</i></li>
              <li>Caribou — Honey <i>2024</i></li>
              <li>Floating Points <i>nights</i></li>
              <li>Tycho <i>writing</i></li>
              <li>Erik Satie <i>mornings</i></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Reading ────────────────────────────────────────── */}
      <section className={styles.reading}>
        <h2>Currently<br /><i>reading</i></h2>
        <div className={styles.books}>
          <div className={styles.book}>
            <div className="cover ocher">
              <div className="cover__num">№ r-01</div>
              <div><div className="cover__title">The Pragmatic Programmer</div></div>
              <div className="cover__foot"><span>re-read</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Hunt &amp; Thomas</div>
            <div className={styles.bookMeta}>re-read · 3rd</div>
          </div>
          <div className={styles.book}>
            <div className="cover prussian">
              <div className="cover__num">№ r-02</div>
              <div><div className="cover__title">Working in Public</div></div>
              <div className="cover__foot"><span>essai</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Nadia Eghbal</div>
            <div className={styles.bookMeta}>42% · slow</div>
          </div>
          <div className={styles.book}>
            <div className="cover plum">
              <div className="cover__num">№ r-03</div>
              <div><div className="cover__title">L&apos;art de la guerre</div></div>
              <div className="cover__foot"><span>fr</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Sun Tzu, trad. Soyer</div>
            <div className={styles.bookMeta}>on bedside</div>
          </div>
          <div className={styles.book}>
            <div className="cover forest">
              <div className="cover__num">№ r-04</div>
              <div><div className="cover__title">Ghost in the Wires</div></div>
              <div className="cover__foot"><span>memoir</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Kevin Mitnick</div>
            <div className={styles.bookMeta}>finished · 9/10</div>
          </div>
        </div>
      </section>

      {/* ── Portrait + quote ───────────────────────────────── */}
      <section className={styles.portraitBlock}>
        <div className={styles.portrait}>
          <div className={styles.portraitFrame}></div>
          <div className={styles.portraitId}>cb · lille · 2025 · ƒ/2.0 · duotone(prussian/brick)</div>
        </div>
        <div>
          <div className={styles.quote}>
            I&apos;d rather be wrong &amp; specific<br />
            than vague &amp; safe.
            <cite>— posted on a sticky note above my desk since 2022</cite>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────── */}
      <div className={styles.contactRow}>
        <span><b>~/contact</b></span>
        <span>email · <span className={styles.obf}><span className={styles.at}></span></span></span>
        <span>github · <a href="#" style={{ color: 'var(--accent)' }}>@clementbacle</a></span>
        <span>x · <a href="#" style={{ color: 'var(--accent)' }}>@clementbacle</a></span>
        <span>bsky · <a href="#" style={{ color: 'var(--accent)' }}>clementbacle.bsky.social</a></span>
        <span style={{ marginLeft: 'auto' }}>no DMs about freelance &mdash; salarié heureux ✦</span>
      </div>

    </div>
  )
}
