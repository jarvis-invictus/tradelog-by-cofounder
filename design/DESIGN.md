---
brand:
  name: tradelog
  tagline: Discipline · Insight · Growth
  positioning: AI-powered trading journal and behavioral coach for retail forex traders
  locked_kit: brand-kit-v2.png
  theme: pastel utility
  surfaces: [web app, marketing site, mobile (Android-first), docs, slides, transactional email]
  vibe: [editorial, calm, instrumented, trustworthy, india-native, tradingview-adjacent]
palette:
  base:
    anchor: "#121F29"
    sage: "#A7C5B0"
    lavender: "#C9B4F2"
    sand: "#FFD9A6"
    mint: "#E6F5EE"
    neutral: "#F3F5F4"
    paper: "#FBFBF9"
    ink_muted: "#5A6B73"
    rule: "#E3E6E4"
  semantic:
    background: "#FBFBF9"
    surface: "#FFFFFF"
    surface_muted: "#F3F5F4"
    surface_inset: "#E6F5EE"
    foreground: "#121F29"
    foreground_muted: "#5A6B73"
    border: "#E3E6E4"
    border_strong: "#121F29"
    primary: "#121F29"
    primary_foreground: "#FBFBF9"
    accent: "#C9B4F2"
    accent_foreground: "#121F29"
    success: "#6FA77E"        # derived from Sage, weighted for legibility
    success_surface: "#E6F5EE"
    warning: "#E3A867"        # derived from Sand
    warning_surface: "#FFEFD6"
    danger: "#C2585A"         # inferred restrained red for rule breaks
    danger_surface: "#F6DDDE"
    pnl_up: "#6FA77E"
    pnl_down: "#C2585A"
font_sources:
  - id: google-fonts
    foundry: Google Fonts
    license: Open-source licenses, commonly SIL Open Font License 1.1
    source_url: https://fonts.google.com/
    best_for: body, ui, multi-script (Devanagari for Hindi/Marathi), fast implementation
    implementation_note: Use next/font/google or official downloads. Pair with Noto Sans Devanagari for Hindi/Marathi parity.
  - id: fontshare
    foundry: Fontshare / Indian Type Foundry
    license: ITF Free Font License / Fontshare EULA
    source_url: https://www.fontshare.com/
    best_for: body, ui, display, marketing
    implementation_note: Self-host with next/font/local using official Fontshare files. Respect the Fontshare EULA per family; do not relabel as OFL unless the family's license says so.
  - id: the-league
    foundry: The League of Moveable Type
    license: SIL Open Font License 1.1
    source_url: https://www.theleagueofmoveabletype.com/
    best_for: display, editorial, brand-accent
    implementation_note: Use as display/accent only; ship the OFL text alongside bundled font files.
typography:
  display:
    fontFamily: "Fraunces"
    sourceId: google-fonts
    sourceStatus: approved
    alternativeSourceId: fontshare
    alternatives:
      - fontFamily: "Gambarino"
        sourceId: fontshare
        sourceStatus: approved
        note: Fontshare alternative for a sharper editorial voice; self-host under Fontshare EULA.
      - fontFamily: "Fanwood"
        sourceId: the-league
        sourceStatus: approved
        note: The League of Moveable Type display alternative under SIL OFL 1.1.
    role: Editorial display, hero, section openings
    weights: [400, 500]
    style: high-contrast serif, lowercase wordmark, restrained optical size
    tracking: -0.01em
  body:
    fontFamily: "Inter"
    sourceId: google-fonts
    sourceStatus: approved
    alternativeSourceId: fontshare
    alternatives:
      - fontFamily: "Switzer"
        sourceId: fontshare
        sourceStatus: approved
        note: Fontshare body/UI alternative; self-host under Fontshare EULA, do not relabel as OFL.
      - fontFamily: "Satoshi"
        sourceId: fontshare
        sourceStatus: approved
        note: Secondary Fontshare alternative for a slightly more geometric grotesque.
    role: UI, body, forms, navigation
    weights: [400, 500, 600]
    tracking: -0.005em
  mono:
    fontFamily: "JetBrains Mono"
    sourceId: google-fonts
    sourceStatus: approved
    alternativeSourceId: fontshare
    alternatives:
      - fontFamily: "JetBrains Mono"
        sourceId: fontshare
        sourceStatus: approved
        note: Same family available via Fontshare for self-hosting.
    role: Numerals, P&L, ticks, timestamps, technical annotation, eyebrow labels
    weights: [400, 500]
    tracking: 0.04em
    case: uppercase eyebrows, lining figures, tabular numbers on
  devanagari:
    fontFamily: "Noto Sans Devanagari"
    sourceId: google-fonts
    sourceStatus: approved
    role: Hindi/Marathi parity for body and UI
    weights: [400, 500, 600]
radius:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 999px
  card: 14px
  control: 10px
spacing:
  unit: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]
  gutter: 24px
  page_margin: 48px
  section: 64px
shadow:
  none: "none"
  card: "0 1px 0 rgba(18,31,41,0.04), 0 1px 2px rgba(18,31,41,0.05)"
  raised: "0 8px 24px -12px rgba(18,31,41,0.18)"
  focus_ring: "0 0 0 3px rgba(201,180,242,0.45)"
motion:
  duration_fast: 120ms
  duration_base: 180ms
  duration_slow: 280ms
  easing_standard: cubic-bezier(0.2, 0.6, 0.2, 1)
  easing_entrance: cubic-bezier(0.16, 1, 0.3, 1)
  hover_lift: translateY(-1px)
  press: translateY(0) scale(0.99)
---

# DESIGN.md

## Overview

tradelog is a freemium trading journal and behavioral coach for retail forex traders on MT5, India-first by design. The brand voice is calm, instrumented, and quietly editorial — closer to a clinician's notebook than a trading-floor terminal. It borrows the legibility patterns of TradingView (tabular numerals, clear status semantics, dense-but-quiet panels) and pairs them with a pastel utility palette that softens emotional moments rather than amplifying them.

- **Locked brand kit:** `brand-kit-v2.png`
- **Theme:** pastel utility
- **Visual source of truth:** the locked brand kit image. All foundational tokens (palette, type roles, shape system, component sketches, art direction) are derived from it. Where the image only implies a value, this document labels the choice as inferred.
- **Surfaces:** marketing site, web app (primary), Android app, docs, investor and community slides, transactional email.

## Content Fundamentals

**Voice.** Calm, specific, accountable. Speak like a senior trader debriefing a peer — never a coach yelling motivation. Prefer observation over instruction.

**Tone by surface.**
- Marketing — confident, editorial, lowercase wordmark, full-stop endings.
- In-app — neutral, short, second person ("your", "you").
- Friction warnings (rule overrides) — non-judgmental, factual, give the trader the final say.
- AI insights — pattern-first, never diagnostic.

**Casing.** Wordmark and product name are lowercase: `tradelog`. UI labels use sentence case. Eyebrows and meta labels use UPPERCASE TRACKED MONO (e.g., `RULE CHECK`, `AUTO-SYNC`).

**Punctuation quirks.** The tagline uses center dots between words: `Discipline · Insight · Growth`. Comparative statements use `>` to set priorities: `Rules > Emotions`, `Data > Opinions`. Avoid exclamation marks. Avoid em-dashes in UI strings; use a single en-dash with spaces in editorial copy.

**Emoji stance.** No emoji in product UI. Use the icon system instead. Emoji are acceptable only in community channels, never in transactional or in-app surfaces.

**Currency & numbers.** Always render ₹ with a thin space: `₹2,000`. P&L uses a leading sign and tabular figures: `+₹437.10`, `−₹212.00`. Lots: `0.10 lot`. Pairs: `EURUSD` (no slash, uppercase).

**Naming patterns.** Features are two-word noun phrases: Auto-Sync, Rule Engine, Behavioral Edge, Voice Journal, Privacy First. Avoid product suffixes like "Pro", "Plus", "AI" in names.

**Concrete examples.**
- Button label: `Review today's trades` (not "Click here", not "Get Started!")
- Error: `We couldn't reach MT5. Your trades are safe — we'll retry in the background.`
- Empty state: `No trades yet. Connect MT5 and your journal fills itself.`
- Rule warning: `You've hit 3 trades today. Continue anyway?` with secondary `Override and log reason`.

## Visual Foundations

### Color

The palette is a six-tone pastel utility set anchored by a single near-black. The pastels are working colors, not decoration — each one carries a semantic role.

- **Anchor `#121F29`** — primary foreground, primary buttons, wordmark, chart axes. Used for every load-bearing surface.
- **Sage `#A7C5B0`** — success, rule respected, P&L up, "synced/analyzed" states.
- **Lavender `#C9B4F2`** — brand accent, focus, selected tab, AI insight surfaces. The one "unexpected" supporting color.
- **Sand `#FFD9A6`** — warning, rule override, friction moments. Never alarm; always caution.
- **Mint `#E6F5EE`** — inset surface for positive context (synced, journaled).
- **Neutral `#F3F5F4`** — muted surface, table zebra, disabled.

Backgrounds default to **paper `#FBFBF9`** (slightly warmer than pure white, inferred from kit). Red for losses and hard blocks is `#C2585A` — restrained, never saturated. Saturated greens, neons, and bluish-purple gradients are out of system.

### Type

A three-voice typography system. Each role has a primary Google Fonts choice plus at least one approved non-Google alternative for self-hosting:

- **Display — Fraunces (Google Fonts).** High-contrast transitional serif, used for headlines, hero, section openings, and the lowercase wordmark feel. Tracking tightens slightly (−0.01em) at large sizes. Approved alternatives: **Gambarino** (Fontshare, ITF/Fontshare EULA) for a sharper editorial voice; **Fanwood** (The League of Moveable Type, SIL OFL 1.1) for an editorial revival.
- **UI / Body — Inter (Google Fonts).** Clean, legible, grotesque sans for every product surface. 14–16px body, 13px meta, 12px tabular for dense tables. Approved alternative: **Switzer** (Fontshare, ITF/Fontshare EULA) as a self-hosted body/UI option, with **Satoshi** as a secondary Fontshare alternative.
- **Mono / Data — JetBrains Mono (Google Fonts).** Tabular numerals for P&L, lot sizes, pip values; uppercase tracked mono for eyebrows and status labels. The same family is available via Fontshare for self-hosting if Google's CDN is undesirable.

Hierarchy is established by **weight contrast within a small size range** rather than huge size jumps. A typical screen uses 28/22/16/14/12 with serif reserved for one headline per view. Hindi/Marathi parity uses Noto Sans Devanagari at matched weights.

### Spacing & Layout

- 4px base unit. Component padding lives on 8/12/16; section rhythm on 24/32/48/64.
- 12-column grid on web, 24px gutter, 48px page margin. Marketing pages allow asymmetric two-column splits (7/5).
- Generous left margins on editorial pages; thin vertical rule motifs (inferred from the board's vertical caption gesture) can anchor long-form content.

### Borders, Radii, Shadows, Transparency

- Borders are 1px `#E3E6E4` hairlines. Strong borders (anchor) are reserved for primary buttons and selected states.
- Radii: controls 10px, cards 14px, pills 999px, large surfaces 16–24px. Quarter-arc geometric motifs from the brand kit can be used as decorative cues at section openings — sparingly.
- Shadows are minimal. Cards rely on hairline borders and paper-on-paper contrast. A single soft raised shadow is reserved for popovers and overlays.
- No glassmorphism, no heavy blur. A very faint backdrop blur (8px) is acceptable behind modal scrims.

### Hover & Press

- Hover: 1px translate up, border darkens by one step, no color flash.
- Press: returns to baseline with 0.99 scale, 120ms.
- Focus: 3px lavender ring (`rgba(201,180,242,0.45)`) — never blue, never default browser outline.

### Motion

- 120/180/280ms durations. Standard easing for state, entrance easing for content reveal.
- Numbers (P&L, balances) animate with a 280ms count-up on first paint, then update instantly. No ticker flicker.
- Charts draw left-to-right with entrance easing. Never bounce.

### Imagery Vibe

Photography is editorial and quiet: mountain horizons, architectural curves, a figure ascending stairs, soft daylight surfaces. Always desaturated, always with one of the pastel hues quietly tinting a shadow or wall. No stock trading photography, no candlestick chart wallpapers, no glowing screens, no mascots.

## Iconography And Assets

- **Style:** thin-stroke line icons, ~1.5px stroke, rounded caps and joins, square 24px viewbox, no fills except for status dots. The brand kit shows this in the feature row (auto-sync, discipline, AI insights, voice journal, privacy first).
- **Sizes:** 16 (inline), 20 (UI default), 24 (feature), 32+ (marketing).
- **Status marks:** filled circles in Sage / Sand / restrained red, with a white glyph (check, exclamation, ×).
- **Chart marks:** tiny sparkline and bar motifs are part of the system (visible in the kit). Use them as inline data, not decoration.
- **Logo:** the locked kit shows a rounded-square mark on anchor with a serif `t` and a sage/lavender quarter-circle accent, paired with the lowercase serif wordmark `tradelog`. Treat the kit image as the only authoritative source until an SVG is provided. **SVG/PNG export files are missing** and should be sourced from design before production use.
- **Illustration:** none required. The brand expresses itself through type, color blocks, and editorial photography.
- **Substitution-needed:** icon set SVGs, logo SVG/PNG suite, favicon, social OG templates, app icon.

## Components

All components inherit anchor foreground, paper background, hairline borders, 10–14px radii, and Inter for labels.

**Buttons.**
- *Primary* — anchor fill, paper text, 10px radius, 12×20 padding, no shadow. Hover lifts 1px.
- *Secondary* — lavender fill, anchor text. Used for accent CTAs.
- *Ghost* — paper fill, hairline border, anchor text.
- *Icon button* — circular, lavender fill, anchor glyph (visible in the kit as the arrow control).
- *Destructive* — restrained red text on paper with red hairline border; filled red only for confirmation modals.

**Inputs.**
- Single hairline border, 10px radius, 40px height, leading icon optional, trailing filter/clear icon. Focus state: lavender ring + anchor border. Placeholder uses ink_muted.

**Chips & filters.** Pill radius, paper fill, hairline border, small leading status dot (sage/lavender/sand) and trailing `×`. Examples: `● EURUSD ×`, `● Win ×`, `● Rule Warning ×`, `● News ×`.

**Segmented control / tabs.** Single-row, hairline-bordered group, paper background. Active tab uses anchor text and a 2px lavender underline (inferred from the Overview/Trades/Rules/Insights pattern in the kit). Icons sit left of label.

**Cards.**
- *Default* — paper surface, hairline border, 14px radius, 16–20px padding. No nested cards.
- *Status card* — leading status circle, title in 14/600, secondary line in 13/400 ink_muted. Four canonical variants: `Rule respected` (sage), `Rule override` (sand), `Daily loss limit` (red), informational (lavender).
- *Trade tile* — pair + side on the left (mono pair, sentence-case side), price row (Buy · lot · Entry · Exit), P&L on the right with sign and pip delta, mini sparkline trailing. Hairline divider between rows.

**Progress / pipeline.** Horizontal stepper with circular nodes and hairline connectors. States: `Synced → Analyzed → Rule Check → Journaled`. Current step is lavender filled, completed steps are sage with check, pending steps are neutral. Step labels in mono uppercase, 11px.

**Navigation.** Top bar is paper with a hairline base border. Lowercase wordmark left, tabs center or left-of-center, search and account right. Side nav (web app) is 240px, paper surface, anchor labels, lavender 2px indicator on active item.

**Alerts.** Inline banners with a leading status dot, no full-bleed color fills. Background tints (mint, sand, faint red) sit at 100–200 weight; text always remains anchor for legibility.

**Dashboard tiles.** Four-up KPI row: label in mono eyebrow, value in display serif or large Inter 500 with tabular figures, delta in sage/red with sign, sparkline trailing. Tiles share hairline border, no shadow.

**Voice journal control.** Circular record button, lavender fill, anchor mic glyph, soft pulse animation while recording. A transcript appears in a card below; explicit copy reminds the user audio is not stored.

## UI Kit Guidance

**Typical web-app screen (Journal).** Paper background. Left rail nav (Overview / Trades / Rules / Insights / Voice). Top bar with search and account. Page header is a single serif headline plus a mono eyebrow date range. Below: a 4-up KPI row, then a two-column split — left a trade list (tiles with sparklines), right a stacked column of insight cards (lavender-tinted) and a rule status card (sage or sand depending on the day). Use whitespace generously; do not fill the canvas.

**Marketing.** Editorial two-column hero: lowercase serif wordmark mark-left, headline center-left in display serif (`Trade with clarity, grow with discipline.`), thin Inter subline below, single primary CTA. The feature row uses the five thin-line icons from the kit with mono eyebrow labels. Photography (mountains, stairs, curves) crops tall and quiet, with a pastel quietly tinting the shadows.

**Mobile (Android-first).** Single-column, 16px page margins, 12px radii, larger 48px tap targets. The friction warning is a full-width sand-tinted sheet with the rule restated, a primary "Override and log reason" button, and a paper "Cancel" ghost. P&L numbers remain mono tabular.

**Docs.** Two-column with a thin sidebar TOC. Serif h1, Inter body at 16/1.6, mono inline code on neutral surface. Callouts reuse the four status card variants.

**Slides (16:9).** Paper background, 48px margins, mono index numbers top-left (`01`, `02` — seen in the kit), serif headline, one chart or one photo per slide. Footer rule + `tradelog · v1.0`. Avoid bullet lists; prefer one statement per slide.

**Do not invent:** bluish-purple gradients, glassy cards, neon candlestick decoration, colored left-border alert cards, emoji status indicators, mascots, 3D objects. None of these are in the locked kit.

## Preview And Verification Notes

Downstream agents should generate small self-contained preview cards for inspection:

- **Type previews** — one card per role (Display Fraunces, UI Inter, Mono JetBrains Mono) showing the role name, a one-line specimen, and the scale ladder. One card showing `Rules > Emotions | Data > Opinions` in mono. Also generate a "non-Google alternative" preview tile for Gambarino/Switzer to confirm Fontshare self-host fallback before lock.
- **Color previews** — six swatch cards (Anchor, Sage, Lavender, Sand, Mint, Neutral) with hex and semantic role. One card showing semantic tokens (success / warning / danger / accent) on paper.
- **Spacing previews** — a card showing the 4/8/12/16/24/32 ladder as stacked bars, and a card showing card padding and gutter at real scale.
- **Components previews** — button row (Primary / Secondary / Ghost / Icon), input with search and filter, chip row, segmented tabs, status card quartet, trade tile, stepper (Synced → Analyzed → Rule Check → Journaled), KPI tile.
- **Brand previews** — wordmark on paper, mark on anchor, tagline `Discipline · Insight · Growth`, four art-direction tiles (Calm Focus, Structured, Progressive, Clean & Honest) with one-line labels.

Each preview should fit a 480–640px card, use paper background, and be inspectable without scrolling.

## Caveats And Missing Assets

- **Logo files.** Only the rasterized mark and wordmark in `brand-kit-v2.png` are available. SVG/PNG exports, favicon, app icon, and social OG templates are missing and should be requested before production.
- **Icon set.** The five feature icons are visible only as raster previews. Production needs an SVG icon set matching the thin-stroke style.
- **Exact display serif.** The wordmark and headlines read as a high-contrast transitional serif. Fraunces (Google Fonts) is the inferred working choice; final selection may shift to Gambarino (Fontshare) or Fanwood (The League of Moveable Type) if a sharper or more revivalist voice is desired.
- **Danger red.** The kit shows a desaturated red on the rule-break card; `#C2585A` is inferred to harmonize with the pastel utility set. Confirm with d