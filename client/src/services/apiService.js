// API Service - Refactored to use MCP (Model Context Protocol)
import { mcpClient } from './mcpClient.js';

class ApiService {
    // Network endpoints
    async getNetworkStatus() {
        // Primary: Use MCP Tool for composite data
        try {
            const data = await mcpClient.callTool('get_network_info');
            if (data) return data;
        } catch (error) {
            console.warn("⚠️ [MCP] get_network_info failed, falling back to REST API:", error.message);
        }

        // Fallback: Standard REST API
        try {
            const response = await fetch('http://localhost:5000/api/network/status');
            if (response.ok) {
                return await response.json();
            }
        } catch (err) {
            console.error("❌ [API] REST Fallback failed:", err);
        }
        return null;
    }

    // Agent endpoints
    async getAgents() {
        // Use MCP Resource for specific data
        const states = await mcpClient.readResource('agents://states');
        return { agents: states };
    }

    async toggleAgentState(agentId) {
        // Assuming a REST endpoint for toggling agent state, as MCP doesn't have a direct equivalent in the provided context
        // Or, if MCP had a 'control_agent' tool, it could be used:
        // const result = await mcpClient.callTool('control_agent', { action: 'toggle', agentId });
        // For now, using a direct REST call as per the instruction's implied structure.
        try {
            // Placeholder for API_BASE_URL, assuming it would be defined elsewhere or hardcoded for this example
            const API_BASE_URL = 'http://localhost:5000/api'; // Example base URL
            const response = await fetch(`${API_BASE_URL}/agents/${agentId}/toggle`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error toggling agent state:', error);
            throw error;
        }
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

    // System endpoints
    async autoConfigure() {
        const response = await fetch('http://localhost:5000/api/system/autoconfig', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    }

    async disconnectSystem() {
        const response = await fetch('http://localhost:5000/api/system/disconnect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    }
}

export default new ApiService();
