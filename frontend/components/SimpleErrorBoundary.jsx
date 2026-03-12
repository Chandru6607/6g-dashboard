'use client';

import React from 'react';

class SimpleErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
                    <h1 style={{ color: '#00f3ff', marginBottom: '20px' }}>
                        6G Digital Twin Dashboard
                    </h1>
                    <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.8 }}>
                        Demo Mode - Visualization System
                    </p>
                    
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid #00f3ff',
                        borderRadius: '12px',
                        padding: '30px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{ color: '#f59e0b', marginBottom: '15px' }}>
                            🎯 Demo Features Available:
                        </h2>
                        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
                            <li>🌐 Network Topology Visualization</li>
                            <li>🧠 AI Agent Training Simulation</li>
                            <li>📊 Real-time Performance Metrics</li>
                            <li>📡 System Health Monitoring</li>
                            <li>🔄 Automatic Topology Switching</li>
                        </ul>
                        
                        <div style={{ marginTop: '20px' }}>
                            <button 
                                onClick={() => window.location.href = '/'}
                                style={{
                                    background: '#00f3ff',
                                    color: '#0f172a',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                🏠 Go to Dashboard
                            </button>
                            <button 
                                onClick={() => window.location.href = '/digital-twin'}
                                style={{
                                    background: '#8b5cf6',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                🔧 Try Twin Engine
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '30px', fontSize: '14px', opacity: 0.6 }}>
                        <p>6G Digital Twin Dashboard - Research & Education Platform</p>
                        <p>Advanced Network Visualization with AI Agent Training</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SimpleErrorBoundary;
