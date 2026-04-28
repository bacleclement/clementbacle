import Link from 'next/link'
import HeroFog from '@/components/HeroFog'
import styles from './home.module.scss'

export default function HomePage() {
  return (
    <>
      {/* ===================================================== HERO */}
      <section className={styles.hero}>
        <HeroFog />

        <div className="shell">
          <div className={styles.hero__eyebrow}>
            <span className={styles.dot}></span>
            <span>writing &amp; building &mdash; updated 27 apr 2026</span>
          </div>

          <h1 className={styles.hero__title}>
            I build software
            <br />
            and <em>AI&nbsp;workflows</em> —
            <br />
            then write about both.
          </h1>

          <p className={styles.hero__sub}>
            <b>~/clement</b> · senior fullstack engineer · lille, fr
            <span className="cursor"></span>
          </p>

          {/* Decorative static terminal — aria-hidden, not interactive */}
          <div className={styles.term} aria-hidden="true">
            <div><span className="p">$</span> <span className="o">whoami</span></div>
            <div>clement &mdash; ten years shipping web. ex-founder (12 ppl). currently at hublo (healthtech).</div>
            <div><span className="p">$</span> <span className="o">cat ./focus.txt</span></div>
            <div><span className="a">›</span> ai agents · context engineering · mcp · nestjs · entrepreneuriat</div>
            <div style={{ marginTop: '6px' }}><span className="p">$</span> <span className="o">cat ./skills.txt</span></div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>front</b> &nbsp; react · angular · svelte · typescript</div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>back</b> &nbsp;&nbsp; nestjs · node · express</div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>data</b> &nbsp; mongodb · postgresql · redis</div>
            <div><span className="a">›</span> <b style={{ color: 'var(--fg)', fontWeight: 400 }}>ai</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; anthropic · openai · mcp · langchain</div>
          </div>

          <div className={styles.hero__meta}>
            <div><span className={styles.k}>stack</span> React · Angular · Svelte · NestJS · Node</div>
            <div><span className={styles.k}>data</span> MongoDB · PostgreSQL</div>
            <div><span className={styles.k}>now</span> Hublo · senior fullstack</div>
            <div><span className={styles.k}>before</span> Co-founder &amp; PO, Oscare · raised seed · 12 ppl · exited</div>
          </div>
        </div>
      </section>

      {/* ===================================================== LATEST WRITING */}
      <div className="shell">
      <section style={{ marginTop: 'var(--s-9)' }}>
        <div className={styles['section-head']}>
          <h2>Latest <em>writing</em></h2>
          <Link href="/writing" className={styles.more}>all essays</Link>
        </div>

        <div className={styles['writing-grid']}>
          <Link className="card lg" href="/writing">
            <div className="card__cover">
              <div className="cover brick">
                <div className="cover__num">№ 023</div>
                <div>
                  <div className="cover__title">Context engineering, not&nbsp;prompt engineering.</div>
                </div>
                <div className="cover__foot">
                  <span>essai · fr</span>
                  <span>14·apr·26</span>
                </div>
              </div>
            </div>
            <div className="card__title">Context engineering, not prompt engineering</div>
            <div className="card__meta">
              <span>14 apr 2026</span>
              <span>·</span>
              <span>14 min read</span>
              <span>·</span>
              <span>fr · en</span>
            </div>
          </Link>

          <Link className="card" href="/writing">
            <div className="card__cover">
              <div className="cover prussian">
                <div className="cover__num">№ 022</div>
                <div><div className="cover__title">MCP is the <i>USB-C</i> of LLM tools.</div></div>
                <div className="cover__foot">
                  <span>essai · fr</span>
                  <span>02·apr·26</span>
                </div>
              </div>
            </div>
            <div className="card__title">MCP is the USB-C of LLM tools</div>
            <div className="card__meta">
              <span>02 apr 2026</span>
              <span>·</span>
              <span>9 min</span>
            </div>
          </Link>

          <Link className="card" href="/writing">
            <div className="card__cover">
              <div className="cover ocher">
                <div className="cover__num">№ 021</div>
                <div><div className="cover__title">A NestJS module<br />for agent tools.</div></div>
                <div className="cover__foot">
                  <span>note · en</span>
                  <span>21·mar·26</span>
                </div>
              </div>
            </div>
            <div className="card__title">A NestJS module for agent tools</div>
            <div className="card__meta">
              <span>21 mar 2026</span>
              <span>·</span>
              <span>6 min</span>
            </div>
          </Link>
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
            <div className="eyebrow">~/projects · selected</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 600, margin: 'var(--s-2) 0 0' }}>
              Selected work.
            </h2>
          </div>
          <Link href="/projects" className={styles.more}>all projects</Link>
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
              Kitt Intelligence and Tooling Toolkit &mdash; reusable AI workflow engine.
              MCP-aware coding co-pilot with persistent memory.
            </div>
            <div className={styles.work__stack}>typescript · mcp · anthropic</div>
            <div className={styles.work__year}>2025 →</div>
          </a>

          <Link className={styles['work__row']} href="/projects">
            <div className={styles.work__num}>№ 002</div>
            <div className={styles.work__name}>ClaudIn</div>
            <div className={styles.work__desc}>
              Free open-source LinkedIn outreach. Replace Waalaxy with Claude.
              A bundle of Claude Code skills.
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
              A NestJS framework for multi-agent workflows &mdash; queen-and-workers
              pattern with planner, workers and critic.
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
