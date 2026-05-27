# tradelog — app/

Next.js 14 App Router application for **tradelog**, a freemium SaaS trading journal for Indian retail forex traders on MT5.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router, TypeScript (strict) |
| Styling | Tailwind CSS v3 (design tokens from `design/DESIGN.md`) |
| State / data | TanStack React Query v5 |
| Backend / DB | Supabase (Postgres + Auth) |
| Trade sync | MetaAPI (MT5 read-only) — stub wired, integration pending |
| AI insights | Claude API / Groq fallback — stub wired, integration pending |
| Payments | Razorpay — webhook handler wired, checkout pending |

## Directory layout

```
app/
  src/
    actions/          # Next.js server actions (auth)
    app/              # App Router pages and route handlers
      api/
        insights/generate/   # AI insights generation stub
        sync/mt5/            # MetaAPI MT5 sync stub
        webhooks/razorpay/   # Razorpay webhook handler
      auth/callback/         # Supabase OAuth callback
      dashboard/
        (overview)           # KPI tiles + recent trades + insights
        trades/              # Trade history
        rules/               # Rule engine CRUD
        insights/            # Behavioral insights
        journal/             # Trade journal
        settings/            # Profile + subscription
      login/
      signup/
    components/
      auth/             # LoginForm, SignupForm
      dashboard/        # SideNav, TopBar, OverviewClient
      insights/         # InsightsClient
      journal/          # JournalClient
      rules/            # RulesClient, RuleFrictionModal
      settings/         # SettingsClient
      trades/           # TradesClient, TradeTile
      ui/               # KpiTile, StatusCard, TradeStepper, Chip
    hooks/
      api/              # use-trades, use-rules, use-insights
      use-user.ts
    lib/
      supabase/         # client, server, admin, types
      utils.ts          # cn, formatInr, formatDate, etc.
    middleware.ts       # Auth protection middleware
  supabase/
    config.toml
    migrations/
      20260527000001_initial_schema.sql
```

## Local setup

```bash
cd app
npm install          # or: bun install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Environment variables

See `.env.example`. Supabase and Vercel env vars for staging/production are managed at the Cofounder platform level.

## Design system

All UI follows `design/DESIGN.md` in the repo root. Palette tokens, typography, radii, and component patterns are derived from `brand-kit-v2.png`.

## What’s stubbed (next priorities)

1. **MetaAPI** — `src/app/api/sync/mt5/route.ts` has the wiring points. Add `metaapi-cloud-sdk` and fill in.
2. **AI insights** — `src/app/api/insights/generate/route.ts`. Add `@anthropic-ai/sdk`.
3. **Razorpay checkout** — Settings page has the upgrade button. Wire `razorpay` package + subscription creation.
4. **Trade log form** — "+ Log trade" modal in Trades page.
5. **Add rule modal** — "+ Add rule" flow in Rules page.
