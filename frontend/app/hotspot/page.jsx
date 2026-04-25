'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../hooks/apiService';
import { useSocket } from '../../hooks/useSocket';

export default function HotspotPage() {
    const [status, setStatus] = useState({
        active: false,
        ssid: '6G-Dashboard Connect',
        optimized: false,
        connectedDevices: []
    });
    const [isToggling, setIsToggling] = useState(false);
    const [optimizing, setOptimizing] = useState(false);

    const socketUpdate = useSocket('hotspot:update');

    useEffect(() => {
        if (socketUpdate) {
            setStatus(socketUpdate);
        }
    }, [socketUpdate]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await apiService.getHotspotStatus();
                setStatus(data);
            } catch (error) {
                console.error('Failed to fetch hotspot status:', error);
            }
        };
        fetchStatus();
    }, []);

    const handleToggle = async () => {
        setIsToggling(true);
        if (!status.active) {
            setOptimizing(true);
            // Simulate network optimization delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            setOptimizing(false);
        }
        
        try {
            const result = await apiService.toggleHotspot();
            setStatus(prev => ({ ...prev, active: result.active, optimized: result.optimized }));
        } catch (error) {
            console.error('Failed to toggle hotspot:', error);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <main className="hotspot-page fade-in">
            <div className="hotspot-layout">
                {/* Left Section - Control */}
                <section className="hotspot-control">
                    <div className="panel glass premium-card">
                        <div className="panel-header">
                            <h2 className="panel-title">📡 6G Network Node Control</h2>
                        </div>
                        <div className="panel-body centered">
                            <div className="status-hero">
                                <div className={`signal-ring ${status.active ? 'active' : ''} ${optimizing ? 'optimizing' : ''}`}>
                                    <div className="signal-core">
                                        {optimizing ? '⚡' : status.active ? '📶' : '💤'}
                                    </div>
                                </div>
                                <h1 className="hero-title">
                                    {optimizing ? 'Optimizing Connection...' : status.active ? 'Network Active' : 'Network Standby'}
                                </h1>
                                <p className="hero-subtitle">
                                    {status.active ? 'Broadcasting optimized 6G fabric signal' : 'Ready to initiate secure hotspot'}
                                </p>
                            </div>

                            <div className="hotspot-actions">
                                <div className="info-box">
                                    <span className="label">SSID</span>
                                    <span className="value">{status.ssid}</span>
                                </div>
                                
                                <button 
                                    className={`toggle-btn ${status.active ? 'active' : ''}`}
                                    onClick={handleToggle}
                                    disabled={isToggling || optimizing}
                                >
                                    {isToggling || optimizing ? (
                                        <span className="loader"></span>
                                    ) : (
                                        status.active ? 'DEACTIVATE HOTSPOT' : 'ACTIVATE 6G HOTSPOT'
                                    )}
                                </button>
                            </div>

                            {status.optimized && (
                                <div className="optimization-badge">
                                    <span className="pulse-dot"></span>
                                    INTERNET SPEED OPTIMIZED VIA 6G FABRIC
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="optimization-stats panel glass">
                        <div className="panel-header">
                            <h2 className="panel-title">📊 Real-time Optimization</h2>
                        </div>
                        <div className="panel-body grid-2">
                            <div className="stat-item">
                                <span className="stat-label">Source Latency</span>
                                <span className="stat-value text-info">12ms</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Fabric Latency</span>
                                <span className="stat-value text-success">2.4ms</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Optimization Gain</span>
                                <span className="stat-value text-accent">+85%</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Signal Integrity</span>
                                <span className="stat-value">99.8%</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Section - Connected Devices */}
                <aside className="devices-panel">
                    <div className="panel glass full-height">
                        <div className="panel-header">
                            <h2 className="panel-title">📱 Connected Devices</h2>
                            <span className="device-count">{status.connectedDevices.length} Active</span>
                        </div>
                        <div className="panel-body no-padding">
                            <div className="device-list">
                                <AnimatePresence>
                                    {status.active && status.connectedDevices.map((device, index) => (
                                        <motion.div 
                                            key={device.id}
                                            className="device-item"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="device-icon">📱</div>
                                            <div className="device-info">
                                                <span className="device-name">{device.name}</span>
                                                <span className="device-meta">{device.ip} • {device.mac}</span>
                                            </div>
                                            <div className="device-signal">
                                                <div className="signal-bars">
                                                    <div className="bar active"></div>
                                                    <div className="bar active"></div>
                                                    <div className="bar active"></div>
                                                    <div className="bar"></div>
                                                </div>
                                                <span className="signal-dbm">{device.signal} dBm</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {!status.active && (
                                    <div className="empty-state">
                                        <p>Activate hotspot to see connected devices</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                .hotspot-page {
                    height: 100%;
                    width: 100%;
                    padding: 24px;
                }

                .hotspot-layout {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 24px;
                    height: calc(100vh - 120px);
                }

                .hotspot-control {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .centered {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    text-align: center;
                }

                .status-hero {
                    margin-bottom: 40px;
                }

                .signal-ring {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 4px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    position: relative;
                    transition: all 0.5s;
                }

                .signal-ring.active {
                    border-color: var(--nvidia-green);
                    box-shadow: 0 0 30px rgba(118, 185, 0, 0.2);
                }

                .signal-ring.optimizing {
                    border-color: var(--color-info);
                    animation: pulse 1s infinite;
                }

                .signal-core {
                    font-size: 40px;
                }

                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 243, 255, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(0, 243, 255, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 243, 255, 0); }
                }

                .hero-title {
                    font-size: 2.2rem;
                    margin-bottom: 8px;
                }

                .hero-subtitle {
                    color: var(--text-secondary);
                    font-size: 1rem;
                }

                .hotspot-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: 100%;
                    max-width: 400px;
                }

                .info-box {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 16px;
                    border-radius: 12px;
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .info-box .label {
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    font-weight: 700;
                }

                .info-box .value {
                    font-weight: 700;
                    color: var(--nvidia-green);
                }

                .toggle-btn {
                    padding: 18px;
                    border-radius: 12px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: none;
                    background: var(--nvidia-green);
                    color: #000;
                }

                .toggle-btn.active {
                    background: transparent;
                    border: 2px solid #ff4444;
                    color: #ff4444;
                }

                .toggle-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                }

                .optimization-badge {
                    margin-top: 30px;
                    background: rgba(0, 243, 255, 0.1);
                    color: var(--color-info);
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: 1px solid rgba(0, 243, 255, 0.2);
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--color-info);
                    border-radius: 50%;
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    50% { opacity: 0.3; }
                }

                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .stat-label {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                }

                .stat-value {
                    font-size: 1.4rem;
                    font-weight: 700;
                }

                .full-height {
                    height: 100%;
                }

                .no-padding {
                    padding: 0 !important;
                }

                .device-list {
                    display: flex;
                    flex-direction: column;
                }

                .device-item {
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .device-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }

                .device-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .device-name {
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .device-meta {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                }

                .device-signal {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 4px;
                }

                .signal-bars {
                    display: flex;
                    gap: 2px;
                    align-items: flex-end;
                    height: 12px;
                }

                .bar {
                    width: 3px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .bar:nth-child(1) { height: 4px; }
                .bar:nth-child(2) { height: 7px; }
                .bar:nth-child(3) { height: 10px; }
                .bar:nth-child(4) { height: 13px; }

                .bar.active {
                    background: var(--nvidia-green);
                }

                .signal-dbm {
                    font-size: 0.65rem;
                    color: var(--text-secondary);
                }

                .empty-state {
                    padding: 60px;
                    text-align: center;
                    color: var(--text-secondary);
                    font-style: italic;
                }

                .device-count {
                    background: var(--nvidia-green);
                    color: #000;
                    padding: 2px 10px;
                    border-radius: 10px;
                    font-size: 0.7rem;
                    font-weight: 700;
                }

                .loader {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    display: inline-block;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
}
