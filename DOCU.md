# 🌐 6G Digital Twin Dashboard - The Ultimate Technical Guide

Welcome to the **6G Digital Twin Dashboard**, an advanced, full-stack orchestration platform designed for simulating, analyzing, and training AI agents in next-generation 6G network environments.

---

## 🏗️ 1. System Architecture

The project follows a robust, event-driven architecture designed for high-performance real-time visualization and scalable backend processing.

### 🌐 Frontend (Next.js Application)
- **Framework**: [Next.js 15+](https://nextjs.org/) with App Router.
- **Rendering**: React 18 with modern `use` and `Transition` hooks.
- **3D Engine**: [React Three Fiber](https://r3f.docs.pmnd.rs/) & Three.js for immersive 6G node visualization.
- **Data Viz**: Chart.js and Recharts for live KPI streaming.
- **Animations**: Framer Motion for premium UI transitions.

### 🔌 Real-Time Layer (Socket.io)
- **WebSocket Protocol**: Bidirectional streaming between the Express server and Next.js client.
- **Latency**: Sub-50ms updates for node position and metric data.
- **Events**: `network:update`, `agents:update`, `telemetry:event`, `system:alert`.

### 🎛️ Backend (Express Server)
- **Engine**: Node.js with ESM modules.
- **Communication**: RESTful API endpoints + WebSocket handlers.
- **Scalability**: Integrated **Redis Pub/Sub** adapter for horizontal scaling across multiple instances.

---

## 🌟 2. Featured Innovations

### 🤖 Rescue Agent (AI Self-Healing)
Located at [`src/server/services/rescueAgent.js`](file:///c:/Users/chand/OneDrive/Desktop/6g-dashboard/6g-dashboard/src/server/services/rescueAgent.js), the Rescue Agent acts as a watchdog for the entire ecosystem.
- **Health Checks**: Monitors node statuses and data flow consistency.
- **Automatic Healing**: Proactively "optimizes" degraded nodes (gNBs/UEs) using randomized probability models.
- **State Persistence**: Backs up the current simulation state to `simulation_state_backup.json` every 10 seconds and restores it on server restart.
- **Troubleshooting Tool**: Accessible via `/api/system/rescue` to force a global reset and fix.

### 🔌 Model Context Protocol (MCP) Server
Integrated directly into the backend via [`src/server/mcpServer.js`](file:///c:/Users/chand/OneDrive/Desktop/6g-dashboard/6g-dashboard/src/server/mcpServer.js).
- **Resources**: Exposes `network://status`, `network://topology`, and `agents://states` as standard MCP resources.
- **Tools**: Provides `get_network_info`, `get_analytics`, and `control_experiment` tools for external AI agents to interact with the dashboard.
- **Transport**: Uses **Server-Sent Events (SSE)** for standardized communication.

### 🎭 Dynamic Topology Engine
Simulates 6G physical environment changes through 6 distinct topology types:
- **Mesh**: Grid-based multi-connection network.
- **Ring**: Circular node arrangement.
- **Bus**: Linear, backbone-style networking.
- **Star**: Central hub with spoke connectivity.
- **Tree**: Hierarchical, multi-level infrastructure.
- **Hybrid**: Combined Mesh-Star connectivity.

---

## 🤖 3. Multi-Agent Reinforcement Learning (MARL)

The dashboard orchestrates three specialized AI agents that learn in real-time:
1.  **Resource Allocation Agent**: Optimizes spectrum and frequency distribution.
2.  **Congestion Control Agent**: Manages packet flow and avoids bottlenecks.
3.  **Mobility Management Agent**: Handles seamless UEs-to-gNB handovers.

- **Training Mode**: Agents increment episodes and convergence values exponentially.
- **Inference Mode**: Agents operate at peak efficiency based on learned weights.
- **Automatic Retraining**: When the topology type changes, agents reset their state to adapt to the new physical environment.

---

## 📁 4. Project Directory Structure

```text
6g-dashboard/
├── 📂 backend/           # Classic backend modules
├── 📂 frontend/          # Main Next.js 15 application
│   ├── 📂 app/           # App Router pages (Overview, Analytics, Twin)
│   ├── 📂 components/    # 3D and UI atomic components
│   └── 📂 hooks/         # Custom React hooks (useSocket, useNetwork)
├── 📂 src/
│   └── 📂 server/        # Core Backend Service Logic
│       ├── 📂 data/      # Mock Generators & Simulation State
│       ├── 📂 routes/    # Express API routes
│       ├── 📂 services/  # Rescue Agent & background tasks
│       ├── 📂 websocket/ # Socket.io handlers
│       └── 📄 mcpServer.js # MCP Implementation
├── 📄 server.js          # Unified entry point for Next.js + Express
└── 📄 DOCU.md            # This Super Guide
```

---

## 🛠️ 5. Developer Tools & Commands

### 🚀 Running the Project
```bash
# Start the unified development server (Express + Next.js)
npm run dev

# Build for production
npm run build

# Start in production mode
npm start
```

### 📋 API Reference (Base: `/api`)
- `GET /network/status`: Current topology and performance metrics.
- `GET /agents`: List of all agents and their training states.
- `POST /system/autoconfig`: Starts the simulation data flow.
- `POST /system/rescue`: Triggers the Rescue Agent troubleshooting.

---

## 🚀 6. Future Vision: Phase 3
- **Federated Learning**: Data stays local; models are shared.
- **Digital Twin Real-Time Sync**: Integration with actual NVIDIA Aerial SDK or O-RAN hardware.
- **Quantum-Safe Networking**: Implementation area for PQC (Post-Quantum Cryptography) simulations.

---
*Generated by Antigravity AI for the 6G Innovation Team.*
spects from architecture to deployment and future roadmap.
