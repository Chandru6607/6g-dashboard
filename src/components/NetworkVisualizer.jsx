'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

// 3D Network Node Component
const NetworkNode = ({ position, type, status, id, onClick, throughput }) => {
    const groupRef = useRef();
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const initRef = useRef(false);

    const targetPos = new THREE.Vector3(...position);

    useFrame((state) => {
        if (groupRef.current) {
            if (!initRef.current) {
                groupRef.current.position.copy(targetPos);
                initRef.current = true;
            } else {
                const glideSpeed = Math.min((parseFloat(throughput) || 10) * 0.005, 0.15);
                groupRef.current.position.lerp(targetPos, glideSpeed);
            }
        }

        if (meshRef.current) {
            const rotSpeed = (parseFloat(throughput) || 10) * 0.002;
            meshRef.current.rotation.y += rotSpeed;
            if (hovered) {
                meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    });

    const color = type === 'gNB'
        ? (status === 'active' ? '#00f3ff' : '#f59e0b')
        : '#8b5cf6';

    const size = type === 'gNB' ? 0.5 : 0.25;

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <mesh
                ref={meshRef}
                onClick={() => onClick({ id, type, status })}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : 0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Glow effect */}
            <mesh scale={hovered ? 1.5 : 1.2}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.2}
                />
            </mesh>

            {hovered && (
                <Html distanceFactor={10}>
                    <div className="node-tooltip">
                        <strong>{id}</strong>
                        <div>{type}</div>
                        <div className={`status ${status}`}>{status}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

// Connection Line Component
const ConnectionLine = ({ start, end, throughput }) => {
    const lineRef = useRef();
    const initRef = useRef(false);
    const currentStart = useRef(new THREE.Vector3(...start));
    const currentEnd = useRef(new THREE.Vector3(...end));

    useFrame(() => {
        if (!lineRef.current) return;

        const targetStart = new THREE.Vector3(...start);
        const targetEnd = new THREE.Vector3(...end);

        if (!initRef.current) {
            currentStart.current.copy(targetStart);
            currentEnd.current.copy(targetEnd);
            initRef.current = true;
        } else {
            const glideSpeed = Math.min((parseFloat(throughput) || 10) * 0.005, 0.15);
            currentStart.current.lerp(targetStart, glideSpeed);
            currentEnd.current.lerp(targetEnd, glideSpeed);
        }

        const positions = new Float32Array([
            currentStart.current.x, currentStart.current.y, currentStart.current.z,
            currentEnd.current.x, currentEnd.current.y, currentEnd.current.z,
        ]);

        lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <line ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial
                color="#10b981"
                transparent
                opacity={0.3}
                linewidth={2}
            />
        </line>
    );
};

// Camera Controller for smooth transitions
const CameraController = ({ viewMode }) => {
    const { camera, controls } = useThree();

    useEffect(() => {
        if (!camera || !controls) return;

        let targetPos = [10, 10, 10];
        let targetLookAt = [0, 0, 0];

        switch (viewMode) {
            case 'top':
                targetPos = [0, 20, 0];
                break;
            case 'side':
                targetPos = [20, 0, 0];
                break;
            case '3d':
            default:
                targetPos = [12, 12, 12];
                break;
        }

        const duration = 1000;
        const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const t = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            camera.position.set(
                startPos.x + (targetPos[0] - startPos.x) * t,
                startPos.y + (targetPos[1] - startPos.y) * t,
                startPos.z + (targetPos[2] - startPos.z) * t
            );

            controls.target.set(
                0 * (1 - t) + targetLookAt[0] * t,
                0 * (1 - t) + targetLookAt[1] * t,
                0 * (1 - t) + targetLookAt[2] * t
            );

            controls.update();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [viewMode, camera, controls]);

    return null;
};

// Main 3D Scene
const NetworkScene = ({ topology, onNodeClick, viewMode, throughput }) => {
    if (!topology) return null;

    const convert3D = (node, type) => {
        const x = (node.x - 400) / 80;
        const y = type === 'gNB' ? 1.5 : -1.5;
        const z = (node.y - 200) / 80;
        return [x, y, z];
    };

    return (
        <>
            <PerspectiveCamera makeDefault position={[12, 12, 12]} />
            <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={3}
                maxDistance={40}
                makeDefault
            />
            <CameraController viewMode={viewMode} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00f3ff" />

            <gridHelper args={[30, 30, '#00f3ff', '#1a1f3a']} />
            <axesHelper args={[10]} />

            {topology.gNBs.map((gnb) => (
                <NetworkNode
                    key={gnb.id}
                    id={gnb.id}
                    position={convert3D(gnb, 'gNB')}
                    type="gNB"
                    status={gnb.status}
                    onClick={onNodeClick}
                    throughput={throughput}
                />
            ))}

            {topology.UEs.map((ue) => (
                <NetworkNode
                    key={ue.id}
                    id={ue.id}
                    position={convert3D(ue, 'UE')}
                    type="UE"
                    status={ue.status}
                    onClick={onNodeClick}
                    throughput={throughput}
                />
            ))}

            {topology.UEs.map((ue) => {
                const connectedGnb = topology.gNBs.find(g => g.id === ue.connectedTo);
                if (connectedGnb) {
                    return (
                        <ConnectionLine
                            key={`${ue.id}-${connectedGnb.id}`}
                            start={convert3D(ue, 'UE')}
                            end={convert3D(connectedGnb, 'gNB')}
                            throughput={throughput}
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

export default function NetworkVisualizer({ topology, onNodeClick, viewMode, throughput }) {
    return (
        <Canvas>
            <NetworkScene
                topology={topology}
                onNodeClick={onNodeClick}
                viewMode={viewMode}
                throughput={throughput}
            />
        </Canvas>
    );
}
