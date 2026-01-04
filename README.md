# 6G Digital Twin Dashboard

Enterprise-grade web dashboard for monitoring and controlling a 6G Communication Network Digital Twin Ecosystem with Multi-Agent Reinforcement Learning capabilities.

## Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: Express.js + Node.js
- **Real-time**: Socket.io (WebSocket)
- **Visualization**: Chart.js with react-chartjs-2
- **Styling**: CSS with Glassmorphism design

## Features

- 🌐 **Global Network Overview** - Real-time 6G network topology visualization with animated nodes
- 🤖 **Digital Twin Control** - Sync status, mode toggle, and AI-powered predictive analytics
- 🧠 **Multi-Agent RL** - Monitor intelligent agents with reward curves and convergence tracking
- 📡 **Event-Driven Telemetry** - Live Kafka/MQTT event streaming with severity filtering
- 🧪 **Experiment Manager** - Configure and control network scenarios and traffic profiles
- 📊 **Performance Analytics** - Compare baseline vs proposed approaches with export functionality
- ⚠️ **System Health & Alerts** - Real-time alert notifications with severity-based color coding

## Installation

### Install All Dependencies

```bash
npm run install:all
```

Or manually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

## Development

Start both frontend and backend servers concurrently:

```bash
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend server (port 5000)
npm run server:dev

# Terminal 2 - Frontend dev server (port 3000)
npm run client:dev
```

Open your browser and navigate to: **http://localhost:3000**

## Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Project Structure

```
6g-dashboard/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom hooks (useSocket)
│   │   ├── services/        # API and WebSocket services
│   │   ├── styles/          # Global and component styles
│   │   ├── App.jsx          # Main application
│   │   └── main.jsx         # Entry point
│   └── package.json
├── server/                   # Express.js backend
│   ├── routes/              # API routes
│   ├── websocket/           # WebSocket handlers
│   ├── data/                # Mock data generators
│   ├── server.js            # Application entry
│   └── package.json
└── package.json             # Root package.json
```

## API Endpoints

- `GET /api/network/status` - Network topology and metrics
- `GET /api/agents` - Agent states and metrics
- `GET /api/agents/rewards` - Reward curves data
- `GET /api/twin/predictive` - Predictive analytics
- `GET /api/analytics` - Performance analytics
- `POST /api/experiments/start` - Start experiment
- `POST /api/experiments/stop` - Stop experiment
- `GET /api/health` - Health check

## WebSocket Events

**Server → Client:**
- `network:metrics` - Live network metrics
- `agents:update` - Agent state updates
- `telemetry:event` - Telemetry events
- `system:alert` - System alerts
- `sync:progress` - Sync progress updates
- `telemetry:throughput` - Event throughput

**Client → Server:**
- `experiment:start` - Start experiment
- `experiment:stop` - Stop experiment

## Design System

**Colors:**
- Cyan (`#00f3ff`) - Primary accent
- Electric Blue (`#0066ff`) - Secondary accent
- Violet (`#8b5cf6`) - Agent highlights
- Success Green (`#10b981`)
- Warning Orange (`#f59e0b`)
- Danger Red (`#ef4444`)

**Visual Effects:**
- Glassmorphism with backdrop blur
- Neon glow effects on interactive elements
- Smooth transitions and micro-animations
- Canvas-based network visualization

## License

MIT

## Author

6G Digital Twin Research Team
