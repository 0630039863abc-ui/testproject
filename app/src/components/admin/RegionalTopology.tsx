import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import type { ClusterType } from '../../types';

const ClusterNode = ({ position, label, size, onClick, color, intensity }: any) => {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float floatIntensity={2} rotationIntensity={0.5} speed={1.5}>
            <group position={position} onClick={onClick}>
                <mesh ref={mesh}>
                    <icosahedronGeometry args={[size, 1]} />
                    <MeshDistortMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={intensity}
                        distort={0.4}
                        speed={2}
                        roughness={0}
                        metalness={0.9}
                    />
                </mesh>

                {/* Label */}
                <Text
                    position={[0, size + 0.8, 0]}
                    fontSize={0.4}
                    color="white"
                    font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0pnF8R-0.woff2"
                >
                    {label.toUpperCase()}
                </Text>

                {/* Connection Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[size * 1.5, 0.02, 16, 100]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
            </group>
        </Float>
    );
};

export const RegionalTopology: React.FC<{ onSelect: (c: ClusterType) => void; selected: ClusterType }> = ({ onSelect, selected }) => {
    const { clusterMetrics } = useSimulation();

    // Helper to get metrics for a cluster
    const getClusterMetrics = (name: string) => clusterMetrics.find(c => c.name === name);

    // Calculate dynamic props based on active units
    const getNodeProps = (name: string, baseSize: number) => {
        const metrics = getClusterMetrics(name);
        const units = metrics?.activeUnits || 10;
        // Scale size slightly with units (max +50%)
        const dynamicSize = baseSize + (units / 100) * 0.5;
        // Brightness scales with units
        const intensity = 0.5 + (units / 50);

        return { size: dynamicSize, intensity };
    };

    return (
        <div className="w-full h-full relative rounded-2xl overflow-hidden glass-panel">
            <Canvas camera={{ position: [0, 0, 12] }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#10B981" />

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

                {/* Central Hub */}
                <ClusterNode
                    position={[-4, 2, 0]}
                    label="Science"
                    {...getNodeProps('Science', 1.5)}
                    color="#3B82F6"
                    active={selected === 'Science'}
                    onClick={() => onSelect('Science')}
                />

                <ClusterNode
                    position={[4, 2, 0]}
                    label="Creative"
                    {...getNodeProps('Creative', 1.2)}
                    color="#8B5CF6"
                    active={selected === 'Creative'}
                    onClick={() => onSelect('Creative')}
                />

                <ClusterNode
                    position={[-4, -3, 0]}
                    label="Social"
                    {...getNodeProps('Social', 1.3)}
                    color="#F59E0B"
                    active={selected === 'Social'}
                    onClick={() => onSelect('Social')}
                />

                <ClusterNode
                    position={[4, -3, 0]}
                    label="Bio"
                    {...getNodeProps('Bio', 1.4)}
                    color="#10B981"
                    active={selected === 'Bio'}
                    onClick={() => onSelect('Bio')}
                />

                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
                </EffectComposer>
            </Canvas>

            <div className="absolute top-4 left-4 pointer-events-none">
                <h3 className="text-emerald-400 font-mono text-sm tracking-widest border border-emerald-500/30 px-2 py-1 bg-emerald-900/20 rounded">
                    LIVE_TOPOLOGY
                </h3>
            </div>
        </div>
    );
};
