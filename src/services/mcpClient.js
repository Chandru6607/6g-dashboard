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
                // Use relative path for internal project
                const baseURL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');
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
            console.error(`❌ [MCP] Tool Error (${name}):`, error.message);
            throw error;
        }
    }

    async readResource(uri) {
        await this.ensureConnected();

        try {
            const result = await this.client.readResource({ uri });

            if (!result || !result.contents || !result.contents[0]) {
                throw new Error("Invalid resource response");
            }

            return JSON.parse(result.contents[0].text);
        } catch (error) {
            console.error(`❌ [MCP] Resource Error (${uri}):`, error.message);
            throw error;
        }
    }
}

export const mcpClient = new MCPClientService();
