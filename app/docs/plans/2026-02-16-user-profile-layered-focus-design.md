# User Profile: Layered Focus Redesign

## Problem
- Right panel (40%) is overloaded: profile + CharacterSelector + SpiderChart + ClusterPulseCards + AgentTelemetryStream + CognitiveDrift
- Too many small decorative HUD elements adding visual noise
- Generic 60/40 dashboard split layout

## Solution: Layered Focus

### Layout
- PersonalKnowledgeGraph fills entire viewport as background layer (absolute inset-0)
- Floating glass panel on the right (w-[420px], glassmorphism) hovers over the graph
- Map HUD label stays on graph layer (top-left)

### Floating Panel Structure
1. **Profile Header** (compact) — name, level, insight, CharacterSelector as horizontal row
2. **Tab Bar** — 3 tabs: Топология | Поток | Дрифт
3. **Tab Content** — one section visible at a time:
   - Топология: SpiderChart (280px height)
   - Поток: ClusterPulseCards + AgentTelemetryStream
   - Дрифт: CognitiveDrift (expanded)

### Removed Elements
- HUD corner decorations on SpiderChart
- "СИНХРОНИЗАЦИЯ: АКТИВНА" status text
- Footer HUD "СТАТУС_ОПЕРАТОРА: НОМИНАЛЬНЫЙ"
- Decorative gradient lines/separators

### Style
- Glass panel: bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl
- Tab bar: minimal pills, active tab colored by dominant cluster
- CharacterSelector: horizontal scroll row instead of 3-column grid
- Min font size: 9px (up from 7px)

### Unchanged (simulation safety)
- All hooks (useSimulation, useMemo) remain identical
- PersonalKnowledgeGraph — no logic changes, just full-screen sizing
- SpiderChart, CognitiveDrift, ClusterPulseCards, AgentTelemetryStream — logic untouched
- EventCard overlay, Achievement modal — untouched

## Files to modify
- `src/pages/user/ui/UserPage.tsx` — main layout restructure
- `src/features/User/CharacterSelector/ui/CharacterSelector.tsx` — horizontal layout variant
