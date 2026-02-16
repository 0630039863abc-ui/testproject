import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { useSimulation, CLUSTER_TOPICS } from '../../../entities/Simulation/model/simulationContext';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { getClusterColor, CLUSTER_TRANSLATIONS, INACTIVE_CLUSTER_COLORS } from '../../../shared/lib/tokens';
import { Activity } from 'lucide-react';

// ── SHARED GEOMETRIES (created once, reused by every node) ──
const GEO = {
    coreActive:   new THREE.SphereGeometry(12, 24, 24),
    haloActive:   new THREE.SphereGeometry(12 * 1.8, 16, 16),
    ringActive:   new THREE.RingGeometry(12 * 1.6, 12 * 2.4, 48),
    coreInactive: new THREE.SphereGeometry(6, 12, 12),
    haloInactive: new THREE.SphereGeometry(6 * 1.6, 8, 8),
    ringInactive: new THREE.RingGeometry(6 * 1.4, 6 * 1.8, 24),
    satellite:    new THREE.SphereGeometry(4, 16, 16),
    satHalo:      new THREE.SphereGeometry(4 * 1.8, 8, 8),
    eventDot:     new THREE.SphereGeometry(1.5, 8, 8),
};

function createStarField(): THREE.Points {
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const radius = 2000;

    for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius + (Math.random() - 0.5) * 400;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

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

function createNebulaTexture(color: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(0.4, color + '20');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function createNebulae(clusterNodes: { fx: number; fy: number; fz: number; color: string }[]): THREE.Group {
    const nebulaGroup = new THREE.Group();
    nebulaGroup.name = 'nebulae';

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

function createExplosion(position: THREE.Vector3, color: string, scene: THREE.Scene) {
    const count = 30;
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

interface ComponentProps {
    onNodeClick: (node: any) => void;
}

const PersonalKnowledgeGraphComponent: React.FC<ComponentProps> = ({ onNodeClick }) => {
    const { activeZone, setActiveZone, logs, currentUser, getEventsForTopic } = useSimulation();
    const fgRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    // Track container size (throttled)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        let rafId = 0;
        const update = () => {
            rafId = 0;
            setDimensions({ width: el.clientWidth, height: el.clientHeight });
        };
        update();
        const ro = new ResizeObserver(() => {
            if (!rafId) rafId = requestAnimationFrame(update);
        });
        ro.observe(el);
        return () => { ro.disconnect(); if (rafId) cancelAnimationFrame(rafId); };
    }, []);

    // Pulse system
    const clusterPulseTimestamps = useRef<Map<string, number>>(new Map());
    // Direct refs for animation — no getObjectByName per frame
    const clusterCoreRefs = useRef<Map<string, THREE.Mesh>>(new Map());
    const clusterHaloRefs = useRef<Map<string, THREE.Mesh>>(new Map());
    const clusterRingRefs = useRef<Map<string, THREE.Mesh>>(new Map());
    const clusterInactiveSet = useRef<Set<string>>(new Set());
    const lastLogCount = useRef(0);
    const animationFrameId = useRef<number>(0);

    const clusterGroups = useRef<Map<string, THREE.Group>>(new Map());
    const linkParticles = useRef<Map<string, { points: THREE.Points; offsets: Float32Array }>>(new Map());
    const hoveredNode = useRef<string | null>(null);

    // Pre-computed hash per cluster for sinusoidal animation
    const clusterHashCache = useRef<Map<string, number>>(new Map());
    const getClusterHash = (id: string) => {
        let h = clusterHashCache.current.get(id);
        if (h === undefined) {
            h = 0;
            for (let i = 0; i < id.length; i++) h += id.charCodeAt(i);
            clusterHashCache.current.set(id, h);
        }
        return h;
    };

    // Detect new logs and register pulse timestamps
    useEffect(() => {
        const newLogCount = logs.length - lastLogCount.current;
        if (newLogCount > 0) {
            const newLogs = logs.slice(0, newLogCount);
            const now = Date.now();
            newLogs.forEach(log => {
                clusterPulseTimestamps.current.set(log.cluster, now);
            });
        }
        lastLogCount.current = logs.length;
    }, [logs, currentUser.name]);

    // Animation loop — uses direct refs, no scene traversal
    useEffect(() => {
        const PULSE_DURATION = 800;
        const BASE_INTENSITY = 1.2;
        const PULSE_INTENSITY = 3.0;

        const animate = () => {
            const now = Date.now();
            const time = now * 0.001;

            clusterCoreRefs.current.forEach((core, clusterId) => {
                // Skip heavy animation for inactive clusters
                if (clusterInactiveSet.current.has(clusterId)) {
                    const ring = clusterRingRefs.current.get(clusterId);
                    if (ring) ring.rotation.z += 0.0005;
                    return;
                }

                const ring = clusterRingRefs.current.get(clusterId);
                if (ring) ring.rotation.z += 0.002;

                const pulseTime = clusterPulseTimestamps.current.get(clusterId);
                if (pulseTime) {
                    const age = now - pulseTime;
                    if (age < PULSE_DURATION) {
                        const progress = age / PULSE_DURATION;
                        const intensity = PULSE_INTENSITY - (progress * (PULSE_INTENSITY - BASE_INTENSITY));
                        const scale = 1 + (1 - progress) * 0.3;
                        const material = core.material as THREE.MeshStandardMaterial;
                        material.emissiveIntensity = intensity;
                        core.scale.setScalar(scale);
                    } else {
                        clusterPulseTimestamps.current.delete(clusterId);
                    }
                } else {
                    const hash = getClusterHash(clusterId);
                    const material = core.material as THREE.MeshStandardMaterial;
                    material.emissiveIntensity = BASE_INTENSITY + Math.sin(time * 0.8 + hash) * 0.2;
                }

                const halo = clusterHaloRefs.current.get(clusterId);
                if (halo) {
                    const hash = getClusterHash(clusterId);
                    (halo.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(time * 0.5 + hash) * 0.02;
                }
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId.current);
    }, []);

    // ── GRAPH DATA ──
    const graphData = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const allClusters = Object.keys(CLUSTER_TOPICS);
        const inactiveClusters = Object.keys(INACTIVE_CLUSTER_COLORS);

        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const maxRadius = 320;
        const jitter = 45;
        const zJitter = 35;

        allClusters.forEach((clusterName: any, index: number) => {
            const isActiveNode = activeZone === clusterName;
            const seed = index * 123.456;
            const r = maxRadius * Math.sqrt((index + 0.5) / allClusters.length);
            const angle = index * goldenAngle;
            const baseX = Math.cos(angle) * r;
            const baseY = Math.sin(angle) * r;
            const x = baseX + (seededRandom(seed + 1) - 0.5) * jitter;
            const y = baseY + (seededRandom(seed + 2) - 0.5) * jitter;
            const z = (seededRandom(seed + 3) - 0.5) * zJitter;

            nodes.push({
                id: clusterName,
                group: 'cluster',
                val: isActiveNode ? 40 : 30,
                color: getClusterColor(clusterName),
                inactive: false,
                fx: x, fy: y, fz: z
            });
        });

        // Inactive clusters — outer ring
        const inactiveBaseRadius = 420;
        const inactiveMaxRadius = 620;
        inactiveClusters.forEach((clusterName, index) => {
            const seed = (index + 100) * 789.123;
            const r = inactiveBaseRadius + (inactiveMaxRadius - inactiveBaseRadius) * Math.sqrt((index + 0.5) / inactiveClusters.length);
            const angle = index * goldenAngle + Math.PI * 0.5;
            const baseX = Math.cos(angle) * r;
            const baseY = Math.sin(angle) * r;
            const x = baseX + (seededRandom(seed + 1) - 0.5) * jitter * 0.8;
            const y = baseY + (seededRandom(seed + 2) - 0.5) * jitter * 0.8;
            const z = (seededRandom(seed + 3) - 0.5) * zJitter * 0.6;

            nodes.push({
                id: clusterName,
                group: 'cluster',
                val: 12,
                color: INACTIVE_CLUSTER_COLORS[clusterName],
                inactive: true,
                fx: x, fy: y, fz: z
            });
        });

        // Neural links — active clusters only
        const activeClusterNodes = nodes.filter(n => n.group === 'cluster' && !n.inactive);
        activeClusterNodes.forEach((node1, i) => {
            for (let j = i + 1; j < activeClusterNodes.length; j++) {
                const node2 = activeClusterNodes[j];
                const dx = node1.fx - node2.fx;
                const dy = node1.fy - node2.fy;
                const dz = node1.fz - node2.fz;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (distance < 400) {
                    links.push({ source: node1.id, target: node2.id, type: 'neural', distance });
                }
            }
        });

        if (activeZone && CLUSTER_TOPICS[activeZone]) {
            const topics = CLUSTER_TOPICS[activeZone];
            const clusterNode = nodes.find(n => n.id === activeZone);
            if (clusterNode) {
                const radius = 200;
                const angleStep = (2 * Math.PI) / topics.length;

                topics.forEach((topic, i) => {
                    const angle = i * angleStep;
                    const tx = clusterNode.fx + (radius * Math.cos(angle));
                    const ty = clusterNode.fy + (radius * Math.sin(angle));
                    const tz = 0;

                    nodes.push({
                        id: topic, group: 'topic', val: 10,
                        color: getClusterColor(activeZone), parent: activeZone,
                        fx: tx, fy: ty, fz: tz
                    });
                    links.push({ source: activeZone, target: topic, type: 'star' });

                    if (activeTopic === topic) {
                        const events = getEventsForTopic(activeTopic);
                        const subRadius = 60;
                        const subAngleStep = (2 * Math.PI) / events.length;

                        events.forEach((event: any, j: number) => {
                            const subAngle = j * subAngleStep;
                            const ex = tx + (subRadius * Math.cos(subAngle));
                            const ey = ty + (subRadius * Math.sin(subAngle));
                            const ez = 50;
                            nodes.push({
                                id: event.id, name: event.label, group: 'event',
                                val: 5, color: '#ffffff', fx: ex, fy: ey, fz: ez
                            });
                            links.push({ source: topic, target: event.id, type: 'satellite' });
                        });
                    }
                });
            }
        }

        return { nodes, links };
    }, [activeZone, activeTopic, getEventsForTopic]);

    // Pre-built adjacency map for O(1) hover lookups
    const adjacencyMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        graphData.links.forEach((l: any) => {
            if (l.type !== 'neural') return;
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            if (!map.has(s)) map.set(s, new Set());
            if (!map.has(t)) map.set(t, new Set());
            map.get(s)!.add(t);
            map.get(t)!.add(s);
        });
        return map;
    }, [graphData]);

    // Scene setup — bloom, stars
    useEffect(() => {
        if (fgRef.current) {
            const renderer = fgRef.current.renderer();
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(
                    Math.floor(renderer.domElement.width / 2),
                    Math.floor(renderer.domElement.height / 2)
                ),
                0.35, 0.3, 0.85
            );
            fgRef.current.postProcessingComposer().addPass(bloomPass);
            fgRef.current.cameraPosition({ x: 0, y: 0, z: 1000 });

            const scene = fgRef.current.scene();
            const existing = scene.getObjectByName('starField');
            if (existing) scene.remove(existing);
            scene.add(createStarField());
        }
    }, []);

    // Nebulae
    useEffect(() => {
        if (!fgRef.current) return;
        const scene = fgRef.current.scene();
        const existing = scene.getObjectByName('nebulae');
        if (existing) scene.remove(existing);

        const clusterNodes = graphData.nodes
            .filter((n: any) => n.group === 'cluster' && !n.inactive)
            .map((n: any) => ({ fx: n.fx, fy: n.fy, fz: n.fz, color: n.color }));

        if (clusterNodes.length > 0) {
            scene.add(createNebulae(clusterNodes));
        }
    }, [graphData]);

    const handleNodeClick = useCallback((node: any) => {
        if (!node) return;

        if (node.group === 'cluster' && node.inactive) return;

        if (node.group === 'cluster') {
            const isDeselecting = activeZone === node.id;
            setActiveZone(isDeselecting ? null : node.id);
            setActiveTopic(null);

            if (fgRef.current) {
                if (isDeselecting) {
                    fgRef.current.cameraPosition(
                        { x: 0, y: 0, z: 1000 },
                        { x: 0, y: 0, z: 0 },
                        1500
                    );
                } else {
                    const distance = 250;
                    fgRef.current.cameraPosition(
                        { x: node.fx + distance * 0.3, y: node.fy + distance * 0.2, z: node.fz + distance },
                        { x: node.fx, y: node.fy, z: node.fz },
                        1500
                    );
                    const scene = fgRef.current.scene();
                    createExplosion(new THREE.Vector3(node.fx, node.fy, node.fz), node.color, scene);
                }
            }
        } else if (node.group === 'topic') {
            setActiveTopic(prev => prev === node.id ? null : node.id);
            onNodeClick({ ...node, title: node.id });
        } else if (node.group === 'event') {
            onNodeClick({ ...node, title: node.name });
        }
    }, [onNodeClick, activeZone, setActiveZone]);

    // Hover handler with O(1) adjacency lookup
    const handleNodeHover = useCallback((node: any) => {
        hoveredNode.current = node?.id || null;

        clusterCoreRefs.current.forEach((core, clusterId) => {
            const halo = clusterHaloRefs.current.get(clusterId);
            const isInactive = clusterInactiveSet.current.has(clusterId);
            const defaultOpacity = isInactive ? 0.45 : 0.95;
            const defaultHaloOpacity = isInactive ? 0.025 : 0.05;

            if (!node || node.group !== 'cluster') {
                (core.material as THREE.MeshStandardMaterial).opacity = defaultOpacity;
                core.scale.setScalar(1);
                if (halo) (halo.material as THREE.MeshBasicMaterial).opacity = defaultHaloOpacity;
                return;
            }

            if (clusterId === node.id) {
                core.scale.setScalar(1.2);
                if (halo) (halo.material as THREE.MeshBasicMaterial).opacity = 0.12;
            } else {
                const neighbors = adjacencyMap.get(node.id);
                const isConnected = neighbors ? neighbors.has(clusterId) : false;

                if (isConnected) {
                    (core.material as THREE.MeshStandardMaterial).opacity = 0.8;
                } else {
                    (core.material as THREE.MeshStandardMaterial).opacity = 0.2;
                    if (halo) (halo.material as THREE.MeshBasicMaterial).opacity = 0.02;
                }
            }
        });
    }, [adjacencyMap]);

    const handleBackgroundClick = useCallback(() => {
        setActiveZone(null);
        setActiveTopic(null);
        if (fgRef.current) {
            fgRef.current.cameraPosition(
                { x: 0, y: 0, z: 1000 },
                { x: 0, y: 0, z: 0 },
                1500
            );
        }
    }, [setActiveZone]);

    const linkColor = useCallback((link: any) => {
        if (link.type === 'neural') {
            const opacity = Math.max(0.15, 0.5 - (link.distance / 1200));
            return `rgba(120, 200, 255, ${opacity})`;
        }
        if (link.type === 'star') return 'rgba(255,255,255,0.35)';
        return 'rgba(255,255,255,0.2)';
    }, []);

    const linkWidth = useCallback((link: any) => link.type === 'neural' ? 1.5 : 2.5, []);

    const linkThreeObject = useCallback((link: any) => {
        if (link.type !== 'neural') return undefined as any;

        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const key = `${sourceId}-${targetId}`;

        const particleCount = 4;
        const positions = new Float32Array(particleCount * 3);
        const offsets = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) offsets[i] = i / particleCount;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const color = new THREE.Color(link.source?.color || '#64b4ff');
        const material = new THREE.PointsMaterial({
            color, size: 2.5, transparent: true, opacity: 0.8,
            blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        linkParticles.current.set(key, { points, offsets });
        return points;
    }, []);

    const linkPositionUpdate = useCallback((obj: any, { start, end }: any, link: any) => {
        if (link.type !== 'neural' || !obj) return;
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const key = `${sourceId}-${targetId}`;
        const data = linkParticles.current.get(key);
        if (!data) return;

        const positions = data.points.geometry.attributes.position.array as Float32Array;
        const time = Date.now() * 0.0003;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dz = end.z - start.z;

        for (let i = 0; i < data.offsets.length; i++) {
            const t = (data.offsets[i] + time) % 1;
            positions[i * 3] = start.x + dx * t;
            positions[i * 3 + 1] = start.y + dy * t;
            positions[i * 3 + 2] = start.z + dz * t;
        }
        data.points.geometry.attributes.position.needsUpdate = true;
    }, []);

    const nodeThreeObject = useCallback((node: any) => {
        const group = new THREE.Group();

        if (node.group === 'cluster' && node.inactive) {
            // ── INACTIVE CLUSTER — MeshBasicMaterial (no lighting calc) ──
            const coreMaterial = new THREE.MeshBasicMaterial({
                color: node.color,
                transparent: true,
                opacity: 0.45,
            });
            const core = new THREE.Mesh(GEO.coreInactive, coreMaterial);
            group.add(core);

            clusterCoreRefs.current.set(node.id, core);
            clusterGroups.current.set(node.id, group);
            clusterInactiveSet.current.add(node.id);

            const haloMaterial = new THREE.MeshBasicMaterial({
                color: node.color, transparent: true, opacity: 0.025,
                side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
            });
            const halo = new THREE.Mesh(GEO.haloInactive, haloMaterial);
            group.add(halo);
            clusterHaloRefs.current.set(node.id, halo);

            const ringMaterial = new THREE.MeshBasicMaterial({
                color: node.color, transparent: true, opacity: 0.04,
                side: THREE.DoubleSide, depthWrite: false,
            });
            const ring = new THREE.Mesh(GEO.ringInactive, ringMaterial);
            ring.rotation.x = Math.PI * 0.4;
            group.add(ring);
            clusterRingRefs.current.set(node.id, ring);

            const labelText = CLUSTER_TRANSLATIONS[node.id] || node.id;
            const sprite = new SpriteText(labelText);
            sprite.color = '#555555';
            sprite.textHeight = 5;
            sprite.position.y = 6 + 12;
            sprite.fontFace = 'JetBrains Mono';
            sprite.backgroundColor = 'rgba(0,0,0,0.3)';
            sprite.padding = 1;
            sprite.borderRadius = 2;
            group.add(sprite);

        } else if (node.group === 'cluster') {
            // ── ACTIVE CLUSTER ──
            const coreMaterial = new THREE.MeshStandardMaterial({
                color: node.color, emissive: node.color, emissiveIntensity: 1.2,
                metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.95,
            });
            const core = new THREE.Mesh(GEO.coreActive, coreMaterial);
            group.add(core);

            clusterCoreRefs.current.set(node.id, core);
            clusterGroups.current.set(node.id, group);

            const haloMaterial = new THREE.MeshBasicMaterial({
                color: node.color, transparent: true, opacity: 0.05,
                side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
            });
            const halo = new THREE.Mesh(GEO.haloActive, haloMaterial);
            group.add(halo);
            clusterHaloRefs.current.set(node.id, halo);

            const ringMaterial = new THREE.MeshBasicMaterial({
                color: node.color, transparent: true, opacity: 0.1,
                side: THREE.DoubleSide, depthWrite: false,
            });
            const ring = new THREE.Mesh(GEO.ringActive, ringMaterial);
            ring.rotation.x = Math.PI * 0.4;
            group.add(ring);
            clusterRingRefs.current.set(node.id, ring);

            const labelText = CLUSTER_TRANSLATIONS[node.id] || node.id;
            const sprite = new SpriteText(labelText);
            sprite.color = '#a0a0a0';
            sprite.textHeight = 7;
            sprite.position.y = 12 + 20;
            sprite.fontFace = 'JetBrains Mono';
            sprite.backgroundColor = 'rgba(0,0,0,0.5)';
            sprite.padding = 2;
            sprite.borderRadius = 2;
            group.add(sprite);

        } else if (node.group === 'topic') {
            const satMaterial = new THREE.MeshStandardMaterial({
                color: node.color, emissive: node.color, emissiveIntensity: 0.6,
                metalness: 0.2, roughness: 0.4, transparent: true, opacity: 0.85,
            });
            group.add(new THREE.Mesh(GEO.satellite, satMaterial));

            const miniHaloMat = new THREE.MeshBasicMaterial({
                color: node.color, transparent: true, opacity: 0.06,
                side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
            });
            group.add(new THREE.Mesh(GEO.satHalo, miniHaloMat));

            const sprite = new SpriteText(node.id);
            sprite.color = '#909090';
            sprite.textHeight = 3;
            sprite.position.y = 4 + 6;
            sprite.fontFace = 'JetBrains Mono';
            sprite.backgroundColor = 'rgba(0,0,0,0.4)';
            sprite.padding = 1;
            group.add(sprite);

        } else if (node.group === 'event') {
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: '#ffffff', transparent: true, opacity: 0.7,
                blending: THREE.AdditiveBlending,
            });
            group.add(new THREE.Mesh(GEO.eventDot, dotMaterial));
        }

        return group;
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative bg-black overflow-hidden">
            <ForceGraph3D
                ref={fgRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                nodeLabel="id"
                nodeColor="color"
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                onBackgroundClick={handleBackgroundClick}
                linkColor={linkColor}
                linkWidth={linkWidth}
                linkOpacity={0.6}
                linkThreeObject={linkThreeObject}
                linkPositionUpdate={linkPositionUpdate}
                backgroundColor="#000000"
                nodeThreeObject={nodeThreeObject}
                enableNodeDrag={false}
                showNavInfo={false}
                d3AlphaDecay={0}
                d3VelocityDecay={0}
                cooldownTicks={0}
            />

            <div className="absolute bottom-6 left-6 pointer-events-none">
                <div className="flex flex-col items-start gap-1">
                    {activeZone && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getClusterColor(activeZone) }}></div>
                            <span className="text-lg font-bold text-white tracking-widest uppercase font-mono">{'>'} {CLUSTER_TRANSLATIONS[activeZone] || activeZone}</span>
                        </div>
                    )}
                    {activeTopic && (
                        <div className="flex items-center gap-2 pl-4 animate-in fade-in slide-in-from-left-4 duration-300 delay-75">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            <span className="text-sm text-gray-400 font-mono">{'>'} {activeTopic}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ERROR BOUNDARY ---

class GraphErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Knowledge Graph Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full bg-black flex flex-col items-center justify-center border border-blue-500/30 p-4 relative z-50">
                    <Activity className="text-blue-500 mb-2 animate-pulse" size={32} />
                    <h3 className="text-white font-orbitron text-sm uppercase text-center mb-1 tracking-widest">НЕЙРОЛИНК ОТКЛЮЧЕН</h3>
                    <p className="text-blue-400 font-mono text-[10px] max-w-[200px] text-center mb-4 bg-blue-900/20 p-2 rounded">
                        {this.state.error?.message || "Неизвестная ошибка WebGL"}
                    </p>
                    <button
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500 text-blue-500 text-[10px] font-orbitron uppercase hover:bg-blue-500/40 transition-colors cursor-pointer"
                        onClick={() => window.location.reload()}
                    >
                        ПЕРЕЗАГРУЗИТЬ СОЕДИНЕНИЕ
                    </button>
                    <span className="absolute bottom-2 right-2 text-[8px] text-gray-600 font-mono text-center">
                        КОД_ОШИБКИ: GRAPH_CRASH_0x2
                    </span>
                </div>
            );
        }

        return this.props.children;
    }
}

const PersonalKnowledgeGraphWrapped: React.FC<ComponentProps> = (props) => {
    return (
        <GraphErrorBoundary>
            <PersonalKnowledgeGraphComponent {...props} />
        </GraphErrorBoundary>
    );
};

export const PersonalKnowledgeGraph = React.memo(PersonalKnowledgeGraphWrapped);
