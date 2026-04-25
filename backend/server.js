// Backend Server for 6G Digital Twin Dashboard
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createAdapter } from '@socket.io/redis-adapter';
import { initializeRedis, pubClient, subClient } from './redis.js';

// Backend modules
import apiRoutes from './src/routes/api.js';
import { initializeWebSocket } from './src/websocket/handlers.js';
import { rescueAgent } from './src/services/rescueAgent.js';
import { hotspotService } from './src/services/hotspotService.js';

const PORT = process.env.PORT || 3001;

// Initialize Express app
const expressApp = express();

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for development
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

// Create HTTP server
const httpServer = createServer(expressApp);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: corsOptions
});

expressApp.set('io', io);
expressApp.use(cors(corsOptions));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Initialize Redis and Socket.io adapter
async function initializeServer() {
    try {
        // Initialize Redis connections
        const redisSuccess = await initializeRedis();
        
        // Set up Redis adapter for Socket.io only if Redis is available
        if (redisSuccess) {
            io.adapter(createAdapter(pubClient, subClient));
            console.log('🔗 [Socket.io] Redis adapter configured');
        } else {
            console.log('ℹ️ [Socket.io] Running without Redis adapter (local memory only)');
        }
        

        
        // Register API routes
        expressApp.use('/api', apiRoutes);
        
        // Initialize WebSocket handlers
        initializeWebSocket(io);
        
        // Initialize Rescue Agent
        rescueAgent.initialize(io);
        
        // Initialize Hotspot Service
        hotspotService.setIo(io);
        
        // Start server
        httpServer.listen(PORT, (err) => {
            if (err) throw err;
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 6G Digital Twin Dashboard Backend');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📡 Server: http://localhost:${PORT}`);
            console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
            console.log(`📊 API Endpoints: http://localhost:${PORT}/api`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });
        
    } catch (error) {
        console.error('❌ [Server] Failed to initialize:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 [Server] SIGTERM received, shutting down gracefully');
    httpServer.close(() => {
        console.log('🔌 [Server] HTTP server closed');
    });
});

process.on('SIGINT', async () => {
    console.log('🛑 [Server] SIGINT received, shutting down gracefully');
    httpServer.close(() => {
        console.log('🔌 [Server] HTTP server closed');
    });
});

// Start the server
initializeServer();
