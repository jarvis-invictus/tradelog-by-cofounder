# Tradelog — AI Trading Journal
> Discipline · Insight · Growth

**One-line summary:** Tradelog is an AI-powered trading journal for retail forex traders that auto-syncs trades from MetaTrader 5, enforces self-set discipline rules with friction-based blocks, and delivers personalized behavioral coaching — starting with India's Rich Royals community and expanding globally.

**GitHub Pages (landing site):** https://jarvis-invictus.github.io/tradelog-by-cofounder/
**App repo (Cofounder-managed):** https://github.com/Cofounder-Customer-Projects-1/tradelog-455118
**Marketing repo:** https://github.com/Cofounder-Customer-Projects-1/tradelog-455118-marketing

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Cofounder Workspace Setup](#3-cofounder-workspace-setup)
4. [Agent Roles & What Each One Does](#4-agent-roles--what-each-one-does)
5. [Design System](#5-design-system)
6. [Brand Assets in This Repo](#6-brand-assets-in-this-repo)
7. [App Architecture](#7-app-architecture)
8. [Supabase & Database](#8-supabase--database)
9. [Vercel Deployments](#9-vercel-deployments)
10. [Development Workflow](#10-development-workflow)
11. [MVP Scope & Roadmap](#11-mvp-scope--roadmap)
12. [ICP & Go-To-Market](#12-icp--go-to-market)
13. [How to Continue from Here (Agent Instructions)](#13-how-to-continue-from-here-agent-instructions)

---

## 1. Product Overview

### Core Product Loop
1. **Auto-Sync from MT5** — Read-only MetaAPI integration captures every trade (pair, lot size, entry, exit, P&L) with zero manual entry.
2. **Rules Engine (Soft Block)** — Traders self-set discipline rules ("Max 3 trades/day", "No trading after loss limit", "Minimum 1:2 RR"). When a rule is broken, the app surfaces a friction warning requiring a conscious override.
3. **AI Behavioral Insights** — Post-trade and weekly AI analysis (Claude API / Groq fallback) surfaces patterns the trader cannot see themselves: revenge trading frequency, session-time performance gaps, drawdown triggers.
4. **Voice-First Journal** — Traders speak their reasoning in Hindi/Marathi/English post-trade. Whisper transcribes and attaches to the trade. Audio is never stored.
5. **India-Native UX** — Rs-denominated P&L, UPI payments via Razorpay, Hindi/Marathi localization, Android-first.

### MVP Scope (v1 — Rich Royals Launch)
- MT5 auto-sync (MetaAPI)
- Rules engine with soft friction blocks
- Basic AI insights (Claude API)
- Rs P&L dashboard
- Razorpay subscription (Rs 299-499/month)

Post-MVP: Voice journal (Whisper), advanced analytics, Hindi/Marathi UI strings, white-label for institutes.

### Business Model
| Tier | Price | Features |
|------|-------|----------|
| Free | Rs 0 | Manual trade logging, limited history |
| Pro | Rs 299-499/mo | MT5 auto-sync, AI feedback, weekly reports, rules engine, full analytics |

Payments via Razorpay (UPI, cards, netbanking). Future: institute/group licenses, broker affiliate revenue.

### Competitive Moat
| Dimension | Tradelog | Tradervue / TraderSync / Edgewonk |
|-----------|----------|-----------------------------------|
| Trade capture | Auto-sync from MT5 | Mostly manual |
| Behavioral enforcement | Rules engine + friction blocks | None |
| AI coaching | Behavioral pattern insights | Basic statistics |
| Localization | Rs P&L, UPI, Hindi/Marathi | USD-only, Western UX |
| Pricing | Rs 299-499/mo | $30-50/mo (Rs 2,500-4,000) |
| Distribution | 1,000+ warm users at launch | Cold acquisition |

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router), React 19, TypeScript (strict), Tailwind CSS v4 |
| State / Data | TanStack Query (React Query) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Package manager | Bun |
| Linting | Biome |
| Trade sync | MetaAPI (MT5 read-only) |
| AI insights | Claude API (primary), Groq (fallback) |
| Voice transcription | OpenAI Whisper |
| Payments | Razorpay (UPI, cards, netbanking) |
| Email | Postmark |
| Hosting | Vercel |
| CI/CD | GitHub Actions -> Vercel |

---

## 3. Cofounder Workspace Setup

This project is built and managed inside the [Cofounder](https://cofounder.co) platform. The following Cofounder-managed infrastructure is canonical — do not infer config from .env files.

### Repositories
| Repo | Purpose | Default Branch |
|------|---------|----------------|
| `Cofounder-Customer-Projects-1/tradelog-455118` | Main app | `main` (staging) / `prod` (production) |
| `Cofounder-Customer-Projects-1/tradelog-455118-marketing` | Marketing site | `main` (staging) / `prod` (production) |

### Vercel Projects
| Project | Staging URL | Production URL |
|---------|-------------|----------------|
| App | https://staging.app.tradelog-455118.cofounder.company | https://app.tradelog-455118.cofounder.company |
| Marketing | https://staging.tradelog-455118.cofounder.company | https://tradelog-455118.cofounder.company |

### Supabase
| Ref | Purpose |
|-----|---------|
| `ohixyyfajhhdjkytvbgz` | Production |
| `pfquaounoifgtjixvjzq` | Staging branch |

### Branch Targeting Rules
- `main` -> staging environment
- `prod` -> production environment
- PRs targeting `main` apply Supabase migrations to staging
- Publishing (merging `main` -> `prod`) applies migrations to production

---

## 4. Agent Roles & What Each One Does

Cofounder uses specialized AI agents. Here is what each agent owns for Tradelog:

### Engineer Agent
- Primary implementation agent: app code, backend, API routes, database schema, migrations
- Works in `/workspace/repo` (the app repo checkout)
- Reads `AGENTS.md` and `design/DESIGN.md` before any UI work
- Follows the PR loop: code -> lint/typecheck -> commit -> push -> PR -> CI -> merge
- **Coding rules (from `AGENTS.md`):**
  - Use React Query for all server state — no useEffect fetching
  - useEffect is banned by default; use event handlers or render-time derivation
  - No barrel imports — import concrete files
  - Named imports only (exception: `import * as React`)
  - Run `bun run lint`, `bun run typecheck`, `bun run test` before finishing any PR

### Design Agent
- Owns the design system, brand direction, color palette, typography, component patterns
- Output is `DESIGN.md` — the locked design source of truth (see Section 5)
- Generated brand kits: `brand-kit-v1.png`, `brand-kit-v2.png` (in `design/` folder of this repo)
- Generates landing pages, mockups, favicon packs, and visual direction artifacts
- All Engineer UI work must read `DESIGN.md` first

### Marketing Agent
- Owns the marketing website (separate repo: `tradelog-455118-marketing`)
- Landing page iterations: `tradelog-landing.html`, `tradelog-landing-v2.html`, `tradelog-landing-v3.html`
- GTM strategy, campaign briefs, SEO, content angles

### Cofounder / Superoptimizer (Root Agent)
- Orchestrates all agents
- Owns business context, ICP, positioning, mission
- Routes tasks to the right agent
- Manages Vercel, Supabase, and GitHub integration credentials at the platform level

---

## 5. Design System

The locked design system lives in `design/DESIGN.md`. Every agent doing UI work must read it first.

### Core Identity
- **Brand name:** tradelog
- **Tagline:** Discipline . Insight . Growth
- **Theme:** Pastel utility — editorial, calm, instrumented, trustworthy, India-native, TradingView-adjacent
- **Locked brand kit:** `brand-kit-v2.png`

### Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Anchor (navy) | `#121F29` | Primary backgrounds, nav, footers |
| Sage | `#A7C5BD` | Calm accents, secondary UI |
| Lavender | `#C9B4F2` | Primary accent, CTAs, highlights |
| Ivory | `#F5F0E8` | Light backgrounds, cards |
| Gold | `#E8C547` | Alerts, premium markers |
| Profit green | `#4CAF50` | P&L positive |
| Loss red | `#E53935` | P&L negative |

### Typography
- **Headings:** TT Neoris Variable (display weight)
- **Body / UI:** AF Another Sans Variable
- **Mono / data / labels:** Departure Mono
- Font URLs from `https://cofounder.co/fonts/` (platform CDN)

### Key Design Rules
- Dark-anchored surfaces with lavender accent — never generic SaaS blue
- Editorial density: data-forward, scannable, no card soup
- India-native: Rs symbol, rupee formatting, UPI badge in payment flows
- TradingView-adjacent: candlestick motifs, clean chart integration aesthetic
- No decorative gradients, no emoji confetti, no floating blobs
- Mobile-first (Android-first)

---

## 6. Brand Assets in This Repo

| File | Description |
|------|-------------|
| `index.html` | Tradelog landing page v3 — animated, SEO-optimised, self-contained |
| `design/DESIGN.md` | Locked design system — read this before any UI work |
| `design/brand-kit-versions.json` | Brand kit version history with metadata |
| `design/brand-kit-v2.png` | Current locked brand kit (upload manually if not present) |
| `design/brand-kit-v1.png` | Previous brand kit iteration |

---

## 7. App Architecture

### Directory Structure (`/workspace/repo` or cloned app repo)
```
src/
  actions/      # Next.js server actions
  app/          # Next.js App Router pages and layouts
  components/   # Shared React components
  hooks/        # React Query hooks (api/ subdirectory for API hooks)
  lib/          # Shared utilities
  proxy.ts      # Supabase session middleware (enable after Supabase is configured)
supabase/       # Migrations and local Supabase config
scripts/        # Utility scripts
```

### Key Wiring Points
- **Supabase auth:** `src/app/auth/callback/route.ts` handles OAuth redirects
- **Stripe webhooks:** scaffold in place, needs Stripe env vars
- **Email (Postmark):** helpers and starter templates in `src/lib/`
- **Middleware:** `src/proxy.ts` — uncomment `updateSession` after Supabase is live

### Enabling Supabase
1. Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
2. In `src/proxy.ts`, uncomment `updateSession` and remove the placeholder `NextResponse.next()`.

---

## 8. Supabase & Database

- Production ref: `ohixyyfajhhdjkytvbgz`
- Staging branch ref: `pfquaounoifgtjixvjzq`
- Migrations live in `supabase/migrations/`
- Merging a migration PR into `main` applies it to staging automatically
- Publishing to `prod` applies it to production

**Key tables to build (MVP):**
- `users` — Supabase Auth users + profile (MT5 account ID, plan tier)
- `trades` — individual trade records (pair, lot, entry, exit, pnl, timestamp, session)
- `rules` — user-defined discipline rules (type, threshold, enabled)
- `rule_violations` — log of rule breaks with override reason
- `journals` — voice/text journal entries linked to trades
- `insights` — AI-generated behavioral insights (weekly/per-trade)
- `subscriptions` — Razorpay subscription state per user

---

## 9. Vercel Deployments

| Environment | Branch | App URL | Marketing URL |
|-------------|--------|---------|---------------|
| Staging | `main` | https://staging.app.tradelog-455118.cofounder.company | https://staging.tradelog-455118.cofounder.company |
| Production | `prod` | https://app.tradelog-455118.cofounder.company | https://tradelog-455118.cofounder.company |

Vercel env vars are managed at the Cofounder platform level — do not read from checked-in `.env` files for staging/production values.

---

## 10. Development Workflow

### Local Setup
```bash
cd /workspace/repo   # (or clone the app repo)
bun install
bun dev              # works before Supabase is configured
```

### Before Every PR
```bash
bun run lint
bun run typecheck
bun run test
```

### PR Workflow (Engineer Agent)
1. Create branch from `main` (naming: `cofounder/<description>`)
2. Make changes using repo tools (`read`, `edit`, `write`, `ast_edit`)
3. Run lint + typecheck
4. Commit and push
5. Create PR targeting `main`
6. Wait for CI checks
7. Merge when clean — do not wait for manual review

### Deployment Flow
- `main` -> auto-deploys to Vercel staging
- `prod` <- merge from `main` (via Cofounder Publish) -> production

---

## 11. MVP Scope & Roadmap

### MVP (v1 — Rich Royals Launch)
- [ ] MT5 auto-sync via MetaAPI (read-only)
- [ ] Rules engine: self-set rules + friction block UI
- [ ] Basic AI insights (Claude API) — post-trade patterns
- [ ] Rs P&L dashboard with trade history
- [ ] Razorpay Pro subscription (Rs 299-499/month)
- [ ] Auth (Supabase email + Google OAuth)
- [ ] Android-first responsive web app

### Post-MVP
- [ ] Voice journal (Whisper transcription)
- [ ] Weekly AI behavioral report
- [ ] Hindi/Marathi UI localization
- [ ] Advanced analytics (session analysis, drawdown triggers)
- [ ] White-label for Rich Royals institute
- [ ] Global expansion (USD pricing, MT4 support)

---

## 12. ICP & Go-To-Market

### Primary ICP
Intermediate Indian retail forex trader:
- 6-24 months live trading on MT5
- Small account (Rs 10,000-1,00,000 capital)
- Knows rules intellectually, breaks them emotionally
- Android user, pays via UPI
- Rich Royals community member or adjacent

### Launch Channel
Rich Royals forex institute — 15,000+ alumni, 1,000+ active monthly traders. Co-founder runs the institute. Direct warm distribution from day one.

### Expansion Channels
- Indian forex Telegram/Discord groups
- Hindi/Marathi YouTube and short-form content
- Referral incentives within trading communities

### Team
- **Sahil Bagul** — Tech founder. Full-stack, AI integration, product architecture.
- **Co-founder (brother)** — Domain expert and distribution. Runs Rich Royals institute.

---

## 13. How to Continue from Here (Agent Instructions)

If you are an AI agent picking up this project, follow these steps:

### Step 1 — Read context files first
Before doing any work, read these in order:
1. `design/DESIGN.md` in this repo — brand and design system (mandatory for all UI work)
2. This README — product scope, stack, agent roles
3. `AGENTS.md` in the app repo (`Cofounder-Customer-Projects-1/tradelog-455118`) — coding rules

### Step 2 — Identify your role
| If you are... | Your scope |
|---------------|-----------|
| **Engineer Agent** | App code at `Cofounder-Customer-Projects-1/tradelog-455118`, checked out at `/workspace/repo` |
| **Design Agent** | Visual direction, `DESIGN.md` updates, brand kit, landing page iterations |
| **Marketing Agent** | `tradelog-455118-marketing` repo, campaign briefs, SEO, content |
| **Root/Cofounder Agent** | Orchestration, business decisions, agent routing |

### Step 3 — Current state (as of 2026-05-26)
- App scaffold: provisioned (Next.js + Supabase + Stripe scaffold, no product features built yet)
- Design system: locked (brand-kit-v2, DESIGN.md complete)
- Landing page v3: live at https://jarvis-invictus.github.io/tradelog-by-cofounder/
- Supabase: provisioned (staging + production refs above), no app-specific migrations yet
- Vercel: staging and production deployments connected
- MVP features: NOT YET BUILT — MT5 sync, rules engine, AI insights, Razorpay are all pending

### Step 4 — Next implementation priorities (MVP order)
1. Supabase schema: `trades`, `rules`, `rule_violations`, `users` tables + RLS policies
2. MetaAPI integration: MT5 trade sync background service
3. Rules engine: rule CRUD + violation detection + friction warning UI
4. AI insights: Claude API integration for post-trade behavioral analysis
5. Razorpay: subscription checkout + webhook handler + entitlement check middleware
6. Dashboard: Rs P&L view with trade history and rule violation stats

### Step 5 — Key constraints (never violate)
- No `useEffect` for data fetching — use React Query hooks
- No barrel imports — import concrete files directly
- Run `bun run lint` + `bun run typecheck` before every PR
- Read `design/DESIGN.md` before any UI work — use the exact palette, typography, and component patterns defined there
- All Supabase/Vercel env vars come from Cofounder platform, not `.env` files
- Mobile-first (Android), Rs formatting, UPI badge in payment flows
- PRs target `main` (staging) — never push directly to `prod`

---

*This README was generated by the Cofounder Engineer agent on 2026-05-26. Update the "Current state" section in Step 3 as milestones are completed.*
