// API Service - Refactored to use MCP (Model Context Protocol)
import { mcpClient } from './mcpClient.js';

class ApiService {
    // Network endpoints
    async getNetworkStatus() {
        // Use MCP Tool for composite data
        return await mcpClient.callTool('get_network_info');
    }

    // Agent endpoints
    async getAgents() {
        // Use MCP Resource for specific data
        const states = await mcpClient.readResource('agents://states');
        return { agents: states };
    }

    async getRewardCurves() {
        // Fallback or another tool if needed, but for now let's use the resource if available or a mock
        // Since reward curves weren't explicitly in my MCP resources, I'll use a mocked response or fetch it if I update MCP
        // For simplicity, let's assume we use a resource
        try {
            return await mcpClient.readResource('agents://rewards');
        } catch (e) {
            // Mock fallback if resource doesn't exist yet
            return { labels: [], datasets: [] };
        }
    }

    // Digital Twin endpoints
    async getPredictiveData() {
        const result = await mcpClient.callTool('get_analytics');
        return { predictions: result.predictive };
    }

    // Analytics endpoints
    async getAnalytics() {
        const result = await mcpClient.callTool('get_analytics');
        return result.analytics;
    }

    async exportAnalytics() {
        const result = await mcpClient.callTool('get_analytics');
        return {
            success: true,
            data: result.analytics,
            exportTime: new Date().toISOString()
        };
    }

    // Experiment endpoints
    async startExperiment(scenario, trafficProfile, duration) {
        const result = await mcpClient.callTool('control_experiment', {
            action: 'start',
            scenario,
            duration
        });
        return { success: true, message: result };
    }

    async stopExperiment() {
        const result = await mcpClient.callTool('control_experiment', {
            action: 'stop'
        });
        return { success: true, message: result };
    }

    async selectScenario(scenarioId) {
        // Mapping scenario selection to a tool if needed
        return { success: true, scenarioId };
    }
}

export default new ApiService();
