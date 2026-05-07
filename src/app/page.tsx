import Link from 'next/link'
import HeroFog from '@/components/HeroFog'
import { getArticles } from '@/lib/articles'
import styles from './home.module.scss'

function compactDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
  return `${parseInt(d)}·${months[parseInt(m)-1]}·${y.slice(2)}`
}

export default function HomePage() {
  const latest = getArticles().slice(0, 3)
  return (
    <>
      {/* ===================================================== HERO */}
      <section className={styles.hero}>
        <HeroFog />

        <div className="shell">
          <div className={styles.hero__eyebrow}>
            <span className={styles.dot}></span>
            <span>écriture &amp; code &mdash; mis à jour 27 avr. 2026</span>
          </div>

          <h1 className={styles.hero__title}>
            Je construis des logiciels
            <br />
            et des <em>workflows&nbsp;IA</em> —
            <br />
            et j&rsquo;écris sur les deux.
          </h1>

          <p className={styles.hero__sub}>
            <b>~/clement</b> · senior fullstack engineer · lille, fr
            <span className="cursor"></span>
          </p>

          {/* Decorative static terminal — aria-hidden, not interactive */}
          <div className={styles.term} aria-hidden="true">
            <div><span className="p">$</span> <span className="o">whoami</span></div>
            <div>clement &mdash; dix ans à livrer du web. ex-fondateur (12 pers.). actuellement chez hublo (healthtech).</div>
            <div><span className="p">$</span> <span className="o">cat ./focus.txt</span></div>
            <div><span className="a">›</span> agents ia · context engineering · mcp · nestjs · entrepreneuriat</div>
            <div style={{ marginTop: '6px' }}><span className="p">$</span> <span className="o">cat ./skills.txt</span></div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>front</b> &nbsp; react · angular · svelte · typescript</div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>back</b> &nbsp;&nbsp; nestjs · node · express</div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>data</b> &nbsp; mongodb · postgresql · redis</div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>ia</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; anthropic · openai · mcp · langchain</div>
          </div>

          <div className={styles.hero__meta}>
            <div><span className={styles.k}>stack</span> React · Angular · Svelte · NestJS · Node</div>
            <div><span className={styles.k}>data</span> MongoDB · PostgreSQL</div>
            <div><span className={styles.k}>maintenant</span> Hublo · senior fullstack</div>
            <div><span className={styles.k}>avant</span> Co-fondateur &amp; CPO, Oscare · seed levé · 12 pers. · exited</div>
          </div>
        </div>
      </section>

      {/* ===================================================== LATEST WRITING */}
      <div className="shell">
      <section style={{ marginTop: 'var(--s-9)' }}>
        <div className={styles['section-head']}>
          <h2>Derniers <em>articles</em></h2>
          <Link href="/writing" className={styles.more}>tous les essais</Link>
        </div>

        <div className={styles['writing-grid']}>
          {latest.map((a, i) => {
            const num = String(getArticles().length - i).padStart(3, '0')
            return (
              <Link key={a.slug} className={i === 0 ? 'card lg' : 'card'} href={`/article/${a.slug}`}>
                <div className="card__cover">
                  <div className={`cover ${a.coverColor}`}>
                    <div className="cover__num">№ {num}</div>
                    <div><div className="cover__title">{a.title}</div></div>
                    <div className="cover__foot">
                      <span>{a.category ?? 'essai'} · {a.language}</span>
                      <span>{compactDate(a.date_written)}</span>
                    </div>
                  </div>
                </div>
                <div className="card__title">{a.title}</div>
                <div className="card__meta">
                  <span>{compactDate(a.date_written).replace(/·/g, ' ')}</span>
                  <span>·</span>
                  <span>{a.readingTime} min</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===================================================== PULL QUOTE */}
      <blockquote className={styles.pull}>
        The interesting question isn&rsquo;t &ldquo;can the agent do this task?&rdquo; &mdash; it&rsquo;s
        &ldquo;what does the agent need to know, in what shape, to get one shot at it right?&rdquo;
        <cite>— from &ldquo;Context engineering, not prompt engineering&rdquo;</cite>
      </blockquote>

      {/* ===================================================== SELECTED WORK */}
      <section style={{ marginTop: 'var(--s-8)' }}>
        <div className={styles['section-head']}>
          <div>
            <div className="eyebrow">~/projects · sélection</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 600, margin: 'var(--s-2) 0 0' }}>
              Projets choisis.
            </h2>
          </div>
          <Link href="/projects" className={styles.more}>tous les projets</Link>
        </div>

        <div className={styles.work}>
          <a
            className={styles['work__row']}
            href="https://github.com/bacleclement/kitt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.work__num}>№ 001</div>
            <div className={styles.work__name}>Kitt ↗</div>
            <div className={styles.work__desc}>
              Kitt Intelligence and Tooling Toolkit &mdash; moteur de workflows IA réutilisable.
              Co-pilote de code MCP-aware avec mémoire persistante.
            </div>
            <div className={styles.work__stack}>typescript · mcp · anthropic</div>
            <div className={styles.work__year}>2025 →</div>
          </a>

          <Link className={styles['work__row']} href="/projects">
            <div className={styles.work__num}>№ 002</div>
            <div className={styles.work__name}>ClaudIn</div>
            <div className={styles.work__desc}>
              Prospection LinkedIn open-source et gratuite. Remplace Waalaxy par Claude.
              Un ensemble de skills Claude Code.
            </div>
            <div className={styles.work__stack}>claude code · skills · oss</div>
            <div className={styles.work__year}>2026</div>
          </Link>

          <a
            className={styles['work__row']}
            href="https://github.com/bacleclement/hive"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.work__num}>№ 003</div>
            <div className={styles.work__name}>Hive ↗</div>
            <div className={styles.work__desc}>
              Framework NestJS pour les workflows multi-agents &mdash; pattern reine-et-ouvrières
              avec planificateur, agents spécialisés et critique.
            </div>
            <div className={styles.work__stack}>nestjs · multi-agent</div>
            <div className={styles.work__year}>2026</div>
          </a>
        </div>
      </section>
      </div>{/* /shell */}
    </>
  )
}
