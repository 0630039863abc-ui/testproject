import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { useSimulation, CLUSTER_TOPICS } from '../../../entities/Simulation/model/simulationContext';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { getClusterColor, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Activity } from 'lucide-react';

function createStarField(): THREE.Points {
    const starCount = 4000;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const radius = 2000;

    for (let i = 0; i < starCount; i++) {
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

function createNebulaTexture(color: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(0.4, color + '20');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
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

interface ComponentProps {
    onNodeClick: (node: any) => void;
}

const PersonalKnowledgeGraphComponent: React.FC<ComponentProps> = ({ onNodeClick }) => {
    const { activeZone, setActiveZone, logs, currentUser, getEventsForTopic } = useSimulation();
    const fgRef = useRef<any>(null);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    // Pulse system: store pulse timestamps per cluster
    const clusterPulseTimestamps = useRef<Map<string, number>>(new Map());
    const clusterMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
    const lastLogCount = useRef(0);
    const animationFrameId = useRef<number>(0);

    const clusterGroups = useRef<Map<string, THREE.Group>>(new Map());
    const linkParticles = useRef<Map<string, { points: THREE.Points; offsets: Float32Array }>>(new Map());
    const hoveredNode = useRef<string | null>(null);

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

    // Animation loop: ring rotation, sinusoidal pulse, and halo breathing
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

                // Core animation
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

    // CHAOTIC NEURON-LIKE LAYOUT CONSTRUCTION
    const graphData = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const allClusters = Object.keys(CLUSTER_TOPICS);

        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const spreadX = 500;
        const spreadY = 700;
        const spreadZ = 400;
        const offsetX = -250;

        allClusters.forEach((clusterName: any, index: number) => {
            const isActiveNode = activeZone === clusterName;
            const seed = index * 123.456;

            const baseX = (seededRandom(seed + 1) - 0.5) * spreadX;
            const x = baseX + offsetX;
            const y = (seededRandom(seed + 2) - 0.5) * spreadY;
            const depthGradient = (baseX / spreadX) * 50;
            const z = ((seededRandom(seed + 3) - 0.5) * spreadZ) + depthGradient;

            nodes.push({
                id: clusterName,
                group: 'cluster',
                val: isActiveNode ? 40 : 30,
                color: getClusterColor(clusterName),
                inactive: false,
                fx: x, fy: y, fz: z
            });
        });

        const clusterNodes = nodes.filter(n => n.group === 'cluster');
        clusterNodes.forEach((node1, i) => {
            clusterNodes.forEach((node2, j) => {
                if (i < j) {
                    const dx = node1.fx - node2.fx;
                    const dy = node1.fy - node2.fy;
                    const dz = node1.fz - node2.fz;
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (distance < 450) {
                        links.push({
                            source: node1.id,
                            target: node2.id,
                            type: 'neural',
                            distance: distance
                        });
                    }
                }
            });
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
                        id: topic,
                        group: 'topic',
                        val: 10,
                        color: getClusterColor(activeZone),
                        parent: activeZone,
                        fx: tx, fy: ty, fz: tz
                    });

                    links.push({
                        source: activeZone,
                        target: topic,
                        type: 'star'
                    });

                    if (activeTopic === topic) {
                        const events = getEventsForTopic(activeTopic);
                        const subRadius = 60;
                        const subAngleStep = (2 * Math.PI) / events.length;

                        events.forEach((event: any, j: number) => {
                            const subAngle = j * subAngleStep;
                            const ex = tx + (subRadius * Math.cos(subAngle));
                            const ey = ty + (subRadius * Math.sin(subAngle));
                            const ez = 50;

                            const eventName = event.label;
                            const eventId = event.id;

                            nodes.push({
                                id: eventId,
                                name: eventName,
                                group: 'event',
                                val: 5,
                                color: '#ffffff',
                                fx: ex, fy: ey, fz: ez
                            });

                            links.push({
                                source: topic,
                                target: eventId,
                                type: 'satellite'
                            });
                        });
                    }
                });
            }
        }

        return { nodes, links };
    }, [activeZone, activeTopic, getEventsForTopic]);

    useEffect(() => {
        if (fgRef.current) {
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.8,   // strength (was 0.4)
                0.4,   // radius (was 0.2)
                0.6    // threshold (was 0.9)
            );
            fgRef.current.postProcessingComposer().addPass(bloomPass);
            fgRef.current.cameraPosition({ x: 200, y: 150, z: 900 });

            const scene = fgRef.current.scene();
            const existing = scene.getObjectByName('starField');
            if (existing) scene.remove(existing);
            scene.add(createStarField());
        }
    }, []);

    useEffect(() => {
        if (!fgRef.current) return;
        const scene = fgRef.current.scene();

        const existing = scene.getObjectByName('nebulae');
        if (existing) scene.remove(existing);

        const clusterNodes = graphData.nodes
            .filter((n: any) => n.group === 'cluster')
            .map((n: any) => ({ fx: n.fx, fy: n.fy, fz: n.fz, color: n.color }));

        if (clusterNodes.length > 0) {
            scene.add(createNebulae(clusterNodes));
        }
    }, [graphData]);

    const handleNodeClick = useCallback((node: any) => {
        if (!node) return;

        if (node.group === 'cluster') {
            const isDeselecting = activeZone === node.id;
            setActiveZone(isDeselecting ? null : node.id);
            setActiveTopic(null);

            if (fgRef.current) {
                if (isDeselecting) {
                    fgRef.current.cameraPosition(
                        { x: 200, y: 150, z: 900 },
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

    return (
        <div className="w-full h-full relative bg-[radial-gradient(ellipse_at_center,_#1B1B1B_0%,_#050505_100%)] overflow-hidden">
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="id"
                nodeColor="color"
                onNodeClick={handleNodeClick}
                onNodeHover={(node: any) => {
                    hoveredNode.current = node?.id || null;

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
                linkColor={(link: any) => {
                    if (link.type === 'neural') {
                        const opacity = Math.max(0.1, 0.4 - (link.distance / 1500));
                        return `rgba(100, 180, 255, ${opacity})`;
                    }
                    return 'rgba(255,255,255,0.4)';
                }}
                linkWidth={(link: any) => link.type === 'neural' ? 1.5 : 2.5}
                linkOpacity={0.6}
                linkThreeObject={(link: any) => {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    const key = `${sourceId}-${targetId}`;

                    if (link.type !== 'neural') return undefined as any;

                    const particleCount = 8;
                    const positions = new Float32Array(particleCount * 3);
                    const offsets = new Float32Array(particleCount);

                    for (let i = 0; i < particleCount; i++) {
                        offsets[i] = i / particleCount;
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
                backgroundColor="#000000"
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
                        clusterGroups.current.set(node.id, group);

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
                enableNodeDrag={false}
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
