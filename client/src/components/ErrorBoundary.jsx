import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("🔥 [ErrorBoundary] Caught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    background: '#1a1f3a',
                    color: '#ffffff',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    <h1 style={{ color: '#ef4444' }}>Something went wrong.</h1>
                    <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                        The 6G Dashboard encountered an unexpected error.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #00f3ff, #0066ff)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Application
                    </button>
                    <pre style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        maxWidth: '80%',
                        overflow: 'auto'
                    }}>
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
