import { useState, useEffect } from 'react';
import socketService from '../services/socketService';
import { mcpClient } from '../services/mcpClient';
import './ConnectedServers.css';

const ConnectedServers = () => {
    const [servers, setServers] = useState([
        {
            id: 'mcp-server',
            name: 'MCP Protocol Server',
            endpoint: 'http://localhost:5000/mcp',
            type: 'SSE/MCP',
            connected: false
        },
        {
            id: 'ws-server',
            name: 'Realtime WebSocket Server',
            endpoint: 'ws://localhost:5000',
            type: 'WebSocket',
            connected: false
        },
        {
            id: 'rest-api',
            name: 'Core REST API',
            endpoint: 'http://localhost:5000/api',
            type: 'REST',
            connected: true // Usually always "connected" if the page loads
        }
    ]);

    useEffect(() => {
        const checkConnections = () => {
            setServers(prev => prev.map(server => {
                if (server.id === 'mcp-server') {
                    return { ...server, connected: mcpClient.isConnected };
                }
                if (server.id === 'ws-server') {
                    return { ...server, connected: socketService.socket?.connected || false };
                }
                return server;
            }));
        };

        const interval = setInterval(checkConnections, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="panel connected-servers">
            <div className="panel-header">
                <h2 className="panel-title">Active Server Node Registry</h2>
                <div className="connection-summary">
                    <span className="summary-label">Active Uplinks:</span>
                    <span className="summary-value">{servers.filter(s => s.connected).length}/{servers.length}</span>
                </div>
            </div>
            <div className="panel-body">
                <div className="server-list">
                    {servers.map((server) => (
                        <div key={server.id} className={`server-card ${server.connected ? 'connected' : 'disconnected'}`}>
                            <div className="server-info">
                                <div className="server-main">
                                    <span className="server-name">{server.name}</span>
                                    <span className="server-type">{server.type}</span>
                                </div>
                                <div className="server-meta">
                                    <code className="server-endpoint">{server.endpoint}</code>
                                </div>
                            </div>
                            <div className="server-status">
                                <div className={`status-indicator ${server.connected ? 'pulse' : ''}`}></div>
                                <span className="status-text">{server.connected ? 'ACTIVE' : 'OFFLINE'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConnectedServers;
