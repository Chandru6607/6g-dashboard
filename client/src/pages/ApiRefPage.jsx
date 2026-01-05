import React from 'react';
import { motion } from 'framer-motion';
import './DocsPage.css'; // Reusing common styles

const ApiRefPage = () => {
    return (
        <motion.div
            className="api-ref-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="api-header">
                <h1>API Reference</h1>
                <p>Detailed documentation for all APIs and protocols used within the 6G Dashboard ecosystem.</p>
            </div>

            <div className="api-content">
                <section className="api-section">
                    <h2>🔌 Model Context Protocol (MCP)</h2>
                    <p>The core communication layer for agent-to-agent and agent-to-dashboard interaction.</p>
                    <div className="api-card">
                        <h3>Connection Endpoint</h3>
                        <div className="code-block">
                            ws://localhost:3001/mcp
                        </div>
                        <p>Standard WebSocket endpoint for MCP client synchronization.</p>
                    </div>
                </section>

                <section className="api-section">
                    <h2>📊 Available Endpoints</h2>
                    <div className="api-grid">
                        <div className="api-card">
                            <h3>GET /api/network/topology</h3>
                            <p>Returns the current network structure including nodes, links, and their status.</p>
                        </div>
                        <div className="api-card">
                            <h3>GET /api/metrics/realtime</h3>
                            <p>Stream real-time performance metrics (latency, throughput, packet loss).</p>
                        </div>
                        <div className="api-card">
                            <h3>POST /api/agents/control</h3>
                            <p>Send control commands to specific agents in the network.</p>
                        </div>
                    </div>
                </section>

                <section className="api-section">
                    <h2>📦 Data Structures</h2>
                    <p>Common objects used across the API:</p>
                    <div className="code-block">
                        {`{
  "nodeId": "string",
  "status": "active" | "inactive",
  "metrics": {
    "load": "number",
    "uptime": "number"
  }
}`}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default ApiRefPage;
