import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DocsPage.css';

const ExpandableCard = ({ title, subtitle, icon, badge, children, typeLabel }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`expandable-card ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="card-header">
                {badge && <span className="badge badge-purple">{badge}</span>}
                {typeLabel && <span className="type-label">{typeLabel}</span>}
                <div className="title-row">
                    <h3>{title}</h3>
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="expand-icon"
                    >
                        ▼
                    </motion.span>
                </div>
                <p className="subtitle">{subtitle}</p>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="card-details"
                    >
                        <div className="details-content">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isExpanded && <div className="expand-hint">Click to see technical details</div>}
        </div>
    );
};

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
                <p>Welcome to the 6G Digital Twin Platform user guide. Click on any box below to reveal deep technical specifications and integration logic.</p>
            </div>

            <div className="docs-content">
                <section className="docs-section" id="flow">
                    <h2>🔄 End-to-End Operational Flow</h2>
                    <div className="flow-steps">
                        <ExpandableCard
                            title="1. Network Emulation"
                            subtitle="Ground truth generation via GNS3"
                            badge="Phase 1"
                        >
                            <p>GNS3 runs a virtualized 6G core and RAN. In this phase:</p>
                            <ul>
                                <li>Docker containers host the 5G/6G protocol stacks.</li>
                                <li>The raw radio environment is emulated using frequency-selective fading models.</li>
                                <li>Traffic generators (Iperf/TRex) inject realistic 6G data profiles.</li>
                            </ul>
                        </ExpandableCard>

                        <ExpandableCard
                            title="2. MCP Abstraction"
                            subtitle="The communication bridge"
                            badge="Phase 2"
                        >
                            <p>The Model Context Protocol (MCP) ensures standard integration:</p>
                            <div className="code-block">
                                {"// Bridge logic"}<br />
                                {"GNS3_API.get('/nodes') -> MCP_Tool('get_network_info') -> Dashboard_UI"}
                            </div>
                            <p>This abstraction allows us to swap GNS3 for other simulators like ns-3 or MATLAB without rewriting the dashboard logic.</p>
                        </ExpandableCard>

                        <ExpandableCard
                            title="3. Live Sync"
                            subtitle="Real-time UI updates"
                            badge="Phase 3"
                        >
                            <p>Every 1,000ms, the server broadcasts the global state:</p>
                            <ul>
                                <li><strong>Socket.io:</strong> Synchronizes the 3D scene and metrics.</li>
                                <li><strong>State Persistency:</strong> Ensures agent progress is saved server-side even if a browser tab is closed.</li>
                            </ul>
                        </ExpandableCard>
                    </div>
                </section>

                <section className="docs-section" id="agents">
                    <h2>🤖 Inbuilt Intelligent Agents</h2>
                    <div className="component-grid">
                        <ExpandableCard
                            title="Resource Allocation"
                            subtitle="Spectral efficiency optimization"
                            badge="MARL Agent"
                        >
                            <h4>Reward Function:</h4>
                            <div className="code-block">
                                {"R = ( Throughput / Baseline ) - ( Latency_Penalty )"}
                            </div>
                            <p>The agent uses Deep Q-Learning (DQN) to select the optimal frequency block for each UE based on its QoS requirements.</p>
                        </ExpandableCard>

                        <ExpandableCard
                            title="Congestion Control"
                            subtitle="Buffer & packet management"
                            badge="MARL Agent"
                        >
                            <h4>Mechanism:</h4>
                            <p>Implements an AI-driven RED (Random Early Detection) variant. It predicts traffic spikes 500ms in advance and preemptively scales buffer depths.</p>
                        </ExpandableCard>

                        <ExpandableCard
                            title="Mobility Manager"
                            subtitle="Handover & beam-steering"
                            badge="MARL Agent"
                        >
                            <h4>Beam-Steering Logic:</h4>
                            <p>Uses a Transformer-based model to predict UE trajectory. It directs 6G sub-THz beams to the predicted location to maintain 100Gbps+ links during mobility.</p>
                        </ExpandableCard>
                    </div>
                </section>

                <section className="docs-section" id="gns3">
                    <h2>📡 GNS3 & Digital Twin Integration</h2>
                    <div className="integration-box">
                        <ExpandableCard
                            title="Coordinate Mapping System"
                            subtitle="2D Planes to 3D Space"
                        >
                            <p>The integration logic translates GNS3 X/Y coordinates into the Digital Twin's 3D grid:</p>
                            <div className="code-block">
                                {"// GNS3 Transformation Logic"}<br />
                                {"const x = (gnb.x - offset) / zoom;"}<br />
                                {"const y = height_adjustment; // gNB=1.5, UE=-1.5"}<br />
                                {"const z = (gnb.y - offset) / zoom;"}
                            </div>
                            <p>This allows for the visualization of beamforming altitude and overlapping coverage spheres in a way native GNS3 cannot.</p>
                        </ExpandableCard>
                    </div>
                </section>

                <section className="docs-section" id="mcp">
                    <h2>🧠 MCP Tool & Resource Reference</h2>
                    <div className="api-grid">
                        <ExpandableCard
                            title="get_network_info"
                            subtitle="Topology & Metrics tool"
                            typeLabel="TOOL"
                        >
                            <p>Retrieves the full GNS3 node graph and real-time telemetry metrics.</p>
                            <div className="code-block">
                                {"// Returns:"}<br />
                                {"{ nodes: [...], links: [...], metrics: { latency: 25, ... } }"}
                            </div>
                        </ExpandableCard>

                        <ExpandableCard
                            title="agents://states"
                            subtitle="Persistence Resource"
                            typeLabel="RESOURCE"
                        >
                            <p>Syncs the MARL training progress across all dashboard instances. Includes:</p>
                            <ul>
                                <li>Episode Count: Total training iterations.</li>
                                <li>Average Reward: Moving average of agent performance.</li>
                                <li>Convergence: Training stability indicator.</li>
                            </ul>
                        </ExpandableCard>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default DocsPage;
