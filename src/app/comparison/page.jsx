'use client';

import { motion } from 'framer-motion';
import ConnectedServers from '../../components/ConnectedServers';
import './ComparisonPage.css';

export default function ComparisonPage() {
    return (
        <motion.div
            className="comparison-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="page-header">
                <h1 className="page-title">Network Comparison</h1>
                <p className="page-subtitle">Compare different scenarios and configurations</p>
            </div>

            <div className="dashboard">
                <div style={{ gridColumn: 'span 12' }}>
                    <ConnectedServers />
                </div>
            </div>
        </motion.div>
    );
}
