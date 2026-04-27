// ─────────────────────────────────────────────────────────────────────────────
// THE MISKATONIC MANUSCRIPT — text adventure engine
// ─────────────────────────────────────────────────────────────────────────────

export type RoomId   = 'library' | 'archives' | 'basement' | 'chamber' | 'outside'
export type ItemId   = 'lantern' | 'note' | 'coin' | 'book'
export type Dir      = 'north' | 'south' | 'east' | 'west' | 'up' | 'down'

export interface GameState {
  room: RoomId
  inventory: ItemId[]
  roomItems: Record<RoomId, ItemId[]>
  flags: Record<string, boolean>
  sanity: number
  over: boolean
  win: boolean
}

export interface TurnResult {
  lines: string[]
  next: GameState
}

// ── HTML helpers ──────────────────────────────────────────────────────────────
const ok  = (s: string) => `<span class="ok">${s}</span>`
const err = (s: string) => `<span class="err">${s}</span>`
const dim = (s: string) => `<span class="dim">${s}</span>`
const kw  = (s: string) => `<span class="kw">${s}</span>`
const sep = (n = 42)    => dim('─'.repeat(n))

// ── Room exits  (locked exits checked at runtime) ─────────────────────────────
const EXITS: Record<RoomId, Partial<Record<Dir, RoomId>>> = {
  library:  { east: 'archives', down: 'basement' },
  archives: { west: 'library' },
  basement: { up: 'library', north: 'chamber' },
  chamber:  { south: 'outside' },
  outside:  {},
}

// ── Room descriptions ─────────────────────────────────────────────────────────
function describeRoom(id: RoomId, state: GameState): string[] {
  const items = state.roomItems[id] ?? []
  const hasLantern = state.inventory.includes('lantern')

  switch (id) {
    case 'library':
      return [
        ok('READING ROOM') + dim(' · Miskatonic University Library'),
        sep(),
        'The gas lamps flicker at irregular intervals.',
        'Professor Armitage\'s oak desk dominates the north corner —',
        'papers scattered, a teacup still warm.',
        '',
        ...(items.includes('lantern')
          ? [`A ${kw('brass lantern')} burns at the edge of the desk.`]
          : []),
        ...(items.includes('note')
          ? [`A folded ${kw('note')} is pinned beneath an inkwell.`]
          : []),
        '',
        `Exits: ${kw('EAST')} → restricted archives · ${kw('DOWN')} → basement stacks`,
      ]

    case 'archives':
      if (!hasLantern) return [
        ok('RESTRICTED ARCHIVES'),
        sep(),
        err('The archives are nearly lightless.'),
        dim('Towering shelves press close in the dark. The air smells'),
        dim('of old paper and something animal and wrong.'),
        dim('You need more light to search here.'),
        '',
        `Exits: ${kw('WEST')} → reading room`,
      ]
      return [
        ok('RESTRICTED ARCHIVES'),
        sep(),
        'By lantern-light: shelves of forbidden texts, most with no titles',
        'on their spines — only sigils pressed into the leather.',
        '',
        `One volume, ${kw('Unaussprechlichen Kulten')}, lies open on the reading stand.`,
        ...(state.flags.kulten_examined && !state.flags.key_taken
          ? [`A heavy ${kw('iron key')} protrudes from between the pages.`]
          : []),
        '',
        `Exits: ${kw('WEST')} → reading room`,
      ]

    case 'basement':
      return [
        ok('BASEMENT STACKS'),
        sep(),
        'Narrow aisles between floor-to-ceiling shelves. The cold here',
        'has a quality to it — not the cold of a cellar, but of vast',
        dim('open space where there should be walls.'),
        '',
        dim('Something is breathing in the dark. You tell yourself it is pipes.'),
        '',
        ...(items.includes('coin')
          ? [`A ${kw('silver coin')} gleams in the dust near the floor drain.`]
          : []),
        `To the ${kw('NORTH')}, a heavy iron door ${state.flags.chamber_unlocked ? 'stands open' : 'bears a keyhole'}.`,
        '',
        `Exits: ${kw('UP')} → reading room · ${kw('NORTH')} ${state.flags.chamber_unlocked ? '(open)' : '(locked)'}`,
      ]

    case 'chamber':
      return [
        ok('RITUAL CHAMBER'),
        sep(),
        err('A room that should not exist beneath the library.'),
        '',
        'The floor is covered in chalk diagrams — concentric circles,',
        dim('non-Euclidean angles that the eye slides off of.'),
        '',
        ...(items.includes('book')
          ? [
              `In the centre, on a plain wooden stand: a tome bound`,
              `in pale leather. ${kw('DE VERMIS MYSTERIIS')}. The Mysteries of the Worm.`,
              dim('This is what Armitage found.'),
            ]
          : [dim('The wooden stand is empty.')]),
        '',
        `Exits: ${kw('SOUTH')} → passage to loading dock`,
      ]

    case 'outside':
      return [
        ok('LOADING DOCK'),
        sep(),
        'Cold night air. You are outside.',
        '',
        dim('Above, the stars are arranged incorrectly. You know this now'),
        dim('in a way you cannot un-know — the way you know your own name.'),
        '',
        'But the sky is open, and you are alive.',
      ]
  }
}

// ── Item examine / read descriptions ─────────────────────────────────────────
function examineItem(name: string, state: GameState): TurnResult {
  const s = { ...state, flags: { ...state.flags } }
  const lines: string[] = []

  const n = name.toLowerCase()

  if (n === 'lantern' || n === 'brass lantern') {
    lines.push(dim('A quality brass lantern, still burning. Armitage\'s initials are scratched on the base: H.W.A.'))
    return { lines, next: s }
  }
  if (n === 'note' || n === 'armitage' || n === 'armitage\'s note') {
    if (!s.inventory.includes('note') && !(s.roomItems.library ?? []).includes('note')) {
      lines.push(err('There is no note here.'))
      return { lines, next: s }
    }
    s.flags.note_read = true
    lines.push(
      ok('Armitage\'s note:'),
      sep(28),
      dim('"Found the shipment manifest — the book arrived Tuesday.'),
      dim('Restricted archives, shelf R-7. I have the key.'),
      dim('God help me, I looked inside. Do not read past page forty.'),
      dim('Do not read past—"'),
      sep(28),
      dim('The sentence ends mid-word.'),
    )
    return { lines, next: s }
  }
  if (n === 'kulten' || n === 'book' && s.room === 'archives' || n.includes('kulten') || n.includes('unauss')) {
    if (s.room !== 'archives') {
      lines.push(err('There is no such thing here.'))
      return { lines, next: s }
    }
    if (!s.inventory.includes('lantern')) {
      lines.push(err('It\'s too dark to see properly.'))
      return { lines, next: s }
    }
    if (!s.flags.kulten_examined) {
      s.flags.kulten_examined = true
      s.sanity -= 1
      lines.push(
        dim('You open to a random page. Your eyes trace a paragraph about'),
        dim('rituals performed at angles that only exist below certain depths.'),
        err('Your mind recoils. −1 sanity.'),
        '',
        `A heavy ${kw('iron key')} slides from between pages 312 and 313.`,
        dim('You take it before you can think better of it.'),
      )
      s.flags.kulten_examined = true
      s.flags.key_taken = true
      s.flags.has_key = true
    } else {
      lines.push(dim('You have already disturbed its pages enough.'))
    }
    return { lines, next: s }
  }
  if (n === 'coin' || n === 'silver coin') {
    lines.push(
      `The coin is tarnished silver. On one face: a lighthouse.`,
      dim('On the other: a figure with too many angles to be human.'),
      dim('The date stamped reads 1692. Impossible — coinage of that era was different.'),
    )
    return { lines, next: s }
  }
  if (n === 'de vermis' || n === 'mysteriis' || (n === 'book' && s.room === 'chamber') || n.includes('vermis')) {
    if (!s.inventory.includes('book')) {
      lines.push(err('The book is not in your possession.'))
      return { lines, next: s }
    }
    return readBook(s)
  }
  if (n === 'stand' || n === 'wooden stand') {
    if (s.room !== 'chamber') {
      lines.push(err('There is no stand here.'))
      return { lines, next: s }
    }
    lines.push(
      dim('Plain pine wood, unremarkable. A circular groove is worn into its surface,'),
      dim('as if something heavy and round had rested here for a very long time.'),
    )
    return { lines, next: s }
  }
  if (n === 'desk' || n === 'armitage\'s desk') {
    if (s.room !== 'library') {
      lines.push(err('There is no desk here.'))
      return { lines, next: s }
    }
    lines.push(
      'Armitage\'s desk. Scattered papers — calculations, star charts,',
      dim('a letter in an alphabet you cannot identify.'),
      `The ${kw('note')} pinned beneath the inkwell seems most recent.`,
    )
    return { lines, next: s }
  }

  lines.push(err(`You see no ${name} to examine.`))
  return { lines, next: s }
}

function readBook(state: GameState): TurnResult {
  const s = { ...state, flags: { ...state.flags } }
  const lines: string[] = []
  if (!s.flags.book_read) {
    s.flags.book_read = true
    s.sanity -= 2
    lines.push(
      err('You open De Vermis Mysteriis.'),
      '',
      dim('The text is in Medieval Latin, with marginal glosses in something older.'),
      dim('You read three sentences. Then four. Then you cannot stop.'),
      '',
      dim('The worm, Prinn writes, does not die. It retreats. It waits in the angles'),
      dim('between the foundations. It is patient because it does not experience time.'),
      '',
      err('Your vision fractures at the edges. −2 sanity.'),
      '',
      dim('When you close the book, you notice the passage is behind you.'),
      `The ${kw('SOUTH')} exit was always there.`,
    )
  } else {
    s.sanity -= 1
    lines.push(
      err('You read further. −1 sanity.'),
      dim('"…and he who carries the text becomes the text, over sufficient time."'),
    )
  }
  return { lines, next: s }
}

// ── sanity ────────────────────────────────────────────────────────────────────
function sanityFlavour(n: number): string {
  if (n >= 5) return ok('●●●●●')
  if (n === 4) return ok('●●●●') + dim('○') + dim(' · your hands tremble slightly')
  if (n === 3) return ok('●●●') + err('○○') + err(' · shadows move at the edge of vision')
  if (n === 2) return ok('●●') + err('○○○') + err(' · whispers in a language older than Greek')
  if (n === 1) return ok('●') + err('○○○○') + err(' · reality feels thin, like paper about to tear')
  return err('○○○○○') + err(' · [CRITICAL]')
}

// ── take item ─────────────────────────────────────────────────────────────────
function takeItem(name: string, state: GameState): TurnResult {
  const s = { ...state, roomItems: { ...state.roomItems }, flags: { ...state.flags } }
  const lines: string[] = []
  const n = name.toLowerCase().replace(/^the\s+/, '')

  // Key is special — stored as flag, not real item
  if (n === 'key' || n === 'iron key') {
    if (!s.flags.kulten_examined) {
      lines.push(err('You see no key here.'))
      return { lines, next: s }
    }
    if (s.flags.key_taken) {
      lines.push(err('You already have the key.'))
      return { lines, next: s }
    }
    if (s.room !== 'archives') {
      lines.push(err('There is no key here.'))
      return { lines, next: s }
    }
    s.flags.key_taken = true
    s.flags.has_key = true
    lines.push(ok('Taken.') + dim(' The key is cold and heavier than it should be.'))
    return { lines, next: s }
  }

  const roomList = s.roomItems[s.room] ?? []
  let itemId: ItemId | undefined

  if (n === 'lantern' || n === 'brass lantern') itemId = 'lantern'
  else if (n === 'note' || n === 'armitage' || n === 'armitage\'s note') itemId = 'note'
  else if (n === 'coin' || n === 'silver coin') itemId = 'coin'
  else if (n === 'book' || n.includes('vermis') || n.includes('mysteriis') || n === 'manuscript' || n === 'tome') itemId = 'book'

  if (!itemId || !roomList.includes(itemId)) {
    lines.push(err(`You see no ${n} here.`))
    return { lines, next: s }
  }
  if (s.inventory.includes(itemId)) {
    lines.push(err(`You already have the ${n}.`))
    return { lines, next: s }
  }

  s.roomItems = { ...s.roomItems, [s.room]: roomList.filter(i => i !== itemId) }
  s.inventory = [...s.inventory, itemId]

  if (itemId === 'book') {
    s.sanity -= 1
    lines.push(
      ok('You take De Vermis Mysteriis.'),
      dim('The leather cover is warm to the touch. You try not to think about why.'),
      err('−1 sanity.'),
    )
  } else if (itemId === 'lantern') {
    lines.push(ok('Taken.') + dim(' The lantern\'s warmth is a small comfort.'))
  } else if (itemId === 'note') {
    lines.push(ok('Taken.') + dim(' Armitage\'s handwriting is tight, hurried.'))
  } else if (itemId === 'coin') {
    lines.push(ok('Taken.') + dim(' The coin is cold in your palm.'))
  }

  return { lines, next: s }
}

// ── move ──────────────────────────────────────────────────────────────────────
function move(dir: Dir, state: GameState): TurnResult {
  const s = { ...state, flags: { ...state.flags } }
  const lines: string[] = []

  const exits = EXITS[s.room]
  const target = exits[dir]

  if (!target) {
    lines.push(err('You cannot go that way.'))
    return { lines, next: s }
  }

  // Locked chamber
  if (target === 'chamber' && !s.flags.chamber_unlocked) {
    if (s.flags.has_key) {
      s.flags.chamber_unlocked = true
      lines.push(
        dim('You fit the iron key into the lock. It turns with a sound like a joint'),
        dim('popping. The door swings inward on silent hinges.'),
        '',
        dim('The air that escapes is cold and smells of chalk and old candles.'),
        '',
      )
    } else {
      lines.push(
        err('The iron door is locked.'),
        dim('A heavy keyhole stares back at you.'),
      )
      return { lines, next: s }
    }
  }

  // Archives without lantern — allow entry but warn
  if (target === 'archives' && !s.inventory.includes('lantern')) {
    lines.push(dim('You step into the archives. It\'s very dark here.'), '')
  }

  s.room = target as RoomId

  // Win condition
  if (s.room === 'outside') {
    if (!s.inventory.includes('book')) {
      lines.push(
        dim('You emerge onto the loading dock. The cold night air hits your face.'),
        dim('You left the book behind. You are safe.'),
        '',
        dim('But you will never stop wondering what was inside.'),
        '',
        sep(),
        dim('ESCAPED (without the book). Type ') + kw('play') + dim(' to try again.'),
      )
    } else {
      lines.push(
        ok('LOADING DOCK'),
        sep(),
        'Cold night air. You are outside.',
        '',
        dim('Above, the stars are arranged incorrectly. You know this now in a way'),
        dim('you cannot un-know — the way you know your own name.'),
        '',
        dim('But the sky is open, and the library door is behind you, and you are alive.'),
        '',
        dim('De Vermis Mysteriis is in your bag. Armitage will want to see this.'),
        dim('If he is still himself.'),
        '',
        sep(),
        ok('YOU FOUND THE BOOK.') + `  sanity: ${s.sanity}/5`,
        dim('Type ') + kw('play') + dim(' to start again.'),
        sep(),
      )
    }
    s.over = true
    s.win = s.inventory.includes('book')
    return { lines, next: s }
  }

  lines.push(...describeRoom(s.room, s))
  return { lines, next: s }
}

// ── inventory ─────────────────────────────────────────────────────────────────
function showInventory(state: GameState): string[] {
  const held: string[] = []
  if (state.inventory.includes('lantern'))  held.push(kw('brass lantern'))
  if (state.inventory.includes('note'))     held.push(kw('Armitage\'s note'))
  if (state.inventory.includes('coin'))     held.push(kw('silver coin'))
  if (state.inventory.includes('book'))     held.push(kw('De Vermis Mysteriis'))
  if (state.flags.has_key && state.flags.key_taken) held.push(kw('iron key'))

  if (held.length === 0) return [dim('You are carrying nothing.')]
  return [
    ok('Carrying:'),
    ...held.map(i => `  · ${i}`),
    '',
    `Sanity: ${sanityFlavour(state.sanity)}`,
  ]
}

// ── help ──────────────────────────────────────────────────────────────────────
function showHelp(): string[] {
  return [
    ok('commands'),
    sep(32),
    `${kw('look')} / ${kw('l')}            describe room`,
    `${kw('go')} <dir>            move (n s e w up down)`,
    `${kw('take')} <item>         pick up an item`,
    `${kw('examine')} / ${kw('x')} <thing>  look closer`,
    `${kw('read')} <item>         read a text`,
    `${kw('inventory')} / ${kw('i')}       what you carry`,
    `${kw('sanity')}              check your mind`,
    `${kw('quit')}                leave the game`,
  ]
}

// ── death ─────────────────────────────────────────────────────────────────────
function checkDeath(state: GameState): TurnResult | null {
  if (state.sanity <= 0) {
    const s = { ...state, over: true, win: false }
    return {
      lines: [
        '',
        err('Your mind shatters.'),
        '',
        dim('The angles of the room shift until nothing is perpendicular.'),
        dim('Something vast and cold pours through the cracks in your perception.'),
        dim('You had a name. You had a purpose. These things are very far away now.'),
        '',
        err('SANITY DEPLETED. GAME OVER.'),
        dim('Type ') + kw('play') + dim(' to start again.'),
      ],
      next: s,
    }
  }
  return null
}

// ── INTRO ─────────────────────────────────────────────────────────────────────
export const INTRO: string[] = [
  sep(),
  ok('THE MISKATONIC MANUSCRIPT'),
  dim('a text adventure · Arkham, Massachusetts · 1923'),
  sep(),
  '',
  'A telegram arrived this morning from the university:',
  dim('"Armitage missing. Restricted archives unsealed. Come at once."'),
  '',
  'Professor Armitage was your mentor. Three days ago he located',
  'a rare manuscript rumoured to have arrived at the library.',
  dim('He sent no word after that.'),
  '',
  'The library closes in one hour.',
  '',
  dim('Type ') + kw('help') + dim(' for commands · ') + kw('look') + dim(' to begin.'),
  sep(),
  '',
]

// ── initGame ──────────────────────────────────────────────────────────────────
export function initGame(): GameState {
  return {
    room: 'library',
    inventory: [],
    roomItems: {
      library:  ['lantern', 'note'],
      archives: [],
      basement: ['coin'],
      chamber:  ['book'],
      outside:  [],
    },
    flags: {},
    sanity: 5,
    over: false,
    win: false,
  }
}

// ── processCommand ────────────────────────────────────────────────────────────
export function processCommand(raw: string, state: GameState): TurnResult {
  const cmd   = raw.trim().toLowerCase()
  const words = cmd.split(/\s+/)
  const verb  = words[0]
  const rest  = words.slice(1).join(' ')

  if (state.over) {
    return { lines: [dim('The game is over. Type ') + kw('play') + dim(' to start again.')], next: state }
  }

  // direction shortcuts
  const dirMap: Record<string, Dir> = { n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down', ...Object.fromEntries((['north','south','east','west','up','down'] as Dir[]).map(d => [d, d])) }

  if (dirMap[verb]) {
    const result = move(dirMap[verb], state)
    const death  = checkDeath(result.next)
    return death ?? result
  }

  switch (verb) {
    case 'look': case 'l':
      return { lines: describeRoom(state.room, state), next: state }

    case 'go': {
      const d = dirMap[rest] ?? dirMap[rest?.charAt(0)]
      if (!d) return { lines: [err(`Go where? (n s e w up down)`)], next: state }
      const result = move(d, state)
      return checkDeath(result.next) ?? result
    }

    case 'take': case 'get': case 'pick': {
      const item = rest.replace(/^up\s+/, '')
      const result = takeItem(item, state)
      return checkDeath(result.next) ?? result
    }

    case 'examine': case 'x': case 'inspect': case 'look at': {
      const result = examineItem(rest, state)
      return checkDeath(result.next) ?? result
    }

    case 'read': {
      const n = rest.replace(/^the\s+/, '').toLowerCase()
      if (n === 'note' || n === 'armitage' || n.includes('note')) return examineItem('note', state)
      if (n.includes('kulten') || n.includes('unauss')) return examineItem('kulten', state)
      if (n.includes('vermis') || n.includes('mysteriis') || n === 'book' || n === 'tome') {
        if (!state.inventory.includes('book')) {
          return { lines: [err('You don\'t have the book.')], next: state }
        }
        const result = readBook(state)
        return checkDeath(result.next) ?? result
      }
      return { lines: [err(`Read what? (${kw('note')}, ${kw('kulten')}, ${kw('book')})`)], next: state }
    }

    case 'inventory': case 'i': case 'inv':
      return { lines: showInventory(state), next: state }

    case 'sanity':
      return { lines: [`Sanity: ${sanityFlavour(state.sanity)}`], next: state }

    case 'help': case '?':
      return { lines: showHelp(), next: state }

    case 'quit': case 'q': case 'exit': {
      const s = { ...state, over: true, win: false }
      return {
        lines: [dim('You flee into the Arkham night. The book is never found.'), dim('Type ') + kw('play') + dim(' to start again.')],
        next: s,
      }
    }

    default:
      return { lines: [err(`Unknown command: "${verb}" — type `) + kw('help') + err(' for commands.')], next: state }
  }
}
