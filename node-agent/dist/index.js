import axios from "axios";
import os from "os";
const API_URL = process.env.API_URL || "http://localhost:4000";
const NODE_NAME = process.env.NODE_NAME || `node-${os.hostname()}-${Date.now()}`;
let nodeId = null;
// Register node with the API
async function registerNode() {
    try {
        const response = await axios.post(`${API_URL}/nodes/register`, {
            name: NODE_NAME,
        });
        nodeId = response.data.node.id;
        console.log(`✅ Node registered: ${nodeId} (${NODE_NAME})`);
        return nodeId;
    }
    catch (error) {
        console.error("Failed to register node:", error);
        throw error;
    }
}
// Collect system metrics
function collectMetrics() {
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    return {
        cpu: {
            cores: cpus.length,
            loadAverage: loadAvg,
            model: cpus[0]?.model || "Unknown",
        },
        memory: {
            total: totalMem,
            free: freeMem,
            used: usedMem,
            usagePercent: ((usedMem / totalMem) * 100).toFixed(2),
        },
        uptime: os.uptime(),
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        timestamp: new Date().toISOString(),
    };
}
// Send heartbeat to API
async function sendHeartbeat() {
    if (!nodeId) {
        console.error("Node not registered, attempting to register...");
        try {
            await registerNode();
        }
        catch (error) {
            console.error("Failed to register, skipping heartbeat");
            return;
        }
    }
    try {
        const metrics = collectMetrics();
        await axios.post(`${API_URL}/nodes/heartbeat`, {
            nodeId,
            metrics,
        });
        console.log(`💓 Heartbeat sent (CPU: ${metrics.cpu.loadAverage[0].toFixed(2)}, Memory: ${metrics.memory.usagePercent}%)`);
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                console.log("Node not found, re-registering...");
                nodeId = null;
                await registerNode();
            }
            else {
                console.error("Heartbeat error:", error.message);
            }
        }
        else {
            console.error("Heartbeat error:", error);
        }
    }
}
// Main function
async function main() {
    console.log("🚀 Starting ModelMine Node Agent...");
    console.log(`📡 API URL: ${API_URL}`);
    console.log(`🖥️  Node Name: ${NODE_NAME}`);
    // Register node
    try {
        await registerNode();
    }
    catch (error) {
        console.error("Failed to register node, exiting...");
        process.exit(1);
    }
    // Send initial heartbeat
    await sendHeartbeat();
    // Send heartbeat every 5 seconds
    setInterval(() => {
        sendHeartbeat();
    }, 5000);
    console.log("✅ Node agent running, sending heartbeats every 5 seconds...");
}
// Handle graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down...");
    process.exit(0);
});
process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down...");
    process.exit(0);
});
// Start the agent
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map