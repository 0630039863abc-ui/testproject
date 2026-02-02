import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { useSimulation, CLUSTER_TOPICS } from '../../../entities/Simulation/model/simulationContext';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { getClusterColor, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';

interface ComponentProps {
    onNodeClick: (node: any) => void;
}

const PersonalKnowledgeGraphComponent: React.FC<ComponentProps> = ({ onNodeClick }) => {
    const { activeZone, setActiveZone, logs, currentUser } = useSimulation();
    const fgRef = useRef<any>(null);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    // Pulse system: store pulse timestamps per cluster
    const clusterPulseTimestamps = useRef<Map<string, number>>(new Map());
    const clusterMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
    const lastLogCount = useRef(0);
    const animationFrameId = useRef<number>(0);

    // CACHE Geometries and Materials to prevent memory thrashing
    const geometries = useRef<Map<string, THREE.SphereGeometry>>(new Map());
    const materials = useRef<Map<string, THREE.MeshPhysicalMaterial>>(new Map());

    const getGeometry = (size: number) => {
        const key = `sphere_${size.toFixed(2)}`;
        if (!geometries.current.has(key)) {
            geometries.current.set(key, new THREE.SphereGeometry(size, 32, 32));
        }
        return geometries.current.get(key)!;
    };

    const getMaterial = (color: string, isInactive: boolean, isCluster: boolean) => {
        const key = `${color}_${isInactive}_${isCluster}`;
        if (!materials.current.has(key)) {
            materials.current.set(key, new THREE.MeshPhysicalMaterial({
                color: isInactive ? '#6b7280' : color,
                metalness: 0.1,
                roughness: 0.1,
                emissive: isInactive ? '#6b7280' : color,
                emissiveIntensity: isInactive ? 0.3 : (isCluster ? 2.0 : 0.5),
                transparent: true,
                opacity: isInactive ? 0.5 : 0.9
            }));
        }
        return materials.current.get(key)!;
    };

    // Detect new logs and register pulse timestamps
    useEffect(() => {
        const newLogCount = logs.length - lastLogCount.current;
        if (newLogCount > 0) {
            const newLogs = logs.slice(0, newLogCount);
            const now = Date.now();

            newLogs.forEach(log => {
                if (log.userId === currentUser.name) {
                    clusterPulseTimestamps.current.set(log.cluster, now);
                }
            });
        }
        lastLogCount.current = logs.length;
    }, [logs, currentUser.name]);

    // Animation loop: update material intensity based on pulse age
    useEffect(() => {
        const PULSE_DURATION = 800;
        const BASE_INTENSITY = 2.0;
        const PULSE_INTENSITY = 6.0;

        const animate = () => {
            const now = Date.now();

            clusterMeshes.current.forEach((mesh, clusterId) => {
                const pulseTime = clusterPulseTimestamps.current.get(clusterId);
                if (pulseTime) {
                    const age = now - pulseTime;
                    if (age < PULSE_DURATION) {
                        const progress = age / PULSE_DURATION;
                        const intensity = PULSE_INTENSITY - (progress * (PULSE_INTENSITY - BASE_INTENSITY));
                        const scale = 1 + (1 - progress) * 0.3;

                        const material = mesh.material as THREE.MeshPhysicalMaterial;
                        if (material) material.emissiveIntensity = intensity;
                        mesh.scale.setScalar(scale);
                    } else {
                        clusterPulseTimestamps.current.delete(clusterId);
                        const material = mesh.material as THREE.MeshPhysicalMaterial;
                        if (material) material.emissiveIntensity = BASE_INTENSITY;
                        mesh.scale.setScalar(1);
                    }
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
        const activeClusters = Object.keys(CLUSTER_TOPICS);
        const inactiveClusters = [
            'Biology', 'Psychology', 'Philosophy', 'Security', 'Logistics',
            'Ecology', 'Information', 'Health', 'Exploration', 'Education',
            'Justice', 'Communication', 'Infrastructure'
        ];
        const allClusters = [...activeClusters, ...inactiveClusters];

        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const spreadX = 500;
        const spreadY = 700;
        const spreadZ = 400;
        const offsetX = -250;

        allClusters.forEach((clusterName: any, index: number) => {
            const isActive = activeZone === clusterName;
            const isInactive = inactiveClusters.includes(clusterName);
            const seed = index * 123.456;

            const baseX = (seededRandom(seed + 1) - 0.5) * spreadX;
            const x = baseX + offsetX;
            const y = (seededRandom(seed + 2) - 0.5) * spreadY;
            const depthGradient = (baseX / spreadX) * 50;
            const z = ((seededRandom(seed + 3) - 0.5) * spreadZ) + depthGradient;

            nodes.push({
                id: clusterName,
                group: 'cluster',
                val: isActive ? 40 : 30,
                color: getClusterColor(clusterName),
                inactive: isInactive,
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
                        const eventTypes = ['Симпозиум', 'Воркшоп', 'Лекция', 'Хакатон', 'Панель'];
                        const eventCount = 5;
                        const subRadius = 60;
                        const subAngleStep = (2 * Math.PI) / eventCount;

                        for (let j = 0; j < eventCount; j++) {
                            const subAngle = j * subAngleStep;
                            const ex = tx + (subRadius * Math.cos(subAngle));
                            const ey = ty + (subRadius * Math.sin(subAngle));
                            const ez = 50;

                            const eventName = `${topic} ${eventTypes[j % eventTypes.length]}`;
                            const eventId = `Event_${topic}_${j}`;

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
                        }
                    }
                });
            }
        }

        return { nodes, links };
    }, [activeZone, activeTopic]);

    useEffect(() => {
        if (fgRef.current) {
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.4,
                0.2,
                0.9
            );
            fgRef.current.postProcessingComposer().addPass(bloomPass);
            fgRef.current.cameraPosition({ x: 0, y: 0, z: 800 });
        }
    }, []);

    const handleNodeClick = useCallback((node: any) => {
        if (node.group === 'cluster') {
            setActiveZone(activeZone === node.id ? null : node.id);
            setActiveTopic(null);
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
                linkColor={(link: any) => {
                    if (link.type === 'neural') {
                        const opacity = Math.max(0.02, 0.15 - (link.distance / 2000));
                        return `rgba(100, 150, 255, ${opacity})`;
                    }
                    return 'rgba(255,255,255,0.2)';
                }}
                linkWidth={(link: any) => link.type === 'neural' ? 0.5 : 1}
                linkOpacity={0.6}
                backgroundColor="#050505"
                nodeThreeObject={(node: any) => {
                    const group = new THREE.Group();
                    const baseSize = node.val ? node.val * 0.2 : 2;
                    const geometry = getGeometry(baseSize);
                    const material = getMaterial(node.color, !!node.inactive, node.group === 'cluster');
                    const sphere = new THREE.Mesh(geometry, material);

                    if (node.group === 'cluster' && !node.inactive) {
                        clusterMeshes.current.set(node.id, sphere);
                    }

                    if (node.inactive) {
                        const wireframeGeometry = getGeometry(node.val * 0.22);
                        const wireframeMaterial = new THREE.MeshBasicMaterial({
                            color: '#ffffff',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.1
                        });
                        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
                        group.add(wireframe);
                    }

                    group.add(sphere);

                    const labelText = CLUSTER_TRANSLATIONS[node.id] || node.id.replace(/_/g, ' ');
                    const sprite = new SpriteText(labelText);
                    sprite.color = '#fff';
                    sprite.textHeight = node.group === 'cluster' ? 8 : (node.group === 'topic' ? 4 : 2);
                    sprite.position.y = node.val * 0.2 + (node.group === 'cluster' ? 8 : 4);
                    sprite.fontFace = 'JetBrains Mono';

                    if (node.group !== 'event') group.add(sprite);

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

export const PersonalKnowledgeGraph = React.memo(PersonalKnowledgeGraphComponent);
