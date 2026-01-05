import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useSocket } from '../hooks/useSocket';
import apiService from '../services/apiService';
import './DigitalTwinPage.css';

// 3D Network Node Component
const NetworkNode = ({ position, type, status, id, onClick }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
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
        <group position={position}>
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
const ConnectionLine = ({ start, end }) => {
    const points = [
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
    ];

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial
                color="#10b981"
                transparent
                opacity={0.3}
                linewidth={2}
            />
        </line>
    );
};

// Main 3D Scene
const NetworkScene = ({ topology, onNodeClick }) => {
    if (!topology) return null;

    // Convert 2D positions to 3D (spread out in 3D space)
    const convert3D = (node) => {
        const x = (node.x - 400) / 100;
        const y = Math.random() * 2 - 1;
        const z = (node.y - 200) / 100;
        return [x, y, z];
    };

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
            <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={3}
                maxDistance={20}
            />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />

            {/* Grid Helper */}
            <gridHelper args={[20, 20, '#00f3ff', '#1a1f3a']} />

            {/* Render gNBs */}
            {topology.gNBs.map((gnb) => (
                <NetworkNode
                    key={gnb.id}
                    id={gnb.id}
                    position={convert3D(gnb)}
                    type="gNB"
                    status={gnb.status}
                    onClick={onNodeClick}
                />
            ))}

            {/* Render UEs */}
            {topology.UEs.map((ue) => (
                <NetworkNode
                    key={ue.id}
                    id={ue.id}
                    position={convert3D(ue)}
                    type="UE"
                    status={ue.status}
                    onClick={onNodeClick}
                />
            ))}

            {/* Render Connections */}
            {topology.UEs.map((ue) => {
                const connectedGnb = topology.gNBs.find(g => g.id === ue.connectedTo);
                if (connectedGnb) {
                    return (
                        <ConnectionLine
                            key={`${ue.id}-${connectedGnb.id}`}
                            start={convert3D(ue)}
                            end={convert3D(connectedGnb)}
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

// Main Page Component
const DigitalTwinPage = () => {
    const [topology, setTopology] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [viewMode, setViewMode] = useState('3d');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiService.getNetworkStatus();
                if (data.topology) setTopology(data.topology);
                if (data.metrics) setMetrics(data.metrics);
                console.log('✅ [MCP] Data synced:', data);
            } catch (error) {
                console.error('❌ [MCP] Fetch failed:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    return (
        <motion.div
            className="digital-twin-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="twin-header">
                <h1 className="twin-title">3D Digital Twin Visualization</h1>
                <div className="twin-controls">
                    <button
                        className={`view-btn ${viewMode === '3d' ? 'active' : ''}`}
                        onClick={() => setViewMode('3d')}
                    >
                        3D View
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'top' ? 'active' : ''}`}
                        onClick={() => setViewMode('top')}
                    >
                        Top View
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'side' ? 'active' : ''}`}
                        onClick={() => setViewMode('side')}
                    >
                        Side View
                    </button>
                </div>
            </div>

            <div className="twin-container">
                <div className="canvas-wrapper">
                    <Canvas>
                        <NetworkScene topology={topology} onNodeClick={handleNodeClick} />
                    </Canvas>
                </div>

                <div className="side-panel">
                    <div className="metrics-panel">
                        <h3>Network Metrics</h3>
                        <div className="metric-row">
                            <span className="metric-name">Latency</span>
                            <span className="metric-value">{metrics?.latency || '--'} ms</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-name">Throughput</span>
                            <span className="metric-value">{metrics?.throughput || '--'} Gbps</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-name">Packet Loss</span>
                            <span className="metric-value">{metrics?.packetLoss || '--'} %</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-name">Active Nodes</span>
                            <span className="metric-value">{metrics?.activeNodes || '--'}</span>
                        </div>
                    </div>

                    {selectedNode && (
                        <div className="node-details-panel">
                            <h3>Selected Node</h3>
                            <div className="detail-row">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{selectedNode.id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Type:</span>
                                <span className="detail-value">{selectedNode.type}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className={`detail-value status-${selectedNode.status}`}>
                                    {selectedNode.status}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="legend-panel">
                        <h3>Legend</h3>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: '#00f3ff' }}></div>
                            <span>gNB (Base Station)</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: '#8b5cf6' }}></div>
                            <span>UE (User Equipment)</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: '#10b981' }}></div>
                            <span>Active Connection</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DigitalTwinPage;
