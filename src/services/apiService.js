// API Service - Refactored to use MCP (Model Context Protocol)
import { mcpClient } from './mcpClient.js';

class ApiService {
    // Helper to get base URL
    getBaseURL() {
        if (typeof window !== 'undefined') {
            return process.env.NEXT_PUBLIC_API_URL || '';
        }
        return '';
    }

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
            const response = await fetch(`${this.getBaseURL()}/api/network/status`);
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
        const states = await mcpClient.readResource('agents://states');
        return { agents: states };
    }

    async toggleAgentState(agentId) {
        try {
            const API_BASE_URL = `${this.getBaseURL()}/api`;
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
        try {
            return await mcpClient.readResource('agents://rewards');
        } catch (e) {
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
        return { success: true, scenarioId };
    }

    // System endpoints
    async autoConfigure() {
        console.log('📡 [API] Triggering system autoconfig...');
        const response = await fetch(`${this.getBaseURL()}/api/system/autoconfig`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Autoconfig failed: ${response.status} ${errorText}`);
        }
        return await response.json();
    }

    async disconnectSystem() {
        console.log('📡 [API] Triggering system disconnect...');
        const response = await fetch(`${this.getBaseURL()}/api/system/disconnect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`Disconnect failed: ${response.status}`);
        }
        return await response.json();
    }
}

export default new ApiService();
