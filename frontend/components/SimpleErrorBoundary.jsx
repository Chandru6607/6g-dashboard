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
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                    <h1 style={{ color: '#00f3ff', marginBottom: '10px' }}>
                        System Interface Error
                    </h1>
                    <p style={{ fontSize: '16px', marginBottom: '30px', opacity: 0.8 }}>
                        The 6G Dashboard encountered an unexpected issue while rendering.
                    </p>
                    
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        padding: '20px',
                        maxWidth: '800px',
                        margin: '0 auto',
                        textAlign: 'left',
                        fontFamily: 'monospace',
                        overflowX: 'auto'
                    }}>
                        <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '10px' }}>Error Details:</p>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {this.state.error?.toString()}
                        </pre>
                    </div>
                    
                    <div style={{ marginTop: '30px' }}>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#00f3ff',
                                color: '#0f172a',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Reload & Retry
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SimpleErrorBoundary;
