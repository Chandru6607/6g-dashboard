import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import apiService from '../services/apiService';
import './NetworkOverview.css';

const NetworkOverview = () => {
    const canvasRef = useRef(null);
    const [topology, setTopology] = useState(null);
    const [metrics, setMetrics] = useState(null);

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
                if (data && data.topology) setTopology(data.topology);
                if (data && data.metrics) setMetrics(data.metrics);
            } catch (error) {
                console.error('❌ [MCP] NetworkOverview initial fetch failed:', error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!topology || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        const draw = () => {
            // Clear canvas
            ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Draw gNBs (base stations)
            topology.gNBs.forEach((gnb) => {
                ctx.beginPath();
                ctx.arc(gnb.x, gnb.y, 12, 0, Math.PI * 2);
                ctx.fillStyle = gnb.status === 'active' ? '#00f3ff' : '#f59e0b';
                ctx.fill();
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#00f3ff';
                ctx.strokeStyle = '#00f3ff';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Label
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Inter';
                ctx.fillText(gnb.id, gnb.x - 15, gnb.y + 25);
            });

            // Draw UEs and connections
            topology.UEs.forEach((ue) => {
                const connectedGnb = topology.gNBs.find(g => g.id === ue.connectedTo);

                if (connectedGnb) {
                    // Draw connection line
                    ctx.beginPath();
                    ctx.moveTo(ue.x, ue.y);
                    ctx.lineTo(connectedGnb.x, connectedGnb.y);
                    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // Draw UE
                ctx.beginPath();
                ctx.arc(ue.x, ue.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#8b5cf6';
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#8b5cf6';
                ctx.strokeStyle = '#8b5cf6';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.shadowBlur = 0;
            });
        };

        draw();
        const interval = setInterval(draw, 50);

        return () => clearInterval(interval);
    }, [topology]);

    return (
        <div className="panel network-overview">
            <div className="panel-header">
                <h2 className="panel-title">Global Network Overview</h2>
                <div className="panel-actions">
                    <span className="badge badge-success pulse">Live</span>
                </div>
            </div>
            <div className="panel-body">
                <div className="network-viz-container">
                    <canvas ref={canvasRef} id="networkTopology"></canvas>
                    <div className="network-legend">
                        <div className="legend-item">
                            <span className="legend-dot" style={{ background: '#00f3ff' }}></span>
                            <span>gNB (Base Station)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot" style={{ background: '#8b5cf6' }}></span>
                            <span>UE (User Equipment)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot" style={{ background: '#10b981' }}></span>
                            <span>Active Connection</span>
                        </div>
                    </div>
                </div>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-icon">📶</div>
                        <div className="metric-content">
                            <span className="metric-label">Avg Latency</span>
                            <span className="metric-value">{metrics?.latency || '--'}</span>
                            <span className="metric-unit">ms</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">⚡</div>
                        <div className="metric-content">
                            <span className="metric-label">Throughput</span>
                            <span className="metric-value">{metrics?.throughput || '--'}</span>
                            <span className="metric-unit">Gbps</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">📉</div>
                        <div className="metric-content">
                            <span className="metric-label">Packet Loss</span>
                            <span className="metric-value">{metrics?.packetLoss || '--'}</span>
                            <span className="metric-unit">%</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">🌐</div>
                        <div className="metric-content">
                            <span className="metric-label">Active Nodes</span>
                            <span className="metric-value">{metrics?.activeNodes || '--'}</span>
                            <span className="metric-unit">nodes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkOverview;
