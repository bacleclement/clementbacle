// ── French dictionary (default language) ─────────────────────────────────────

export const fr = {
  terminal: {
    welcome: 'bienvenue. tape <span class="kw">help</span> pour voir les commandes.',
    nav: (href: string) => `<span class="dim">→ navigation vers ${href}…</span>`,
    help: {
      header: 'commandes disponibles',
      rows: [
        ['help',              'afficher cette liste'],
        ['ls',               'lister les pages'],
        ['cd &lt;chemin&gt;','naviguer · /home /writing /projects /about'],
        ['/home',            'raccourci · idem pour /writing /projects …'],
        ['whoami',           'à propos de clément'],
        ['cat skills.txt',   'stack &amp; compétences'],
        ['cat focus.txt',    'focus actuel'],
        ['contact',          'comment me joindre'],
        ['play',             'aventure textuelle · Le Manuscrit de Miskatonic'],
        ['theme',            'basculer dark / light'],
        ['clear',            'vider le terminal'],
      ] as [string, string][],
    },
    ls: {
      header: 'pages',
      rows: [
        ['~/home',     'accueil'],
        ['~/writing',  'essais &amp; notes'],
        ['~/projects', 'projets'],
        ['~/about',    'à propos'],
      ] as [string, string][],
    },
    whoami: [
      'clément bacle — senior <b style="color: var(--fg);">fullstack</b> &amp; ingénieur logiciel.',
      '<span class="dim">dix ans à livrer du web. ex-fondateur (12 pers.). actuellement chez hublo (healthtech).</span>',
    ],
    contact: [
      'email · <span class="kw">clement [at] clementbacle.com</span>',
      'github · <span class="kw">@clementbacle</span>',
      '<span class="dim">pas de DMs freelance — salarié heureux.</span>',
    ],
    theme: (next: string) => `<span class="ok">thème · ${next}</span>`,
    clement: {
      engage:   '<span class="ok">&gt; activation du mode phosphore CRT...</span>',
      synced:   (cmd: string) => `<span class="dim">scanlines synchronisées. tape</span> <span class="kw">${cmd}</span> <span class="dim">à nouveau ou clique exit pour revenir.</span>`,
      disengage:(prev: string) => `<span class="ok">&gt; mode phosphore désactivé. retour à ${prev}.</span>`,
    },
    cat: {
      skills: {
        header: '~/skills.txt',
        rows: [
          ['front', 'react · angular · svelte · typescript'],
          ['back',  'nestjs · node · express'],
          ['data',  'mongodb · postgresql · redis'],
          ['ai',    'anthropic · openai · mcp · langchain'],
          ['infra', 'docker · gh actions · vercel · fly.io'],
        ] as [string, string][],
      },
      focus: {
        header: '~/focus.txt',
        text:   '› agents ia · context engineering · mcp · nestjs · entrepreneuriat',
      },
      missing: '<span class="err">cat: opérande manquant</span>',
      notFound: (f: string) => `<span class="err">cat: ${f}: fichier inexistant</span>`,
    },
    errors: {
      noSuchPage:  '<span class="err">page inconnue · essaie ls</span>',
      cdNotFound:  (t: string) => `<span class="err">cd: ${t}: répertoire inexistant</span>`,
      notFound:    (n: string) => `<span class="err">${n}: commande inconnue · essaie </span><span class="kw">help</span>`,
    },
  },

  footer: {
    elsewhere: 'ailleurs',
    feed:      'flux',
    colophon:  'colophon',
    setIn:     'composé en newsreader\n& jetbrains mono',
    builtWith: 'construit avec next.js',
  },

  banner: {
    label:     'mode phosphore',
    crt:       'CRT activé',
    typeAgain: 'à nouveau pour quitter',
    exit:      'quitter',
  },

  lab: {
    backLink:    '← clementbacle.com',
    title:       'Agent Patterns Studio',
    useCases:    'Cas d\'usage',
    sampleIO:    'Exemple E/S',
    sampleIn:    'Entrée',
    sampleOut:   'Sortie',
    layers:      'Couches',
    legend:      'Légende',
    emptyStep:   'Sélectionne une étape ou clique un nœud pour explorer le flow.',
    prevStep:    'Étape précédente',
    nextStep:    'Étape suivante',
    pause:       'Pause',
    play:        'Lecture',
    layerNames: {
      security:    'Sécurité',
      reliability: 'Fiabilité',
      evaluation:  'Évaluation',
    },
    nodeTypes: {
      input:        'Entrée',
      output:       'Sortie',
      llm:          'LLM',
      agent:        'Agent',
      orchestrator: 'Orchestrateur',
      router:       'Routeur',
      aggregator:   'Agrégateur',
      tools:        'Outils',
      env:          'Environnement',
      gate:         'Porte',
      retry:        'Retry',
      guard:        'Garde',
      human:        'Humain',
      eval:         'Évaluateur',
    },
  },
}

export type Dict = typeof fr
