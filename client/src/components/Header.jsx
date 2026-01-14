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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAutoConfig = async () => {
        setIsConfiguring(true);
        try {
            await apiService.autoConfigure();

            // Re-initialize connections to ensure everything is fresh
            await mcpClient.connect();
            // socketService.connect(); // Already connected by App.jsx

        } catch (error) {
            console.error('❌ Auto-configuration failed:', error);
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
                            disabled={isConfiguring || !connected}
                            title={!connected ? "Connect to server first" : "Start Simulation"}
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
