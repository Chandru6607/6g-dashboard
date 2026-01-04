import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListToolsRequestSchema,
    CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
    generateNetworkTopology,
    generateNetworkMetrics,
    generateAgentStates,
    generatePredictiveData,
    generateAnalyticsData,
} from './data/generators.js';

// Create MCP Server
const server = new Server(
    {
        name: "6G-Dashboard-MCP",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {},
            tools: {},
        },
    }
);

// Define Resources - same as before
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "network://status",
                name: "Network Status",
                description: "Real-time network performance metrics",
                mimeType: "application/json",
            },
            {
                uri: "network://topology",
                name: "Network Topology",
                description: "Current graph of gNBs and UEs",
                mimeType: "application/json",
            },
            {
                uri: "agents://states",
                name: "Agent States",
                description: "Current state of RL agents in the network",
                mimeType: "application/json",
            }
        ],
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === "network://status") {
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(generateNetworkMetrics()) }] };
    }
    if (uri === "network://topology") {
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(generateNetworkTopology()) }] };
    }
    if (uri === "agents://states") {
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(generateAgentStates()) }] };
    }
    throw new Error(`Resource not found: ${uri}`);
});

// Define Tools - same as before
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_network_info",
                description: "Retrieve comprehensive network information (topology and metrics)",
                inputSchema: { type: "object", properties: {} },
            },
            {
                name: "get_analytics",
                description: "Get predictive and performance analytics data",
                inputSchema: { type: "object", properties: {} },
            },
            {
                name: "control_experiment",
                description: "Start or stop a 6G network experiment",
                inputSchema: {
                    type: "object",
                    properties: {
                        action: { type: "string", enum: ["start", "stop"] },
                        scenario: { type: "string" },
                        duration: { type: "number" },
                    },
                    required: ["action"],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "get_network_info") {
        return { content: [{ type: "text", text: JSON.stringify({ topology: generateNetworkTopology(), metrics: generateNetworkMetrics() }, null, 2) }] };
    }
    if (name === "get_analytics") {
        return { content: [{ type: "text", text: JSON.stringify({ predictive: generatePredictiveData(), analytics: generateAnalyticsData() }, null, 2) }] };
    }
    if (name === "control_experiment") {
        const { action, scenario, duration } = args ?? {};
        if (action === "start") {
            const id = `exp-${Date.now()}`;
            console.log(`🧪 [MCP] Starting experiment: ${scenario}, duration: ${duration}s`);
            return { content: [{ type: "text", text: `Experiment ${id} started for scenario: ${scenario}` }] };
        } else {
            console.log('⏹️ [MCP] Stopping experiment');
            return { content: [{ type: "text", text: "Experiment stopped successfully" }] };
        }
    }
    throw new Error(`Tool not found: ${name}`);
});

// Session management for SSE
const transports = new Map();

export function attachMCPServer(app) {
    app.get("/mcp", async (req, res) => {
        console.log("🔌 New MCP SSE connection attempt");
        const transport = new SSEServerTransport("/mcp/messages", res);

        // The transport generates a sessionId after connect
        await server.connect(transport);

        if (transport.sessionId) {
            transports.set(transport.sessionId, transport);
            console.log(`✅ MCP Session created: ${transport.sessionId}`);

            res.on('close', () => {
                console.log(`❌ MCP Session closed: ${transport.sessionId}`);
                transports.delete(transport.sessionId);
            });
        }
    });

    app.post("/mcp/messages", async (req, res) => {
        const sessionId = req.query.sessionId;
        const transport = transports.get(sessionId);

        if (transport) {
            try {
                // If body is already parsed by express.json(), handlePostMessage should still work
                // but let's see if we need to pass the body explicitly or if req is enough.
                await transport.handlePostMessage(req, res);
            } catch (err) {
                console.error("❌ MCP Error handling message:", err);
                res.status(500).send(err.message);
            }
        } else {
            console.warn(`⚠️ No active MCP transport for session: ${sessionId}`);
            res.status(400).send("No active MCP transport for this session");
        }
    });

    console.log("✅ MCP Server mounted at /mcp");
}
