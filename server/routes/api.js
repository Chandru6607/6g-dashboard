// REST API Routes for 6G Dashboard

import express from 'express';
import * as generators from '../data/generators.js';
import { simulationState } from '../data/state.js';
import { broadcastSimulationState } from '../websocket/handlers.js';

const router = express.Router();

// Get network status and topology
router.get('/network/status', (req, res) => {
    res.json({
        topology: generators.generateNetworkTopology(),
        metrics: generators.generateNetworkMetrics(),
    });
});

// Get all agent states
router.get('/agents', (req, res) => {
    res.json({
        agents: simulationState.agents,
    });
});

// Toggle agent state (training/inference)
router.post('/agents/:id/toggle', (req, res) => {
    const { id } = req.params;
    const agent = simulationState.agents.find(a => a.id === id);

    if (agent) {
        agent.state = agent.state === 'training' ? 'inference' : 'training';
        console.log(`🤖 [Agent] ${agent.name} state toggled to ${agent.state}`);

        // If starting training, randomize topology
        if (agent.state === 'training') {
            const topologies = ['Mesh', 'Ring', 'Bus', 'Star', 'Tree', 'Hybrid'];
            const types = topologies.filter(t => t !== simulationState.currentTopologyType);
            simulationState.currentTopologyType = types[Math.floor(Math.random() * types.length)];
            console.log(`🔄 [Network] Topology switched to ${simulationState.currentTopologyType} for training`);
        }

        // Broadcast update via socket
        const io = req.app.get('io');
        io.emit('agents:update', simulationState.agents);

        // Force immediate network update so UI reflects topology change instantly
        const updateData = {
            topology: generators.generateNetworkTopology(),
            topologyType: simulationState.currentTopologyType,
            metrics: generators.generateNetworkMetrics(),
            timestamp: new Date().toISOString()
        };
        io.emit('network:update', updateData);

        res.json({
            success: true,
            agent,
            topologyType: simulationState.currentTopologyType
        });
    } else {
        res.status(404).json({ success: false, message: 'Agent not found' });
    }
});

// Get reward curves for training visualization
router.get('/agents/rewards', (req, res) => {
    res.json(generators.generateRewardCurves());
});

// Get predictive analytics data
router.get('/twin/predictive', (req, res) => {
    res.json({
        predictions: generators.generatePredictiveData(),
    });
});

// Get performance analytics
router.get('/analytics', (req, res) => {
    res.json(generators.generateAnalyticsData());
});

// Start experiment
router.post('/experiments/start', (req, res) => {
    const { scenario, trafficProfile, duration } = req.body;
    console.log(`🧪 Starting experiment: ${scenario}, profile: ${trafficProfile}, duration: ${duration}s`);

    res.json({
        success: true,
        experimentId: `exp-${Date.now()}`,
        scenario,
        trafficProfile,
        duration,
        startTime: Date.now(),
    });
});

// Stop experiment
router.post('/experiments/stop', (req, res) => {
    console.log('⏹️  Stopping experiment');

    res.json({
        success: true,
        stopTime: Date.now(),
    });
});

// Select scenario
router.post('/scenarios/:id/select', (req, res) => {
    const { id } = req.params;
    console.log(`📋 Scenario selected: ${id}`);

    res.json({
        success: true,
        scenarioId: id,
    });
});

// Export analytics data
router.get('/analytics/export', (req, res) => {
    const data = generators.generateAnalyticsData();
    res.json({
        success: true,
        data,
        exportTime: new Date().toISOString(),
    });
});

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Rescue Agent Troubleshooting
router.post('/system/rescue', async (req, res) => {
    const { rescueAgent } = await import('../services/rescueAgent.js');
    const result = await rescueAgent.troubleshootAll();
    res.json(result);
});

// Simulation State
let simulationInterval = null;

// System Autoconfig (Start Simulation)
router.post('/system/autoconfig', (req, res) => {
    console.log('🔧 [System] Auto-configuration triggered');

    simulationState.active = true;
    simulationState.startTime = Date.now();

    const io = req.app.get('io');

    // Clear existing interval if any
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }

    // Start Real-Time Simulation Loop
    const emitUpdate = () => {
        const updateData = {
            timestamp: new Date().toISOString(),
            topology: generators.generateNetworkTopology(),
            topologyType: simulationState.currentTopologyType,
            metrics: generators.generateNetworkMetrics(),
            agents: generators.generateAgentStates(),
            analytics: generators.generateAnalyticsData()
        };
        io.emit('network:update', updateData);
    };

    // Emit immediately
    emitUpdate();

    simulationInterval = setInterval(emitUpdate, 1000); // 1 second heartbeat

    broadcastSimulationState(io);

    res.json({
        success: true,
        active: true,
        message: 'System auto-configuration complete & Simulation Started',
        status: 'OPERATIONAL',
        timestamp: new Date().toISOString(),
    });
});

// System Disconnect (Stop Simulation)
router.post('/system/disconnect', (req, res) => {
    console.log('🔌 [System] Disconnect triggered');

    simulationState.active = false;
    simulationState.startTime = null;

    // Stop Simulation Loop
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
        console.log('🛑 [Simulation] Stopped');
    }

    const io = req.app.get('io');
    broadcastSimulationState(io);

    res.json({
        success: true,
        active: false,
        message: 'System disconnected & Simulation Stopped',
        status: 'DISCONNECTED',
        timestamp: new Date().toISOString(),
    });
});

export default router;
