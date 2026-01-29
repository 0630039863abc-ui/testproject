import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import type { ClusterType } from '../../types';

const ClusterSphere = ({
    position,
    color,
    label,
    size,
    anomalies,
    isActive,
    onClick
}: {
    position: [number, number, number];
    color: string;
    label: string;
    size: number;
    anomalies: number;
    isActive: boolean;
    onClick: () => void;
}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;

            if (isActive) {
                const scale = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
                meshRef.current.scale.set(scale, scale, scale);
                meshRef.current.rotation.x += 0.02; // Spin faster if active
            } else {
                meshRef.current.scale.set(1, 1, 1);
                meshRef.current.rotation.x += 0.002;
            }
        }
    });

    const hasAnomalies = anomalies > 3;

    return (
        <Float speed={isActive ? 4 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
                <mesh ref={meshRef}>
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshStandardMaterial
                        color={hasAnomalies ? "#ef4444" : color}
                        roughness={0.1}
                        metalness={0.6}
                        emissive={hasAnomalies ? "#ef4444" : (isActive ? color : '#000000')}
                        emissiveIntensity={hasAnomalies ? 0.8 : (isActive ? 0.5 : 0)}
                        transparent
                        opacity={0.9}
                    />
                </mesh>
                <Text
                    position={[0, size + 0.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {label}
                </Text>
                {hasAnomalies && (
                    <Text
                        position={[0, size + 1.2, 0]}
                        fontSize={0.3}
                        color="#ef4444"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ⚠ ANOMALY
                    </Text>
                )}
                {isActive && (
                    <mesh position={[0, -size - 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[size * 1.2, size * 1.4, 32]} />
                        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.5} />
                    </mesh>
                )}
            </group>
        </Float>
    );
};

export const RegionalMap: React.FC<{ onSelect: (c: ClusterType) => void }> = ({ onSelect }) => {
    const { clusterMetrics, activeZone, setActiveZone } = useSimulation();

    // Map 6 clusters to 3D positions
    // We can use a ring or a 2x3 grid. Let's do a 2x3 grid style or Ring.
    // Let's stick to the visual layout of "Science/Tech" etc.
    // Positions:
    // Science [-3, 2], Technology [-3, -2]
    // Economics [0, 2], Society [0, -2] (Middle)
    // Politics [3, 2], Art [3, -2]

    // Actually, let's align somewhat with the Venue map (Hexagon) but flattened for the Admin dashboard view.

    const positions: Record<string, [number, number, number]> = {
        'Science': [-4, 2, 0],
        'Technology': [-4, -2, 0],
        'Economics': [0, 2, 0],
        'Society': [0, -2, 0],
        'Politics': [4, 2, 0],
        'Art': [4, -2, 0]
    };

    const colors: Record<string, string> = {
        'Science': '#3b82f6',
        'Technology': '#06b6d4',
        'Economics': '#f59e0b',
        'Society': '#10b981',
        'Politics': '#ef4444',
        'Art': '#8b5cf6'
    };

    const handleClusterClick = (c: ClusterType) => {
        onSelect(c); // Update local selection for sidebar details
        setActiveZone(c); // Update global simulation context
    };

    return (
        <div className="w-full h-full relative" onClick={() => setActiveZone(null)}>
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />

                {clusterMetrics.map((metric) => (
                    <ClusterSphere
                        key={metric.name}
                        position={positions[metric.name] || [0, 0, 0]}
                        color={colors[metric.name] || '#ffffff'}
                        label={metric.name}
                        size={1 + (metric.activeUnits / 1000)} // Dynamic size
                        anomalies={metric.anomalies}
                        isActive={activeZone === metric.name}
                        onClick={() => handleClusterClick(metric.name as ClusterType)}
                    />
                ))}

            </Canvas>
            <div className="absolute top-4 left-4 pointer-events-none">
                <h3 className="text-white font-bold opacity-50">REGIONAL CONTROL // {activeZone ? activeZone.toUpperCase() : 'ALL ZONES'}</h3>
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none">
                <p className="text-[10px] text-gray-500">CLICK SPHERE TO FOCUS SIMULATION</p>
            </div>
        </div>
    );
};
