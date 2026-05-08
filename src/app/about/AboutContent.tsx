'use client'

import { useLang } from '@/i18n/context'
import styles from './about.module.scss'

export default function AboutContent() {
  const { t, lang } = useLang()

  return (
    <div className="shell">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.aboutHead}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>
          {t.about.eyebrow}
        </div>
        <h1>
          {t.about.h1a}<br />
          {t.about.h1b}<em>{t.about.h1em}</em>
        </h1>
        <p className={styles.lede}>{t.about.lede}</p>
      </header>

      {/* ── Bio ────────────────────────────────────────────── */}
      <section className={styles.bio}>
        <div>
          {lang === 'fr' ? (
            <>
              <p className="dropcap">
                J&apos;ai commencé à coder en 2017, dans une pièce à Lille, après six ans de pharma
                et une thèse de doctorat sur la création d&apos;une startup de santé. Le Wagon est arrivé ensuite.
                Je n&apos;ai jamais regardé en arrière. Le diplôme de pharmacien est toujours dans un tiroir quelque part &mdash;
                il est utile quand des collègues décrivent leurs problèmes de santé au bureau.
              </p>
              <p>
                Aujourd&apos;hui, je suis senior fullstack chez <b style={{ color: 'var(--fg)' }}>Hublo</b>, la healthtech française
                qui connecte hôpitaux et EHPAD aux soignants intérimaires &mdash;
                infirmiers, aides-soignants, sages-femmes. Avant ça, j&apos;ai co-fondé <b style={{ color: 'var(--fg)' }}>Oscare</b>, une plateforme
                de parcours de soins pour les hôpitaux français &mdash; levée d&apos;un million en 2021, déployée
                dans 30+ établissements, 60 000 patients, 2 000 professionnels, onze personnes.
                Avant encore, <b style={{ color: 'var(--fg)' }}>Officina Santé</b> : une app de clinique du sommeil construite avec un
                somnologue au CHR de Lille, une étude clinique déposée, et un livre publié avec
                le Dr.&nbsp;Chapelle &mdash; <i>Faites de beaux rêves</i> (Dunod, 2019). En parallèle je travaille
                sur des agents &mdash; voix, texte, MCP &mdash; et j&apos;écris sur ce qui survit au contact de la production.
              </p>
              <p>
                J&apos;écris parce que je pense plus clairement quand je suis forcé de m&apos;engager dans une phrase. La plupart
                de ce que je publie ici a commencé comme une page Notion, perdu un tiers de ses mots, et
                est devenu quelque chose que je laisserais lire à un ami. Je préfère les textes qui ont tort mais
                qui sont précis aux textes vagues mais&nbsp;prudents.
              </p>
            </>
          ) : (
            <>
              <p className="dropcap">
                I started coding in 2017, in a room in Lille, after six years in pharma
                and a doctoral thesis about building a healthcare startup. Le Wagon came next.
                I never looked back. The pharmacist&apos;s degree is still in a drawer somewhere &mdash;
                useful when colleagues describe their health problems at the office.
              </p>
              <p>
                Today, I&apos;m a senior fullstack engineer at <b style={{ color: 'var(--fg)' }}>Hublo</b>, the French healthtech
                connecting hospitals and care homes to temporary nurses, nurse assistants, and midwives.
                Before that, I co-founded <b style={{ color: 'var(--fg)' }}>Oscare</b>, a care pathway platform for French hospitals &mdash;
                €1M raised in 2021, deployed in 30+ institutions, 60,000 patients, 2,000 professionals,
                eleven people. Before that, <b style={{ color: 'var(--fg)' }}>Officina Santé</b>: a sleep clinic app built with a somnologist
                at Lille&apos;s CHR, a clinical study filed, and a book published with Dr.&nbsp;Chapelle &mdash;
                <i>Faites de beaux rêves</i> (Dunod, 2019). In parallel, I work on agents &mdash; voice, text, MCP &mdash;
                and write about what survives contact with production.
              </p>
              <p>
                I write because I think more clearly when forced to commit to a sentence. Most of what
                I publish here started as a Notion page, lost a third of its words, and became something
                I&apos;d let a friend read. I prefer texts that are wrong but precise over texts that are
                vague but&nbsp;safe.
              </p>
            </>
          )}
        </div>
        <aside className={styles.bioMeta}>
          <b>{t.about.aside.based}</b>Lille, FR
          <b>{t.about.aside.at}</b>Hublo (healthtech) · 2024 →
          <b>{t.about.aside.before}</b>Co-{lang === 'fr' ? 'fondateur' : 'founder'} &amp; CPO, Oscare · 2019–2024
          <b>{t.about.aside.education}</b>{lang === 'fr' ? 'Doctorat Pharmacie, Lille 2 · 2015 / Le Wagon · 2017' : 'PharmD, Lille 2 · 2015 / Le Wagon · 2017'}
          <b>{t.about.aside.published}</b>Faites de beaux rêves · Dunod 2019
          <b>{t.about.aside.writing}</b>4 {lang === 'fr' ? 'essais' : 'essays'} · {lang === 'fr' ? 'depuis' : 'since'} 2025
          <b>{t.about.aside.projects}</b>4 {lang === 'fr' ? 'projets actifs' : 'active projects'}
          <b>{t.about.aside.languages}</b>fr · en
          <b>{t.about.aside.not}</b>{t.about.aside.notVal}
        </aside>
      </section>

      {/* ── Stack ──────────────────────────────────────────── */}
      <section className={styles.stackBlock}>
        <h2>{t.about.stackHead}<br /><i>{t.about.stackEm}</i></h2>
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
        <h2>{t.about.readingHead}<br /><i>{t.about.readingEm}</i></h2>
        <div className={styles.books}>
          <div className={styles.book}>
            <div className="cover ocher">
              <div className="cover__num">№ r-01</div>
              <div><div className="cover__title">The Pragmatic Programmer</div></div>
              <div className="cover__foot"><span>re-read</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Hunt &amp; Thomas</div>
            <div className={styles.bookMeta}>{lang === 'fr' ? 'relecture · 3e' : 're-read · 3rd'}</div>
          </div>
          <div className={styles.book}>
            <div className="cover prussian">
              <div className="cover__num">№ r-02</div>
              <div><div className="cover__title">Working in Public</div></div>
              <div className="cover__foot"><span>essay</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Nadia Eghbal</div>
            <div className={styles.bookMeta}>42% · {lang === 'fr' ? 'lentement' : 'slowly'}</div>
          </div>
          <div className={styles.book}>
            <div className="cover plum">
              <div className="cover__num">№ r-03</div>
              <div><div className="cover__title">L&apos;art de la guerre</div></div>
              <div className="cover__foot"><span>fr</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Sun Tzu, trad. Soyer</div>
            <div className={styles.bookMeta}>{lang === 'fr' ? 'sur la table de nuit' : 'on the nightstand'}</div>
          </div>
          <div className={styles.book}>
            <div className="cover forest">
              <div className="cover__num">№ r-04</div>
              <div><div className="cover__title">Ghost in the Wires</div></div>
              <div className="cover__foot"><span>memoir</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Kevin Mitnick</div>
            <div className={styles.bookMeta}>{lang === 'fr' ? 'terminé · 9/10' : 'finished · 9/10'}</div>
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
            {t.about.quoteLine1}<br />
            {t.about.quoteLine2}
            <cite>{t.about.quoteCite}</cite>
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
        <span style={{ marginLeft: 'auto' }}>{t.about.contactNotAvail}</span>
      </div>

    </div>
  )
}
