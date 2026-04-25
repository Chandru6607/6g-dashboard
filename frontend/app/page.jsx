'use client';

import { useState, useEffect } from 'react';
import NetworkOverview from '../components/NetworkOverview';
import SystemHealth from '../components/SystemHealth';
import ConnectedServers from '../components/ConnectedServers';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [topologyType, setTopologyType] = useState('Mesh');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading completion
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleTopologyChange = async (type) => {
        try {
            // This endpoint doesn't exist yet, we'll add it or use an existing one
            const res = await fetch('/api/network/topology/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            const data = await res.json();
            if (data.success) {
                setTopologyType(type);
            }
        } catch (error) {
            console.error('Failed to change topology:', error);
        }
    };

    return (
        <main className="dashboard-container">
            {isLoading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Initializing 6G Command Fabric...</p>
                </div>
            ) : (
                <div className="dashboard-grid">
                    <section className="grid-item network-section">
                        <NetworkOverview topologyType={topologyType} />
                    </section>

                    <aside className="grid-item side-section">
                        <div className="panel glass">
                            <div className="panel-header">
                                <h2 className="panel-title">📡 Logic Engine Status</h2>
                            </div>
                            <div className="panel-body no-padding">
                                <ConnectedServers />
                            </div>
                        </div>
                    </aside>

                    <section className="grid-item health-section">
                        <div className="panel glass">
                            <div className="panel-header">
                                <h2 className="panel-title">🏥 System Integrity & Live Telemetry</h2>
                            </div>
                            <div className="panel-body">
                                <SystemHealth />
                            </div>
                        </div>
                    </section>
                </div>
            )}

            <style jsx>{`
                .dashboard-container {
                    width: 100%;
                    height: 100%;
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    grid-template-rows: auto 1fr;
                    gap: 20px;
                }
                .network-section { grid-column: 1; grid-row: 1; }
                .side-section { grid-column: 2; grid-row: 1 / span 2; }
                .health-section { grid-column: 1; grid-row: 2; }
                .loading-state {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 80vh;
                    gap: 20px;
                    color: var(--accent-primary);
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(0, 243, 255, 0.1);
                    border-top-color: var(--accent-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .no-padding { padding: 0 !important; }
            `}</style>
        </main>
    );
}
