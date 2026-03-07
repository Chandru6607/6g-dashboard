'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import OSIVisualizer to avoid SSR issues with Three.js
const OSIVisualizer = dynamic(() => import('../../components/OSIVisualizer'), {
    ssr: false,
    loading: () => (
        <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f3ff' }}>
            <div className="pulse-dot" style={{ width: 16, height: 16, background: '#00f3ff', marginRight: 10 }}></div>
            Initializing 3D Quantum Stack...
        </div>
    )
});

export default function VizOSIPage() {
    return (
        <motion.main
            className="viz-osi-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '24px' }}
        >
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    VIZ <span style={{ color: 'var(--color-info)' }}>OSI</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
                    Exploring the AI-Integrated 6G Protocol Stack
                </p>
            </div>

            <OSIVisualizer />

            <div className="osi-details-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginTop: '40px'
            }}>
                <div className="panel" style={{ padding: '24px', background: 'rgba(20,20,20,0.8)', border: '1px solid #333', borderRadius: '16px' }}>
                    <h3 style={{ color: '#8b5cf6', margin: '0 0 12px 0' }}>AI-PHY Integration</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Machine learning models integrated directly into the physical layer for real-time beamforming optimization and signal interference cancellation.
                    </p>
                </div>
                <div className="panel" style={{ padding: '24px', background: 'rgba(20,20,20,0.8)', border: '1px solid #333', borderRadius: '16px' }}>
                    <h3 style={{ color: '#ff8800', margin: '0 0 12px 0' }}>Semantic Communications</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        The presentation layer now utilizes AI-driven semantic compression, transmitting meaning rather than raw bits to maximize spectral efficiency.
                    </p>
                </div>
                <div className="panel" style={{ padding: '24px', background: 'rgba(20,20,20,0.8)', border: '1px solid #333', borderRadius: '16px' }}>
                    <h3 style={{ color: '#00ccff', margin: '0 0 12px 0' }}>Autonomous Orchestration</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Network and Transport layers use reinforcement learning to autonomously orchestrate slices and routes based on predicted traffic patterns.
                    </p>
                </div>
            </div>
        </motion.main>
    );
}
