// Express Server for 6G Digital Twin Dashboard
// Backend API and WebSocket server

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { initializeWebSocket } from './websocket/handlers.js';
import { attachMCPServer } from './mcpServer.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5000;

// Middleware & MCP
app.use(cors());

// Initialize MCP Server (before body parsers to handle stream if needed)
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

// Start server
httpServer.listen(PORT, () => {
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
