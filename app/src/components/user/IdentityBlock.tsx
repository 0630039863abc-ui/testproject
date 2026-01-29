import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { Shield, CheckCircle } from 'lucide-react';

const DNAHelix = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.getElapsedTime() * 0.5;
        }
    });

    return (
        <Float floatIntensity={2} rotationIntensity={0.5}>
            <group ref={group}>
                {Array.from({ length: 20 }).map((_, i) => {
                    const y = (i - 10) * 0.4;
                    const angle = i * 0.5;
                    const x1 = Math.cos(angle);
                    const z1 = Math.sin(angle);
                    return (
                        <group key={i} position={[0, y, 0]}>
                            {/* Strand 1 */}
                            <mesh position={[x1, 0, z1]}>
                                <sphereGeometry args={[0.1, 8, 8]} />
                                <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
                            </mesh>
                            {/* Strand 2 */}
                            <mesh position={[-x1, 0, -z1]}>
                                <sphereGeometry args={[0.1, 8, 8]} />
                                <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={0.5} />
                            </mesh>
                            {/* Connector */}
                            <mesh rotation={[0, -angle, 0]} scale={[2, 0.05, 0.05]}>
                                <boxGeometry />
                                <meshStandardMaterial color="#FFFFFF" opacity={0.3} transparent />
                            </mesh>
                        </group>
                    );
                })}
            </group>
        </Float>
    );
};

export const IdentityBlock: React.FC = () => {
    const { currentUser } = useSimulation();

    return (
        <div className="h-full w-full flex flex-col glass-panel rounded-2xl relative overflow-hidden group">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-50">
                <Canvas camera={{ position: [0, 0, 8] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} color="#3B82F6" intensity={1} />
                    <DNAHelix />
                    <Environment preset="city" />
                </Canvas>
            </div>

            <div className="relative z-10 p-6 flex flex-col h-full justify-end bg-gradient-to-t from-black/90 to-transparent">
                <div className="mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-blue-500/50 bg-black/50 backdrop-blur flex items-center justify-center mb-4">
                        <span className="text-xl font-mono text-blue-400">ID</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{currentUser.name}</h1>
                    <div className="flex items-center gap-2 text-blue-400 mt-1 font-mono-data text-sm">
                        <Shield size={14} />
                        <span>{currentUser.role}</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle size={12} /> Verified
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-blue-500/30 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-blue-500/30 rounded-br-xl" />
        </div>
    );
};
