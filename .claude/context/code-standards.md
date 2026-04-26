# clementbacle.dev — Code Standards

> Project is greenfield. Standards below are the targets to enforce as code is written. Updated incrementally as patterns emerge.

## Tech Baseline

### Frontend / Framework

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Required for native MCP support in P2 |
| Language | **TypeScript** (strict mode) | No `any`, no `as` shortcuts |
| Styling | **Tailwind CSS** | Config derived from Claude Design `tokens.css` |
| Fonts | `next/font/google` | Newsreader, JetBrains Mono, Geist (loaded via `app/layout.tsx`) |
| Icons | TBD | Probably Lucide or Heroicons (decision in E2) |
| Theme | Dark default (`data-theme="dark"`) | Light theme via easter egg trigger |

### Content

| Layer | Technology | Notes |
|---|---|---|
| Articles source | **Markdown + YAML frontmatter** | Files in `content/articles/*.md` |
| Parser | **Velite** (preferred) or `next-mdx-remote` | Decision in E4 — Velite is build-time + type-safe |
| Code highlighting | Shiki | If code blocks needed in articles |

### Infrastructure & deploy

| Layer | Technology | Notes |
|---|---|---|
| Package manager | **pnpm** | Fast install, deterministic lockfile, Vercel-recommended |
| Hosting | **Vercel** | Auto-deploy from `main` branch |
| Domain | `clementbacle.dev` | DNS managed in Vercel |
| HTTPS | Vercel auto | Cert + redirect HTTP→HTTPS |
| CDN | Vercel Edge | Default for SSG pages |

### Testing

| Layer | Technology | P1 status |
|---|---|---|
| Unit / component | **Vitest** (when added) | None in P1 — focus on shipping |
| E2E | **Playwright** (when added) | None in P1 |
| Visual regression | TBD | None in P1 |

> **P1 testing strategy : manual smoke test at deploy time.** Automated tests added when site has critical paths to protect.

## Naming Conventions

### Files & folders
- React components : `PascalCase.tsx` (e.g. `ProjectCard.tsx`, `Terminal.tsx`)
- Pages (App Router) : `page.tsx` per route folder, lowercase folder names (e.g. `app/projects/page.tsx`)
- Utils / helpers : `kebab-case.ts` (e.g. `lib/parse-article.ts`)
- Hooks : `useFooBar.ts` (e.g. `hooks/useTheme.ts`)
- Types : `kebab-case.ts` in `types/` folder, exported as `PascalCase` interfaces/types

### Variables
- Components : `PascalCase`
- Functions, variables : `camelCase`
- Constants : `SCREAMING_SNAKE_CASE` (e.g. `MAX_ARTICLES_PER_PAGE`)
- Boolean : prefix with `is`, `has`, `can`, `should` (e.g. `isOpen`, `hasError`)

### Tailwind classes
- Order : layout → spacing → typography → colors → states (use `prettier-plugin-tailwindcss` to auto-sort)
- Tokens from `tokens.css` only — no arbitrary values like `text-[#1a1a1a]`

## Import Rules

```ts
// 1. Node built-ins
import { readFile } from 'node:fs/promises'

// 2. External packages
import { NextResponse } from 'next/server'
import clsx from 'clsx'

// 3. Internal absolute (via @/ alias)
import { ArticleCard } from '@/components/ArticleCard'
import { parseArticle } from '@/lib/parse-article'

// 4. Relative imports (last resort)
import './styles.css'
```

- Path alias `@/` → `src/` (configured in `tsconfig.json`)
- Avoid `../../../foo` — use `@/foo` instead
- Side-effect imports (CSS) at the bottom

## Formatting

- **Prettier** : run on all `.ts` / `.tsx` / `.md` / `.json` files
- **ESLint** : `next/core-web-vitals` + `@typescript-eslint/strict`
- Tab width : 2 spaces
- Quotes : single (`'foo'`)
- Trailing comma : `'all'`
- Semi-colons : `false` (no semis — Next.js convention)

## Architecture (P1)

### File layout (target)

```
clementbacle/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, theme, metadata)
│   │   ├── page.tsx                # / (home — terminal easter egg HERE)
│   │   ├── about/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── writing/page.tsx
│   │   ├── article/[slug]/page.tsx
│   │   ├── sitemap.ts              # auto-generated sitemap
│   │   ├── robots.ts               # robots.txt
│   │   └── api/                    # (empty in P1, agent in P2)
│   ├── components/                 # Reusable UI components
│   ├── lib/                        # Helpers, parsers
│   ├── hooks/                      # React hooks
│   └── types/                      # TS interfaces / types
├── content/
│   └── articles/                   # Markdown articles
├── public/                         # Static assets (favicon, OG images)
├── tailwind.config.ts              # Tokens from Claude Design
├── next.config.ts
└── package.json
```

### Server vs Client components

- **Default : Server Components** (no `'use client'` unless needed)
- `'use client'` only for : interactivity (terminal easter egg, animations, form input), hooks (`useState`, `useEffect`), browser APIs
- Markdown parsing : server-side at build time (SSG)
- Article pages : SSG (Static Site Generation), not SSR

### Routing

- All routes are static (SSG) in P1
- `/article/[slug]` uses `generateStaticParams` to pre-render all articles at build
- No middleware needed in P1

## Dual-account safeguards (CRITICAL)

This repo uses the **personal** GitHub account `bacleclement` (NOT `bacleclement-hublo`).

**Layered protections in place :**

1. `git config --local user.email "clement.bacle01@gmail.com"` (set per-repo)
2. `.git/hooks/pre-push` — blocks `git push` if `gh auth status` active account ≠ `bacleclement`
3. `kitt.json vcs.config.account = "bacleclement"` — read by skills before any VCS operation
4. `kitt.json taskManager.config.account = "bacleclement"` — read by skills before any GH issue operation

**Hard rule for all sessions :** verify `gh auth status` shows `bacleclement` as active BEFORE any `gh` command. If not : run `gh auth switch -u bacleclement`.

## Constraints (non-negotiable)

These are documented in `product.md` but listed here as code-level enforcement points :

- ✅ **Design fidelity** : every component must match Claude Design handoff output. PR comment if any deviation needed.
- ✅ **Terminal easter egg preserved** : the `clement` typed → theme swap behavior must work in production. Smoke-test post every deploy that touches `app/page.tsx` or related components.
- ✅ **mailto: only** for CTAs. No contact form imports, no Cal.com integrations.
- ✅ **No analytics packages** added to `package.json` (`@vercel/analytics`, `plausible-tracker`, `react-ga4`, etc.) without explicit user approval.
