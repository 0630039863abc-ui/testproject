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
            <meshStandardMaterial emissiveIntensity={10} transparent />
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
                const breathing = Math.sin(state.clock.elapsedTime * 1.5 + label.length) * 0.05 + 0.2;
                material.opacity = breathing;
                material.emissiveIntensity = breathing * 2;
            } else {
                material.opacity = 0.85;
                material.emissiveIntensity = 4;
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
                    emissiveIntensity={0.5}
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
                        fontSize={0.25}
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
                        EVENTS
                    </Text>
                </group>
            )}

            {(active || activeZone === label) && (
                <Html position={[0, 0, 1.2]} center pointerEvents="none">
                    <div className={clsx(
                        "px-3 py-1.5 rounded-sm backdrop-blur-xl border transition-all duration-300",
                        activeZone === label ? "border-cyan-400 bg-void/60 shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-white/10 bg-black/80"
                    )}>
                        <div className="text-[11px] font-orbitron font-black text-white uppercase tracking-widest whitespace-nowrap">
                            {CLUSTER_TRANSLATIONS[label] || label}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400/50" style={{ width: `${Math.min(100, count / 5)}%` }} />
                            </div>
                            <div className="text-[8px] text-cyan-400 font-mono-data uppercase">{Math.round(count)} UNIT</div>
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
                            "px-2 py-0.5 rounded-[1px] text-[7px] font-orbitron font-black uppercase whitespace-nowrap border backdrop-blur-md shadow-lg transition-transform duration-300",
                            agent.lastAction ? "bg-cyan-500 border-white text-white scale-110" : "bg-black/90 border-white/20 text-white/80"
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
                <div className="w-full h-full bg-black flex flex-col items-center justify-center border border-red-500/50 p-4 relative z-50">
                    <Activity className="text-red-500 mb-2 animate-pulse" size={32} />
                    <h3 className="text-white font-orbitron text-sm uppercase text-center mb-1 tracking-widest">Visual System Failure</h3>
                    <p className="text-red-400 font-mono text-[10px] max-w-[200px] text-center mb-4 bg-red-900/20 p-2 rounded">
                        {this.state.error?.message || "Unknown WebGL Error"}
                    </p>
                    <button
                        className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-500 text-[10px] font-orbitron uppercase hover:bg-red-500/40 transition-colors cursor-pointer"
                        onClick={() => window.location.reload()}
                    >
                        Reboot System
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
            <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Activity className="text-cyan-500/20 animate-pulse" size={40} />
                    <span className="text-[10px] font-orbitron font-black text-white/20 uppercase tracking-[.8em]">CALIBRATING_SYSTEM</span>
                </div>
            </div>
        );
    }

    if (activeMetrics.length === 0) {
        return (
            <div className="w-full h-full bg-void border border-white/5 flex flex-col items-center justify-center gap-4">
                <div className="text-cyan-500/10"><Activity size={60} strokeWidth={0.5} /></div>
                <span className="text-white/20 text-[9px] font-orbitron font-black uppercase tracking-widest">Awaiting Active Nodes...</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl border border-white/5 bg-black/20">
            {/* Top Right HUD */}
            <div className="absolute top-6 right-8 z-10 text-right pointer-events-none">
                <div className="text-[18px] font-orbitron font-black text-white tabular-nums tracking-tighter drop-shadow-lg">
                    {activeCell ? activeCell.activeUnits.toLocaleString() : '---'}
                </div>
                <div className="text-[7px] text-cyan-400/50 uppercase font-orbitron font-black tracking-widest mt-0.5">
                    {activeCell ? `${CLUSTER_TRANSLATIONS[activeCell.name] || activeCell.name} load` : 'SCANNING_CLUSTER'}
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

                        {/* Connection to nexus core */}
                        <gridHelper args={[30, 20]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.2]}>
                            <meshBasicMaterial attach="material" color="#22d3ee" transparent opacity={0.02} />
                        </gridHelper>

                        {/* Decorative Radial Grid */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.3]}>
                            <ringGeometry args={[0, 15, 6, 1]} />
                            <meshBasicMaterial color="#22d3ee" transparent opacity={0.01} wireframe />
                        </mesh>
                    </group>
                </Float>
            </Canvas>

            {/* Bottom HUD: Clusters Legend */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="flex gap-5">
                    {activeMetrics.slice(0, 6).map(m => (
                        <div key={m.name} className="group/item flex flex-col gap-1.5 transition-opacity duration-300" style={{ opacity: !hovered || hovered === m.name ? 1 : 0.2 }}>
                            <div className="h-0.5 w-8 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full" style={{ width: '100%', backgroundColor: CLUSTER_COLORS[m.name] }} />
                            </div>
                            <span className="text-[7px] font-orbitron font-black text-white/30 uppercase tracking-tighter">
                                {CLUSTER_TRANSLATIONS[m.name]?.slice(0, 4) || m.name.slice(0, 4)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="px-2 py-1 bg-cyan-400/5 border border-cyan-400/20 rounded-[1px] backdrop-blur-md">
                        <span className="text-[8px] font-orbitron font-black text-cyan-400 uppercase tracking-[0.2em] animate-pulse">
                            Link_Status: Secure
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid Overlay Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
    );
};
