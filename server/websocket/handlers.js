// WebSocket Handlers for Real-time Data Streaming

import {
    generateNetworkMetrics,
    generateAgentStates,
    generateTelemetryEvent,
    generateAlert,
    getSyncProgress,
    getAIConfidence,
} from '../data/generators.js';

let eventThroughput = 0;
let eventCount = 0;

// Initialize WebSocket connection handlers
export const initializeWebSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        // Send initial data
        socket.emit('network:metrics', generateNetworkMetrics());
        socket.emit('agents:update', generateAgentStates());
        socket.emit('sync:progress', { progress: getSyncProgress(), confidence: getAIConfidence() });

        // Start broadcasting intervals
        const intervals = [];

        // Network metrics - every 2 seconds
        intervals.push(
            setInterval(() => {
                socket.emit('network:metrics', generateNetworkMetrics());
            }, 2000)
        );

        // Agent states - every 5 seconds
        intervals.push(
            setInterval(() => {
                socket.emit('agents:update', generateAgentStates());
            }, 5000)
        );

        // Telemetry events - random intervals (500ms - 2s)
        const scheduleTelemetryEvent = () => {
            setTimeout(() => {
                const event = generateTelemetryEvent();
                socket.emit('telemetry:event', event);
                eventCount++;
                scheduleTelemetryEvent();
            }, Math.random() * 1500 + 500);
        };
        scheduleTelemetryEvent();

        // Alerts - random intervals (5s - 15s)
        const scheduleAlert = () => {
            setTimeout(() => {
                const alert = generateAlert();
                socket.emit('system:alert', alert);
                scheduleAlert();
            }, Math.random() * 10000 + 5000);
        };
        scheduleAlert();

        // Sync progress and AI confidence - every 3 seconds
        intervals.push(
            setInterval(() => {
                socket.emit('sync:progress', {
                    progress: getSyncProgress(),
                    confidence: getAIConfidence(),
                });
            }, 3000)
        );

        // Event throughput calculation - every 1 second
        intervals.push(
            setInterval(() => {
                eventThroughput = eventCount;
                eventCount = 0;
                socket.emit('telemetry:throughput', { throughput: eventThroughput });
            }, 1000)
        );

        // Handle experiment control events from client
        socket.on('experiment:start', (data) => {
            console.log('🧪 Experiment started:', data);
            socket.emit('experiment:status', {
                status: 'running',
                scenario: data.scenario,
                startTime: Date.now(),
            });
        });

        socket.on('experiment:stop', () => {
            console.log('⏹️  Experiment stopped');
            socket.emit('experiment:status', {
                status: 'stopped',
                scenario: null,
            });
        });

        // Clean up on disconnect
        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
            intervals.forEach(interval => clearInterval(interval));
        });
    });

    console.log('🔌 WebSocket server initialized');
};
