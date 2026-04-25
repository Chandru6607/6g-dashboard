'use client';

import { useState, useEffect } from 'react';
import NetworkOverview from '../components/NetworkOverview';
import SystemHealth from '../components/SystemHealth';
import ConnectedServers from '../components/ConnectedServers';
import { motion } from 'framer-motion';
import apiService from '../hooks/apiService';

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
        // Optimistic update so button shows active immediately
        setTopologyType(type);
        try {
            await apiService._fetch('/api/network/topology/select', {
                method: 'POST',
                body: JSON.stringify({ type })
            });
        } catch (error) {
            console.error('Failed to change topology on backend:', error);
            // Keep the optimistic UI change — local simulation still works
        }
    };

    return (
        <main className="dashboard curvy-theme">
            {isLoading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh',
                    color: '#00f3ff',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    Loading 6G Dashboard...
                </div>
            ) : (
                <>
                    <div className="network-overview panel glass">
                        <div className="panel-header">
                            <h2 className="panel-title">🌐 Global Network Topology</h2>
                            <div className="topology-selector">
                                {['Mesh', 'Star', 'Ring', 'Bus', 'Hybrid'].map(type => (
                                    <button
                                        key={type}
                                        className={`topo-btn ${topologyType === type ? 'active' : ''}`}
                                        onClick={() => handleTopologyChange(type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="panel-body">
                            <NetworkOverview topologyType={topologyType} />
                        </div>
                    </div>

                    <div className="digital-twin-control panel glass">
                        <div className="panel-header">
                            <h2 className="panel-title">🤖 Prediction Engine</h2>
                        </div>
                        <div className="panel-body">
                            <ConnectedServers />
                        </div>
                    </div>



                    <div className="system-health panel glass full-width">
                        <div className="panel-header">
                            <h2 className="panel-title">🏥 System Integrity</h2>
                        </div>
                        <div className="panel-body">
                            <SystemHealth />
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
