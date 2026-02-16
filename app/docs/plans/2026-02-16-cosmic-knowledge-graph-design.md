# Cosmic Knowledge Graph — Visual Redesign

## Context

Redesign the existing 3D knowledge graph from a basic Obsidian-style node graph into an immersive "cosmic map" — nodes as stars/planets, particle bridges for connections, nebulae background.

**Stack**: React + react-force-graph-3d + Three.js (existing)
**Approach**: Evolve current implementation via `nodeThreeObject`, `linkThreeObject`, and scene ref access.

## Requirements

- Visual style: Space map (stars, planets, nebulae)
- Connections: Star bridges with animated particles flowing along edges
- Interactivity: Maximum (hover glow, click zoom, explosion effects, orbital topic reveal)
- Background: Full cosmos (star field, nebulae, parallax layers)

## Design

### 1. Cluster Nodes — "Stars" (12 nodes)

Each cluster rendered as a Three.js Group:
- **Core sphere**: `MeshStandardMaterial`, emissive color from `CLUSTER_COLORS`, `emissiveIntensity: 3-5`
- **Halo**: Transparent oversized sphere (`scale 2x`), `MeshBasicMaterial`, `opacity: 0.15` — atmospheric glow
- **Rings**: `RingGeometry` on larger clusters, semi-transparent, slow rotation
- **Size**: 2-3x larger than current
- **Animation**: Sinusoidal emissiveIntensity pulsation (3-5s period)

### 2. Topic Nodes — "Satellites"

- Small spheres on orbital rings around parent cluster
- Visible orbital ring as thin transparent circle
- Slow orbital animation (~0.2 rad/s via requestAnimationFrame)
- Color inherited from cluster, muted (`opacity: 0.7`)

### 3. Links — "Star Bridges"

- **Base line**: Gradient opacity (brighter near nodes, fades toward center)
- **Particle flow**: `THREE.Points` with 5-10 particles moving along each edge
  - `PointsMaterial`, `size: 1.5`, `transparent: true`
- Brightness proportional to node proximity

### 4. Background — "Deep Space"

- **Star field**: `THREE.Points`, 3000-5000 particles in large-radius sphere
  - Varied sizes (1-3px), subtle opacity flicker
- **Nebulae**: 3-5 large `SpriteMaterial` sprites with radial gradient in nearby cluster colors
  - Size ~200-400 units, `opacity: 0.08-0.15`
- **Parallax**: 2-3 depth layers, slower movement for distant stars

### 5. Interactivity

**Hover on cluster**:
- Scale up to 1.3x (300ms ease)
- Halo opacity to 0.3
- Connected links highlight
- Unconnected nodes dim to `opacity: 0.2`

**Click on cluster**:
- Camera flies to cluster (1-2s smooth transition)
- Topic satellites expand on orbits
- Ring rotation accelerates (pulse)
- Particle burst: 30-50 particles explode outward, fade in 1s

**Click on empty space**: Camera returns to overview

### 6. Post-processing

- UnrealBloomPass: `strength: 0.8`, `radius: 0.4`, `threshold: 0.6`

## Files to Modify

- `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx` — main component rewrite
- `src/shared/lib/tokens.ts` — potentially add new design tokens
- `src/app/styles/index.css` — minor style adjustments if needed
