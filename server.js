// Custom Next.js Server with Express and Socket.io
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import cors from 'cors';

// Backend modules from src/server
import apiRoutes from './src/server/routes/api.js';
import { initializeWebSocket } from './src/server/websocket/handlers.js';
import { attachMCPServer } from './src/server/mcpServer.js';
import { rescueAgent } from './src/server/services/rescueAgent.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
    const expressApp = express();
    const httpServer = createServer(expressApp);

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
                callback(null, true);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    };

    const io = new Server(httpServer, {
        cors: corsOptions
    });

    expressApp.set('io', io);
    expressApp.use(cors(corsOptions));

    // Initialize MCP Server
    attachMCPServer(expressApp);

    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));

    // API Routes
    expressApp.use('/api', apiRoutes);

    // Initialize WebSocket
    initializeWebSocket(io);

    // Initialize Rescue Agent
    rescueAgent.initialize(io);

    // Handle all other requests with Next.js
    expressApp.all('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(PORT, (err) => {
        if (err) throw err;
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚀 6G Digital Twin Dashboard (Next.js)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📡 Server: http://localhost:${PORT}`);
        console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
        console.log(`📊 API Endpoints: http://localhost:${PORT}/api`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
});
