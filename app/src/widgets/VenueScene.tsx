import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Line, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../shared/lib/tokens';
import type { ClusterType } from '../types';

// --- Configuration ---
const RADIUS = 6;
const CLUSTERS: { name: ClusterType, color: string, angle: number }[] = [
    { name: 'Science', color: CLUSTER_COLORS['Science'], angle: 0 },
    { name: 'Technology', color: CLUSTER_COLORS['Technology'], angle: 60 },
    { name: 'Economics', color: CLUSTER_COLORS['Economics'], angle: 120 },
    { name: 'Society', color: CLUSTER_COLORS['Society'], angle: 180 },
    { name: 'Politics', color: CLUSTER_COLORS['Politics'], angle: 240 },
    { name: 'Art', color: CLUSTER_COLORS['Art'], angle: 300 },
];

// --- Helpers ---
const getCoords = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return new THREE.Vector3(Math.cos(rad) * RADIUS, 0, Math.sin(rad) * RADIUS);
};

const getLoad = (metrics: any, name: string) => {
    if (!Array.isArray(metrics)) return 0;
    const m = metrics.find((m: any) => m.name === name);
    if (!m) return 0;
    return Math.min(m.activeUnits / 500, 1);
};

// --- Components ---

// 1. Holographic Node (PBR Glass + Emissive Core)
const HolographicNode = ({ position, color, label, load }: { position: THREE.Vector3, color: string, label: string, load: number }) => {
    const pct = Math.round(load * 100);
    const height = Math.max(0.1, load * 4);

    return (
        <group position={position}>
            {/* Base Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1, 1.05, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Glassy Exterior */}
                <mesh position={[0, height / 2, 0]}>
                    <boxGeometry args={[0.8, height, 0.8]} />
                    <meshPhysicalMaterial
                        color={color}
                        transparent
                        roughness={0.1}
                        metalness={0.1}
                        transmission={0.9} // Glass effect
                        thickness={1} // Refraction
                        emissive={color}
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* Inner Emissive Core (The "Data") */}
                <mesh position={[0, height / 2, 0]}>
                    <boxGeometry args={[0.4, height * 0.8, 0.4]} />
                    <meshStandardMaterial color="white" emissive={color} emissiveIntensity={2} />
                </mesh>

                {/* Vertical Laser Beams */}
                <mesh position={[0, 2.5, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 5, 8]} />
                    <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
                </mesh>
            </Float>

            {/* Floating Label */}
            <group position={[0, 4.5, 0]}>
                <Text
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.02}
                    outlineColor="black"
                >
                    {CLUSTER_TRANSLATIONS[label] || label}
                </Text>
                {pct > 0 && (
                    <Text position={[0, -0.3, 0]} fontSize={0.25} color={color} anchorX="center" anchorY="top">
                        {pct}% LOAD
                    </Text>
                )}
            </group>
        </group>
    );
};

// 2. Energy Bridge (Curved Line)
const EnergyBridge = ({ start, end, weight, color }: { start: THREE.Vector3, end: THREE.Vector3, weight: number, color: string }) => {
    const points = useMemo(() => {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.y += 3 + weight * 4; // Arch height varies by weight
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        return curve.getPoints(20);
    }, [start, end, weight]);

    const ref = useRef<any>(null);
    useFrame(() => {
        if (ref.current) {
            // Pulse the dashed line by offsetting texture
            ref.current.material.dashOffset -= 0.01 * (1 + weight);
        }
    });

    return (
        <Line
            ref={ref}
            points={points}
            color={color}
            lineWidth={Math.max(1, weight * 3)}
            dashed
            dashScale={2}
            dashSize={0.5}
            dashOffset={0}
            opacity={0.6 + weight * 0.4}
            transparent
        />
    );
};

// 3. Neural Traffic (Particles)
const Particle = ({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) => {
    const ref = useRef<THREE.Mesh>(null);
    const speed = 0.5 + Math.random() * 0.5;
    const offset = Math.random() * 100;

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();
        const progress = (t * speed + offset) % 1;

        // Follow the same arc logic (simplified linear lerp + simple arc)
        const pos = new THREE.Vector3().lerpVectors(start, end, progress);
        pos.y += Math.sin(progress * Math.PI) * 3;
        ref.current.position.copy(pos);

        const scale = Math.sin(progress * Math.PI) * 1.5;
        ref.current.scale.setScalar(scale);
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
    );
};

const NeuralTraffic = () => {
    // Generate static paths for demo traffic
    const paths = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => {
            const start = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
            let end = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
            while (start === end) end = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
            return { id: i, start: getCoords(start.angle), end: getCoords(end.angle), color: start.color };
        });
    }, []);

    return (
        <group>
            {paths.map(p => <Particle key={p.id} {...p} />)}
        </group>
    );
};

// --- Main Scene ---
export const VenueScene: React.FC<{ activeCluster: string | null, clusterMetrics?: any, graphStats?: any }> = ({ clusterMetrics = [], graphStats }) => {
    return (
        <div className="w-full h-full relative">
            <Canvas gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }} dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[10, 12, 14]} fov={45} />
                <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.1} />

                {/* Lighting for PBR */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#4f46e5" />
                <pointLight position={[-10, 10, -10]} intensity={2} color="#ec4899" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Suspense fallback={null}>
                    <group position={[0, -1, 0]}>

                        {/* 1. Clusters */}
                        {CLUSTERS.map(c => (
                            <HolographicNode
                                key={c.name}
                                position={getCoords(c.angle)}
                                color={c.color}
                                label={c.name}
                                load={getLoad(clusterMetrics, c.name)}
                            />
                        ))}

                        {/* 2. Edges (Graph Theory) */}
                        {graphStats?.edges?.map((edge: any, i: number) => {
                            const start = CLUSTERS.find(c => c.name === edge.source);
                            const end = CLUSTERS.find(c => c.name === edge.target);
                            if (!start || !end) return null;
                            return (
                                <EnergyBridge
                                    key={`edge-${i}`}
                                    start={getCoords(start.angle)}
                                    end={getCoords(end.angle)}
                                    weight={edge.weight}
                                    color={start.color}
                                />
                            );
                        })}

                        {/* 3. Traffic */}
                        <NeuralTraffic />

                        {/* 4. Floor Grid */}
                        <gridHelper args={[40, 40, '#222', '#050505']} position={[0, -0.01, 0]} />
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
                            <circleGeometry args={[20]} />
                            <meshBasicMaterial color="#000000" opacity={0.8} transparent />
                        </mesh>
                    </group>
                </Suspense>
            </Canvas>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
    );
};
