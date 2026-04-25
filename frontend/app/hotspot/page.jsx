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
    const [leftWidth, setLeftWidth] = useState(65); // Percentage
    const [isResizing, setIsResizing] = useState(false);

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

    // Resizable logic
    const handleMouseDown = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 30 && newWidth < 80) {
                setLeftWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleToggle = async () => {
        setIsToggling(true);
        if (!status.active) {
            setOptimizing(true);
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
        <main className={`hotspot-page fade-in ${isResizing ? 'resizing' : ''}`}>
            <div className="hotspot-layout" style={{ gridTemplateColumns: `${leftWidth}% 4px 1fr` }}>
                {/* Left Section - Control */}
                <section className="hotspot-control">
                    <div className="panel glass premium-card hotspot-hero-panel">
                        <div className="panel-header">
                            <h2 className="panel-title">📡 6G Network Node Control</h2>
                            <div className="status-dot-container">
                                <span className={`status-text ${status.active ? 'active' : ''}`}>
                                    {status.active ? 'BROADCASTING' : 'OFFLINE'}
                                </span>
                                <span className={`status-dot ${status.active ? 'active' : ''}`}></span>
                            </div>
                        </div>
                        <div className="panel-body compact-centered">
                            <div className="status-hero-compact">
                                <div className={`signal-ring-sm ${status.active ? 'active' : ''} ${optimizing ? 'optimizing' : ''}`}>
                                    <div className="signal-core-sm">
                                        {optimizing ? '⚡' : status.active ? '📶' : '💤'}
                                    </div>
                                    {status.active && <div className="scanning-line"></div>}
                                </div>
                                <h1 className="hero-title-sm">
                                    {optimizing ? 'Optimizing...' : status.active ? '6G Node Active' : 'Node Standby'}
                                </h1>
                            </div>

                            <div className="hotspot-actions-wrapper">
                                <div className="credentials-grid">
                                    <div className="credential-item">
                                        <span className="label">SSID</span>
                                        <span className="value">{status.ssid}</span>
                                    </div>
                                    <div className="credential-item">
                                        <span className="label">PASSWORD</span>
                                        <span className="value">••••••••</span>
                                    </div>
                                </div>
                                
                                <button 
                                    className={`main-toggle-btn ${status.active ? 'active' : ''}`}
                                    onClick={handleToggle}
                                    disabled={isToggling || optimizing}
                                    id="hotspot-activate-button"
                                >
                                    {isToggling || optimizing ? (
                                        <div className="btn-loading">
                                            <span className="loader-ring"></span>
                                            <span>INITIALIZING...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="btn-icon">{status.active ? '⏹' : '🚀'}</span>
                                            <span className="btn-text">{status.active ? 'SHUTDOWN NETWORK' : 'ACTIVATE 6G HOTSPOT'}</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {status.active && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="active-optimization-pill"
                                >
                                    <span className="sparkle">✨</span>
                                    <span>REAL-TIME 6G FABRIC OPTIMIZATION ENABLED</span>
                                </motion.div>
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

                {/* Resize Handle */}
                <div 
                    className={`resize-handle ${isResizing ? 'active' : ''}`} 
                    onMouseDown={handleMouseDown}
                ></div>

                {/* Right Section - Connected Devices */}
                <aside className="devices-panel">
                    <div className="panel glass full-height premium-side">
                        <div className="panel-header">
                            <div className="header-with-badge">
                                <h2 className="panel-title">📱 Connected Devices</h2>
                                <span className={`status-badge ${status.active ? 'online' : 'offline'}`}>
                                    {status.active ? 'SCANNING' : 'IDLE'}
                                </span>
                            </div>
                            <span className="device-count">{status.connectedDevices.length} ACTIVE</span>
                        </div>
                        
                        <div className="panel-body no-padding scroll-y">
                            <div className="device-list">
                                <AnimatePresence mode='popLayout'>
                                    {status.active && status.connectedDevices.length > 0 ? (
                                        status.connectedDevices.map((device, index) => (
                                            <motion.div 
                                                key={device.id}
                                                className="device-card"
                                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                                transition={{ 
                                                    type: "spring", 
                                                    stiffness: 300, 
                                                    damping: 25,
                                                    delay: index * 0.05 
                                                }}
                                            >
                                                <div className="card-inner">
                                                    <div className="device-type-icon">
                                                        {device.name.includes('iPhone') ? '📱' : 
                                                         device.name.includes('Android') ? '🤖' : 
                                                         device.name.includes('Samsung') ? '📱' : '💻'}
                                                    </div>
                                                    
                                                    <div className="device-main">
                                                        <div className="device-header">
                                                            <span className="name">{device.name}</span>
                                                            <span className="connection-time">{device.connectedAt}</span>
                                                        </div>
                                                        
                                                        <div className="device-sub">
                                                            <span className="ip">{device.ip}</span>
                                                            <span className="separator">/</span>
                                                            <span className="mac">{device.mac}</span>
                                                        </div>
                                                        
                                                        <div className="device-telemetry">
                                                            <div className="tel-item">
                                                                 <span className="tel-icon">📉</span>
                                                                 <span className="tel-val">{device.traffic}</span>
                                                            </div>
                                                            <div className="tel-item">
                                                                 <span className="tel-icon">📡</span>
                                                                 <span className="tel-val">{device.signal} dBm</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="signal-indicator">
                                                        <div className="bars-container">
                                                            {[1, 2, 3, 4].map(b => (
                                                                <div 
                                                                    key={b} 
                                                                    className={`bar b${b} ${Math.abs(device.signal) < (b * 20 + 20) ? 'active' : ''}`}
                                                                ></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-glow" style={{ background: `radial-gradient(circle at center, var(--nvidia-green) 0%, transparent 70%)` }}></div>
                                            </motion.div>
                                        ))
                                    ) : status.active ? (
                                        <div className="searching-state">
                                            <div className="radar">
                                                <div className="ripple"></div>
                                                <div className="ripple"></div>
                                                <div className="ripple"></div>
                                            </div>
                                            <p>Scanning for nearby devices...</p>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="lock-icon">🔒</div>
                                            <p>Activate 6G Node to allow connections</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                .hotspot-page {
                    height: 100%;
                    width: 100%;
                    padding: 15px;
                    overflow: hidden;
                    background: radial-gradient(circle at 0% 0%, rgba(118, 185, 0, 0.05) 0%, transparent 50%);
                }

                .hotspot-page.resizing {
                    cursor: col-resize;
                }

                .hotspot-layout {
                    display: grid;
                    gap: 0;
                    height: calc(100vh - 110px);
                }

                .hotspot-control {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    overflow-y: auto;
                    padding-right: 10px;
                }

                .resize-handle {
                    width: 4px;
                    background: transparent;
                    cursor: col-resize;
                    transition: background 0.2s;
                    position: relative;
                    z-index: 10;
                }

                .resize-handle:hover, .resize-handle.active {
                    background: var(--nvidia-green);
                    box-shadow: 0 0 10px var(--nvidia-green);
                }

                .compact-centered {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 15px 20px;
                }

                .hotspot-hero-panel {
                    min-height: 400px;
                    display: flex;
                    flex-direction: column;
                }

                .status-hero-compact {
                    margin-bottom: 15px;
                    text-align: center;
                }

                .signal-ring-sm {
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    position: relative;
                    background: rgba(255, 255, 255, 0.01);
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                }

                .signal-ring-sm.active {
                    border-color: rgba(118, 185, 0, 0.3);
                    box-shadow: 0 0 30px rgba(118, 185, 0, 0.1);
                }

                .signal-core-sm {
                    font-size: 40px;
                    z-index: 2;
                }

                .hero-title-sm {
                    font-size: 2.2rem;
                    font-weight: 900;
                    letter-spacing: -0.03em;
                    background: linear-gradient(180deg, #fff 0%, #888 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                }

                .hotspot-actions-wrapper {
                    width: 100%;
                    max-width: 420px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .main-toggle-btn {
                    width: 100%;
                    padding: 20px;
                    border-radius: 14px;
                    border: none;
                    background: var(--nvidia-green);
                    color: #000;
                    font-weight: 900;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .main-toggle-btn.active {
                    background: #ff4444;
                    color: #fff;
                }

                .active-optimization-pill {
                    margin-top: 15px;
                    background: rgba(0, 243, 255, 0.08);
                    border: 1px solid rgba(0, 243, 255, 0.2);
                    padding: 6px 16px;
                    border-radius: 20px;
                    color: var(--color-info);
                    font-size: 0.7rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Rest of existing styles preserved but optimized */
                .status-dot-container { display: flex; align-items: center; gap: 10px; }
                .status-text { font-size: 0.7rem; font-weight: 800; color: var(--text-tertiary); letter-spacing: 0.1em; }
                .status-text.active { color: var(--nvidia-green); }
                .status-dot { width: 8px; height: 8px; background: #333; border-radius: 50%; position: relative; }
                .status-dot.active { background: var(--nvidia-green); box-shadow: 0 0 10px var(--nvidia-green); }
                .scanning-line { position: absolute; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, var(--nvidia-green), transparent); top: 0; animation: scan-vertical 3s linear infinite; opacity: 0.5; }
                @keyframes scan-vertical { 0% { top: 0; } 100% { top: 100%; } }
                .credentials-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .credential-item { background: rgba(255, 255, 255, 0.03); padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; gap: 2px; }
                .credential-item .label { font-size: 0.6rem; font-weight: 800; color: var(--text-tertiary); }
                .credential-item .value { font-size: 0.85rem; font-weight: 700; color: #fff; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .stat-item { background: rgba(255, 255, 255, 0.02); padding: 15px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); }
                .stat-label { display: block; font-size: 0.65rem; color: var(--text-tertiary); font-weight: 700; margin-bottom: 4px; }
                .stat-value { font-size: 1.5rem; font-weight: 900; color: #fff; }
                .premium-side { background: linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(0,0,0,0.8) 100%); border-left: 1px solid rgba(255, 255, 255, 0.05); }
                .device-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 12px; margin-bottom: 8px; position: relative; overflow: hidden; }
                .card-inner { display: flex; align-items: center; gap: 12px; }
                .device-type-icon { width: 38px; height: 38px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
                .device-main { flex: 1; }
                .device-header { display: flex; justify-content: space-between; margin-bottom: 2px; }
                .name { font-weight: 800; font-size: 0.85rem; }
                .connection-time { font-size: 0.6rem; color: var(--text-tertiary); }
                .device-sub { font-size: 0.65rem; color: var(--text-secondary); opacity: 0.7; }
                .device-telemetry { display: flex; gap: 10px; margin-top: 6px; }
                .tel-item { display: flex; align-items: center; gap: 4px; font-size: 0.6rem; font-weight: 700; color: var(--text-tertiary); }
                .tel-val { color: var(--nvidia-green); }
                .searching-state { padding: 80px 20px; display: flex; flex-direction: column; align-items: center; gap: 15px; color: var(--text-tertiary); }
                .radar { width: 60px; height: 60px; position: relative; }
                .ripple { position: absolute; width: 100%; height: 100%; border: 2px solid var(--nvidia-green); border-radius: 50%; animation: ripple-pulse 2s infinite cubic-bezier(0, 0.2, 0.8, 1); opacity: 0; }
                .ripple:nth-child(2) { animation-delay: -0.5s; }
                .ripple:nth-child(3) { animation-delay: -1s; }
                @keyframes ripple-pulse { 0% { transform: scale(0.1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
                .btn-loading { display: flex; align-items: center; gap: 8px; }
                .loader-ring { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.1); border-top-color: currentColor; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .signal-indicator { display: flex; align-items: center; }
                .bars-container { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
                .bar { width: 3px; background: rgba(255, 255, 255, 0.05); border-radius: 1px; }
                .bar.b1 { height: 25%; } .bar.b2 { height: 50%; } .bar.b3 { height: 75%; } .bar.b4 { height: 100%; }
                .bar.active { background: var(--nvidia-green); box-shadow: 0 0 5px var(--nvidia-green); }
                .card-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.02; pointer-events: none; }
                .scroll-y { overflow-y: auto; }
            `}</style>
        </main>
    );
}
