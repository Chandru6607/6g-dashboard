'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import apiService from '../hooks/apiService';
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
        let animationNodes = null;

        const draw = () => {
            // First time setup or handle target nodes
            if (!animationNodes) {
                animationNodes = {
                    gNBs: topology.gNBs.map(n => ({ ...n, currentX: n.x, currentY: n.y })),
                    UEs: topology.UEs.map(n => ({ ...n, currentX: n.x, currentY: n.y }))
                };
            } else {
                // Deep sync target coordinates
                topology.gNBs.forEach(gnb => {
                    const existing = animationNodes.gNBs.find(n => n.id === gnb.id);
                    if (existing) {
                        existing.targetX = gnb.x;
                        existing.targetY = gnb.y;
                    } else {
                        animationNodes.gNBs.push({ ...gnb, currentX: gnb.x, currentY: gnb.y, targetX: gnb.x, targetY: gnb.y });
                    }
                });
                topology.UEs.forEach(ue => {
                    const existing = animationNodes.UEs.find(n => n.id === ue.id);
                    if (existing) {
                        existing.targetX = ue.x;
                        existing.targetY = ue.y;
                    } else {
                        animationNodes.UEs.push({ ...ue, currentX: ue.x, currentY: ue.y, targetX: ue.x, targetY: ue.y });
                    }
                });
            }

            // Lerp mathematical translation
            const lerpSpeed = Math.min((parseFloat(metrics?.throughput) || 10) * 0.005, 0.15); // Faster internet = faster glide

            animationNodes.gNBs.forEach(n => {
                if (n.targetX !== undefined) {
                    n.currentX += (n.targetX - n.currentX) * lerpSpeed;
                    n.currentY += (n.targetY - n.currentY) * lerpSpeed;
                }
            });
            animationNodes.UEs.forEach(n => {
                if (n.targetX !== undefined) {
                    n.currentX += (n.targetX - n.currentX) * lerpSpeed;
                    n.currentY += (n.targetY - n.currentY) * lerpSpeed;
                }
            });

            // Clear canvas
            ctx.fillStyle = 'rgba(10, 14, 39, 0.2)'; // Fading trail effect
            ctx.fillRect(0, 0, width, height);

            // Draw gNBs (base stations)
            animationNodes.gNBs.forEach((gnb) => {
                ctx.beginPath();
                ctx.arc(gnb.currentX, gnb.currentY, 12, 0, Math.PI * 2);
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
                ctx.fillText(gnb.id, gnb.currentX - 15, gnb.currentY + 25);
            });

            // Draw UEs and connections
            animationNodes.UEs.forEach((ue) => {
                const connectedGnb = animationNodes.gNBs.find(g => g.id === ue.connectedTo);

                if (connectedGnb) {
                    // Draw connection line
                    ctx.beginPath();
                    ctx.moveTo(ue.currentX, ue.currentY);
                    ctx.lineTo(connectedGnb.currentX, connectedGnb.currentY);
                    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // Draw UE
                ctx.beginPath();
                ctx.arc(ue.currentX, ue.currentY, 6, 0, Math.PI * 2);
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
        // Request animation frame is much smoother than setInterval for math lerps
        let animationFrameId;
        const renderLoop = () => {
            draw();
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        return () => cancelAnimationFrame(animationFrameId);
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
