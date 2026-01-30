import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_COLORS } from '../../../shared/lib/tokens';

const VoronoiCell = ({ position, color, size, intensity }: { position: [number, number, number], color: string, size: number, intensity: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.1;
        }
        if (glowRef.current) {
            glowRef.current.scale.setScalar(1.2 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1);
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[size, 1]} />
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.3}
                    emissive={color}
                    emissiveIntensity={intensity}
                    roughness={0}
                    metalness={0.8}
                />
            </mesh>
            {/* Glow Aura */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[size * 1.5, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.1 * intensity} />
            </mesh>
        </group>
    );
};

export const DomainHeatmap: React.FC = () => {
    const { logs } = useSimulation();

    const cellsData = useMemo(() => {
        const counts = logs.reduce((acc, log) => {
            acc[log.cluster] = (acc[log.cluster] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const clusters = Object.entries(CLUSTER_COLORS);
        return clusters.map(([name, color], idx) => {
            const angle = (idx / clusters.length) * Math.PI * 2;
            const radius = 4;
            const count = counts[name] || 1;
            const size = 0.5 + (count / 20);

            return {
                name,
                color,
                position: [Math.cos(angle) * radius, Math.sin(angle) * (radius * 0.5), 0] as [number, number, number],
                size,
                intensity: 0.5 + (count / 10)
            };
        });
    }, [logs]);

    return (
        <div className="h-full w-full bg-black/40 border border-white/10 rounded-xl overflow-hidden relative group">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Нейро_Теплокарта_3D</h3>
            </div>

            <Canvas shadows={false}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <group>
                        {cellsData.map((cell) => (
                            <VoronoiCell
                                key={cell.name}
                                position={cell.position}
                                color={cell.color}
                                size={cell.size}
                                intensity={cell.intensity}
                            />
                        ))}
                    </group>
                </Float>

                <Environment preset="night" />
            </Canvas>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,0,255,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]"></div>
        </div>
    );
};
