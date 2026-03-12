# 6G Digital Twin Dashboard

A production-ready, real-time 6G network simulation dashboard with automatic topology switching and AI agent training visualization.

## 🚀 Features

### Core Functionality
- **Real-time 6G Network Simulation** with automatic topology switching
- **AI Agent Training** visualization with live progress tracking
- **3D Digital Twin** visualization using React Three Fiber
- **WebSocket Streaming** for real-time data updates
- **Multi-Topology Support**: Mesh, Ring, Bus, Star, Tree, Hybrid
- **Automatic Training**: Base stations and UEs train across different topologies
- **Production-Ready Architecture**: Separate frontend/backend for cloud deployment

### Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Next.js)     │    │   (Express)     │
│   Vercel Deploy  │    │   Render Deploy   │
│                 │    │                 │
│   React Three    │    │   Socket.io     │
│   Fiber          │    │   Redis Pub/Sub  │
│                 │    │                 │
└─────────────────┘    └─────────────────┘
         ↕ WebSocket ↕                     ↕ API ↕
```

## 🏗️ Project Structure

```
6g-dashboard/
├── frontend/                 # Next.js application (Vercel)
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   └── package.json       # Frontend dependencies
├── backend/                  # Express server (Render)
│   ├── src/               # Backend source code
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── websocket/      # WebSocket handlers
│   │   └── data/          # Data generators
│   ├── redis.js           # Redis configuration
│   └── server.js          # Main server file
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Redis (optional, for production scaling)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Chandru6607/6g-dashboard.git
cd 6g-dashboard
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

3. **Environment Setup**
```bash
# Frontend environment (create frontend/.env.local)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Backend environment (optional)
REDIS_URL=redis://localhost:6379
PORT=3001
```

4. **Start Development Servers**
```bash
# Start backend (terminal 1)
cd backend
npm start

# Start frontend (terminal 2)
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- WebSocket: ws://localhost:3001

## 🎯 Key Features

### Automatic Topology Switching
- **Cycles every 10 seconds** through different network topologies
- **Resets training states** when topology changes
- **Real-time visualization** of topology transitions
- **Supports 6 topologies**: Mesh, Ring, Bus, Star, Tree, Hybrid

### AI Agent Training
- **3 Training Agents**: Resource Allocation, Congestion Control, Mobility Management
- **Real-time progress tracking** with episodes and rewards
- **Visual training indicators** in 3D environment
- **Automatic convergence** monitoring

### 3D Digital Twin
- **Interactive network visualization** with React Three Fiber
- **Real-time node positioning** based on topology
- **Training status visualization** with color coding and animations
- **Performance metrics** overlay

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy frontend to Vercel
cd frontend
vercel --prod
```

### Backend (Render)
```bash
# Deploy backend to Render
# Set root directory: backend
# Build command: npm install
# Start command: node server.js
# Environment variables: REDIS_URL, PORT
```

### Production with Redis
```bash
# Redis providers
REDIS_URL=redis://your-redis-provider.com:6379

# Example providers
- Render Redis
- Upstash Redis
- Redis Cloud
```

## 📊 API Endpoints

### Network Management
- `GET /api/network/status` - Get current network topology and metrics
- `POST /api/network/topology/select` - Manually select topology
- `POST /api/system/autoconfig` - Start automatic simulation
- `POST /api/system/disconnect` - Stop simulation

### Agent Management
- `GET /api/agents` - Get all agent states
- `POST /api/agents/:id/toggle` - Toggle agent training/inference
- `GET /api/agents/rewards` - Get training reward curves

### Analytics
- `GET /api/analytics` - Get performance analytics
- `GET /api/analytics/export` - Export analytics data
- `GET /api/twin/predictive` - Get predictive analytics

## 🔌 WebSocket Events

### Real-time Updates
- `network:update` - Network topology and metrics changes
- `agents:update` - Agent training progress
- `topology:changed` - Topology switch notifications
- `telemetry:event` - Real-time telemetry events
- `system:alert` - System alerts and notifications

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.1.6** - React framework
- **React 18.3.1** - UI library
- **React Three Fiber 8.18.0** - 3D graphics
- **Three.js 0.160.0** - 3D engine
- **Socket.io Client 4.7.4** - WebSocket client
- **Chart.js/Recharts** - Data visualization
- **Framer Motion** - Animations

### Backend
- **Express 4.21.2** - Web server
- **Socket.io 4.8.1** - WebSocket server
- **Redis 4.6.10** - Pub/sub messaging
- **@socket.io/redis-adapter 8.2.0** - Redis adapter

## 🎨 UI Features

### Digital Twin Visualization
- **3D Network Topology** visualization
- **Real-time node updates** with smooth animations
- **Training status indicators** with progress rings
- **Interactive node selection** with detailed information
- **Multiple camera views**: 3D, Top, Side

### Training Dashboard
- **Live agent status** with training progress bars
- **Episode and reward tracking**
- **Topology-aware training** metrics
- **Real-time convergence** monitoring
- **Color-coded states** for training/inference

## 🔧 Configuration

### Simulation Settings
```javascript
// Automatic topology switching interval
topologySwitchInterval: 10000, // 10 seconds

// Available topologies
availableTopologies: ['Mesh', 'Ring', 'Bus', 'Star', 'Tree', 'Hybrid']

// Training parameters
trainingResetOnTopologyChange: true,
realTimeVisualization: true
```

### Environment Variables
```bash
# Frontend
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001

# Backend
PORT=3001
REDIS_URL=redis://localhost:6379
NODE_ENV=production
```

## 📈 Performance

### Optimization Features
- **Lazy loading** for 3D components
- **WebSocket connection pooling** for scalability
- **Redis pub/sub** for multi-instance scaling
- **Optimized React rendering** with memoization
- **Efficient state management** for real-time updates

### Monitoring
- **Real-time metrics** tracking
- **WebSocket health** monitoring
- **Performance analytics** dashboard
- **Error boundary** protection
- **Graceful degradation** for connection issues

## 🤖 Development

### Local Development
```bash
# Start both services concurrently
npm run dev:all

# With hot reload
npm run dev:frontend
npm run dev:backend
```

### Testing
```bash
# Run tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 📚 Documentation

### API Documentation
- Full OpenAPI specification at `/api/docs`
- WebSocket event documentation
- Component props documentation
- Architecture decision records

### Contributing
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests if applicable
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏‍♂️ Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ for 6G network research and development**
