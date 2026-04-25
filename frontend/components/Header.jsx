'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import apiService from '../hooks/apiService';
import socketService from '../hooks/socketService';
import logo from '../logo.png';
import './Header.css';

const Header = ({ connected, simulationActive, isSidebarOpen, onToggleSidebar }) => {
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeAgents, setActiveAgents] = useState(3);
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [topologyType, setTopologyType] = useState('Mesh');

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const handleNetworkUpdate = (data) => {
            if (data.topologyType) {
                setTopologyType(data.topologyType);
            }
        };

        socketService.on('network:update', handleNetworkUpdate);

        return () => {
            clearInterval(timer);
            socketService.off('network:update', handleNetworkUpdate);
        };
    }, []);

    const handleAutoConfig = async () => {
        setIsConfiguring(true);
        console.log('🔧 [System] Starting auto-configuration...');

        try {
            // Priority 1: Ensure Socket is connected first
            if (!socketService.socket?.connected) {
                console.log('🔌 [Socket] Initializing connection...');
                socketService.connect();
                // Wait a bit for connection
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Priority 2: Call Autoconfig API
            const result = await apiService.autoConfigure();
            console.log('✅ [System] Auto-config result:', result);



        } catch (error) {
            console.error('❌ [System] Auto-configuration failed:', error);
            alert('Failed to connect network. Please ensure the backend server is running.');
        } finally {
            setIsConfiguring(false);
        }
    };

    const handleDisconnect = async () => {
        setIsConfiguring(true);
        try {
            await apiService.disconnectSystem();
        } catch (error) {
            console.error('❌ Disconnect failed:', error);
        } finally {
            setIsConfiguring(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false });
    };

    const getStatusText = () => {
        if (!connected) return 'OFFLINE';
        if (simulationActive) return 'OPERATIONAL';
        return 'STANDBY';
    };

    const getStatusClass = () => {
        if (!connected) return 'status-inactive';
        if (simulationActive) return 'status-active';
        return 'status-warning';
    };

    return (
        <header className="command-header">
            <div className="header-left">
                <button className="sidebar-trigger" onClick={onToggleSidebar}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                    </svg>
                </button>
                <div className="brand">
                    <div className="brand-logo">
                        <Image src={logo} alt="6G" width={32} height={32} />
                        <div className="logo-glow"></div>
                    </div>
                    <div className="brand-text">
                        <h1 className="main-title">6G <span className="highlight">COMMAND</span></h1>
                        <p className="sub-title">AI-Native Multi-Agent Fabric</p>
                    </div>
                </div>
            </div>

            <div className="header-center">
                <div className="system-pill">
                    <span className={`status-indicator ${simulationActive ? 'active' : 'standby'}`}></span>
                    <span className="status-label">{getStatusText()}</span>
                </div>
            </div>

            <div className="header-right">
                <div className="system-metrics">
                    <div className="metric-item">
                        <span className="label">TOPOLOGY</span>
                        <span className="value">{topologyType}</span>
                    </div>
                    <div className="divider"></div>
                    <div className="metric-item">
                        <span className="label">PULSE</span>
                        <span className="value">{mounted && currentTime ? formatTime(currentTime) : '--:--:--'}</span>
                    </div>
                </div>
                
                <div className="action-zone">
                    {!simulationActive ? (
                        <button className="btn-initiate" onClick={handleAutoConfig} disabled={isConfiguring}>
                            {isConfiguring ? 'CONFIGURING...' : 'INITIATE FABRIC'}
                        </button>
                    ) : (
                        <button className="btn-terminate" onClick={handleDisconnect} disabled={isConfiguring}>
                            {isConfiguring ? 'TERMINATING...' : 'DISCONNECT'}
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .command-header {
                    height: var(--header-height);
                    background: var(--glass-bg);
                    backdrop-filter: var(--glass-blur);
                    border-bottom: 1px solid var(--glass-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    z-index: 100;
                }

                .header-left, .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .sidebar-trigger {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .sidebar-trigger:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--foreground);
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .brand-logo {
                    position: relative;
                }

                .logo-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                    background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
                    opacity: 0.3;
                    filter: blur(8px);
                    z-index: -1;
                }

                .main-title {
                    font-size: 1rem;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: 0.05em;
                }

                .highlight {
                    color: var(--accent-primary);
                }

                .sub-title {
                    font-size: 0.65rem;
                    color: var(--text-secondary);
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .system-pill {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 6px 16px;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .status-indicator.active {
                    background: var(--accent-secondary);
                    box-shadow: 0 0 10px var(--accent-secondary);
                }

                .status-indicator.standby {
                    background: #ffcc00;
                }

                .status-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                .system-metrics {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 6px 20px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }

                .metric-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .metric-item .label {
                    font-size: 0.55rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                }

                .metric-item .value {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--accent-primary);
                }

                .divider {
                    width: 1px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .btn-initiate, .btn-terminate {
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .btn-initiate {
                    background: var(--accent-secondary);
                    color: #000;
                }

                .btn-initiate:hover {
                    box-shadow: 0 0 20px rgba(118, 185, 0, 0.4);
                    transform: translateY(-1px);
                }

                .btn-terminate {
                    background: transparent;
                    color: #ef4444;
                    border-color: #ef4444;
                }

                .btn-terminate:hover {
                    background: rgba(239, 68, 68, 0.1);
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
                }

                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </header>
    );
};

export default Header;
