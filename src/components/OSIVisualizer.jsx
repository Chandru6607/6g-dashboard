'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import './OSIVisualizer.css';

const osiLayers = [
    { id: 7, name: 'Application', desc: 'AI Intent Prediction & Services', color: '#ff4444' },
    { id: 6, name: 'Presentation', desc: 'AI Semantic Compression', color: '#ff8800' },
    { id: 5, name: 'Session', desc: 'AI Session Optimization', color: '#ffcc00' },
    { id: 4, name: 'Transport', desc: 'AI Traffic Shaping', color: '#76b900' },
    { id: 3, name: 'Network', desc: 'AI Intelligent Routing', color: '#00ccff' },
    { id: 2, name: 'Data Link', desc: 'AI MAC Scheduling', color: '#0066ff' },
    { id: 1, name: 'Physical', desc: 'AI Beamforming / PHY', color: '#8b5cf6' },
];

const totalLayers = osiLayers.length;
const layerHeight = 1.2;
const spacing = 0.2;

// Improved Camera Controller: Flies to offset view, then yields to user control
const CameraController = ({ activeLayer }) => {
    const previousLayer = useRef(activeLayer);
    const hasArrived = useRef(false);

    useFrame((state) => {
        if (previousLayer.current !== activeLayer) {
            hasArrived.current = false;
            previousLayer.current = activeLayer;
        }

        if (hasArrived.current) return; // Yield full control to user OrbitControls

        const targetPos = new THREE.Vector3();

        if (activeLayer) {
            // Zoom into specific layer, but leave room for the sidebox
            const layerIndex = osiLayers.findIndex(l => l.id === activeLayer);
            const yPos = (totalLayers - 1 - layerIndex) * (layerHeight + spacing);

            targetPos.set(4, yPos + 2, 10); // Offset to the right

            state.camera.position.lerp(targetPos, 0.05);
            if (state.camera.position.distanceTo(targetPos) < 0.1) {
                hasArrived.current = true;
            }
        } else {
            // Default wide view
            targetPos.set(12, 10, 18);
            state.camera.position.lerp(targetPos, 0.03);
            if (state.camera.position.distanceTo(targetPos) < 0.1) {
                hasArrived.current = true;
            }
        }
    });
    return null;
};

// Individual 3D Pyramid Layer (Frustum)
const PyramidLayer = ({ layer, index, isActive, onClick }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Calculate dimensions to form a pyramid shape
    const bottomRadius = 4 - (index * 0.4);
    const topRadius = bottomRadius - 0.35;
    const yPos = index * (layerHeight + spacing);

    // Subtle rotation when not clicked
    useFrame((state) => {
        if (!isActive && meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
        } else if (isActive && meshRef.current) {
            meshRef.current.rotation.y += 0.005; // Slow spin when focused
        }
    });

    return (
        <group position={[0, yPos, 0]}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(isActive ? null : layer.id);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Cylinder with 4 segments = Square frustum */}
                <cylinderGeometry args={[topRadius, bottomRadius, layerHeight, 4]} />

                {/* Main Glass Material */}
                <meshPhysicalMaterial
                    color={layer.color}
                    emissive={layer.color}
                    emissiveIntensity={isActive ? 0.8 : hovered ? 0.4 : 0.1}
                    transparent
                    opacity={isActive ? 0.9 : 0.6}
                    roughness={0.1}
                    metalness={0.8}
                    clearcoat={1}
                />
            </mesh>

            {/* Wireframe Outline for tech feel */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[topRadius + 0.01, bottomRadius + 0.01, layerHeight + 0.01, 4]} />
                <meshBasicMaterial color={layer.color} wireframe transparent opacity={hovered || isActive ? 0.5 : 0.1} />
            </mesh>

            {/* Layer HTML Label (Always visible, fades when active) */}
            <Html position={[-(bottomRadius + 1.5), 0, 0]} center style={{ opacity: isActive ? 0 : 1, transition: 'opacity 0.3s' }}>
                <div className="layer-label-3d" style={{ borderColor: layer.color, color: layer.color }}>
                    <strong>L{layer.id}</strong> {layer.name}
                </div>
            </Html>

            {/* Active Details Overlay (Visible only when clicked) */}
            {isActive && (
                <>
                    {/* Glowing Pointer Line */}
                    <Line
                        points={[[topRadius, layerHeight / 2, 0], [topRadius + 3, layerHeight / 2 + 1, 0]]}
                        color={layer.color}
                        lineWidth={2}
                        transparent
                        opacity={0.8}
                    />
                    {/* Floating Side Info Box */}
                    <Html position={[topRadius + 3, layerHeight / 2 + 1, 0]} center zIndexRange={[100, 0]}>
                        <div className="layer-detail-card" style={{ boxShadow: `0 0 30px ${layer.color}44`, border: `1px solid ${layer.color}` }}>
                            <div className="card-header" style={{ borderBottom: `2px solid ${layer.color}` }}>
                                <h3>Layer {layer.id}: {layer.name}</h3>
                            </div>
                            <div className="card-body">
                                <div className="ai-service-badge" style={{ background: `${layer.color}11`, color: layer.color, borderColor: layer.color }}>
                                    <span className="pulse-dot" style={{ background: layer.color, boxShadow: `0 0 8px ${layer.color}` }}></span>
                                    {layer.desc}
                                </div>
                                <div className="detailed-list">
                                    <div className="list-item">
                                        <span className="check" style={{ color: layer.color }}>✓</span> Autonomous Scaling
                                    </div>
                                    <div className="list-item">
                                        <span className="check" style={{ color: layer.color }}>✓</span> Quantum Encryption
                                    </div>
                                    <div className="list-item">
                                        <span className="check" style={{ color: layer.color }}>✓</span> Zero-Touch Provisioning
                                    </div>
                                </div>
                                <p className="card-desc">Click background to reset camera</p>
                            </div>
                        </div>
                    </Html>
                </>
            )}
        </group>
    );
};

// Data Linkage Particles
const DataFlowParticles = () => {
    const particles = useRef();

    useFrame((state) => {
        if (particles.current) {
            particles.current.position.y = (state.clock.elapsedTime * 3) % (totalLayers * layerHeight);
        }
    });

    return (
        <group ref={particles}>
            {[...Array(40)].map((_, i) => (
                <mesh key={i} position={[(Math.random() - 0.5) * 5, Math.random() * 4 - 2, (Math.random() - 0.5) * 5]}>
                    <sphereGeometry args={[0.03]} />
                    <meshBasicMaterial color="#00f3ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                </mesh>
            ))}
        </group>
    );
};

export default function OSIVisualizer() {
    const [activeLayer, setActiveLayer] = useState(null);

    // Click background to unselect
    const handlePointerMissed = () => {
        setActiveLayer(null);
    };

    return (
        <div className="osi-container-3d">
            <div className="osi-instructions">
                {activeLayer ? 'Click background to zoom out. Drag to rotate 360°' : 'Drag to rotate 360°. Click any layer to inspect AI services.'}
            </div>

            <Canvas
                camera={{ position: [12, 10, 18], fov: 45 }}
                onPointerMissed={handlePointerMissed}
            >
                {/* Environment */}
                <color attach="background" args={['#020202']} />
                <fog attach="fog" args={['#020202', 15, 60]} />
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 15, 10]} intensity={2} color="#ffffff" />
                <pointLight position={[-10, 0, -10]} intensity={1.5} color="#00f3ff" />
                <pointLight position={[0, -10, 0]} intensity={1} color="#ff4444" />

                <CameraController activeLayer={activeLayer} />

                {/* Unlocked 360 degree OrbitControls */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    minDistance={5}
                    maxDistance={40}
                    makeDefault
                />

                <Float
                    speed={1.5} // Slower, more majestic float
                    rotationIntensity={0.2}
                    floatIntensity={0.8}
                    floatingRange={[-1, 1]}
                >
                    <group position={[0, -5, 0]}>
                        {/* Base Grid/Platform */}
                        <gridHelper args={[30, 30, '#00f3ff', '#1a1f3a']} position={[0, -0.5, 0]} />
                        <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[30, 30]} />
                            <meshBasicMaterial color="#000" transparent opacity={0.9} />
                        </mesh>

                        {/* OSI Layers (Bottom to Top) */}
                        {[...osiLayers].map((layer, index) => (
                            <PyramidLayer
                                key={layer.id}
                                layer={layer}
                                index={index}
                                isActive={activeLayer === layer.id}
                                onClick={setActiveLayer}
                            />
                        ))}

                        {/* Central Beam linking layers */}
                        <mesh position={[0, (totalLayers * layerHeight) / 2, 0]}>
                            <cylinderGeometry args={[0.2, 0.5, totalLayers * layerHeight + 2, 8]} />
                            <meshBasicMaterial color="#00f3ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
                        </mesh>

                        <DataFlowParticles />
                    </group>
                </Float>
            </Canvas>
        </div>
    );
}
