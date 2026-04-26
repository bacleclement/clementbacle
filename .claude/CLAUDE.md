# Claude CLI — clementbacle.dev

Personal landing page for Clément Bacle — freelance dev & AI builder portfolio.
Source design : Claude Design handoff at `https://api.anthropic.com/v1/design/h/8fqu_ISF0YvRxUi9aWQ6MQ`.

## .claude/ Structure

```
.claude/
├── CLAUDE.md              # This file
├── config/kitt.json       # Kitt configuration (project, vcs, taskManager, build, design, deploy)
├── context/
│   ├── product.md         # Product brief : users, domains, business rules, vocabulary
│   └── code-standards.md  # Tech baseline, naming, imports, architecture, testing
├── skills/                # Symlinks to ~/.claude/kitt/.claude/skills/* (kitt skills)
└── workspace/             # Work items
    ├── epics/             # E1-E6 land here once /refine'd or /build-plan'd
    ├── features/
    ├── bugs/
    └── refactors/
```

## Kitt Workflow

Entry point : `/orchestrate` → reads `.claude/config/kitt.json` and `.claude/context/*` to route to the right skill.

### Typical flow for an epic
```
/orchestrate                # detect what to work on
  → /refine                 # turn epic into spec.md (per-epic refined)
  → /align                  # validate architecture against code-standards.md
  → /build-plan             # decompose into US tasks
  → /implement              # TDD per US, with verification
  → /pr-creator             # creates PR, links to GH issue
  → /finish-development     # smoke test + cleanup
```

### Direct skill calls
- `/brainstorm` — for new ideas (NOT for the existing E1-E6 epics, those are already specified in design.md)
- `/manage-task` — read/update GH issues
- `/debug` — systematic bug investigation
- `/qa-frontend` — manual QA of frontend changes

## Reference documents

- Original design.md (lives in scouty repo) : `/Users/clementbacle/Code/scouty/workspace/clementbacle-site/clementbacle-site-design.md`
- 6 epics tracked as GH issues : https://github.com/bacleclement/clementbacle/issues?q=is%3Aopen+label%3Aepic

## Hard Rules (non-negotiable)

### Git & GitHub
- ⛔ **NEVER `git push` without explicit user confirmation**
- ⛔ **NEVER commit secrets** (`.env`, tokens, keys)
- ⛔ **NEVER use `gh auth login` to switch accounts** without explicit user confirmation — this repo uses `bacleclement`, not `bacleclement-hublo`
- ✅ Before any `gh` command : verify `gh auth status` shows `bacleclement` as active. If not : `gh auth switch -u bacleclement`
- ✅ Pre-push hook is installed (`.git/hooks/pre-push`) — it WILL block pushes if active account is wrong
- ✅ Local git config sets `user.email` to `clement.bacle01@gmail.com` (personal). Never override.

### Design fidelity
- ⛔ **NEVER deviate silently from the Claude Design handoff** — every visual choice must match. Deviations require a PR comment + user approval.
- ⛔ **NEVER break the terminal easter egg** on home page (typing `clement` → theme swap). Smoke-test after any change to `app/page.tsx`.
- ⛔ **NEVER add "available for hire" / "looking for opportunities" / "open to roles"** anywhere — Clément is on CDI Hublo.
- ⛔ **NEVER add a contact form, Cal.com, or any non-`mailto:` CTA** — `mailto:` only.
- ⛔ **NEVER add analytics packages** (Vercel Analytics, Plausible, GA4, etc.) without explicit approval.

### Code quality
- ✅ TypeScript strict mode — no `any`, no `as` shortcuts
- ✅ Server Components by default, `'use client'` only when needed
- ✅ Tailwind tokens from `tailwind.config.ts` only — no arbitrary values
- ✅ When uncertain about a pattern : **search first, ask if still unclear, never guess**

### Article migration
- Articles live in `content/articles/*.md` (NOT `.scouty/articles/`)
- Migration is **manual curation** — Clément picks which articles go on the site
- The `.scouty/brand-signatures.md` file from the Scouty repo is **NOT** imported by this site

## Quick Reference

```bash
# Dev
pnpm install
pnpm dev               # http://localhost:3000

# Quality gates
pnpm tsc --noEmit      # typecheck
pnpm lint              # lint
pnpm test              # tests (when added — none in P1)
pnpm build             # production build

# Deploy (manual)
git push origin main   # auto-deploys via Vercel

# Account verification
gh auth status         # MUST show "Active account: true" next to "bacleclement"
```

## Onboarding new sessions

If a new Claude session starts on this repo :
1. Read `.claude/config/kitt.json`
2. Read `.claude/context/product.md`
3. Read `.claude/context/code-standards.md`
4. Read this `CLAUDE.md`
5. Verify `gh auth status` shows `bacleclement` active
6. Run `/orchestrate` to know what to work on
