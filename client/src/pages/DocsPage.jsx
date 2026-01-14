import React from 'react';
import { motion } from 'framer-motion';
import './DocsPage.css';

const DocsPage = () => {
    return (
        <motion.div
            className="docs-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="docs-header">
                <h1>6G Digital Twin Guide</h1>
                <p>Welcome to the 6G Digital Twin Platform user guide. This document provides a comprehensive overview of how our ecosystem is integrated, from GNS3 simulation to real-time analytics.</p>
            </div>

            <div className="docs-content">
                <section className="docs-section" id="flow">
                    <h2>🔄 End-to-End Operational Flow</h2>
                    <p>The system follows a state-of-the-art telemetry and control pipeline designed for low-latency 6G research:</p>
                    <div className="flow-steps">
                        <div className="flow-step">
                            <span className="step-num">1</span>
                            <h4>Network Emulation (GNS3)</h4>
                            <p>Real-world network hardware and 6G radios are emulated in GNS3. This creates the ground truth for our topology and raw signal data.</p>
                        </div>
                        <div className="flow-step">
                            <span className="step-num">2</span>
                            <h4>MCP Abstraction (Middle-tier)</h4>
                            <p>The Model Context Protocol (MCP) server acts as a standardized bridge, translating GNS3 API responses into structured resources and tools for the AI agents.</p>
                        </div>
                        <div className="flow-step">
                            <span className="step-num">3</span>
                            <h4>Real-time Synchronization</h4>
                            <p>WebSockets (Socket.io) broadcast the synchronized state across all dashboard pages at 1Hz, ensuring the Digital Twin is always an accurate reflection of the emulator.</p>
                        </div>
                    </div>
                </section>

                <section className="docs-section" id="agents">
                    <h2>🤖 Inbuilt Intelligent Agents</h2>
                    <p>Our dashboard integrates three core Multi-Agent Reinforcement Learning (MARL) agents that optimize the network in real-time:</p>
                    <div className="component-grid">
                        <div className="component-card">
                            <span className="badge badge-purple">Inbuilt</span>
                            <h3>Resource Allocation</h3>
                            <p>Optimizes sub-carrier and power distribution across gNBs to maximize spectral efficiency.</p>
                        </div>
                        <div className="component-card">
                            <span className="badge badge-purple">Inbuilt</span>
                            <h3>Congestion Control</h3>
                            <p>Manages buffer sizes and packet scheduling to minimize e2e latency during peak traffic.</p>
                        </div>
                        <div className="component-card">
                            <span className="badge badge-purple">Inbuilt</span>
                            <h3>Mobility Manager</h3>
                            <p>Handles seamless handovers (HO) and beam-steering for UEs moving at high speeds.</p>
                        </div>
                    </div>
                </section>

                <section className="docs-section" id="gns3">
                    <h2>📡 GNS3 & Digital Twin Integration</h2>
                    <p>The Digital Twin creates a high-fidelity 3D replica of the GNS3 layout:</p>
                    <div className="integration-box">
                        <h3>Coordinate Mapping System</h3>
                        <p>We map the 2D GNS3 workspace (XY Plane) into our 3D Three.js environment:</p>
                        <div className="code-block">
                            {"// Logic: [GNS3 X, GNS3 Y] -> [Digital Twin X, Y (Altitude), Z (GNS3 Y)]"}<br />
                            {"const x = (node.x - planeCenter) / scale;"}<br />
                            {"const y = node.type === 'gNB' ? 1.5 : -1.5;"}<br />
                            {"const z = (node.y - planeCenter) / scale;"}
                        </div>
                        <p>This allows researchers to visualize vertical distribution and beamforming paths that are not visible in GNS3's native 2D interface.</p>
                    </div>
                </section>

                <section className="docs-section" id="mcp">
                    <h2>🧠 MCP Tool & Resource Reference</h2>
                    <p>AI models interact with the system through these standardized MCP schemas:</p>
                    <div className="api-grid">
                        <div className="api-card">
                            <span className="type-label">TOOL</span>
                            <h3>get_network_info</h3>
                            <p>Retrieves the current GNS3 topology and real-time performance metrics (latency, throughput).</p>
                        </div>
                        <div className="api-card">
                            <span className="type-label">RESOURCE</span>
                            <h3>agents://states</h3>
                            <p>Exposes the persistent rewards, episode counts, and training convergence of all inbuilt MARL agents.</p>
                        </div>
                        <div className="api-card">
                            <span className="type-label">TOOL</span>
                            <h3>control_experiment</h3>
                            <p>Allows agents to trigger scenario changes (e.g., Highway Mobility vs Stadium Dense) in the emulator.</p>
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default DocsPage;
