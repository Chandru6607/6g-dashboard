'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';
import apiService from '../../services/apiService';
import './DigitalTwinPage.css';

// Dynamically import the 3D Visualizer with SSR disabled
const NetworkVisualizer = dynamic(
    () => import('../../components/NetworkVisualizer'),
    { ssr: false, loading: () => <div className="canvas-wrapper loading">Initializing 3D Environment...</div> }
);

export default function DigitalTwinPage() {
    const [topology, setTopology] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [viewMode, setViewMode] = useState('3d');

    const socketData = useSocket('network:update');

    useEffect(() => {
        if (socketData) {
            if (socketData.topology) setTopology(socketData.topology);
            if (socketData.metrics) setMetrics(socketData.metrics);
        }
    }, [socketData]);

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
                    <NetworkVisualizer
                        topology={topology}
                        onNodeClick={handleNodeClick}
                        viewMode={viewMode}
                        throughput={metrics?.throughput}
                    />
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
}
