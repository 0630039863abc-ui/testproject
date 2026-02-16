import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Html } from '@react-three/drei';
import { Delaunay } from 'd3-delaunay';
import * as THREE from 'three';
import { Activity } from 'lucide-react';
import clsx from 'clsx';

import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';

// --- UTILS ---

const isPointInPolygon = (point: [number, number], vs: [number, number][]) => {
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];
        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

type MapPoint = [number, number];

// --- COMPONENTS ---

/**
 * Optimized Spark System using InstancedMesh
 */
const InstancedSparks = ({ count = 200, cells = [] }: { count?: number, cells?: any[] }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { clusterMetrics } = useSimulation();
    const prevPulses = useRef<Record<string, number>>({});

    // Internal state for particles
    const particles = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            active: false,
            pos: new THREE.Vector3(),
            vel: new THREE.Vector3(),
            life: 0,
            maxLife: 1,
            color: new THREE.Color()
        }));
    }, [count]);

    useFrame((_state, delta) => {
        if (!meshRef.current) return;

        const dummy = new THREE.Object3D();
        let activeIdx = 0;

        particles.forEach((p) => {
            if (p.active) {
                p.life -= delta * 1.5;
                if (p.life <= 0) {
                    p.active = false;
                } else {
                    p.pos.addScaledVector(p.vel, delta);
                    dummy.position.copy(p.pos);
                    const scale = (p.life / p.maxLife) * 0.15;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    meshRef.current!.setMatrixAt(activeIdx, dummy.matrix);
                    meshRef.current!.setColorAt(activeIdx, p.color);
                    activeIdx++;
                }
            }
        });

        // Hide remaining instances
        dummy.scale.set(0, 0, 0);
        for (let i = activeIdx; i < count; i++) {
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    // Listen to pulses from simulation
    useEffect(() => {
        clusterMetrics.forEach(m => {
            const prev = prevPulses.current[m.name] || 0;
            if (m.activeUnits > prev) {
                // Find the cell for this cluster to get its centroid
                const cell = cells.find(c => c.name === m.name);
                const emissionPos = cell ? new THREE.Vector3(cell.centroid[0], cell.centroid[1], 0.2) : new THREE.Vector3(0, 0, 0.5);

                // Emit 5 sparks for this pulse
                for (let i = 0; i < 5; i++) {
                    const p = particles.find(pt => !pt.active);
                    if (p) {
                        p.active = true;
                        p.life = 1.0;
                        p.maxLife = 1.0;
                        p.color.set(CLUSTER_COLORS[m.name] || '#ffffff');

                        // Emit from cluster center
                        p.pos.copy(emissionPos);
                        p.vel.set(
                            (Math.random() - 0.5) * 2,
                            (Math.random() - 0.5) * 2,
                            Math.random() * 2 + 0.5
                        );
                    }
                }
            }
            prevPulses.current[m.name] = m.activeUnits;
        });
    }, [clusterMetrics, particles, cells]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshStandardMaterial emissiveIntensity={2} transparent opacity={0.6} />
        </instancedMesh>
    );
};

const VoronoiCell = ({ points, color, label, active, onHover, count, activeZone, onPointerEnter, onPointerLeave, centroid }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const shape = useMemo(() => {
        const s = new THREE.Shape();
        if (!points || points.length === 0) return s;
        points.forEach((p: [number, number], i: number) => {
            if (i === 0) s.moveTo(p[0], p[1]);
            else s.lineTo(p[0], p[1]);
        });
        s.closePath();
        return s;
    }, [points]);

    const linePoints = useMemo(() => {
        if (!points || points.length === 0) return [];
        const pts = points.map((p: any) => new THREE.Vector3(p[0], p[1], 0.01));
        pts.push(new THREE.Vector3(points[0][0], points[0][1], 0.01));
        return pts;
    }, [points]);

    useFrame((state) => {
        if (meshRef.current) {
            const targetZ = active ? 0.6 : 0;
            meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.15);
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            if (!active) {
                const breathing = Math.sin(state.clock.elapsedTime * 1.5 + label.length) * 0.05 + 0.35;
                material.opacity = breathing;
                material.emissiveIntensity = breathing * 0.8;
            } else {
                material.opacity = 0.85;
                material.emissiveIntensity = 1.5;
            }
        }
    });

    if (!points || points.length === 0) return null;

    const translatedLabel = CLUSTER_TRANSLATIONS[label] || label;

    return (
        <group>
            <mesh
                ref={meshRef}
                onPointerOver={(e) => { e.stopPropagation(); onHover(label); }}
                onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
                onPointerEnter={(e) => { e.stopPropagation(); onPointerEnter(label); }}
                onPointerLeave={(e) => { e.stopPropagation(); onPointerLeave(null); }}
            >
                <shapeGeometry args={[shape]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                />

                {/* High-End Border */}
                <group>
                    {linePoints.length > 0 && (
                        <line>
                            <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints(linePoints)} />
                            <lineBasicMaterial
                                attach="material"
                                color={color}
                                transparent
                                opacity={active ? 0.8 : 0.2}
                                depthWrite={false}
                                blending={THREE.AdditiveBlending}
                            />
                        </line>
                    )}
                </group>
            </mesh>

            {/* Cluster Label & Count */}
            {centroid && (
                <group position={[centroid[0], centroid[1], 0.2]}>
                    <Text
                        position={[0, 0.4, 0]}
                        fontSize={0.22}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        fillOpacity={0.9}
                    >
                        {translatedLabel.toUpperCase()}
                    </Text>
                    <Text
                        position={[0, -0.1, 0]}
                        fontSize={0.5}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
                        fillOpacity={0.8}
                    >
                        {Math.round(count).toLocaleString()}
                    </Text>
                    <Text
                        position={[0, -0.5, 0]}
                        fontSize={0.15}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        fillOpacity={0.4}
                    >
                        СОБЫТИЙ
                    </Text>
                </group>
            )}

            {(active || activeZone === label) && (
                <Html position={[0, 0, 1.2]} center pointerEvents="none">
                    <div className="px-3 py-2 rounded-lg bg-zinc-900/95 border border-white/10 backdrop-blur-sm shadow-xl">
                        <div className="text-[12px] font-semibold text-zinc-100 whitespace-nowrap">
                            {CLUSTER_TRANSLATIONS[label] || label}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono tabular-nums mt-0.5">
                            {Math.round(count)} единиц
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

const OptimizedAgents = ({ agents }: { agents: any[] }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state, _delta) => {
        if (!meshRef.current) return;

        agents.forEach((agent, i) => {
            // Simple lerp for smoothness
            dummy.position.set(agent.position[0], agent.position[1], agent.position[2]);
            const s = (agent.isActive ? 1.4 : 1.0) + Math.sin(state.clock.elapsedTime * 4 + i) * 0.1;
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
            meshRef.current!.setColorAt(i, new THREE.Color(agent.themeColor));
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, Math.max(1, agents.length)]}>
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshStandardMaterial emissiveIntensity={2} transparent opacity={0.9} />
            </instancedMesh>

            {/* Overlay for active agents */}
            {agents.map((agent) => (
                (agent.isActive || agent.lastAction) && (
                    <Html key={agent.id} position={agent.position} center distanceFactor={15} pointerEvents="none">
                        <div className={clsx(
                            "px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap border backdrop-blur-sm",
                            agent.lastAction ? "bg-blue-500/20 border-blue-500/30 text-blue-200" : "bg-black/60 border-white/10 text-zinc-400"
                        )}>
                            {agent.lastAction || agent.name.split(' ')[0]}
                        </div>
                    </Html>
                )
            ))}
        </group>
    );
};

// --- MAIN COMPONENT ---

// --- ERROR BOUNDARY ---

class VoronoiErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Voronoi Component Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full bg-[#09090B] flex flex-col items-center justify-center border border-red-500/50 p-4 relative z-50">
                    <Activity className="text-red-500 mb-2 animate-pulse" size={32} />
                    <h3 className="text-white font-semibold text-sm text-center mb-1">Ошибка визуализации</h3>
                    <p className="text-red-400 font-mono text-[10px] max-w-[200px] text-center mb-4 bg-red-900/20 p-2 rounded">
                        {this.state.error?.message || "Unknown WebGL Error"}
                    </p>
                    <button
                        className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 text-red-400 text-[11px] font-medium rounded-md hover:bg-red-500/30 transition-colors cursor-pointer"
                        onClick={() => window.location.reload()}
                    >
                        Перезагрузить
                    </button>
                    <span className="absolute bottom-2 right-2 text-[8px] text-gray-600 font-mono text-center">
                        ERR_CODE: VORONOI_CRASH_0x1
                    </span>
                </div>
            );
        }

        return this.props.children;
    }
}

// --- MAIN COMPONENT ---

export const StrategicVoronoiMap: React.FC = () => {
    return (
        <VoronoiErrorBoundary>
            <StrategicVoronoiMapContent />
        </VoronoiErrorBoundary>
    );
};

const StrategicVoronoiMapContent: React.FC = () => {
    const { clusterMetrics, selectableUsers, currentUser, logs } = useSimulation();
    const [hovered, setHovered] = useState<string | null>(null);
    const [activeZone, setActiveZone] = useState<string | null>(null);

    // Filter and sanitize data
    const activeMetrics = useMemo(() =>
        clusterMetrics.filter(m => m.activeUnits > 0 && !isNaN(m.activeUnits)),
        [clusterMetrics]);

    const cells = useMemo(() => {
        const count = activeMetrics.length;
        if (count === 0) return [];

        const width = 16.5;
        const height = 12.5;

        // 1. Generate Points with NaN checks
        const points = activeMetrics.map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const r = 3.8 + Math.sin(i * 1.8) * 1.2;
            const x = Math.cos(angle) * r + Math.sin(i * 12) * 0.5;
            const y = Math.sin(angle) * r + Math.cos(i * 8) * 0.5;

            // Safety check
            if (isNaN(x) || isNaN(y)) return [0, 0] as MapPoint;
            return [x, y] as MapPoint;
        });

        // 2. Generate Fallback if too few points
        if (count < 2) {
            return activeMetrics.map(m => ({
                name: m.name,
                points: [[-6, -5], [6, -5], [6, 5], [-6, 5]] as MapPoint[],
                centroid: [0, 0] as [number, number],
                color: CLUSTER_COLORS[m.name] || '#ffffff',
                intensity: m.activeUnits
            }));
        }

        try {
            const delaunay = Delaunay.from(points);
            const voronoi = delaunay.voronoi([-width / 2, -height / 2, width / 2, height / 2]);

            return activeMetrics.map((m, i) => {
                const poly = Array.from(voronoi.cellPolygon(i) || []);
                if (poly.length === 0) return null;

                let cx = 0, cy = 0;
                poly.forEach(p => { cx += p[0]; cy += p[1]; });

                return {
                    name: m.name,
                    points: poly as MapPoint[],
                    centroid: [cx / poly.length, cy / poly.length] as [number, number],
                    color: CLUSTER_COLORS[m.name] || '#ffffff',
                    intensity: m.activeUnits
                };
            }).filter(Boolean);
        } catch (e) {
            console.warn("Voronoi Fallback due to error:", e);
            // Radial Fallback Layout
            return activeMetrics.map((m, i) => {
                const angle = (i / count) * Math.PI * 2;
                const nextAngle = ((i + 1) / count) * Math.PI * 2;
                const r = 8;
                return {
                    name: m.name,
                    points: [[0, 0], [Math.cos(angle) * r, Math.sin(angle) * r], [Math.cos(nextAngle) * r, Math.sin(nextAngle) * r]] as MapPoint[],
                    centroid: [Math.cos(angle + (nextAngle - angle) / 2) * r / 2, Math.sin(angle + (nextAngle - angle) / 2) * r / 2] as [number, number],
                    color: CLUSTER_COLORS[m.name] || '#ffffff',
                    intensity: m.activeUnits
                };
            });
        }
    }, [activeMetrics]);

    const agents = useMemo(() => {
        return selectableUsers.map((user: any, i: number) => {
            if (!user || !user.id || typeof user.id !== 'string') return null;
            const userIdSanitized = user.id.trim();
            const primaryCluster = (user.stats && Object.entries(user.stats).sort((a: any, b: any) => b[1] - a[1])[0]?.[0]) || 'Science';
            const cell = (cells as any[]).find(c => c.name === primaryCluster);
            if (!cell) return null;

            // Stable pseudo-random position inside cell
            const seed = i * 42.42;
            let px = cell.centroid[0] + Math.sin(seed) * 1.5;
            let py = cell.centroid[1] + Math.cos(seed) * 1.5;

            // Clamp to polygon if needed (simple check)
            if (!isPointInPolygon([px, py], cell.points)) {
                px = cell.centroid[0] + Math.sin(seed) * 0.5;
                py = cell.centroid[1] + Math.cos(seed) * 0.5;
            }

            const lastLog = logs.find(l => l.userId === user.name);
            const isRecent = lastLog && (Date.now() - lastLog.timestamp < 2500);

            return {
                id: userIdSanitized,
                name: user.name,
                position: [px, py, 0.15],
                themeColor: cell.color,
                isActive: currentUser.id.trim() === userIdSanitized,
                lastAction: isRecent ? lastLog.action : null
            };
        }).filter(Boolean);
    }, [selectableUsers, cells, currentUser.id, logs]);

    const activeCell = activeMetrics.find(m => m.name === hovered);

    if (clusterMetrics.length === 0) {
        return (
            <div className="w-full h-full bg-[#09090B] flex items-center justify-center rounded-xl border border-white/[0.06]">
                <div className="flex flex-col items-center gap-3">
                    <Activity className="text-zinc-600 animate-pulse" size={24} />
                    <span className="text-[11px] text-zinc-500 font-medium">Загрузка...</span>
                </div>
            </div>
        );
    }

    if (activeMetrics.length === 0) {
        return (
            <div className="w-full h-full bg-[#09090B] border border-white/[0.06] flex flex-col items-center justify-center gap-3 rounded-xl">
                <Activity size={24} className="text-zinc-600" strokeWidth={1.5} />
                <span className="text-[11px] text-zinc-500 font-medium">Нет активных кластеров</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#09090B]">
            {/* Top Right HUD */}
            <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
                <div className="text-[20px] font-mono font-medium text-zinc-100 tabular-nums tracking-tight">
                    {activeCell ? activeCell.activeUnits.toLocaleString() : ''}
                </div>
                <div className="text-[11px] text-zinc-500 tracking-wider mt-0.5">
                    {activeCell ? (CLUSTER_TRANSLATIONS[activeCell.name] || activeCell.name) : ''}
                </div>
            </div>

            <Canvas gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [0, -10, 16], fov: 32 }}>
                <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} enablePan={false} />
                <ambientLight intensity={1.5} />
                <pointLight position={[0, 10, 10]} intensity={4} color="#3b82f6" />

                <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.5}>
                    <group rotation={[-Math.PI / 12, 0, 0]}>
                        {/* Cells */}
                        {cells.map((cell: any) => cell && (
                            <VoronoiCell
                                key={cell.name}
                                {...cell}
                                active={hovered === cell.name}
                                onHover={setHovered}
                                activeZone={activeZone}
                                onPointerEnter={setActiveZone}
                                onPointerLeave={setActiveZone}
                                label={cell.name}
                                count={cell.intensity}
                            />
                        ))}

                        {/* Agents */}
                        <OptimizedAgents agents={agents} />

                        {/* Sparks */}
                        <InstancedSparks cells={cells} />

                    </group>
                </Float>
            </Canvas>

        </div>
    );
};
