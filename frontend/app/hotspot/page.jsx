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
                    padding: 24px;
                    overflow: hidden;
                }

                .hotspot-layout {
                    display: grid;
                    grid-template-columns: 1fr 420px;
                    gap: 24px;
                    height: calc(100vh - 140px);
                }

                .hotspot-control {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                /* Custom Scrollbar */
                .hotspot-control::-webkit-scrollbar,
                .scroll-y::-webkit-scrollbar {
                    width: 4px;
                }
                .hotspot-control::-webkit-scrollbar-thumb,
                .scroll-y::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }

                .centered {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 40px;
                    text-align: center;
                }

                .status-hero {
                    margin-bottom: 40px;
                }

                .signal-ring {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 32px;
                    position: relative;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .signal-ring.active {
                    border-color: var(--nvidia-green);
                    box-shadow: 0 0 50px rgba(118, 185, 0, 0.15), inset 0 0 20px rgba(118, 185, 0, 0.1);
                }

                .signal-ring.optimizing {
                    border-color: var(--color-info);
                    animation: pulse-ring 2s infinite;
                }

                .signal-core {
                    font-size: 50px;
                    filter: drop-shadow(0 0 10px currentColor);
                }

                @keyframes pulse-ring {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 243, 255, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 30px rgba(0, 243, 255, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 243, 255, 0); }
                }

                .hero-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin-bottom: 12px;
                    letter-spacing: -0.02em;
                }

                .hero-subtitle {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    max-width: 400px;
                    line-height: 1.6;
                }

                .hotspot-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                    max-width: 440px;
                    margin-top: 20px;
                }

                .info-box {
                    background: rgba(255, 255, 255, 0.02);
                    padding: 20px 24px;
                    border-radius: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(4px);
                }

                .info-box .label {
                    color: var(--text-tertiary);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                }

                .info-box .value {
                    font-weight: 800;
                    font-size: 1.1rem;
                    color: var(--nvidia-green);
                    text-shadow: 0 0 15px rgba(118, 185, 0, 0.3);
                }

                .toggle-btn {
                    padding: 22px;
                    border-radius: 16px;
                    font-weight: 900;
                    font-size: 1rem;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    background: var(--nvidia-green);
                    color: #000;
                    position: relative;
                    overflow: hidden;
                }

                .toggle-btn.active {
                    background: rgba(255, 68, 68, 0.1);
                    border: 1px solid rgba(255, 68, 68, 0.3);
                    color: #ff4444;
                }

                .toggle-btn:hover:not(:disabled) {
                    transform: translateY(-4px);
                    filter: brightness(1.1);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                }

                .optimization-badge {
                    margin-top: 40px;
                    background: rgba(0, 243, 255, 0.05);
                    color: var(--color-info);
                    padding: 10px 24px;
                    border-radius: 30px;
                    font-size: 0.8rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border: 1px solid rgba(0, 243, 255, 0.15);
                    box-shadow: 0 4px 15px rgba(0, 243, 255, 0.1);
                }

                .pulse-dot {
                    width: 10px;
                    height: 10px;
                    background: var(--color-info);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--color-info);
                    animation: dot-pulse 1.5s infinite;
                }

                @keyframes dot-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.01);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                .stat-value {
                    font-size: 1.6rem;
                    font-weight: 900;
                }

                .full-height { height: 100%; }
                .no-padding { padding: 0 !important; }
                .scroll-y { overflow-y: auto; }

                .premium-side {
                    border-left: 1px solid rgba(255, 255, 255, 0.05);
                    background: linear-gradient(180deg, rgba(15,15,15,0.4) 0%, rgba(5,5,5,0.8) 100%);
                }

                .header-with-badge {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .status-badge {
                    font-size: 0.65rem;
                    font-weight: 900;
                    padding: 2px 8px;
                    border-radius: 4px;
                    width: fit-content;
                    letter-spacing: 0.1em;
                }

                .status-badge.online {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    animation: scanning-pulse 2s infinite;
                }
                
                @keyframes scanning-pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                .status-badge.offline {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-tertiary);
                }

                .device-count {
                    font-size: 0.7rem;
                    font-weight: 900;
                    color: var(--nvidia-green);
                    border: 1px solid var(--nvidia-green);
                    padding: 4px 12px;
                    border-radius: 20px;
                }

                .device-list {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .device-card {
                    position: relative;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .device-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(118, 185, 0, 0.3);
                    transform: scale(1.02);
                }

                .card-inner {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    position: relative;
                    z-index: 1;
                }

                .device-type-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
                }

                .device-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .device-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .device-header .name {
                    font-weight: 800;
                    font-size: 1rem;
                    color: var(--text-primary);
                }

                .connection-time {
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                    font-weight: 600;
                }

                .device-sub {
                    display: flex;
                    gap: 6px;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-family: monospace;
                }

                .separator { opacity: 0.3; }

                .device-telemetry {
                    display: flex;
                    gap: 12px;
                    margin-top: 8px;
                }

                .tel-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 2px 8px;
                    border-radius: 6px;
                }

                .tel-icon { font-size: 0.7rem; }
                .tel-val { 
                    font-size: 0.7rem; 
                    font-weight: 700; 
                    color: var(--color-info);
                }

                .signal-indicator {
                    display: flex;
                    align-items: center;
                }

                .bars-container {
                    display: flex;
                    align-items: flex-end;
                    gap: 2px;
                    height: 20px;
                }

                .bar {
                    width: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 1px;
                    transition: all 0.5s;
                }

                .bar.b1 { height: 25%; }
                .bar.b2 { height: 50%; }
                .bar.b3 { height: 75%; }
                .bar.b4 { height: 100%; }

                .bar.active {
                    background: var(--nvidia-green);
                    box-shadow: 0 0 8px var(--nvidia-green);
                }

                .card-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }

                .device-card:hover .card-glow {
                    opacity: 0.05;
                }

                .searching-state {
                    padding: 80px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                    color: var(--text-tertiary);
                    text-align: center;
                }

                .radar {
                    position: relative;
                    width: 60px;
                    height: 60px;
                }

                .ripple {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 2px solid var(--nvidia-green);
                    border-radius: 50%;
                    animation: ripple-anim 2s infinite cubic-bezier(0, 0.2, 0.8, 1);
                    opacity: 0;
                }

                .ripple:nth-child(2) { animation-delay: -0.5s; }
                .ripple:nth-child(3) { animation-delay: -1s; }

                @keyframes ripple-anim {
                    0% { transform: scale(0.1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                .empty-state {
                    padding: 80px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    color: var(--text-tertiary);
                    text-align: center;
                }

                .lock-icon { font-size: 3rem; opacity: 0.3; }

                .loader {
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(0, 0, 0, 0.1);
                    border-top-color: #000;
                    border-radius: 50%;
                    display: inline-block;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
}
