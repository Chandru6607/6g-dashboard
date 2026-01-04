import { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ connected }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeAgents, setActiveAgents] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false });
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-section">
                    <div className="logo-icon"></div>
                    <div>
                        <h1 className="logo-title">6G Digital Twin Command Center</h1>
                        <p className="logo-subtitle">Multi-Agent Reinforcement Learning Platform</p>
                    </div>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-label">Network Status</span>
                        <span className={`stat-value ${connected ? 'status-active' : 'status-inactive'}`}>
                            {connected ? 'OPERATIONAL' : 'DISCONNECTED'}
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
