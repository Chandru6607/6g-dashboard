// REST API Routes for 6G Dashboard

import express from 'express';
import {
    generateNetworkTopology,
    generateNetworkMetrics,
    generateAgentStates,
    generatePredictiveData,
    generateRewardCurves,
    generateAnalyticsData,
} from '../data/generators.js';

const router = express.Router();

// Get network status and topology
router.get('/network/status', (req, res) => {
    res.json({
        topology: generateNetworkTopology(),
        metrics: generateNetworkMetrics(),
    });
});

// Get all agent states
router.get('/agents', (req, res) => {
    res.json({
        agents: generateAgentStates(),
    });
});

// Get reward curves for training visualization
router.get('/agents/rewards', (req, res) => {
    res.json(generateRewardCurves());
});

// Get predictive analytics data
router.get('/twin/predictive', (req, res) => {
    res.json({
        predictions: generatePredictiveData(),
    });
});

// Get performance analytics
router.get('/analytics', (req, res) => {
    res.json(generateAnalyticsData());
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
    const data = generateAnalyticsData();
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

// System Autoconfig
router.post('/system/autoconfig', (req, res) => {
    console.log('🔧 [System] Auto-configuration triggered');

    // In a real scenario, this might involve resetting agents, clearing queues, etc.
    // For this demo, we'll simulate a successful configuration and ensure generators are fresh.

    res.json({
        success: true,
        message: 'System auto-configuration complete',
        status: 'OPERATIONAL',
        timestamp: new Date().toISOString(),
    });
});

// System Disconnect
router.post('/system/disconnect', (req, res) => {
    console.log('🔌 [System] Disconnect triggered');

    // Simulate cleanup and status update
    res.json({
        success: true,
        message: 'System disconnected',
        status: 'DISCONNECTED',
        timestamp: new Date().toISOString(),
    });
});

export default router;
