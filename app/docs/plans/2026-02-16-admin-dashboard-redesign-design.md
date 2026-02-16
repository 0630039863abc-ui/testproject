# Admin Dashboard Redesign: Bento Dashboard

**Date**: 2026-02-16
**Status**: Approved
**Approach**: Bento Dashboard (Premium Dark UI, Linear/Vercel reference)

## Problems to Solve

1. **Outdated look** — CRT/retro effects (scanlines, grain, glow) look cheap
2. **Weak visual hierarchy** — all panels have equal weight, no clear focus
3. **Poor readability** — small tables, unclear charts, hard to read data

## Design Tokens

### Colors
- Background: `#09090B` (zinc-950), clean, no patterns/overlays
- Surface: `rgba(255,255,255,0.03)` + `border: 1px solid rgba(255,255,255,0.06)`
- Surface hover: `rgba(255,255,255,0.05)` + `border: rgba(255,255,255,0.10)`
- Cluster colors: current palette at 80% saturation, soft glow on hover only
- Cluster badges: `bg-{color}/10 text-{color}/80 border border-{color}/20`

### Typography
- Widget titles: Inter Semi-Bold, 13px, zinc-400, uppercase, tracking-wider
- Numbers/metrics: JetBrains Mono Medium, 28-36px, zinc-100
- Table data: Inter Regular, 13px, zinc-300
- Labels/captions: Inter Regular, 11px, zinc-500
- Orbitron: REMOVED entirely

### Spacing & Radii
- Border-radius: 12px (cards), 8px (inner elements), 6px (badges)
- Padding: 16px (cards), 12px (inner sections)
- Grid gap: 16px between widgets

### Animations
- Hover: `transition: all 150ms ease`
- Mount: framer-motion `layout` transitions
- REMOVED: glitch, shiver, pulse-crimson, scanlines, CRT effects

## Bento Grid Layout

```
12-column CSS Grid, 4 rows
┌─────────────────────────────────┬────────────────────┐
│                                 │  ACTIVITY_MATRIX   │
│     VORONOI MAP                 │  (bar chart + KPIs)│
│     (col 1-8, row 1-3)         │  (col 9-12,        │
│     Hero widget                 │   row 1-2)         │
│                                 ├────────────────────┤
│                                 │  TELEMETRY STREAM  │
│                                 │  (event log)       │
│                                 │  (col 9-12, row 3) │
├──────────┬──────────────────────┼────────────────────┤
│ RATING   │  DEMOGRAPHIC         │  LIVE OCCUPANCY    │
│ STRAT    │  MATRIX              │  (col 9-12, row 4) │
│(col 1-4) │  (col 5-8, row 4)   │                    │
└──────────┴──────────────────────┴────────────────────┘
```

Total height: `100vh - header(48px) - padding(32px)` — no scroll

## Component Designs

### Widget Wrapper (replaces Holocard)
- Header: icon (Lucide 14px) + title (Inter Semi-Bold 13px zinc-400) + action buttons
- Divider: `border-b border-white/5`
- Header height: 36px
- No: scanlines, tech-corners, iridescent glow, backdrop-blur

### Voronoi Map
- Remove bloom post-processing
- Cluster zones: opacity 0.6 default, 0.85 on hover
- Labels: Inter Semi-Bold 12px (not Orbitron), white with text-shadow
- Numbers: JetBrains Mono 20px, crisp white
- Particles: reduced brightness, subtler
- Remove action badge buttons (PROSMOTR ANONSA etc.)

### Activity Matrix
- Thin bars with rounded-top caps, height fills container
- Bar labels: 11px zinc-500
- Event stream table:
  - Row padding: 8px vertical, hover `bg-white/[0.03]`
  - Cluster badges: pill `px-2 py-0.5 rounded-full text-[11px]` outline style
  - Timestamps: zinc-500, monospace

### Rating Strat
- Vertical list of rating cards
- Each: rank (zinc-500 11px) + color dot (8px) + name (Inter 13px zinc-200) + sparkline (60x20px) + score (JBMono 15px zinc-100)

### Demographic Matrix
- Clean grid table (not notebook-style)
- Header: zinc-500, 11px, uppercase
- Cells: zinc-200, 13px, monospace
- Significant cells: `bg-{color}/5`
- Row hover: `bg-white/[0.03]`

### AppHeader
- Height: 48px, transparent background
- Logo "ЦПК": Inter Bold 16px, zinc-100 (no pulsing dot)
- Tabs: pill style, active = `bg-white/[0.08]`, inactive = transparent
- Status: small green dot + text, zinc-500

## What Gets Removed
- All CRT effects (scanlines, grain overlay, hex pattern)
- Noise/vignette from LayoutShell
- Tech-corner decorations
- Orbitron font
- Bloom post-processing on Voronoi
- Iridescent border glow on Holocard
- Glitch/shiver/pulse-crimson animations
- Bright colored badge backgrounds on cluster tags
- Action badge buttons on Voronoi map
