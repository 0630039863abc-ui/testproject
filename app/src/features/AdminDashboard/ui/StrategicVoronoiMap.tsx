import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Html } from '@react-three/drei';
import { Delaunay } from 'd3-delaunay';
import * as THREE from 'three';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS, HUD_COLORS } from '../../../shared/lib/tokens';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';

type MapPoint = [number, number];

const TechnicalCallout = ({ position, label, sublabel, align = 'left' }: any) => {
    const points = useMemo(() => new Float32Array([0, -0.3, 0, align === 'left' ? -0.8 : 0.8, -0.3, 0]), [align]);
    return (
        <group position={position}>
            <Html
                position={[align === 'left' ? -0.8 : 0.8, 0, 0]}
                transform
                occlude
                style={{
                    pointerEvents: 'none',
                    transform: `translate3d(${align === 'left' ? '-100%' : '0'}, -50%, 0)`,
                    textAlign: align as any
                }}
            >
                <div className="flex flex-col" style={{ alignItems: align === 'left' ? 'flex-end' : 'flex-start', width: '200px' }}>
                    <span className="text-[14px] font-black text-blue-500 uppercase tracking-widest whitespace-nowrap">{label}</span>
                    <span className="text-[10px] text-white/60 font-mono uppercase whitespace-nowrap">{sublabel}</span>
                </div>
            </Html>
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={2}
                        array={points}
                        itemSize={3}
                        args={[points, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={HUD_COLORS.primary} transparent opacity={0.2} />
            </line>
        </group>
    );
};

const getRandomPointInPolygon = (points: [number, number][]): [number, number] => {
    if (points.length < 3) return [0, 0];

    // Centroid
    let cx = 0, cy = 0;
    points.forEach(p => { cx += p[0]; cy += p[1]; });
    cx /= points.length;
    cy /= points.length;

    // Pick a random triangle in the fan from centroid
    const idx = Math.floor(Math.random() * (points.length - 1));
    const p1 = points[idx];
    const p2 = points[idx + 1];

    // Random point in triangle (Barycentric)
    let r1 = Math.random();
    let r2 = Math.random();
    if (r1 + r2 > 1) {
        r1 = 1 - r1;
        r2 = 1 - r2;
    }

    const x = cx + r1 * (p1[0] - cx) + r2 * (p2[0] - cx);
    const y = cy + r1 * (p1[1] - cy) + r2 * (p2[1] - cy);

    return [x, y];
};

const Spark = ({ position, color, onMount }: { position: [number, number, number], color: string, onMount: () => () => void }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [opacity, setOpacity] = useState(1);
    const [scale, setScale] = useState(1);

    useEffect(onMount, []);

    useFrame(() => {
        if (meshRef.current) {
            setOpacity(prev => prev * 0.92); // Fade out opacity
            setScale(prev => prev * 0.95); // Shrink size
        }
    });

    return (
        <mesh position={position} ref={meshRef} scale={scale}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={15}
                transparent
                opacity={opacity}
            />
            <pointLight distance={1} intensity={15 * opacity} color={color} />
        </mesh>
    );
};

const VoronoiCell = ({ points, color, label, active, onHover, count, activeZone, onPointerEnter, onPointerLeave, pulse }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [sparks, setSparks] = useState<Array<{ id: number; position: [number, number, number]; color: string }>>([]);
    const sparkId = useRef(0);

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

    const lineArray = useMemo(() => {
        if (!points || points.length === 0) return new Float32Array(0);
        const arr = [];
        for (const p of points) arr.push(p[0], p[1], 0.01);
        arr.push(points[0][0], points[0][1], 0.01);
        return new Float32Array(arr);
    }, [points]);

    const centroid = useMemo(() => {
        if (!points || points.length === 0) return [0, 0, 0];
        let x = 0, y = 0;
        points.forEach((p: [number, number]) => { x += p[0]; y += p[1]; });
        return [x / points.length, y / points.length, 0.2];
    }, [points]);

    useEffect(() => {
        if (pulse) {
            const [x, y] = getRandomPointInPolygon(points);
            const id = sparkId.current++;
            setSparks(prev => [
                ...prev,
                { id, position: [x, y, 0.5], color: color }
            ]);
        }
    }, [pulse, points, color]);

    useFrame(() => {
        if (meshRef.current) {
            const targetZ = active ? 0.6 : 0;
            meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
        }
    });

    if (!points || points.length === 0) return null;

    return (
        <group>
            <mesh
                ref={meshRef}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onHover(label);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    onHover(null);
                }}
                onPointerEnter={(e) => {
                    e.stopPropagation();
                    onPointerEnter(label);
                }}
                onPointerLeave={(e) => {
                    e.stopPropagation();
                    onPointerLeave(null);
                }}
            >
                <shapeGeometry args={[shape]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={active ? 4 : 0.3}
                    transparent
                    opacity={active ? 0.95 : 0.25}
                    side={THREE.DoubleSide}
                />

                <line>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={points.length + 1}
                            array={lineArray}
                            itemSize={3}
                            args={[lineArray, 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color={color} transparent opacity={active ? 1 : 0.3} />
                </line>

                {(active || activeZone === label) && (
                    <Html position={[0, 0, 0.5]} center pointerEvents="none">
                        <div className={`px-2 py-1 rounded backdrop-blur-md border ${activeZone === label ? 'border-white bg-white/10' : 'border-white/20 bg-black/40'}`}>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                {CLUSTER_TRANSLATIONS[label] || label}
                            </div>
                            <div className="text-[7px] text-white/60 font-mono text-center">{Math.round(count)} ЮНИТОВ</div>
                        </div>
                    </Html>
                )}
            </mesh>

            {sparks.map(spark => (
                <Spark
                    key={spark.id}
                    position={spark.position}
                    color={spark.color}
                    onMount={() => {
                        const timer = setTimeout(() => {
                            setSparks(prev => prev.filter(s => s.id !== spark.id));
                        }, 1000);
                        return () => clearTimeout(timer);
                    }}
                />
            ))}


            {/* Persistent Data Label (Numerical) */}
            <Text
                position={[centroid[0], centroid[1], active ? centroid[2] + 0.6 : centroid[2]]}
                fontSize={active ? 0.25 : 0.18}
                color="white"
                fillOpacity={active ? 1 : 0.4}
                anchorX="center"
                anchorY="middle"
            >
                {count}
            </Text>

            {active && (
                <Html position={[centroid[0], centroid[1] - 0.5, 1]} center pointerEvents="none" zIndexRange={[100, 0]}>
                    <div className="text-[14px] font-black text-blue-500 uppercase tracking-widest whitespace-nowrap" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        {CLUSTER_TRANSLATIONS[label] || label.toUpperCase()}
                    </div>
                </Html>
            )}
        </group>
    );
};

export const StrategicVoronoiMap: React.FC = () => {
    const { clusterMetrics } = useSimulation();
    const [hovered, setHovered] = useState<string | null>(null);
    const [activeZone, setActiveZone] = useState<string | null>(null);
    const prevCounts = useRef<Record<string, number>>({});
    const [pulses, setPulses] = useState<Record<string, boolean>>({});

    // Track activity bursts
    React.useEffect(() => {
        const newPulses: Record<string, boolean> = {};
        let hasChanges = false;

        clusterMetrics.forEach(m => {
            const prev = prevCounts.current[m.name] || 0;
            if (m.activeUnits > prev) {
                newPulses[m.name] = true;
                hasChanges = true;
            }
            prevCounts.current[m.name] = m.activeUnits;
        });

        if (hasChanges) {
            setPulses(newPulses);
            const timer = setTimeout(() => setPulses({}), 300);
            return () => clearTimeout(timer);
        }
    }, [clusterMetrics]);

    const activeMetrics = useMemo(() => {
        return clusterMetrics.filter(m => m.activeUnits > 0);
    }, [clusterMetrics]);
    const cells = useMemo(() => {
        const count = activeMetrics.length;
        if (count === 0) return [];

        const width = 16;
        const height = 12;

        const points = activeMetrics.map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const r = 3.5 + Math.sin(i * 1.5) * 1.5;
            const jitterX = Math.sin(i * 31.5) * 0.8;
            const jitterY = Math.cos(i * 24.2) * 0.8;

            return [
                Math.cos(angle) * r + jitterX,
                Math.sin(angle) * r + jitterY
            ] as MapPoint;
        });

        try {
            const delaunay = Delaunay.from(points);
            const voronoi = delaunay.voronoi([-width / 3, -height / 3, width / 3, height / 3]);

            return activeMetrics.map((m, i) => ({
                name: m.name,
                points: Array.from(voronoi.cellPolygon(i) || []),
                color: CLUSTER_COLORS[m.name] || '#ffffff',
                intensity: m.activeUnits,
                activeUnits: m.activeUnits
            }));
        } catch (e) {
            console.error('Voronoi Error:', e);
            return [];
        }
    }, [activeMetrics]);

    const activeCell = clusterMetrics.find(m => m.name === hovered);

    if (clusterMetrics.length === 0) {
        return (
            <div className="w-full h-full bg-[#010101] rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-white/20 text-[10px] uppercase font-black tracking-widest">Стыковка...</span>
            </div>
        );
    }

    const sortedForLegend = [...clusterMetrics]
        .filter(m => m.activeUnits > 0)
        .sort((a, b) => b.activeUnits - a.activeUnits)
        .slice(0, 8);

    return (
        <div className="w-full h-full bg-[#00050a] rounded-2xl overflow-hidden border border-blue-900/10 relative group shadow-[inset_0_0_70px_rgba(0,10,20,0.9)]">
            <div className="absolute top-5 left-6 z-10 pointer-events-none">
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.6em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
                    ПОНТОН: АРХИПЕЛАГ_v5
                </h3>
                <p className="text-[7px] text-blue-300/30 mt-1 font-mono uppercase tracking-[0.1em]">Гибкое Распределение Доменов</p>
            </div>

            <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, -12, 18], fov: 32 }}>
                <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.3} minPolarAngle={Math.PI / 4} enablePan={false} />
                <ambientLight intensity={1.5} />
                <pointLight position={[5, 10, 10]} intensity={3} color={HUD_COLORS.secondary} />

                <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.4}>
                    <group rotation={[-Math.PI / 10, 0, 0]}>
                        {cells.map((cell) => (
                            <VoronoiCell
                                key={cell.name}
                                points={cell.points}
                                color={cell.color}
                                label={cell.name}
                                count={cell.intensity}
                                active={hovered === cell.name}
                                pulse={pulses[cell.name]}
                                onHover={setHovered}
                                activeZone={activeZone}
                                onPointerEnter={setActiveZone}
                                onPointerLeave={setActiveZone}
                            />
                        ))}

                        <TechnicalCallout position={[-6.5, 4, 0]} label="Синхр Волны" sublabel="Канал v1.2" align="left" />
                        <TechnicalCallout position={[6.5, 4, 0]} label="Нагрузка Прилива" sublabel="Энтропия Потока" align="right" />
                        <TechnicalCallout position={[-6.5, -4, 0]} label="Закреплено" sublabel="99.98% ОК" align="left" />
                        <TechnicalCallout position={[6.5, -4, 0]} label="Маяк" sublabel="Активное Сканирование" align="right" />

                        <gridHelper args={[24, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
                            <meshBasicMaterial color="#00ffff" transparent opacity={0.02} />
                        </gridHelper>
                    </group>
                </Float>
            </Canvas>

            <div className="absolute top-5 right-6 text-right pointer-events-none">
                <div className="text-[16px] font-black text-white tabular-nums tracking-tighter">
                    {activeCell ? activeCell.activeUnits : 'ОЖИДАНИЕ'}
                </div>
                <div className="text-[7px] text-blue-300/30 uppercase font-black tracking-widest mt-0.5">
                    {activeCell && hovered ? `${CLUSTER_TRANSLATIONS[hovered] || hovered} ЕМКОСТЬ` : 'ВЫБЕРИТЕ ОСТРОВ'}
                </div>
            </div>

            <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="flex gap-4">
                    {sortedForLegend.map(m => (
                        <div key={m.name} className="flex flex-col gap-1">
                            <div className="w-10 h-0.5 bg-blue-900/10 overflow-hidden">
                                <div className="h-full" style={{ width: '100%', backgroundColor: CLUSTER_COLORS[m.name] }} />
                            </div>
                            <span className="text-[6px] font-black text-blue-300/20 uppercase tracking-tighter">
                                {(CLUSTER_TRANSLATIONS[m.name] || m.name).slice(0, 3)}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black text-cyan-400/80 tabular-nums uppercase tracking-widest border border-cyan-400/20 px-2 py-0.5 rounded-sm bg-cyan-900/10">СТАБИЛЬНЫЙ_ПОТОК</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
