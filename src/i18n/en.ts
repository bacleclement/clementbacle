// ── English dictionary ────────────────────────────────────────────────────────

import type { Dict } from './fr'

export const en: Dict = {
  terminal: {
    welcome: 'welcome. type <span class="kw">help</span> to list commands.',
    nav: (href: string) => `<span class="dim">→ navigating to ${href}…</span>`,
    help: {
      header: 'available commands',
      rows: [
        ['help',              'show this list'],
        ['ls',               'list pages'],
        ['cd &lt;path&gt;',  'go to page · /home /writing /projects /about'],
        ['/home',            'shortcut · same for /writing /projects …'],
        ['whoami',           'about clement'],
        ['cat skills.txt',   'stack &amp; skills'],
        ['cat focus.txt',    'current focus'],
        ['contact',          'how to reach me'],
        ['play',             'text adventure · The Miskatonic Manuscript'],
        ['theme',            'toggle dark / light'],
        ['clear',            'clear log'],
      ],
    },
    ls: {
      header: 'pages',
      rows: [
        ['~/home',     'landing'],
        ['~/writing',  'essays &amp; notes'],
        ['~/projects', 'things I built'],
        ['~/about',    'bio &amp; stack'],
      ],
    },
    whoami: [
      'clément bacle — senior <b style="color: var(--fg);">fullstack</b> &amp; software engineer.',
      '<span class="dim">ten years shipping web. ex-founder (12 ppl). currently at hublo (healthtech).</span>',
    ],
    contact: [
      'email · <span class="kw">clement [at] clementbacle.com</span>',
      'github · <span class="kw">@clementbacle</span>',
      '<span class="dim">no DMs about freelance — salarié heureux.</span>',
    ],
    theme: (next: string) => `<span class="ok">theme · ${next}</span>`,
    clement: {
      engage:    '<span class="ok">&gt; engaging CRT phosphor mode...</span>',
      synced:    (cmd: string) => `<span class="dim">scanlines synced. type</span> <span class="kw">${cmd}</span> <span class="dim">again or click exit to revert.</span>`,
      disengage: (prev: string) => `<span class="ok">&gt; phosphor mode disengaged. back to ${prev}.</span>`,
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
        ],
      },
      focus: {
        header: '~/focus.txt',
        text:   '› ai agents · context engineering · mcp · nestjs · entrepreneuriat',
      },
      missing: '<span class="err">cat: missing operand</span>',
      notFound: (f: string) => `<span class="err">cat: ${f}: no such file</span>`,
    },
    errors: {
      noSuchPage:  '<span class="err">no such page · try ls</span>',
      cdNotFound:  (t: string) => `<span class="err">cd: ${t}: no such directory</span>`,
      notFound:    (n: string) => `<span class="err">${n}: command not found · try </span><span class="kw">help</span>`,
    },
  },

  footer: {
    elsewhere: 'elsewhere',
    feed:      'feed',
    colophon:  'colophon',
    setIn:     'set in newsreader\n& jetbrains mono',
    builtWith: 'built with next.js',
  },

  banner: {
    label:     'phosphor mode',
    crt:       'CRT engaged',
    typeAgain: 'again to exit',
    exit:      'exit',
  },

  lab: {
    backLink:    '← clementbacle.com',
    title:       'Agent Patterns Studio',
    useCases:    'Use cases',
    sampleIO:    'Sample I/O',
    sampleIn:    'Input',
    sampleOut:   'Output',
    layers:      'Layers',
    legend:      'Legend',
    emptyStep:   'Select a step or click a node to explore the flow.',
    prevStep:    'Previous step',
    nextStep:    'Next step',
    pause:       'Pause',
    play:        'Play',
    layerNames: {
      security:    'Security',
      reliability: 'Reliability',
      evaluation:  'Evaluation',
    },
    nodeTypes: {
      input:        'Input',
      output:       'Output',
      llm:          'LLM',
      agent:        'Agent',
      orchestrator: 'Orchestrator',
      router:       'Router',
      aggregator:   'Aggregator',
      tools:        'Tools',
      env:          'Environment',
      gate:         'Gate',
      retry:        'Retry',
      guard:        'Guard',
      human:        'Human',
      eval:         'Evaluator',
    },
  },
}
