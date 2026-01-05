import React from 'react';
import { motion } from 'framer-motion';
import './DocsPage.css';

const DocsPage = () => {
    return (
        <motion.div
            className="docs-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="docs-header">
                <h1>Documentation</h1>
                <p>Welcome to the 6G Digital Twin Platform documentation. This guide will help you understand the core concepts and features of our ecosystem.</p>
            </div>

            <div className="docs-content">
                <section className="docs-section">
                    <h2>🚀 Getting Started</h2>
                    <p>The 6G Dashboard is a comprehensive monitoring and control interface for next-generation network environments. It leverages Multi-Agent Reinforcement Learning (MARL) and Digital Twin technology to optimize network performance.</p>
                    <ul>
                        <li><strong>Dashboard:</strong> Real-time overview of network health and metrics.</li>
                        <li><strong>Digital Twin:</strong> 3D visualization and simulation of the network topology.</li>
                        <li><strong>Analytics:</strong> Deep dive into historical data and performance trends.</li>
                    </ul>
                </section>

                <section className="docs-section">
                    <h2>🛠️ Core Components</h2>
                    <div className="component-grid">
                        <div className="component-card">
                            <h3>MCP Integration</h3>
                            <p>Our platform uses the Model Context Protocol (MCP) for seamless communication between the dashboard and various AI agents.</p>
                        </div>
                        <div className="component-card">
                            <h3>Real-time Telemetry</h3>
                            <p>High-frequency data streams provide up-to-the-second visibility into system performance and agent behavior.</p>
                        </div>
                        <div className="component-card">
                            <h3>Automated Optimization</h3>
                            <p>MARL agents continuously learn and adapt to maintain optimal network conditions under varying loads.</p>
                        </div>
                    </div>
                </section>

                <section className="docs-section">
                    <h2>📖 User Guides</h2>
                    <p>Check out our detailed guides for specific workflows:</p>
                    <div className="guide-links">
                        <a href="#setup">Initial Setup Guide</a>
                        <a href="#monitoring">Advanced Monitoring</a>
                        <a href="#troubleshooting">Troubleshooting Common Issues</a>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default DocsPage;
