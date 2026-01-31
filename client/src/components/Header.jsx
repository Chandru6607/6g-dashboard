import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { mcpClient } from '../services/mcpClient';
import socketService from '../services/socketService';
import logo from '../assets/logo.png';
import './Header.css';

const Header = ({ connected, simulationActive, isSidebarOpen, onToggleSidebar }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeAgents, setActiveAgents] = useState(3);
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [topologyType, setTopologyType] = useState('Mesh');

    useEffect(() => {
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

            // Priority 3: Connect MCP
            await mcpClient.connect();
            console.log('✅ [MCP] Connected');

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

            // Gracefully stop services
            // await mcpClient.disconnect();
            // socketService.disconnect();

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
        <header className="header">
            <div className="header-content">
                <div className="logo-section">
                    <button className="menu-toggle-btn" onClick={onToggleSidebar}>
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                    <img src={logo} alt="6G Dashboard" className="header-logo-image" />
                    <div>
                        <h1 className="logo-title">6G Digital Twin Command Center</h1>
                        <p className="logo-subtitle">Multi-Agent Reinforcement Learning Platform</p>
                    </div>
                </div>

                <div className="header-actions">
                    {!simulationActive ? (
                        <button
                            className={`connect-btn ${isConfiguring ? 'loading' : ''}`}
                            onClick={handleAutoConfig}
                            disabled={isConfiguring}
                            title="Start Simulation"
                        >
                            {isConfiguring ? 'Configuring...' : 'Connect Network'}
                        </button>
                    ) : (
                        <button
                            className={`disconnect-btn ${isConfiguring ? 'loading' : ''}`}
                            onClick={handleDisconnect}
                            disabled={isConfiguring || !connected}
                        >
                            {isConfiguring ? 'Disconnecting...' : 'Disconnect Network'}
                        </button>
                    )}
                </div>

                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-label">Network Status</span>
                        <span className={`stat-value ${getStatusClass()}`}>
                            {getStatusText()}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Active Topology</span>
                        <span className="stat-value text-accent">{topologyType}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Active Agents</span>
                        <span className="stat-value">{activeAgents}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">System Time</span>
                        <span className="stat-value">{formatTime(currentTime)}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
