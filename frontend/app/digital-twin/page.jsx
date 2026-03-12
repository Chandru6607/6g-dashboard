'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';
import apiService from '../../hooks/apiService';
import './DigitalTwinPage.css';

// Dynamically import the 3D Visualizer with SSR disabled
const NetworkVisualizer = dynamic(
    () => import('../../components/NetworkVisualizer'),
    { ssr: false, loading: () => <div className="canvas-wrapper loading">Initializing 3D Environment...</div> }
);

// Import Simple Network Visualizer for demo fallback
import SimpleNetworkVisualizer from '../../components/SimpleNetworkVisualizer';

export default function DigitalTwinPage() {
    const [topology, setTopology] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [agents, setAgents] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [viewMode, setViewMode] = useState('3d');
    const [currentTopologyType, setCurrentTopologyType] = useState(null);
    const [useSimpleVisualizer, setUseSimpleVisualizer] = useState(false); // Use full 3D visualizer

    const socketData = useSocket('network:update');
    const agentsData = useSocket('agents:update');
    const topologyData = useSocket('topology:changed');

    useEffect(() => {
        if (socketData) {
            if (socketData.topology) setTopology(socketData.topology);
            if (socketData.metrics) setMetrics(socketData.metrics);
            if (socketData.topologyType) setCurrentTopologyType(socketData.topologyType);
        }
    }, [socketData]);

    useEffect(() => {
        if (agentsData) {
            setAgents(agentsData);
        }
    }, [agentsData]);

    useEffect(() => {
        if (topologyData) {
            setCurrentTopologyType(topologyData.topology);
            console.log(`🔄 [Twin] Topology switched to ${topologyData.topology}`);
        }
    }, [topologyData]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await apiService.getNetworkStatus();
                if (data) {
                    if (data.topology) setTopology(data.topology);
                    if (data.metrics) setMetrics(data.metrics);
                }
            } catch (error) {
                console.error('❌ fetch failed:', error);
            }
        };

        fetchInitialData();
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
                    <div className="view-controls">
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
                        <button
                            className={`view-btn ${useSimpleVisualizer ? 'active' : ''}`}
                            onClick={() => setUseSimpleVisualizer(!useSimpleVisualizer)}
                            style={{ marginLeft: '20px', background: useSimpleVisualizer ? '#10b981' : '#8b5cf6' }}
                        >
                            {useSimpleVisualizer ? '🎮 Simple View' : '🎮 3D View'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="twin-container">
                <div className="canvas-wrapper">
                    {useSimpleVisualizer ? (
                        <SimpleNetworkVisualizer
                            topology={topology}
                            onNodeClick={handleNodeClick}
                            agents={agents}
                        />
                    ) : (
                        <NetworkVisualizer
                            topology={topology}
                            onNodeClick={handleNodeClick}
                            viewMode={viewMode}
                            throughput={metrics?.throughput}
                            agents={agents}
                        />
                    )}
                </div>

                <div className="side-panel">
                    <div className="metrics-panel">
                        <h3>Network Metrics</h3>
                        <div className="metric-row">
                            <span className="metric-name">Current Topology</span>
                            <span className="metric-value">{currentTopologyType || '--'}</span>
                        </div>
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

                    <div className="training-panel">
                        <h3>Training Status</h3>
                        {agents?.map((agent) => (
                            <div key={agent.id} className="agent-status">
                                <div className="agent-name">{agent.name}</div>
                                <div className={`agent-state ${agent.state}`}>
                                    {agent.state === 'training' ? '🧠 Training' : '📊 Inference'}
                                </div>
                                {agent.state === 'training' && (
                                    <div className="training-progress">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${agent.trainingProgress || agent.convergence || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{agent.trainingProgress || agent.convergence || 0}%</span>
                                    </div>
                                )}
                                <div className="agent-metrics">
                                    <span>Episodes: {agent.episodes}</span>
                                    <span>Reward: {agent.avgReward}</span>
                                </div>
                            </div>
                        ))}
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
                            {selectedNode.isTraining && (
                                <>
                                    <div className="detail-row">
                                        <span className="detail-label">Training:</span>
                                        <span className="detail-value status-training">🧠 Active</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Progress:</span>
                                        <span className="detail-value">{selectedNode.trainingProgress || 0}%</span>
                                    </div>
                                </>
                            )}
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
                            <span>Training Node</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: '#10b981', opacity: 0.3 }}></div>
                            <span>Active Connection</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-legend">
                                <div style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    border: '2px solid #10b981', 
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px'
                                }}></div>
                                <span>Training Progress</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
