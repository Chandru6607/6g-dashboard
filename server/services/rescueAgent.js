import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { simulationState } from '../data/state.js';
import { generateAlert, generateTelemetryEvent } from '../data/generators.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, '../../simulation_state_backup.json');

class RescueAgent {
    constructor() {
        this.io = null;
        this.interval = null;
        this.isHealthy = true;
        this.lastStateSync = Date.now();
        this.recoveryAttempts = 0;
    }

    initialize(io) {
        this.io = io;
        console.log('🛡️  [Rescue Agent] Initialized and monitoring...');

        // Restore last known good state if exists
        this.restoreState();

        // Start the watchdog loop
        this.startWatchdog();
    }

    startWatchdog() {
        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(() => {
            this.performHealthCheck();
            this.backupState();
        }, 10000); // Check every 10 seconds
    }

    performHealthCheck() {
        try {
            // 1. Check if simulation is supposed to be active but has no data flowing
            // (In a real app, we'd check timestamps of last updates)
            if (simulationState.active) {
                const now = Date.now();
                const uptime = now - (simulationState.startTime || now);

                // If the state is active but looks stuck (stale)
                // For this mock, we pretend everything is fine unless we force an error
            }

            // 2. Check for "degraded" nodes and attempt "healing"
            const degradedNodes = simulationState.topology.gNBs.filter(n => n.status === 'degraded');
            if (degradedNodes.length > 0) {
                console.log(`🏥 [Rescue Agent] Found ${degradedNodes.length} degraded nodes. Attempting optimization...`);

                degradedNodes.forEach(node => {
                    // 70% chance to fix it automatically
                    if (Math.random() > 0.3) {
                        node.status = 'active';
                        this.notifyRecovery(`Optimal performance restored to ${node.id}`, node.id);
                    }
                });

                if (this.io) {
                    this.io.emit('network:update', {
                        topology: simulationState.topology,
                        timestamp: new Date().toISOString()
                    });
                }
            }

            // 3. Keep the agent alive
            this.isHealthy = true;

        } catch (error) {
            console.error('⚠️ [Rescue Agent] Self-diagnostic failed:', error.message);
            this.isHealthy = false;
        }
    }

    backupState() {
        try {
            const data = JSON.stringify({
                active: simulationState.active,
                startTime: simulationState.startTime,
                scenario: simulationState.scenario,
                agents: simulationState.agents,
                topology: simulationState.topology
            }, null, 2);

            fs.writeFileSync(STATE_FILE, data);
            this.lastStateSync = Date.now();
        } catch (err) {
            console.error('⚠️ [Rescue Agent] Failed to backup state:', err.message);
        }
    }

    restoreState() {
        try {
            if (fs.existsSync(STATE_FILE)) {
                const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

                // Only restore if it was previously active (persistence)
                Object.assign(simulationState, data);

                console.log('♻️  [Rescue Agent] State restored from backup.');

                if (simulationState.active) {
                    console.log('🚀 [Rescue Agent] Resuming simulation automatically...');
                    // We don't start the interval here directly to avoid circular imports,
                    // server.js or api.js should handle the actual loop start if active=true.
                    // But we can trigger a system event.
                }
            }
        } catch (err) {
            console.error('⚠️ [Rescue Agent] Failed to restore state:', err.message);
        }
    }

    notifyRecovery(message, source) {
        if (!this.io) return;

        const event = {
            id: `rescue-${Date.now()}`,
            timestamp: new Date().toISOString(),
            severity: 'info',
            source: 'rescue.agent',
            type: 'SYSTEM_RECOVERY',
            message: `[RESCUE] ${message}`
        };

        this.io.emit('telemetry:event', event);
        this.io.emit('alert:new', {
            id: `alert-${Date.now()}`,
            timestamp: new Date().toISOString(),
            severity: 'low',
            message: message,
            source: source || 'Rescue Agent'
        });
    }

    // Public method for UI to trigger a "Grand Reset & Fix"
    async troubleshootAll() {
        console.log('🆘 [Rescue Agent] Intensive troubleshooting triggered...');

        // 1. Force all nodes to active
        simulationState.topology.gNBs.forEach(n => n.status = 'active');
        simulationState.topology.UEs.forEach(u => u.status = 'active');

        // 2. Reset agent convergence to better values if they were failing
        simulationState.agents.forEach(a => {
            if (parseFloat(a.avgReward) < 0.5) a.avgReward = 0.75;
        });

        this.notifyRecovery('Global system optimization complete. All services operational.', 'System');

        return { success: true, message: 'Intensive troubleshooting complete' };
    }
}

export const rescueAgent = new RescueAgent();
