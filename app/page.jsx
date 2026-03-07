'use client';

import NetworkOverview from '../components/NetworkOverview';
import SystemHealth from '../components/SystemHealth';
import ConnectedServers from '../components/ConnectedServers';
import ExperimentManager from '../components/ExperimentManager'; // Added import for ExperimentManager
import { motion } from 'framer-motion';
import { useState } from 'react'; // Added import for useState

export default function DashboardPage() {
    const [topologyType, setTopologyType] = useState('Mesh');

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
        <main className="dashboard curvy-theme">
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

            <div className="multi-agent-rl panel glass">
                <div className="panel-header">
                    <h2 className="panel-title">🧠 Agent Training</h2>
                </div>
                <div className="panel-body">
                    <ExperimentManager />
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
        </main>
    );
}
