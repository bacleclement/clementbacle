import type { Metadata } from 'next'
import styles from './about.module.scss'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Senior fullstack engineer, ex-fondateur (Oscare, 12 personnes, exited). Actuellement chez Hublo. J\'écris sur le logiciel, l\'IA et l\'entrepreneuriat.',
  alternates: { canonical: 'https://clementbacle.com/about' },
  openGraph: {
    title: 'À propos — Clément Bacle',
    description: 'Senior fullstack engineer, ex-fondateur (Oscare, 12 personnes, exited). Actuellement chez Hublo.',
    url: 'https://clementbacle.com/about',
  },
}

export default function AboutPage() {
  return (
    <div className="shell">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.aboutHead}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-5)' }}>
          ~/about · v3.2 — dernière édition 02·fév·26
        </div>
        <h1>
          Clément Bacle,<br />
          écrit &amp; <em>construit</em>.
        </h1>
        <p className={styles.lede}>
          Senior front-end &amp; NestJS, ex-fondateur, actuellement à plein temps dans une healthtech.
          Lille, France &mdash; dix ans de Sublime Text 2 à Claude.
        </p>
      </header>

      {/* ── Bio ────────────────────────────────────────────── */}
      <section className={styles.bio}>
        <div>
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
        </div>
        <aside className={styles.bioMeta}>
          <b>basé</b>Lille, FR
          <b>chez</b>Hublo (healthtech) · 2024 →
          <b>avant</b>Co-fondateur &amp; CPO, Oscare · 2019–2024
          <b>formation</b>Doctorat Pharmacie, Lille 2 · 2015 / Le Wagon · 2017
          <b>publié</b>Faites de beaux rêves · Dunod 2019
          <b>écriture</b>4 essais · depuis 2025
          <b>projets</b>4 projets actifs
          <b>langues</b>fr · en
          <b>pas</b>disponible en freelance
        </aside>
      </section>

      {/* ── Stack ──────────────────────────────────────────── */}
      <section className={styles.stackBlock}>
        <h2>Stack<br /><i>actuel</i></h2>
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
        <h2>En ce moment<br /><i>je lis</i></h2>
        <div className={styles.books}>
          <div className={styles.book}>
            <div className="cover ocher">
              <div className="cover__num">№ r-01</div>
              <div><div className="cover__title">The Pragmatic Programmer</div></div>
              <div className="cover__foot"><span>re-read</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Hunt &amp; Thomas</div>
            <div className={styles.bookMeta}>relecture · 3e</div>
          </div>
          <div className={styles.book}>
            <div className="cover prussian">
              <div className="cover__num">№ r-02</div>
              <div><div className="cover__title">Working in Public</div></div>
              <div className="cover__foot"><span>essai</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Nadia Eghbal</div>
            <div className={styles.bookMeta}>42% · lentement</div>
          </div>
          <div className={styles.book}>
            <div className="cover plum">
              <div className="cover__num">№ r-03</div>
              <div><div className="cover__title">L&apos;art de la guerre</div></div>
              <div className="cover__foot"><span>fr</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Sun Tzu, trad. Soyer</div>
            <div className={styles.bookMeta}>sur la table de nuit</div>
          </div>
          <div className={styles.book}>
            <div className="cover forest">
              <div className="cover__num">№ r-04</div>
              <div><div className="cover__title">Ghost in the Wires</div></div>
              <div className="cover__foot"><span>memoir</span><span>&apos;26</span></div>
            </div>
            <div className={styles.bookAuthor}>Kevin Mitnick</div>
            <div className={styles.bookMeta}>terminé · 9/10</div>
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
            J&apos;aime mieux avoir tort &amp; être précis<br />
            que vague &amp; prudent.
            <cite>— sur un post-it au-dessus de mon bureau depuis 2022</cite>
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
        <span style={{ marginLeft: 'auto' }}>pas de DMs freelance &mdash; salarié heureux ✦</span>
      </div>

    </div>
  )
}
