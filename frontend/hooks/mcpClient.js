import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

class MCPClientService {
    constructor() {
        this.client = null;
        this.transport = null;
        this.isConnected = false;
        this.connectionPromise = null;
        this.retryCount = 0;
        this.maxRetries = 10;
        this.baseDelay = 1000;
        this.isManualDisconnect = false;
    }

    async connect() {
        if (this.isConnected) return;
        if (this.connectionPromise) return this.connectionPromise;

        this.connectionPromise = (async () => {
            console.log(`🔌 [MCP] Connecting to Backend (Attempt ${this.retryCount + 1})...`);
            this.isManualDisconnect = false;

            try {
                // Use backend URL with port 3001
                const baseURL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? 'http://localhost:3001' : '');
                const url = new URL("/mcp", baseURL);
                this.transport = new SSEClientTransport(url);

                this.client = new Client({
                    name: "6G-Dashboard-Web-Client",
                    version: "1.0.0",
                }, {
                    capabilities: {
                        resources: {},
                        tools: {},
                    }
                });

                await this.client.connect(this.transport);

                this.isConnected = true;
                this.retryCount = 0;
                this.connectionPromise = null;
                console.log("✅ [MCP] Backend Connected Successfully");

                this.transport.onclose = () => {
                    if (this.isManualDisconnect) {
                        console.log("🔒 [MCP] Clean disconnect completed.");
                        return;
                    }
                    console.warn("⚠️ [MCP] Connection Lost. Attempting reconnection...");
                    this.isConnected = false;
                    this.connect();
                };

            } catch (error) {
                this.isConnected = false;
                this.connectionPromise = null;
                this.retryCount++;

                if (this.retryCount < this.maxRetries) {
                    const delay = Math.min(this.baseDelay * Math.pow(2, this.retryCount), 30000);
                    console.error(`❌ [MCP] Connection Error. Retrying in ${delay}ms...`, error.message);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.connect();
                } else {
                    console.error("🔥 [MCP] Max connection retries reached. Please check the backend.");
                    throw error;
                }
            }
        })();

        return this.connectionPromise;
    }

    async disconnect() {
        if (!this.isConnected) return;

        console.log("🔌 [MCP] Disconnecting...");
        this.isManualDisconnect = true;
        try {
            if (this.transport) {
                await this.transport.close();
            }
            this.client = null;
            this.transport = null;
            this.isConnected = false;
            console.log("✅ [MCP] Disconnected Successfully");
        } catch (error) {
            console.error("❌ [MCP] Disconnect Error:", error.message);
        }
    }

    async ensureConnected() {
        if (!this.isConnected) {
            await this.connect();
        }
    }

    async callTool(name, args = {}) {
        await this.ensureConnected();

        // In demo mode, return mock data
        if (process.env.NODE_ENV === 'development' || !this.client) {
            console.log(`🎭 [Demo] MCP Tool Call: ${name}`, args);
            return this._getMockToolResponse(name, args);
        }

        try {
            const result = await this.client.callTool({
                name,
                arguments: args,
            });

            if (!result || !result.content || !result.content[0]) {
                throw new Error("Invalid tool response");
            }

            return JSON.parse(result.content[0].text);
        } catch (error) {
            console.log(`⚠️ [MCP] Tool failed, using demo data: ${name}`);
            return this._getMockToolResponse(name, args);
        }
    }

    _getMockToolResponse(name, args) {
        switch (name) {
            case 'get_network_info':
                return {
                    topology: {
                        gNBs: [
                            { id: 'gNB-1', x: 0, y: 0, z: 0, status: 'active' },
                            { id: 'gNB-2', x: 100, y: 0, z: 0, status: 'active' },
                            { id: 'gNB-3', x: 50, y: 100, z: 0, status: 'active' }
                        ],
                        UEs: [
                            { id: 'UE-1', x: 25, y: 25, z: 0, status: 'active' },
                            { id: 'UE-2', x: 75, y: 25, z: 0, status: 'active' },
                            { id: 'UE-3', x: 50, y: 75, z: 0, status: 'active' }
                        ]
                    },
                    metrics: {
                        latency: 12,
                        throughput: 850,
                        packetLoss: 0.2
                    }
                };
            case 'get_analytics':
                return {
                    predictive: {
                        nextTopology: 'Star',
                        congestionRisk: 0.3,
                        recommendedActions: ['Increase bandwidth', 'Optimize routing']
                    },
                    analytics: {
                        totalConnections: 150,
                        activeAgents: 3,
                        systemHealth: 95
                    }
                };
            case 'control_experiment':
                return {
                    success: true,
                    message: args?.action === 'start' ? `Experiment started for ${args?.scenario || 'default'}` : "Experiment stopped"
                };
            default:
                return { success: false, message: `Unknown tool: ${name}` };
        }
    }

    async readResource(uri) {
        await this.ensureConnected();

        // In demo mode, return mock data
        if (process.env.NODE_ENV === 'development' || !this.client) {
            console.log(`🎭 [Demo] MCP Resource Read: ${uri}`);
            return this._getMockResourceResponse(uri);
        }

        try {
            const result = await this.client.readResource({ uri });

            if (!result || !result.contents || !result.contents[0]) {
                throw new Error("Invalid resource response");
            }

            return JSON.parse(result.contents[0].text);
        } catch (error) {
            console.log(`⚠️ [MCP] Resource failed, using demo data: ${uri}`);
            return this._getMockResourceResponse(uri);
        }
    }

    _getMockResourceResponse(uri) {
        switch (uri) {
            case 'network://status':
                return {
                    timestamp: new Date().toISOString(),
                    status: 'active',
                    metrics: {
                        latency: 12,
                        throughput: 850,
                        packetLoss: 0.2,
                        connectedDevices: 6
                    }
                };
            case 'network://topology':
                return {
                    type: 'Mesh',
                    nodes: [
                        { id: 'gNB-1', type: 'gNB', status: 'active', connections: 3 },
                        { id: 'gNB-2', type: 'gNB', status: 'active', connections: 3 },
                        { id: 'gNB-3', type: 'gNB', status: 'active', connections: 3 },
                        { id: 'UE-1', type: 'UE', status: 'active', connections: 1 },
                        { id: 'UE-2', type: 'UE', status: 'active', connections: 1 },
                        { id: 'UE-3', type: 'UE', status: 'active', connections: 1 }
                    ]
                };
            case 'agents://states':
                return [
                    { id: 'agent-1', name: 'Resource Allocation', state: 'training', episodes: 150, avgReward: 0.85, trainingProgress: 75 },
                    { id: 'agent-2', name: 'Congestion Control', state: 'training', episodes: 200, avgReward: 0.92, trainingProgress: 60 },
                    { id: 'agent-3', name: 'Mobility Management', state: 'inference', episodes: 300, avgReward: 0.78, trainingProgress: 100 }
                ];
            default:
                return { error: `Unknown resource: ${uri}` };
        }
    }
}

export const mcpClient = new MCPClientService();
