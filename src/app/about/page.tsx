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
            I started writing code in 2017, in a room in Lille, after six years of pharmacy
            school and a doctorate thesis on building a health startup. Le Wagon happened next.
            I never looked back. The pharmacist certificate is still in a drawer somewhere &mdash;
            it comes in handy when colleagues describe their health problems in the office.
          </p>
          <p>
            Today, I&apos;m a fullstack senior engineer at <b style={{ color: 'var(--fg)' }}>Hublo</b>, the French
            healthtech that connects hospitals and care homes to flexible medical staff &mdash;
            nurses, caregivers, midwives. Before that I co-founded <b style={{ color: 'var(--fg)' }}>Oscare</b>, a care
            pathway planning platform for French hospitals &mdash; raised €1M in 2021, shipped
            to 30+ establishments, 60,000 patients, 2,000 professionals, eleven people.
            Before that, <b style={{ color: 'var(--fg)' }}>Officina Santé</b>: a sleep clinic app built with a
            somnologist at the CHR de Lille, a clinical study filed, and a book published with
            Dr.&nbsp;Chapelle &mdash; <i>Faites de beaux rêves</i> (Dunod, 2019). On the side I work
            on agents &mdash; voice, text, MCP &mdash; and write about what survives contact with
            production.
          </p>
          <p>
            I write because I think clearer when I&apos;m forced to commit a sentence. Most of
            what I publish here started as a Notion page, lost a third of its words, and
            became something I&apos;d let a friend read. I prefer pieces that are wrong but
            specific to pieces that are vague but&nbsp;safe.
          </p>
        </div>
        <aside className={styles.bioMeta}>
          <b>based</b>Lille, FR
          <b>at</b>Hublo (healthtech) · 2024 →
          <b>before</b>Co-founder &amp; CPO, Oscare · 2019–2024
          <b>education</b>Doctorat Pharmacie, Lille 2 · 2015 / Le Wagon · 2017
          <b>published</b>Faites de beaux rêves · Dunod 2019
          <b>writing</b>4 essays · since 2025
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
