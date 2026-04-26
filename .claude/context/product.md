# clementbacle.dev — Product Context

## What Is clementbacle.dev

Personal landing page for **Clément Bacle** — currently dev @ Hublo (CDI), building Scouty (AI scouting tool) and writing tech-history articles on LinkedIn/Medium.

**The site is a B2B sales tool**, not a content discovery channel. Clément shares the URL directly to freelance prospects after conversations. Visitors arrive via direct link, not Google SEO.

**The site signals "AI builder you can hire on a project"** — not "looking for a job".

## Users

| Role | Description | Primary actions |
|---|---|---|
| **Freelance prospects** (P0) | CTOs, founders, tech leads who want to hire Clément on AI/dev projects. Receive the URL via direct contact. | Read about, browse projects, scan articles for credibility, **click `mailto:` to email Clément** |
| **Pairs tech / réseau pro** (P1) | French tech devs / friends who follow Clément's content | Browse articles, share with peers |
| **Recruiters** (P2 — secondary) | Tech recruiters checking Clément after seeing him on LinkedIn | Read CV, browse projects, identify if relevant skill match |
| **Future agent users** (P2 only) | Anyone curious about Clément's AI capabilities | Interact with `/playground` agent (data.gouv MCP demo) |

## Core Domains

The site has 6 logical domains in Phase 1 :

1. **Home (`/`)** — hook page, value proposition, terminal easter egg, navigation to all other sections
2. **About (`/about`)** — CV, bio, expertise areas, personal history
3. **Projects (`/projects`)** — portfolio (Scouty primary, others curated)
4. **Writing (`/writing`)** — article list (sorted by date, latest first)
5. **Article template (`/article/[slug]`)** — single article view, supports markdown body, sources, code blocks
6. **Contact (mailto:)** — no contact form, direct email opening (`mailto:` link)

Phase 2 will add :

7. **Playground (`/playground`)** — interactive AI agent connected to data.gouv MCP, demonstrates Clément's capabilities live

## Business Rules

> *Populated incrementally by `/align` after each US validation. Do not fill manually at setup.*

**Initial seed rules (from brainstorm — non-negotiable constraints) :**

- ✅ **Design fidelity** : 100% to Claude Design handoff (`https://api.anthropic.com/v1/design/h/8fqu_ISF0YvRxUi9aWQ6MQ`). No silent "improvements". Deviations require ticket + user validation.
- ✅ **Existing terminal easter egg** : typing `clement` in the home terminal triggers a theme/design swap. This interaction MUST be preserved during migration. Smoke-tested at every deploy.
- ✅ **No "available for hire"** mentions anywhere on the site (Clément is on CDI Hublo, the freelance offer is for projects/consulting only).
- ✅ **No contact form, no Cal.com** : `mailto:` is the only commercial channel. Lower friction for B2B prospects who want to send a brief email.
- ✅ **No analytics in P1** : no Vercel Analytics, no Plausible, no GA4. Tracking value < cost when sending direct links to ~10-30 prospects/month.
- ✅ **FR only in P1** : `<html lang="fr">`. EN i18n deferred to P2.
- ✅ **No coupling with `.scouty/brand-signatures.md`** : that file is articles-only and lives in the Scouty repo. The site has its own universe (terminal egg + Clément's manual additions).

## Vocabulary

| Term | Meaning |
|---|---|
| **Programmer's Press** | Theme name from Claude Design output (newspaper-inspired typography, dark mode default) |
| **Handoff** | Claude Design export (HTML/CSS bundle) used as source of visual truth |
| **Tokens** | CSS custom properties from Claude Design `tokens.css` — ported to `tailwind.config.ts` |
| **Easter egg terminal** | Interactive feature on home page where typing `clement` triggers a theme swap |
| **MCP** | Model Context Protocol — used in P2 to connect agent to data.gouv |
| **Phase 1 (P1)** | Static landing page, 6 pages, ~12-15h work, target launch this week |
| **Phase 2 (P2)** | Agent + data.gouv MCP integration on `/playground`, deferred post-launch |
