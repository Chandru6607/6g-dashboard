import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

class MCPClientService {
    constructor() {
        this.client = null;
        this.transport = null;
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) return;

        console.log("🔌 Connecting to MCP Backend...");
        const url = new URL("http://localhost:5000/mcp");
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
        console.log("✅ MCP Backend Connected");
    }

    async callTool(name, args = {}) {
        if (!this.isConnected) await this.connect();

        try {
            const result = await this.client.callTool({
                name,
                arguments: args,
            });
            return JSON.parse(result.content[0].text);
        } catch (error) {
            console.error(`❌ MCP Tool Error (${name}):`, error);
            throw error;
        }
    }

    async readResource(uri) {
        if (!this.isConnected) await this.connect();

        try {
            const result = await this.client.readResource({ uri });
            return JSON.parse(result.contents[0].text);
        } catch (error) {
            console.error(`❌ MCP Resource Error (${uri}):`, error);
            throw error;
        }
    }
}

export const mcpClient = new MCPClientService();
