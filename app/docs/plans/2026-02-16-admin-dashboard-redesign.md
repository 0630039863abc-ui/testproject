# Admin Dashboard Bento Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the admin dashboard from CRT/retro aesthetic to a clean Premium Dark UI (Linear/Vercel style) with bento grid layout.

**Architecture:** Incremental refactor — update design tokens first, then clean LayoutShell/AppHeader, create new Widget wrapper, restructure AdminPage grid, and finally update each panel component. Each task produces a visually verifiable result.

**Tech Stack:** React 19, Tailwind CSS 4, Three.js (react-three-fiber), Recharts, Framer Motion, Lucide icons.

**Design doc:** `docs/plans/2026-02-16-admin-dashboard-redesign-design.md`

---

### Task 1: Update design tokens and CSS foundation

**Files:**
- Modify: `src/shared/lib/tokens.ts`
- Modify: `src/app/styles/index.css`

**Step 1: Update tokens.ts**

Replace `HUD_COLORS` and `FONTS` in `src/shared/lib/tokens.ts:66-85`:

```ts
export const HUD_COLORS = {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    alert: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    background: '#09090B',   // zinc-950
    surface: 'rgba(255,255,255,0.03)',
    surfaceHover: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.06)',
    borderHover: 'rgba(255,255,255,0.10)',
    text: {
        primary: '#f4f4f5',   // zinc-100
        secondary: '#a1a1aa', // zinc-400
        muted: '#71717a',     // zinc-500
    }
};

export const FONTS = {
    header: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace'
};
```

**Step 2: Clean CSS variables and remove CRT tokens**

In `src/app/styles/index.css`, replace `:root` block (lines 7-41) with:

```css
:root {
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: dark;
  color: #f4f4f5;
  background-color: #09090B;

  --color-bg: #09090B;
  --color-surface: rgba(255,255,255,0.03);
  --color-surface-hover: rgba(255,255,255,0.05);
  --color-border: rgba(255,255,255,0.06);
  --color-border-hover: rgba(255,255,255,0.10);

  --color-cobalt: #3B82F6;
  --color-emerald: #10B981;
  --color-crimson: #EF4444;
  --color-gold: #F59E0B;
}
```

**Step 3: Update body background**

Replace body block (lines 43-53):

```css
body {
  margin: 0;
  display: flex;
  place-items: flex-start;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--color-bg);
  overflow: hidden;
}
```

**Step 4: Remove Orbitron font import**

In the `@import` line (line 1), remove `family=Orbitron:wght@400;500;700;900&` — keep only Inter and JetBrains Mono.

**Step 5: Remove deprecated CSS utilities**

Delete these entire blocks from `index.css`:
- `.font-orbitron` (lines 69-72)
- `.bg-grain` and `.bg-grain::before` (lines 264-279)
- `.bg-tech-grid` (lines 281-287)
- `.scanlines` (lines 289-297)
- `.text-glow-blue`, `.text-glow-orange`, `.text-glow-red` (lines 300-311)
- `.box-glow-blue`, `.box-glow-orange` (lines 314-322)
- `.tech-border-container` and all `.tech-corner-*` (lines 325-370)
- `@keyframes glitch-skew` and `.glitch-hover` (lines 387-416)
- `.decor-text` (lines 419-426)
- `@keyframes scan` and `.animate-scan` / `.animate-scan-fast` (lines 428-444)
- `@keyframes shiver` (lines 447-453)
- `@keyframes laser-sweep` and `.animate-laser-sweep` (lines 455-467)
- `.bg-hex-pattern` (lines 477-480)
- `.crt-container` and `.crt-container::before` (lines 145-163)
- `.crt-flicker` (lines 165-167)
- `.chromatic-aberration` (lines 169-171)
- `@keyframes textShadow` (lines 173-257)
- `@keyframes pulse-crimson` and `.animate-pulse-crimson` (lines 126-142)
- `@keyframes breathe-red` (lines 460-463)
- `@keyframes spin-slow` and `.animate-spin-slow` (lines 373-385)

**Step 6: Update glass utilities to clean surface style**

Replace `.glass-panel` (lines 93-99) with:

```css
.glass-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}
```

Replace `.glass-panel-hover:hover` (lines 101-105) with:

```css
.glass-panel-hover:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-hover);
  transition: all 150ms ease;
}
```

Replace `.glass-card-2` (lines 469-475) with:

```css
.glass-card-2 {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}
```

Update scrollbar to neutral:

```css
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}
```

**Step 7: Verify**

Run: `npm run dev`
Open browser → the page should load with new background color (#09090B). Some components may look broken (missing CSS classes) — that's expected, we fix them in subsequent tasks.

**Step 8: Commit**

```bash
git add src/shared/lib/tokens.ts src/app/styles/index.css
git commit -m "refactor: update design tokens and CSS to Premium Dark UI"
```

---

### Task 2: Clean LayoutShell — remove all decorative overlays

**Files:**
- Modify: `src/widgets/LayoutShell.tsx`

**Step 1: Simplify LayoutShell**

Replace the entire component body in `src/widgets/LayoutShell.tsx` (lines 10-41):

```tsx
export const LayoutShell: React.FC<LayoutShellProps> = ({ children, className }) => {
    return (
        <div className={clsx(
            "relative w-full h-screen bg-[#09090B] overflow-hidden text-white font-inter selection:bg-blue-500/30",
            className
        )}>
            <div className="relative z-[10] w-full h-full flex flex-col">
                {children}
            </div>
        </div>
    );
};
```

This removes: grain overlay, hex pattern, scanlines, vignette, corner ticks.

**Step 2: Verify**

Run: `npm run dev`
Page should now have a clean dark background with no grain/pattern/vignette visible.

**Step 3: Commit**

```bash
git add src/widgets/LayoutShell.tsx
git commit -m "refactor: strip LayoutShell of CRT decorative overlays"
```

---

### Task 3: Redesign AppHeader — clean minimal header

**Files:**
- Modify: `src/widgets/AppHeader.tsx`
- Modify: `src/shared/ui/TabButton.tsx`

**Step 1: Rewrite AppHeader**

Replace entire `AppHeader` component (lines 10-70):

```tsx
export const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onChangeView }) => {
    return (
        <div className="flex-none h-12 flex items-center justify-between px-6 z-50 border-b border-white/[0.06]">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
                <h1 className="font-semibold text-zinc-100 tracking-wide text-base">
                    ЦПК
                </h1>
                <span className="text-[11px] text-zinc-500 font-medium tracking-wider uppercase hidden sm:inline">
                    Панель управления
                </span>
            </div>

            {/* Center: Tabs */}
            <nav className="flex items-center gap-1 bg-white/[0.03] px-1.5 py-1 rounded-lg border border-white/[0.06]">
                <TabButton
                    active={currentView === 'admin'}
                    onClick={() => onChangeView('admin')}
                    icon={<Activity size={13} className={currentView === 'admin' ? "text-zinc-100" : "text-zinc-500"} />}
                    label="Управление"
                    layoutId="app-header-tab-bg"
                />
                <TabButton
                    active={currentView === 'user'}
                    onClick={() => onChangeView('user')}
                    icon={<User size={13} className={currentView === 'user' ? "text-zinc-100" : "text-zinc-500"} />}
                    label="Оператор"
                    layoutId="app-header-tab-bg"
                />
            </nav>

            {/* Right: Status */}
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[11px] text-zinc-500 font-medium">Онлайн</span>
            </div>
        </div>
    );
};
```

**Step 2: Simplify TabButton**

Replace entire `TabButton` component in `src/shared/ui/TabButton.tsx`:

```tsx
export const TabButton: React.FC<TabButtonProps> = ({
    active,
    onClick,
    icon,
    label,
    layoutId = "tab-bg"
}) => (
    <button
        onClick={onClick}
        className={clsx(
            "relative flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-colors duration-150 text-[12px] font-medium",
            active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
        )}
    >
        {active && (
            <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white/[0.08] rounded-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
        )}
        <span className="relative z-10">{icon}</span>
        <span className="relative z-10">{label}</span>
    </button>
);
```

**Step 3: Verify**

Header should be 48px, clean, with pill-style tabs and no scanline/glow effects.

**Step 4: Commit**

```bash
git add src/widgets/AppHeader.tsx src/shared/ui/TabButton.tsx
git commit -m "refactor: redesign AppHeader and TabButton for clean UI"
```

---

### Task 4: Create Widget wrapper component

**Files:**
- Create: `src/shared/ui/Widget.tsx`

**Step 1: Create Widget component**

Create `src/shared/ui/Widget.tsx`:

```tsx
import React from 'react';
import { clsx } from 'clsx';

interface WidgetProps {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    noPadding?: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
    children,
    title,
    icon,
    actions,
    className,
    contentClassName,
    noPadding = false,
}) => {
    return (
        <div className={clsx(
            "flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] transition-colors duration-150 overflow-hidden",
            "hover:bg-white/[0.04] hover:border-white/[0.10]",
            className
        )}>
            {title && (
                <div className="flex items-center justify-between px-4 h-9 border-b border-white/[0.05] shrink-0">
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-zinc-500">{icon}</span>}
                        <h3 className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">{title}</h3>
                    </div>
                    {actions && <div className="flex items-center gap-1">{actions}</div>}
                </div>
            )}
            <div className={clsx("flex-1 min-h-0", noPadding ? "" : "p-4", contentClassName)}>
                {children}
            </div>
        </div>
    );
};
```

**Step 2: Verify**

No visual change yet (Widget not used), but run `npm run dev` to ensure no build errors.

**Step 3: Commit**

```bash
git add src/shared/ui/Widget.tsx
git commit -m "feat: add Widget wrapper component for bento dashboard"
```

---

### Task 5: Restructure AdminPage layout to bento grid

**Files:**
- Modify: `src/pages/admin/ui/AdminPage.tsx`

**Step 1: Rewrite AdminPage grid**

Replace the content inside `<Suspense>` (lines 29-65) with the new bento grid:

```tsx
<div className="flex-1 w-full p-4 grid grid-cols-12 gap-4 relative z-10 overflow-hidden"
     style={{ gridTemplateRows: '2fr 1fr 1fr' }}>

    {/* Voronoi Map — Hero (col 1-8, row 1-3) */}
    <div className="col-span-8 row-span-3">
        <StrategicVoronoiMap />
    </div>

    {/* Activity Matrix (col 9-12, row 1-2) */}
    <div className="col-span-4 row-span-2">
        <LiveOccupancy />
    </div>

    {/* Telemetry Stream (col 9-12, row 3) */}
    <div className="col-span-4 row-span-1 flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
        <TelemetryTableModule
            recentLogs={logs.slice(0, 15)}
            selectedRowId={selectedRowId}
            onSelect={setSelectedRowId}
        />
    </div>

    {/* Rating Strat (col 1-4, row 4) */}
    <div className="col-span-4 row-span-1">
        <KPIBento />
    </div>

    {/* Demographic Matrix (col 5-8, row 4) */}
    {/* Note: DemographicMatrix is currently rendered inside KPIBento.
        We need to extract it. For now, keep the KPIBento spanning 8 cols. */}
</div>
```

Note: The grid uses `gridTemplateRows: '2fr 1fr 1fr'` to give Voronoi 3x the weight. The exact layout may need adjustment in Task 5b.

Also remove the `motion.div` wrappers and `LayoutGroup` if no longer needed for the layout animations. Remove `glass-card` class from the telemetry wrapper div.

**Step 2: Separate DemographicMatrix from KPIBento**

Currently `KPIBento` renders `DemographicMatrix` inside it. We need to split them. In `AdminPage.tsx`, add a lazy import for `DemographicMatrix`:

```tsx
const DemographicMatrix = React.lazy(() => import('../../../features/AdminDashboard/ui/DemographicMatrix').then(module => ({ default: module.DemographicMatrix })));
```

Then update the grid to give each its own cell:

```tsx
{/* Rating Strat (col 1-4, row 4) */}
<div className="col-span-4">
    <KPIBento />
</div>

{/* Demographic Matrix (col 5-8, row 4) */}
<div className="col-span-4">
    <DemographicMatrix />
</div>

{/* Live Stats (col 9-12, row 4) — placeholder or small KPI */}
```

**Step 3: Update KPIBento to NOT render DemographicMatrix**

In `src/features/AdminDashboard/ui/KPIBento.tsx`, remove the `DemographicMatrix` import and remove the right column that renders it (lines 103-106). Make the rating list take full width.

**Step 4: Verify**

Run `npm run dev`. The dashboard should now show:
- Voronoi map taking ~66% width, full height top section
- Activity matrix and telemetry stacked on the right
- Rating and demographic matrix side by side at the bottom

**Step 5: Commit**

```bash
git add src/pages/admin/ui/AdminPage.tsx src/features/AdminDashboard/ui/KPIBento.tsx
git commit -m "refactor: restructure AdminPage to bento grid layout"
```

---

### Task 6: Redesign LiveOccupancy (Activity Matrix)

**Files:**
- Modify: `src/features/AdminDashboard/ui/LiveOccupancy.tsx`

**Step 1: Rewrite LiveOccupancy with Widget wrapper**

Replace the entire component with clean bar chart:

```tsx
import React from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { Activity } from 'lucide-react';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Widget } from '../../../shared/ui/Widget';

export const LiveOccupancy: React.FC = () => {
    const { clusterMetrics } = useSimulation();

    const sortedMetrics = [...clusterMetrics]
        .filter(c => c.activeUnits > 0)
        .sort((a, b) => b.activeUnits - a.activeUnits)
        .slice(0, 8);

    const totalActive = clusterMetrics.reduce((sum, c) => sum + c.activeUnits, 0);
    const maxUnits = Math.max(...clusterMetrics.map(c => c.activeUnits), 1);

    return (
        <Widget
            title="Активность"
            icon={<Activity size={14} />}
            className="h-full"
            actions={
                <span className="text-[11px] text-zinc-500 font-mono tabular-nums">
                    {totalActive.toLocaleString()} всего
                </span>
            }
        >
            <div className="flex items-end justify-between gap-2 h-full pb-2">
                {sortedMetrics.map((c) => {
                    const color = CLUSTER_COLORS[c.name] || '#ffffff';
                    const percentage = (c.activeUnits / maxUnits) * 100;
                    const translatedName = CLUSTER_TRANSLATIONS[c.name] || c.name;

                    return (
                        <div key={c.name} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full flex flex-col items-center justify-end h-full min-h-[80px]">
                                <div
                                    className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-90"
                                    style={{
                                        height: `${percentage}%`,
                                        backgroundColor: color,
                                        opacity: 0.7,
                                        minHeight: '4px',
                                    }}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[11px] font-mono text-zinc-200 tabular-nums font-medium">
                                    {c.activeUnits}
                                </span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    {translatedName.slice(0, 3)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Widget>
    );
};
```

**Step 2: Verify**

Activity Matrix should show clean thin bars with no glow/segments, proper spacing, readable labels.

**Step 3: Commit**

```bash
git add src/features/AdminDashboard/ui/LiveOccupancy.tsx
git commit -m "refactor: redesign LiveOccupancy with clean bar chart"
```

---

### Task 7: Redesign TelemetryStream table

**Files:**
- Modify: `src/features/Telemetry/ui/TelemetryStream.tsx` (only `TelemetryTableModule` export, lines 268-322)

**Step 1: Rewrite TelemetryTableModule**

Replace the `TelemetryTableModule` component (lines 268-322):

```tsx
export const TelemetryTableModule: React.FC<{ recentLogs: any[], selectedRowId: string | null, onSelect: (id: string) => void }> = ({ recentLogs, selectedRowId, onSelect }) => {
    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 h-9 border-b border-white/[0.05] shrink-0">
                <Activity size={14} className="text-zinc-500" />
                <h3 className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">Телеметрия</h3>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-[70px_90px_100px_1fr_1fr] gap-2 px-4 h-8 items-center border-b border-white/[0.05] text-[11px] font-medium uppercase tracking-wider text-zinc-500 shrink-0">
                <div>Время</div>
                <div>Субъект</div>
                <div>Кластер</div>
                <div>Действие</div>
                <div>Контекст</div>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto">
                {recentLogs.map((log) => {
                    const isSelected = selectedRowId === log.id;
                    const color = CLUSTER_COLORS[log.cluster] || '#71717a';
                    return (
                        <div
                            key={log.id}
                            onClick={() => onSelect(log.id)}
                            className={clsx(
                                "grid grid-cols-[70px_90px_100px_1fr_1fr] gap-2 px-4 py-2 border-b border-white/[0.03] items-center cursor-pointer transition-colors duration-150",
                                isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                            )}
                        >
                            <div className="text-[11px] tabular-nums text-zinc-500 font-mono">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                            </div>
                            <div className="text-[12px] text-zinc-300 truncate">
                                {log.userId.split(' ')[0]}
                            </div>
                            <div>
                                <span
                                    className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border"
                                    style={{
                                        color: color,
                                        borderColor: `${color}33`,
                                        backgroundColor: `${color}15`,
                                    }}
                                >
                                    {CLUSTER_TRANSLATIONS[log.cluster]?.slice(0, 8) || log.cluster}
                                </span>
                            </div>
                            <div className="text-[12px] text-zinc-300 truncate">
                                {log.action}
                            </div>
                            <div className="text-[11px] text-zinc-500 truncate">
                                {log.zone}
                            </div>
                            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
```

Note: Ensure `CLUSTER_COLORS`, `CLUSTER_TRANSLATIONS`, `Activity`, and `clsx` are imported at the top of the file (they already are).

**Step 2: Remove CornerBrackets from TelemetryTableModule**

Delete the `<CornerBrackets />` call and the scanline overlay div from the old component.

**Step 3: Verify**

Telemetry stream should show clean rows with pill-style cluster badges, no scanlines, proper spacing.

**Step 4: Commit**

```bash
git add src/features/Telemetry/ui/TelemetryStream.tsx
git commit -m "refactor: redesign TelemetryTableModule with clean table style"
```

---

### Task 8: Redesign KPIBento (Rating Strat)

**Files:**
- Modify: `src/features/AdminDashboard/ui/KPIBento.tsx`

**Step 1: Rewrite KPIBento as vertical ranking list**

Replace entire component. Remove `DemographicMatrix` import, `Holocard` import. Add `Widget` import:

```tsx
import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Widget } from '../../../shared/ui/Widget';

const Sparkline = ({ data, color }: { data: any[], color: string }) => (
    <ResponsiveContainer width={60} height={20}>
        <AreaChart data={data}>
            <Area type="monotone" dataKey="val" stroke={color} strokeWidth={1} fill={color} fillOpacity={0.1} isAnimationActive={false} />
        </AreaChart>
    </ResponsiveContainer>
);

export const KPIBento: React.FC = () => {
    const { logs } = useSimulation();

    const ranking = useMemo(() => {
        const stats = logs.reduce((acc, log) => {
            if (!acc[log.cluster]) {
                acc[log.cluster] = { score: 0, count: 0, users: new Set<string>() };
            }
            let weight = 1;
            if (log.evidenceLevel === 'High') weight += 2;
            if (log.action === 'Тест пройден') weight += 5;
            if (log.cognitiveLoad) weight += log.cognitiveLoad * 0.5;

            acc[log.cluster].score += weight;
            acc[log.cluster].count += 1;
            acc[log.cluster].users.add(log.userId);
            return acc;
        }, {} as Record<string, { score: number, count: number, users: Set<string> }>);

        return Object.entries(CLUSTER_COLORS).map(([name, color]) => ({
            name,
            color,
            score: Math.round(stats[name]?.score || 0),
            users: stats[name]?.users.size || 0,
            count: stats[name]?.count || 0,
            trend: Array.from({ length: 12 }).map(() => ({ val: 10 + Math.random() * 40 }))
        })).sort((a, b) => b.score - a.score);
    }, [logs.length]);

    return (
        <Widget
            title="Рейтинг"
            icon={<Trophy size={14} />}
            className="h-full"
            contentClassName="overflow-y-auto"
        >
            <div className="flex flex-col gap-1">
                {ranking.map((item, idx) => (
                    <div
                        key={item.name}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03] transition-colors duration-150 group"
                    >
                        <span className="text-[11px] text-zinc-500 font-mono tabular-nums w-5 text-right shrink-0">
                            {idx + 1}
                        </span>
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1 min-w-0">
                            <span className="text-[13px] text-zinc-200 truncate block">
                                {CLUSTER_TRANSLATIONS[item.name] || item.name}
                            </span>
                        </div>
                        <div className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Sparkline data={item.trend} color={item.color} />
                        </div>
                        <span className="text-[14px] font-mono text-zinc-100 tabular-nums font-medium w-12 text-right shrink-0">
                            {item.score}
                        </span>
                    </div>
                ))}
            </div>
        </Widget>
    );
};
```

**Step 2: Verify**

Rating should display as a clean vertical list: rank + dot + name + sparkline + score. No Holocard, no tech corners, no Orbitron.

**Step 3: Commit**

```bash
git add src/features/AdminDashboard/ui/KPIBento.tsx
git commit -m "refactor: redesign KPIBento as clean vertical ranking list"
```

---

### Task 9: Redesign DemographicMatrix

**Files:**
- Modify: `src/features/AdminDashboard/ui/DemographicMatrix.tsx`

**Step 1: Rewrite DemographicMatrix with Widget and clean table**

Replace entire component. Remove `Holocard` import, add `Widget`:

```tsx
import React, { useMemo } from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_TRANSLATIONS, CLUSTER_COLORS } from '../../../shared/lib/tokens';
import { Target } from 'lucide-react';
import { Widget } from '../../../shared/ui/Widget';

const AGE_GROUPS = [
    { label: '7-12', min: 7, max: 12, stage: 'Дети' },
    { label: '13-17', min: 13, max: 17, stage: 'Подростки' },
    { label: '18-35', min: 18, max: 35, stage: 'Молодёжь' },
];

export const DemographicMatrix: React.FC = () => {
    const { logs, selectableUsers } = useSimulation();

    const matrix = useMemo(() => {
        if (!selectableUsers || !logs) {
            return AGE_GROUPS.map(g => ({ group: g.label, stage: g.stage, clusters: [] }));
        }

        const userMap = selectableUsers.reduce((acc, u) => {
            if (u) {
                if (u.id) acc[u.id.toLowerCase().trim()] = u;
                if (u.name) acc[u.name.toLowerCase().trim()] = u;
            }
            return acc;
        }, {} as Record<string, typeof selectableUsers[0]>);

        const clusters = [
            'Education', 'Science', 'Labor', 'Culture', 'Volunteering', 'Patriotism',
        ];

        return AGE_GROUPS.map(group => {
            const groupLogs = logs.filter(l => {
                if (!l.userId) return false;
                const user = userMap[l.userId.toLowerCase().trim()];
                if (!user) return false;
                const age = user.age || 0;
                return age >= group.min && age <= group.max;
            });

            return {
                group: group.label,
                stage: group.stage,
                clusters: clusters.map(cluster => {
                    const interest = groupLogs.filter(l => l.cluster === cluster).length;
                    return { name: cluster, interest };
                })
            };
        });
    }, [logs, selectableUsers]);

    const clusters = matrix[0]?.clusters || [];
    const maxVal = Math.max(...matrix.flatMap(r => r.clusters.map(c => c.interest)), 1);

    return (
        <Widget
            title="Демография"
            icon={<Target size={14} />}
            className="h-full"
            noPadding
        >
            <div className="overflow-auto h-full">
                <table className="w-full text-[12px]">
                    <thead>
                        <tr className="border-b border-white/[0.05]">
                            <th className="text-left text-[11px] text-zinc-500 font-medium uppercase tracking-wider px-4 py-2 w-20">Возраст</th>
                            {clusters.map(c => (
                                <th key={c.name} className="text-center text-[10px] text-zinc-500 font-medium uppercase tracking-wider px-2 py-2">
                                    {CLUSTER_TRANSLATIONS[c.name]?.slice(0, 4) || c.name.slice(0, 4)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map(row => (
                            <tr key={row.group} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors duration-150">
                                <td className="px-4 py-2.5">
                                    <div className="text-[13px] text-zinc-200 font-mono tabular-nums">{row.group}</div>
                                    <div className="text-[10px] text-zinc-500">{row.stage}</div>
                                </td>
                                {row.clusters.map(cell => {
                                    const intensity = cell.interest / maxVal;
                                    const color = CLUSTER_COLORS[cell.name] || '#3b82f6';
                                    return (
                                        <td key={cell.name} className="text-center px-2 py-2.5">
                                            <span
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md font-mono text-[13px] tabular-nums"
                                                style={{
                                                    backgroundColor: intensity > 0.1 ? `${color}10` : 'transparent',
                                                    color: intensity > 0.3 ? '#f4f4f5' : '#71717a',
                                                }}
                                            >
                                                {cell.interest || '-'}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Widget>
    );
};
```

**Step 2: Verify**

Demographic matrix should show as a clean data table with subtle colored cells. No Holocard, no tech decorations, no debug panel.

**Step 3: Commit**

```bash
git add src/features/AdminDashboard/ui/DemographicMatrix.tsx
git commit -m "refactor: redesign DemographicMatrix as clean data table"
```

---

### Task 10: Clean up Voronoi Map

**Files:**
- Modify: `src/features/AdminDashboard/ui/StrategicVoronoiMap.tsx`

**Step 1: Reduce emissive intensity on spark particles**

In `InstancedSparks` (line 120-121), change:
```tsx
<meshStandardMaterial emissiveIntensity={10} transparent />
```
to:
```tsx
<meshStandardMaterial emissiveIntensity={2} transparent opacity={0.6} />
```

**Step 2: Reduce cell emissive intensity**

In `VoronoiCell` (line 179), change `emissiveIntensity={0.5}` to `emissiveIntensity={0.3}`.

In the `useFrame` callback (line 154), change `material.emissiveIntensity = breathing * 2` to `material.emissiveIntensity = breathing * 0.8`, and in line 157 change `material.emissiveIntensity = 4` to `material.emissiveIntensity = 1.5`.

**Step 3: Update text rendering for labels**

In `VoronoiCell`, the label text at line 208-215 — update `fontSize={0.25}` to `fontSize={0.22}`. This doesn't change the font family since Three.js Text uses system fonts, but it makes labels slightly more proportional.

**Step 4: Remove bottom HUD legend and status badges**

In `StrategicVoronoiMapContent`, delete the entire "Bottom HUD: Clusters Legend" section (lines 547-568).

Also delete the "Grid Overlay Texture" div (line 571).

**Step 5: Clean the top-right HUD**

Replace lines 495-502 with a cleaner version:

```tsx
<div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
    <div className="text-[20px] font-mono font-medium text-zinc-100 tabular-nums tracking-tight">
        {activeCell ? activeCell.activeUnits.toLocaleString() : ''}
    </div>
    <div className="text-[11px] text-zinc-500 tracking-wider mt-0.5">
        {activeCell ? (CLUSTER_TRANSLATIONS[activeCell.name] || activeCell.name) : ''}
    </div>
</div>
```

**Step 6: Remove decorative grid elements from the Canvas**

Delete the `gridHelper` (lines 533-535) and the decorative `ringGeometry` mesh (lines 538-541).

**Step 7: Clean agent overlay badges**

In `OptimizedAgents`, lines 292-299, replace the Orbitron-styled overlay:

```tsx
<Html key={agent.id} position={agent.position} center distanceFactor={15} pointerEvents="none">
    <div className={clsx(
        "px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap border backdrop-blur-sm",
        agent.lastAction ? "bg-blue-500/20 border-blue-500/30 text-blue-200" : "bg-black/60 border-white/10 text-zinc-400"
    )}>
        {agent.lastAction || agent.name.split(' ')[0]}
    </div>
</Html>
```

**Step 8: Clean the outer container**

Replace line 493:
```tsx
<div className="w-full h-full relative overflow-hidden rounded-xl border border-white/5 bg-black/20">
```
with:
```tsx
<div className="w-full h-full relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#09090B]">
```

**Step 9: Clean the hover tooltip (Html inside VoronoiCell)**

Replace lines 240-256 with a cleaner tooltip:

```tsx
{(active || activeZone === label) && (
    <Html position={[0, 0, 1.2]} center pointerEvents="none">
        <div className="px-3 py-2 rounded-lg bg-zinc-900/95 border border-white/10 backdrop-blur-sm shadow-xl">
            <div className="text-[12px] font-medium text-zinc-100 whitespace-nowrap">
                {CLUSTER_TRANSLATIONS[label] || label}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono tabular-nums mt-0.5">
                {Math.round(count)} единиц
            </div>
        </div>
    </Html>
)}
```

**Step 10: Verify**

Voronoi map should look cleaner — less glow, no bottom legend, no grid overlay, cleaner agent badges and tooltips.

**Step 11: Commit**

```bash
git add src/features/AdminDashboard/ui/StrategicVoronoiMap.tsx
git commit -m "refactor: clean Voronoi map — reduce glow, remove decorative overlays"
```

---

### Task 11: Update Holocard for backward compatibility

**Files:**
- Modify: `src/shared/ui/Holocard.tsx`

**Step 1: Simplify Holocard**

Since Holocard is still used in the User page and potentially other places, update it to match the new style without breaking those usages:

```tsx
export const Holocard: React.FC<HolocardProps> = ({
    children,
    title,
    header,
    description,
    className,
    contentClassName,
}) => {
    return (
        <div className={clsx(
            "relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden transition-colors duration-150 hover:bg-white/[0.04] hover:border-white/[0.10]",
            className
        )}>
            {header ? (
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex justify-between items-center">
                    {header}
                </div>
            ) : title ? (
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex justify-between items-center">
                    <div>
                        <h3 className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">{title}</h3>
                        {description && <p className="text-[11px] text-zinc-500 mt-0.5">{description}</p>}
                    </div>
                </div>
            ) : null}

            <div className={clsx("flex-1 min-h-0", contentClassName)}>
                {children}
            </div>
        </div>
    );
};
```

Remove: tech corners, scanline overlay, iridescent glow, glass edge highlight, status dot, backdrop-blur.

Remove unused props from the interface: `corners`, `gloss`.

**Step 2: Verify**

Run `npm run dev` and check both admin and user views. Both should render without errors.

**Step 3: Commit**

```bash
git add src/shared/ui/Holocard.tsx
git commit -m "refactor: simplify Holocard — remove CRT effects, match Premium UI style"
```

---

### Task 12: Final cleanup and visual polish

**Files:**
- Modify: `src/app/styles/index.css` (if any remaining unused classes)
- Modify: `src/pages/admin/ui/AdminPage.tsx` (final grid tuning)

**Step 1: Remove unused imports**

Check each modified file for unused imports (LayoutGroup, motion where not needed, etc.) and remove them.

**Step 2: Fine-tune grid proportions**

Open the app and adjust `gridTemplateRows` in AdminPage if the proportions don't look right. Target: Voronoi ~60-70% of viewport height, bottom row ~30%.

**Step 3: Remove any remaining font-orbitron references**

Search the codebase for `orbitron` and `font-orbitron` — replace any remaining instances with Inter equivalents.

**Step 4: Verify full flow**

Run `npm run dev`, test:
- Admin tab loads with bento grid
- All 4 panels visible and readable
- Voronoi map interactive (hover shows tooltip)
- Telemetry stream scrollable with clear data
- Tab switching to User view works
- No console errors

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: final cleanup — remove unused imports and remaining CRT references"
```
