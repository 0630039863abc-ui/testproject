import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ClusterType } from '../types';
import { CLUSTER_TRANSLATIONS, CLUSTER_COLORS } from '../shared/lib/tokens';

const MovingParticle = ({ color }: { color: string }) => {
    const ref = useRef<THREE.Mesh>(null);
    const offset = useMemo(() => Math.random() * 100, []);
    const speed = useMemo(() => 0.5 + Math.random() * 0.5, []);
    const pathRadius = useMemo(() => 4 + Math.random() * 4, []);

    useFrame((state) => {
        if (ref.current) {
            const time = state.clock.getElapsedTime() + offset;
            const t = time * speed;
            ref.current.position.x = Math.cos(t) * pathRadius;
            ref.current.position.z = Math.sin(t) * pathRadius;
            ref.current.position.y = Math.sin(t * 2) * 0.5 + 0.5;
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
    );
};

const ZonePlate = ({
    position,
    color,
    label,
    isActive
}: {
    position: [number, number, number],
    color: string,
    label: string,
    isActive: boolean
}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current && isActive) {
            // Pulse effect for active zone
            meshRef.current.position.y = 0.2 + Math.sin(state.clock.getElapsedTime() * 4) * 0.05;
            meshRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.02);
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef} position={[0, 0.2, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 0.15, 6]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isActive ? 1.5 : 0.4}
                    transparent
                    opacity={0.9}
                />
            </mesh>
            <Text
                position={[0, 1.2, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
                fillOpacity={isActive ? 1 : 0.4}
            >
                {label.toUpperCase()}
            </Text>
            {isActive && (
                <group position={[0, 0.5, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[1.3, 1.4, 6]} />
                        <meshBasicMaterial color={color} transparent opacity={0.5} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

const VenueModel = ({ activeCluster }: { activeCluster: string | null }) => {
    // Use CLUSTER_COLORS from tokens for consistency
    const clusters: { name: ClusterType, color: string, angle: number }[] = [
        { name: 'Science', color: CLUSTER_COLORS['Science'], angle: 0 },
        { name: 'Technology', color: CLUSTER_COLORS['Technology'], angle: 60 },
        { name: 'Economics', color: CLUSTER_COLORS['Economics'], angle: 120 },
        { name: 'Society', color: CLUSTER_COLORS['Society'], angle: 180 },
        { name: 'Politics', color: CLUSTER_COLORS['Politics'], angle: 240 },
        { name: 'Art', color: CLUSTER_COLORS['Art'], angle: 300 },
    ];

    const radius = 5;

    return (
        <group position={[0, -1, 0]}>
            {/* Floor Grid */}
            <gridHelper args={[20, 20, '#1e293b', '#0f172a']} position={[0, -0.1, 0]} />

            {/* Central Core */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.5, 1.8, 0.1, 32]} />
                <meshStandardMaterial color="#000" emissive="#3b82f6" emissiveIntensity={0.1} />
            </mesh>

            {clusters.map((c) => {
                const rad = (c.angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const z = Math.sin(rad) * radius;

                return (
                    <ZonePlate
                        key={c.name}
                        position={[x, 0, z]}
                        color={c.color}
                        label={CLUSTER_TRANSLATIONS[c.name] || c.name}
                        isActive={activeCluster === c.name}
                    />
                );
            })}

            {/* Connecting Frame (Hexagon) */}
            <lineSegments rotation={[0, Math.PI / 6, 0]}>
                <edgesGeometry args={[new THREE.CylinderGeometry(radius, radius, 0.05, 6)]} />
                <lineBasicMaterial color="#334155" transparent opacity={0.3} />
            </lineSegments>

            {/* Particles representing Residents */}
            {Array.from({ length: 25 }).map((_, i) => {
                const homeCluster = clusters[i % clusters.length];
                return <MovingParticle key={i} color={homeCluster.color} />;
            })}
        </group>
    );
};

export const VenueScene: React.FC<{ activeCluster: string | null }> = ({ activeCluster }) => {
    return (
        <div className="w-full h-full bg-[#050505]">
            <Canvas shadows={false} gl={{ antialias: false, alpha: false }}>
                <PerspectiveCamera makeDefault position={[0, 10, 12]} fov={40} />
                <OrbitControls
                    enableZoom={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.5}
                />

                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
                <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={1} castShadow={false} />

                <VenueModel activeCluster={activeCluster} />

                <Environment preset="night" />
            </Canvas>
        </div>
    );
};
