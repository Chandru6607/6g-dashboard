'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Docs.css';

const navTree = [
    {
        title: 'Get started',
        links: [
            { id: 'what-is-6g', label: 'What is 6G Control?' }
        ]
    },
    {
        title: 'Architecture',
        links: [
            { id: 'system-design', label: 'System Design' },
            { id: 'ai-native', label: 'AI-Native Stack' },
            { id: 'digital-twin', label: 'Digital Twin Sync' }
        ]
    },
    {
        title: 'API Reference',
        links: [
            { id: 'rest-api', label: 'REST Interfaces' },
            { id: 'websocket', label: 'WebSocket Streams' },
            { id: 'mcp-integration', label: 'MCP Protocol Setup' }
        ]
    }
];

// Helper to deduce Right-side TOC based on active page
const getTOC = (pageId) => {
    switch (pageId) {
        case 'what-is-6g':
            return [
                { id: 'overview', label: 'Overview' },
                { id: 'why-it-matters', label: 'Why does 6G matter?' },
                { id: 'start-building', label: 'Start Building' }
            ];
        case 'system-design':
            return [
                { id: 'topology', label: 'Simulation Topology' },
                { id: 'diagram', label: 'Architecture Diagram' }
            ];
        case 'rest-api':
            return [
                { id: 'endpoints', label: 'Available Endpoints' },
                { id: 'auth', label: 'Authentication' }
            ];
        case 'ai-native':
            return [
                { id: 'overview', label: 'The AI-Native Stack' },
                { id: 'l1-l3', label: 'PHY/MAC/NET Layers' },
                { id: 'l4-l7', label: 'Transport & Application' }
            ];
        case 'digital-twin':
            return [
                { id: 'overview', label: 'Digital Twin Sync' },
                { id: 'telemetry', label: 'Telemetry Ingestion' },
                { id: 'simulation', label: 'Simulation vs Reality' }
            ];
        case 'websocket':
            return [
                { id: 'overview', label: 'WebSocket Streams' },
                { id: 'channels', label: 'Multiplexed Channels' },
                { id: 'backpressure', label: 'Backpressure Strategies' }
            ];
        case 'mcp-integration':
            return [
                { id: 'overview', label: 'MCP Protocol Setup' },
                { id: 'architecture', label: 'Architecture' },
                { id: 'tools', label: 'Exposed Tools' }
            ];
        default:
            return [];
    }
};

export default function DocsPage() {
    const [activePage, setActivePage] = useState('what-is-6g');
    const [activeSection, setActiveSection] = useState('');

    // Auto-select first section on page change
    useEffect(() => {
        const toc = getTOC(activePage);
        if (toc.length > 0) setActiveSection(toc[0].id);
    }, [activePage]);

    return (
        <div className="docs-container">
            {/* Left Sidebar - Nav Tree */}
            <aside className="docs-sidebar-left">
                {navTree.map(group => (
                    <div key={group.title} className="docs-nav-group">
                        <div className="docs-nav-title">{group.title}</div>
                        {group.links.map(link => (
                            <button
                                key={link.id}
                                className={`docs-nav-link ${activePage === link.id ? 'active' : ''}`}
                                onClick={() => setActivePage(link.id)}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                ))}
            </aside>

            {/* Center Content */}
            <main className="docs-main-content">
                <motion.div
                    className="docs-article"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={activePage}
                >
                    {activePage === 'what-is-6g' && (
                        <>
                            <h1 id="overview">What is the 6G Control Center?</h1>
                            <p>
                                6G Control is an open-source standard and orchestration dashboard for managing next-generation telecommunication protocols dynamically infused with AI.
                            </p>
                            <p>
                                Using 6G Control, network administrators can connect AI applications directly to OSI layers to perform semantic compression, predictive maintenance, and autonomous node scaling. Think of it as a standardized neural protocol for your network fabric.
                            </p>

                            <h2 id="why-it-matters">Why does 6G matter?</h2>
                            <p>
                                While 5G bolted AI onto the edges of networks, 6G designs the protocol stack from the ground up to be <strong>AI-Native</strong>. The 6G Control Center visualizes this via the <code>Viz OSI</code> module, allowing you to peek into the AI-PHY and Semantic MAC layers instantaneously.
                            </p>
                        </>
                    )}

                    {activePage === 'system-design' && (
                        <>
                            <h1 id="topology">Enterprise System Design</h1>
                            <p>
                                The architecture links a React (Next.js) frontend client through an Express.js WebSocket server directly into a Python-based Multi-Agent Reinforcement Learning engine and an active Model Context Protocol (MCP) server.
                            </p>

                            <h2 id="diagram">Architecture Diagram</h2>
                            <div className="arch-diagram-frame">
                                <div className="arch-boxes">
                                    <div className="arch-node">
                                        <h4>Next.js Client</h4>
                                        <p>React Three Fiber, Framer Motion</p>
                                    </div>
                                    <div className="arch-arrow">↔</div>
                                    <div className="arch-node" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                                        <h4>Node.js Express</h4>
                                        <p>Socket.IO, MCP SDK, REST API</p>
                                    </div>
                                    <div className="arch-arrow">↔</div>
                                    <div className="arch-node" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                        <h4>Python Simulation</h4>
                                        <p>Q-Learning, Digital Twin Engine</p>
                                    </div>
                                </div>
                            </div>
                            <p>
                                The bidirectional data flows shown above guarantee that the real-world Digital Twin operates identically to the deployed simulation environment, allowing AI to train natively.
                            </p>
                        </>
                    )}

                    {activePage === 'rest-api' && (
                        <>
                            <h1 id="endpoints">API Reference</h1>
                            <p>The 6G dashboard exposes a set of REST endpoints for programmatic control.</p>

                            <pre><code>
                                {`// Fetch Node Telemetry
GET /api/network/telemetry

Response:
{
  "status": "success",
  "data": {
    "activeNodes": 42,
    "systemLatency": "1.2ms"
  }
}`}
                            </code></pre>

                            <h2 id="auth">Authentication</h2>
                            <p>All endpoints currently operate on an open internal network scheme for development purposes. Enterprise SSO will be rolled out in v2.0.</p>
                        </>
                    )}

                    {/* AI-NATIVE STACK */}
                    {activePage === 'ai-native' && (
                        <>
                            <h1 id="overview">The AI-Native Stack</h1>
                            <p>
                                Welcome to the paradigm shift of the 6G era. Unlike previous generations of mobile networks where Artificial Intelligence and Machine Learning were treated as "add-ons" running in Edge clouds or central data centers, the 6G Control standard enforces an <strong>AI-Native Stack</strong>. This means that intelligence is baked directly into every layer of the Open Systems Interconnection (OSI) model, specifically from the Physical layer (L1) all the way up to the Application layer (L7). The architecture eliminates traditional rigid algorithmic boundaries in favor of continuous parameter adaptation based on Deep Reinforcement Learning (DRL) models.
                            </p>
                            <p>
                                By utilizing Semantic and Goal-Oriented Communications, the AI-Native Stack shifts the goalpost from "transmitting bits without error" to "transmitting the meaning of data." This ensures that when network congestion climbs, the protocol can autonomously discard semantically useless information—preserving true intent while massively reducing bandwidth requirements. This documentation will guide you through exactly how that operates under the hood, layer by magical layer.
                            </p>

                            <h2 id="l1-l3">Physical to Network Layers (AI-PHY/MAC/NET)</h2>
                            <p>
                                Traditional Physical Layers utilize rigid constellation maps and unyielding channel coding algorithms like LDPC or Polar Codes. In our AI-Native stack, the transmitter and receiver act as an Autoencoder via Neural Networks. The transmitter learns how to encode bits into waveforms directly suited for the currently observed channel state, while the receiver learns how to decode these highly customized noise-resistant waveforms. This allows for an adaptive modulation and coding scheme that defies standard Shannon Limits.
                            </p>
                            <p>
                                At the Data Link (MAC) layer, Deep Reinforcement agents schedule resources. Rather than utilizing deterministic Round-Robin or Proportional Fair scheduling which struggle under massive IoT scales, the AI scheduler predicts traffic bursts before they happen. It dynamically groups User Equipment (UEs) into priority clusters based on their unexpressed intentions.
                            </p>

                            <div className="arch-diagram-frame">
                                <div className="arch-boxes">
                                    <div className="arch-node">
                                        <h4>AI-PHY (Autoencoder)</h4>
                                        <p>Waveform Synthesis</p>
                                    </div>
                                    <div className="arch-arrow">↓</div>
                                    <div className="arch-node">
                                        <h4>AI-MAC (Scheduler)</h4>
                                        <p>Reinforcement Allocation</p>
                                    </div>
                                    <div className="arch-arrow">↓</div>
                                    <div className="arch-node">
                                        <h4>AI-NET (Routing)</h4>
                                        <p>Graph Neural Routing</p>
                                    </div>
                                </div>
                            </div>

                            <h2 id="l4-l7">Transport to Application Layers</h2>
                            <p>
                                Congestion control in the Transport Layer (TCP/UDP equivalents) is handled by LSTM (Long Short-Term Memory) networks that predict queue limits across backhaul links. By foreseeing bottlenecks 50 to 100 milliseconds into the future, the stack proactively shapes traffic.
                            </p>
                            <p>
                                The Application Layer no longer simply requests "video." It provides an AI Intent. The network understands that a user is engaging in holographic telepresence, and therefore prioritizes ultra-low latency and spatial audio synchronization over raw pixel-perfect bulk transfer.
                            </p>
                        </>
                    )}

                    {/* DIGITAL TWIN SYNC */}
                    {activePage === 'digital-twin' && (
                        <>
                            <h1 id="overview">Digital Twin Synchronization</h1>
                            <p>
                                The 6G Control platform relies on an ultra-high fidelity **Digital Twin**—a real-time, mathematically perfect virtual representation of your physical radio access network (RAN) and core network. Because physical testing of massive MIMO arrays and millions of IoT devices is financially prohibitive and dangerously unpredictable, the Digital Twin serves as the absolute source of truth for all training algorithms.
                            </p>
                            <p>
                                But what happens when the Twin drifts from reality? This module covers the Sync engines that ensure 99.999% state parity between physical hardware and the React/Three.js visualizer.
                            </p>

                            <h2 id="telemetry">Real-Time Telemetry Ingestion</h2>
                            <p>
                                Hardware base stations (gNBs) constantly publish thousands of state variables—antenna tilt arrays, thermal variance, power consumption, and active beamforming trajectories. This data is pumped into the Express backend at staggering rates (often exceeding 10,000 events per second) using Kafka and UDP streams. The synchronization engine compresses this multidimensional data matrix into a latent state using a Variational Autoencoder, which is then mapped into the 3D space in your web browser.
                            </p>

                            <h2 id="simulation">Simulation vs physical state</h2>
                            <p>
                                Our Python backend operates the actual twin. When the physical network experiences an anomaly (e.g., severe weather disrupting millimeter-wave propagation), the Digital Twin instantly injects that exact mathematical noise profile into the simulation. The Multi-Agent system then begins running millions of parallel training epochs per minute inside the Twin to discover a routing solution. Once a solution is confirmed within the Twin (achieving a high confidence threshold), the weights are compiled and flashed down to the physical base stations via the MCP link.
                            </p>

                            <div className="arch-diagram-frame">
                                <div className="arch-boxes">
                                    <div className="arch-node">
                                        <h4>Physical Network</h4>
                                        <p>Raw hardware metrics</p>
                                    </div>
                                    <div className="arch-arrow">→</div>
                                    <div className="arch-node" style={{ borderColor: 'var(--nvidia-green)' }}>
                                        <h4>Sync Engine (Twin)</h4>
                                        <p>Anomaly Sandbox</p>
                                    </div>
                                    <div className="arch-arrow">→</div>
                                    <div className="arch-node" style={{ borderColor: '#ef4444' }}>
                                        <h4>Policy Flasher</h4>
                                        <p>Weights injection</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* WEBSOCKET STREAMS */}
                    {activePage === 'websocket' && (
                        <>
                            <h1 id="overview">WebSocket Streaming Infrastructure</h1>
                            <p>
                                In 6G dashboards, REST APIs are too slow for state transmission. To render hundreds of moving User Equipment endpoints, dynamically shifting topological links, and rapid machine learning reward curves, we rely on a sophisticated WebSocket multiplexing architecture.
                            </p>

                            <h2 id="channels">Multiplexed Channels</h2>
                            <p>
                                Upon establishing a secure `wss://` handshake with the Express.js server, the client immediately subscribes to specific binary buffer channels, avoiding JSON parsing overheads where possible.
                            </p>

                            <pre><code>
                                {`// Example client subscription logic
const socket = io('wss://6g-center.internal');

socket.on('network:update', (buffer) => {
   // Binary unpack the topology
   const topology = decodeMagicalBinary(buffer);
   updateReactThreeFiber(topology);
});

socket.on('agents:update', (data) => {
   // JSON is retained purely for agent metric string reads
   console.log("Agent convergence:", data.convergence);
});`}
                            </code></pre>

                            <h2 id="backpressure">Backpressure and Dropping Strategies</h2>
                            <p>
                                What happens when the simulation fires 5,000 telemetry events a second, but the React DOM can only render at 60 FPS? The WebSocket server implements an intelligent backpressure valve. Events tagged as `critical` (e.g., node outage) bypass the queue and are sent reliably. High-frequency noise metrics (like per-millisecond latency jitter) are accumulated and averaged mathematically serverside, sending only the resulting mean/median payload block every 16ms (syncing directly with the browser's `requestAnimationFrame`).
                            </p>
                        </>
                    )}

                    {/* MCP PROTOCOL */}
                    {activePage === 'mcp-integration' && (
                        <>
                            <h1 id="overview">Model Context Protocol (MCP) Setup</h1>
                            <p>
                                The Model Context Protocol (MCP) is the absolute core of our open-source AI integration layer. Originally designed to allow language models to securely access local file systems, 6G Control extends the MCP spec to allow massive frontier models (like Claude, Gemini, or Llama) to securely inject code, configurations, and reinforcement learning parameters directly into active telecom infrastructure.
                            </p>

                            <h2 id="architecture">Protocol Architecture</h2>
                            <p>
                                The Express backend operates an official MCP Server using the `@modelcontextprotocol/sdk`. It exposes bespoke SDK tools. When an autonomous AI agent decides that the network topology is failing, it doesn't just display a warning; it connects via MCP, reads the current topology matrix, formulates a new routing strategy in Python, and invokes an MCP tool call to deploy it.
                            </p>

                            <div className="arch-diagram-frame">
                                <div className="arch-boxes">
                                    <div className="arch-node">
                                        <h4>Frontier AI Model</h4>
                                        <p>Deep reasoning</p>
                                    </div>
                                    <div className="arch-arrow">↔</div>
                                    <div className="arch-node" style={{ borderColor: 'var(--color-info)' }}>
                                        <h4>MCP Server</h4>
                                        <p>Express.js Auth/Transport</p>
                                    </div>
                                    <div className="arch-arrow">↔</div>
                                    <div className="arch-node">
                                        <h4>6G Digital Twin</h4>
                                        <p>Deployment Execution</p>
                                    </div>
                                </div>
                            </div>

                            <h2 id="tools">Exposed Tools</h2>
                            <p>
                                By default, the 6G Control Center exposes the following tools to connecting MCP clients:
                            </p>
                            <ul>
                                <li><code>get_network_topology()</code> - Returns the current structural graph of all active base stations.</li>
                                <li><code>set_topology_hyperparameters(params)</code> - Injects new reinforcement learning variables directly into the twin.</li>
                                <li><code>trigger_handover(ue_id, target_gnb)</code> - Forces a specific device to migrate base stations instantly.</li>
                            </ul>
                        </>
                    )}
                </motion.div>
            </main>

            {/* Right Sidebar - TOC */}
            <aside className="docs-sidebar-right">
                <div className="toc-title">On this page</div>
                <ul className="toc-list">
                    {getTOC(activePage).map(item => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveSection(item.id);
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
