// API Service - Refactored to use standard REST API instead of MCP
class ApiService {
    // Helper to get base URL
    getBaseURL() {
        if (typeof window !== 'undefined') {
            return process.env.NEXT_PUBLIC_API_URL || '';
        }
        return '';
    }

    // Generic fetch helper
    async _fetch(endpoint, options = {}) {
        try {
            const url = `${this.getBaseURL()}${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`❌ [API] Fetch failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Network endpoints
    async getNetworkStatus() {
        return this._fetch('/api/network/status');
    }

    // Agent endpoints
    async getAgents() {
        return this._fetch('/api/agents');
    }

    async toggleAgentState(agentId) {
        return this._fetch(`/api/agents/${agentId}/toggle`, { method: 'POST' });
    }

    async getRewardCurves() {
        try {
            return await this._fetch('/api/agents/rewards');
        } catch (e) {
            return { labels: [], datasets: [] };
        }
    }

    // Digital Twin endpoints
    async getPredictiveData() {
        return this._fetch('/api/twin/predictive');
    }

    // Analytics endpoints
    async getAnalytics() {
        return this._fetch('/api/analytics');
    }

    async exportAnalytics() {
        return this._fetch('/api/analytics/export');
    }

    // Experiment endpoints
    async startExperiment(scenario, trafficProfile, duration) {
        return this._fetch('/api/experiments/start', {
            method: 'POST',
            body: JSON.stringify({ scenario, trafficProfile, duration })
        });
    }

    async stopExperiment() {
        return this._fetch('/api/experiments/stop', { method: 'POST' });
    }

    async selectScenario(scenarioId) {
        return this._fetch(`/api/scenarios/${scenarioId}/select`, { method: 'POST' });
    }

    // System endpoints
    async autoConfigure() {
        console.log('📡 [API] Triggering system autoconfig...');
        return this._fetch('/api/system/autoconfig', { method: 'POST' });
    }

    async disconnectSystem() {
        console.log('📡 [API] Triggering system disconnect...');
        return this._fetch('/api/system/disconnect', { method: 'POST' });
    }
}

export default new ApiService();
