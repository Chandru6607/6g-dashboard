// Express Server for 6G Digital Twin Dashboard
// Backend API and WebSocket server

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { initializeWebSocket } from './websocket/handlers.js';
import { attachMCPServer } from './mcpServer.js';
import { rescueAgent } from './services/rescueAgent.js';

const app = express();
const httpServer = createServer(app);
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173'
];

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.set('io', io);

const PORT = process.env.PORT || 5000;

// Middleware & MCP
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
}));

// Initialize MCP Server (Must be before body parsers to allow transport to handle its own streams)
attachMCPServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '6G Digital Twin Dashboard API',
        version: '1.0.0',
        endpoints: {
            api: '/api',
            health: '/api/health',
            websocket: 'ws://localhost:5000',
        },
    });
});

// Initialize WebSocket
initializeWebSocket(io);

// Initialize Rescue Agent
rescueAgent.initialize(io);

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 6G Digital Twin Dashboard Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 HTTP Server: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    console.log(`📊 API Endpoints: http://localhost:${PORT}/api`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Server is ready and listening...\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        console.log('✅ HTTP server closed');
    });
});
