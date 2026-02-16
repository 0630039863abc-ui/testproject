# Cosmic Knowledge Graph — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the existing 3D knowledge graph into an immersive cosmic map with planet-like nodes, star bridges, nebulae, and rich interactivity.

**Architecture:** Evolve the existing `react-force-graph-3d` component by replacing `nodeThreeObject` and adding scene-level objects (star field, nebulae) via the ForceGraph3D ref's `.scene()` accessor. All changes are in one main file with helper functions extracted for readability.

**Tech Stack:** React, react-force-graph-3d, Three.js, three-spritetext (all existing)

---

### Task 1: Enhanced Bloom & Camera Setup

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx:227-238`

**Step 1: Update the bloom pass and camera initialization**

Replace the current `useEffect` (lines 227-238) with stronger bloom parameters and better initial camera angle:

```tsx
useEffect(() => {
    if (fgRef.current) {
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.8,   // strength (was 0.4)
            0.4,   // radius (was 0.2)
            0.6    // threshold (was 0.9)
        );
        fgRef.current.postProcessingComposer().addPass(bloomPass);
        // Angled camera for depth perception
        fgRef.current.cameraPosition({ x: 200, y: 150, z: 900 });
    }
}, []);
```

**Step 2: Verify the bloom is visibly stronger**

Run: `npm run dev` — open browser, check that existing nodes glow more intensely. The graph should look noticeably brighter/glowier than before.

**Step 3: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): enhance bloom and camera angle"
```

---

### Task 2: Star Field Background

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Add star field creation function**

Add this function before the component definition (before line 14):

```tsx
function createStarField(): THREE.Points {
    const starCount = 4000;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const radius = 2000;

    for (let i = 0; i < starCount; i++) {
        // Distribute on sphere surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius + (Math.random() - 0.5) * 400;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.name = 'starField';
    return points;
}
```

**Step 2: Add star field to scene in the bloom/camera useEffect**

After the `cameraPosition` call, add:

```tsx
const scene = fgRef.current.scene();
// Remove old star field if re-rendering
const existing = scene.getObjectByName('starField');
if (existing) scene.remove(existing);
scene.add(createStarField());
```

**Step 3: Change backgroundColor to pure black**

In the `<ForceGraph3D>` props, change `backgroundColor="#050505"` to `backgroundColor="#000000"`.

**Step 4: Verify star field renders**

Run `npm run dev` — should see thousands of small white dots on the background sphere, visible when rotating the camera.

**Step 5: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): add cosmic star field background"
```

---

### Task 3: Nebulae Sprites

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Add nebula texture creation function**

Add after `createStarField`:

```tsx
function createNebulaTexture(color: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, color + '40'); // center with alpha
    gradient.addColorStop(0.4, color + '20');
    gradient.addColorStop(1, color + '00'); // transparent edge
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function createNebulae(clusterNodes: { fx: number; fy: number; fz: number; color: string }[]): THREE.Group {
    const nebulaGroup = new THREE.Group();
    nebulaGroup.name = 'nebulae';

    // Pick 4-5 cluster positions to place nebulae near
    const picks = clusterNodes.filter((_, i) => i % 3 === 0).slice(0, 5);
    picks.forEach((node) => {
        const texture = createNebulaTexture(node.color);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
            node.fx + (Math.random() - 0.5) * 100,
            node.fy + (Math.random() - 0.5) * 100,
            node.fz - 50
        );
        sprite.scale.set(350, 350, 1);
        nebulaGroup.add(sprite);
    });

    return nebulaGroup;
}
```

**Step 2: Add nebulae to scene inside the graphData useMemo callback area**

In the bloom/camera `useEffect`, this won't work because graphData is computed later. Instead, add a new `useEffect` that depends on `graphData`:

```tsx
useEffect(() => {
    if (!fgRef.current) return;
    const scene = fgRef.current.scene();

    // Remove old nebulae
    const existing = scene.getObjectByName('nebulae');
    if (existing) scene.remove(existing);

    // Get cluster nodes for positioning
    const clusterNodes = graphData.nodes
        .filter((n: any) => n.group === 'cluster')
        .map((n: any) => ({ fx: n.fx, fy: n.fy, fz: n.fz, color: n.color }));

    if (clusterNodes.length > 0) {
        scene.add(createNebulae(clusterNodes));
    }
}, [graphData]);
```

**Step 3: Verify nebulae render as colored clouds behind clusters**

Run `npm run dev` — rotate camera, should see faint colored cloud sprites near every 3rd cluster.

**Step 4: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): add nebula sprites behind clusters"
```

---

### Task 4: Cluster Node Redesign — Planet Stars with Halos and Rings

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx:271-306`

**Step 1: Replace the `nodeThreeObject` callback**

Replace the entire `nodeThreeObject` prop (lines 271-306) with the new cosmic node renderer:

```tsx
nodeThreeObject={(node: any) => {
    const group = new THREE.Group();

    if (node.group === 'cluster') {
        // === CORE SPHERE (planet) ===
        const coreSize = 12;
        const coreGeometry = new THREE.SphereGeometry(coreSize, 48, 48);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: node.color,
            emissive: node.color,
            emissiveIntensity: 3.0,
            metalness: 0.3,
            roughness: 0.2,
            transparent: true,
            opacity: 0.95,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);

        // Store for animation
        clusterMeshes.current.set(node.id, core);

        // === HALO (atmospheric glow) ===
        const haloGeometry = new THREE.SphereGeometry(coreSize * 2.2, 32, 32);
        const haloMaterial = new THREE.MeshBasicMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.name = 'halo';
        group.add(halo);

        // === RING (Saturn-like) ===
        const ringGeometry = new THREE.RingGeometry(coreSize * 1.6, coreSize * 2.4, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI * 0.4;
        ring.name = 'ring';
        group.add(ring);

        // === LABEL ===
        const labelText = CLUSTER_TRANSLATIONS[node.id] || node.id;
        const sprite = new SpriteText(labelText);
        sprite.color = '#ffffff';
        sprite.textHeight = 10;
        sprite.position.y = coreSize * 2.5 + 5;
        sprite.fontFace = 'JetBrains Mono';
        sprite.fontWeight = 'bold';
        group.add(sprite);

    } else if (node.group === 'topic') {
        // === SATELLITE SPHERE ===
        const satSize = 4;
        const satGeometry = new THREE.SphereGeometry(satSize, 24, 24);
        const satMaterial = new THREE.MeshStandardMaterial({
            color: node.color,
            emissive: node.color,
            emissiveIntensity: 1.5,
            metalness: 0.2,
            roughness: 0.3,
            transparent: true,
            opacity: 0.85,
        });
        const sat = new THREE.Mesh(satGeometry, satMaterial);
        group.add(sat);

        // === SMALL HALO ===
        const miniHalo = new THREE.Mesh(
            new THREE.SphereGeometry(satSize * 1.8, 16, 16),
            new THREE.MeshBasicMaterial({
                color: node.color,
                transparent: true,
                opacity: 0.06,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            })
        );
        group.add(miniHalo);

        // === LABEL ===
        const sprite = new SpriteText(node.id);
        sprite.color = '#cccccc';
        sprite.textHeight = 4;
        sprite.position.y = satSize + 5;
        sprite.fontFace = 'JetBrains Mono';
        group.add(sprite);

    } else if (node.group === 'event') {
        // === TINY DOT ===
        const dotGeometry = new THREE.SphereGeometry(1.5, 12, 12);
        const dotMaterial = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });
        group.add(new THREE.Mesh(dotGeometry, dotMaterial));
    }

    return group;
}}
```

**Step 2: Remove old `getGeometry` and `getMaterial` cache functions**

Delete the `getGeometry` (lines 29-35) and `getMaterial` (lines 37-51) functions and their `geometries`/`materials` refs (lines 26-27) — they're no longer used.

**Step 3: Verify clusters render as glowing planets with halos and rings**

Run `npm run dev` — clusters should be large, glowing spheres with visible atmospheric halos and semi-transparent rings. Topics should be smaller glowing satellites.

**Step 4: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): cosmic planet nodes with halos and rings"
```

---

### Task 5: Ring Rotation Animation

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Add ring refs and update animation loop**

Add a ref to track cluster groups:

```tsx
const clusterGroups = useRef<Map<string, THREE.Group>>(new Map());
```

In the `nodeThreeObject` for clusters, after creating the group, register it:

```tsx
clusterGroups.current.set(node.id, group);
```

**Step 2: Update the animation loop (lines 67-102)**

Replace the animation `useEffect` to also handle ring rotation and sinusoidal pulse:

```tsx
useEffect(() => {
    const PULSE_DURATION = 800;
    const BASE_INTENSITY = 3.0;
    const PULSE_INTENSITY = 8.0;

    const animate = () => {
        const now = Date.now();
        const time = now * 0.001; // seconds

        clusterGroups.current.forEach((group, clusterId) => {
            // Rotate rings
            const ring = group.getObjectByName('ring') as THREE.Mesh;
            if (ring) {
                ring.rotation.z += 0.002;
            }

            // Sinusoidal ambient pulse on core
            const core = clusterMeshes.current.get(clusterId);
            if (core) {
                const pulseTime = clusterPulseTimestamps.current.get(clusterId);
                if (pulseTime) {
                    const age = now - pulseTime;
                    if (age < PULSE_DURATION) {
                        const progress = age / PULSE_DURATION;
                        const intensity = PULSE_INTENSITY - (progress * (PULSE_INTENSITY - BASE_INTENSITY));
                        const scale = 1 + (1 - progress) * 0.3;
                        const material = core.material as THREE.MeshStandardMaterial;
                        if (material) material.emissiveIntensity = intensity;
                        core.scale.setScalar(scale);
                    } else {
                        clusterPulseTimestamps.current.delete(clusterId);
                    }
                } else {
                    // Ambient sinusoidal glow
                    const hash = clusterId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                    const material = core.material as THREE.MeshStandardMaterial;
                    if (material) {
                        material.emissiveIntensity = BASE_INTENSITY + Math.sin(time * 0.8 + hash) * 0.5;
                    }
                }
            }

            // Subtle halo pulse
            const halo = group.getObjectByName('halo') as THREE.Mesh;
            if (halo) {
                const hash = clusterId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                const mat = halo.material as THREE.MeshBasicMaterial;
                mat.opacity = 0.08 + Math.sin(time * 0.5 + hash) * 0.03;
            }
        });

        animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId.current);
}, []);
```

**Step 3: Verify rings rotate and nodes pulse**

Run `npm run dev` — rings should slowly rotate, node glow should subtly oscillate.

**Step 4: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): animated ring rotation and sinusoidal pulse"
```

---

### Task 6: Star Bridge Links with Particle Flow

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Add particle link system**

Add a ref to track link particles:

```tsx
const linkParticles = useRef<Map<string, { points: THREE.Points; offsets: Float32Array }>>(new Map());
```

**Step 2: Add `linkThreeObject` prop to ForceGraph3D**

Add the `linkThreeObject` prop after `linkWidth`:

```tsx
linkThreeObject={(link: any) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const key = `${sourceId}-${targetId}`;

    if (link.type !== 'neural') return undefined as any;

    const particleCount = 8;
    const positions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        offsets[i] = i / particleCount; // evenly spaced along link
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const color = new THREE.Color(link.source?.color || '#64b4ff');
    const material = new THREE.PointsMaterial({
        color: color,
        size: 2.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    linkParticles.current.set(key, { points, offsets });
    return points;
}}
linkPositionUpdate={(obj: any, { start, end }: any, link: any) => {
    if (link.type !== 'neural' || !obj) return;

    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const key = `${sourceId}-${targetId}`;

    const data = linkParticles.current.get(key);
    if (!data) return;

    const positions = data.points.geometry.attributes.position.array as Float32Array;
    const time = Date.now() * 0.0003;

    for (let i = 0; i < data.offsets.length; i++) {
        const t = (data.offsets[i] + time) % 1;
        positions[i * 3] = start.x + (end.x - start.x) * t;
        positions[i * 3 + 1] = start.y + (end.y - start.y) * t;
        positions[i * 3 + 2] = start.z + (end.z - start.z) * t;
    }
    data.points.geometry.attributes.position.needsUpdate = true;
}}
```

**Step 3: Verify particles flow along neural links**

Run `npm run dev` — between connected clusters, small glowing dots should move along the connection lines.

**Step 4: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): star bridge particle flow on links"
```

---

### Task 7: Hover Interactivity

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Add hover state ref**

```tsx
const hoveredNode = useRef<string | null>(null);
```

**Step 2: Add `onNodeHover` prop to ForceGraph3D**

```tsx
onNodeHover={(node: any) => {
    hoveredNode.current = node?.id || null;

    // Highlight hovered cluster, dim others
    clusterGroups.current.forEach((group, clusterId) => {
        const core = clusterMeshes.current.get(clusterId);
        const halo = group.getObjectByName('halo') as THREE.Mesh;

        if (!node || node.group !== 'cluster') {
            // Reset all
            if (core) {
                (core.material as THREE.MeshStandardMaterial).opacity = 0.95;
                core.scale.setScalar(1);
            }
            if (halo) (halo.material as THREE.MeshBasicMaterial).opacity = 0.08;
            return;
        }

        if (clusterId === node.id) {
            // Highlight hovered
            core?.scale.setScalar(1.3);
            if (halo) (halo.material as THREE.MeshBasicMaterial).opacity = 0.25;
        } else {
            // Check if connected
            const isConnected = graphData.links.some((l: any) => {
                const s = typeof l.source === 'object' ? l.source.id : l.source;
                const t = typeof l.target === 'object' ? l.target.id : l.target;
                return (s === node.id && t === clusterId) || (t === node.id && s === clusterId);
            });

            if (isConnected) {
                if (core) (core.material as THREE.MeshStandardMaterial).opacity = 0.8;
            } else {
                if (core) (core.material as THREE.MeshStandardMaterial).opacity = 0.2;
                if (halo) (halo.material as THREE.MeshBasicMaterial).opacity = 0.02;
            }
        }
    });
}}
```

**Step 3: Verify hover effects**

Run `npm run dev` — hover over a cluster: it should scale up, non-connected clusters should dim.

**Step 4: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): hover interactivity with dimming"
```

---

### Task 8: Click Zoom & Explosion Effect

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Add explosion particle function**

```tsx
function createExplosion(position: THREE.Vector3, color: string, scene: THREE.Scene) {
    const count = 40;
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;
        velocities.push(new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        ));
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color, size: 3, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;
    const maxFrames = 60;
    const animateExplosion = () => {
        frame++;
        const pos = points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            pos[i * 3] += velocities[i].x;
            pos[i * 3 + 1] += velocities[i].y;
            pos[i * 3 + 2] += velocities[i].z;
        }
        points.geometry.attributes.position.needsUpdate = true;
        material.opacity = 1 - frame / maxFrames;

        if (frame < maxFrames) {
            requestAnimationFrame(animateExplosion);
        } else {
            scene.remove(points);
            geometry.dispose();
            material.dispose();
        }
    };
    requestAnimationFrame(animateExplosion);
}
```

**Step 2: Update `handleNodeClick` to fly camera and trigger explosion**

Replace the existing `handleNodeClick`:

```tsx
const handleNodeClick = useCallback((node: any) => {
    if (!node) return;

    if (node.group === 'cluster') {
        const isDeselecting = activeZone === node.id;
        setActiveZone(isDeselecting ? null : node.id);
        setActiveTopic(null);

        if (fgRef.current) {
            if (isDeselecting) {
                // Fly back to overview
                fgRef.current.cameraPosition(
                    { x: 200, y: 150, z: 900 },
                    { x: 0, y: 0, z: 0 },
                    1500
                );
            } else {
                // Fly to cluster
                const distance = 250;
                fgRef.current.cameraPosition(
                    { x: node.fx + distance * 0.3, y: node.fy + distance * 0.2, z: node.fz + distance },
                    { x: node.fx, y: node.fy, z: node.fz },
                    1500
                );

                // Explosion effect
                const scene = fgRef.current.scene();
                createExplosion(
                    new THREE.Vector3(node.fx, node.fy, node.fz),
                    node.color,
                    scene
                );
            }
        }
    } else if (node.group === 'topic') {
        setActiveTopic(prev => prev === node.id ? null : node.id);
        onNodeClick({ ...node, title: node.id });
    } else if (node.group === 'event') {
        onNodeClick({ ...node, title: node.name });
    }
}, [onNodeClick, activeZone, setActiveZone]);
```

**Step 3: Add `onBackgroundClick` to return camera**

Add prop to `<ForceGraph3D>`:

```tsx
onBackgroundClick={() => {
    setActiveZone(null);
    setActiveTopic(null);
    if (fgRef.current) {
        fgRef.current.cameraPosition(
            { x: 200, y: 150, z: 900 },
            { x: 0, y: 0, z: 0 },
            1500
        );
    }
}}
```

**Step 4: Verify click zoom and explosion**

Run `npm run dev` — click a cluster: camera should fly to it with a burst of particles. Click background to return.

**Step 5: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): click zoom with particle explosion effect"
```

---

### Task 9: Star Field Twinkle Animation

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Add star twinkle to the animation loop**

Inside the `animate` function in the animation `useEffect`, add star field opacity variation:

```tsx
// Twinkle stars
if (fgRef.current) {
    const scene = fgRef.current.scene();
    const starField = scene.getObjectByName('starField') as THREE.Points;
    if (starField) {
        const mat = starField.material as THREE.PointsMaterial;
        mat.opacity = 0.7 + Math.sin(time * 2) * 0.15;
    }
}
```

**Step 2: Verify subtle twinkling**

Run `npm run dev` — star field should gently fade in and out.

**Step 3: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): star field twinkle animation"
```

---

### Task 10: Final Polish & Cleanup

**Files:**
- Modify: `src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx`

**Step 1: Remove the old gradient background div**

Change the wrapper div class from:
```tsx
<div className="w-full h-full relative bg-[radial-gradient(ellipse_at_center,_#1B1B1B_0%,_#050505_100%)] overflow-hidden">
```
to:
```tsx
<div className="w-full h-full relative bg-black overflow-hidden">
```

**Step 2: Update link colors for cosmic theme**

Update the `linkColor` prop:
```tsx
linkColor={(link: any) => {
    if (link.type === 'neural') {
        const opacity = Math.max(0.15, 0.5 - (link.distance / 1200));
        return `rgba(120, 200, 255, ${opacity})`;
    }
    if (link.type === 'star') return 'rgba(255,255,255,0.35)';
    return 'rgba(255,255,255,0.2)';
}}
```

**Step 3: Remove unused imports**

Remove `Activity` from lucide-react import if no longer used elsewhere. Clean up any unused variables.

**Step 4: Full visual verification**

Run `npm run dev` — verify the complete experience:
- [ ] Star field background with twinkling
- [ ] Nebula sprites behind clusters
- [ ] Planet-like cluster nodes with halos and rings
- [ ] Rings slowly rotating
- [ ] Sinusoidal glow pulsation
- [ ] Particle flow along neural links
- [ ] Hover: scale + dim/highlight
- [ ] Click: camera fly + explosion
- [ ] Background click: return to overview
- [ ] Labels readable

**Step 5: Commit**

```bash
git add src/features/KnowledgeGraph/ui/PersonalKnowledgeGraph.tsx
git commit -m "feat(graph): final polish — cosmic theme complete"
```
