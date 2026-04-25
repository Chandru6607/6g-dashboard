import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { simulationState } from '../data/state.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_PATH = path.resolve(__dirname, '../../scripts/ManageHotspot.ps1');

class HotspotService {
    constructor() {
        this.monitorInterval = null;
        this.io = null;
    }

    setIo(io) {
        this.io = io;
    }

    async toggle(active) {
        const action = active ? 'start' : 'stop';
        console.log(`📶 [Hotspot] Executing action: ${action}`);

        try {
            // Run PowerShell script
            const command = `powershell -ExecutionPolicy Bypass -File "${SCRIPT_PATH}" -action ${action}`;
            const { stdout, stderr } = await execAsync(command);
            
            if (stderr) console.error(`⚠️ [Hotspot] PS Stderr: ${stderr}`);
            console.log(`✅ [Hotspot] PS Stdout: ${stdout}`);

            simulationState.hotspot.active = active;
            
            if (active) {
                this.startMonitoring();
            } else {
                this.stopMonitoring();
                simulationState.hotspot.connectedDevices = [];
            }

            return { success: true, active };
        } catch (error) {
            console.error(`❌ [Hotspot] Error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    startMonitoring() {
        if (this.monitorInterval) clearInterval(this.monitorInterval);
        
        console.log('🔍 [Hotspot] Starting real-time high-fidelity monitoring...');
        this.monitorInterval = setInterval(async () => {
            await this.updateConnectedDevices();
        }, 2000); // Poll every 2 seconds for high responsiveness
    }

    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
    }

    async updateConnectedDevices() {
        try {
            // Step 1: Get neighbors using PowerShell (more reliable than arp -a for real-time)
            // This finds devices in 'Reachable' or 'Permanent' state
            const psCommand = `powershell -Command "Get-NetNeighbor | Where-Object { $_.State -eq 'Reachable' } | Select-Object IPAddress, LinkLayerAddress | ConvertTo-Json"`;
            const { stdout } = await execAsync(psCommand);
            
            let neighbors = [];
            try {
                neighbors = JSON.parse(stdout);
                if (!Array.isArray(neighbors)) neighbors = neighbors ? [neighbors] : [];
            } catch (e) {
                // Fallback to empty if parse fails
            }

            // Step 2: Validate reachability (Optional but good for clearing stale entries)
            // We'll keep the ones found by Get-NetNeighbor as they are actively seen by the stack
            
            const devices = neighbors.map(n => {
                const ip = n.IPAddress;
                const mac = n.LinkLayerAddress;

                // Filter out non-client IPs (like gateway or broadcast)
                if (ip.includes(':') || ip.endsWith('.1') || ip.endsWith('.255')) return null;

                return {
                    id: `dev-${mac.replace(/[:-]/g, '')}`,
                    name: this.getDeviceName(ip, mac),
                    ip: ip,
                    mac: mac,
                    signal: -Math.floor(Math.random() * 30 + 35),
                    connectedAt: this.getConnectionTime(mac),
                    traffic: (Math.random() * 5 + 1).toFixed(1) + ' Mbps'
                };
            }).filter(Boolean);

            // Update state
            simulationState.hotspot.connectedDevices = devices;
            
            if (this.io) {
                this.io.emit('hotspot:update', simulationState.hotspot);
            }
        } catch (error) {
            // Fallback to ARP if PowerShell fails for some reason
            try {
                const { stdout } = await execAsync('arp -a');
                const devices = this.parseArpOutput(stdout);
                simulationState.hotspot.connectedDevices = devices;
                if (this.io) this.io.emit('hotspot:update', simulationState.hotspot);
            } catch (arpError) {
                console.error('❌ [Hotspot] Total monitoring failure:', arpError);
            }
        }
    }

    getConnectionTime(mac) {
        // Mock connection time since system doesn't easily expose this per device
        if (!this._connTimes) this._connTimes = {};
        if (!this._connTimes[mac]) this._connTimes[mac] = new Date().toLocaleTimeString();
        return this._connTimes[mac];
    }

    parseArpOutput(output) {
        const lines = output.split('\n');
        const devices = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.includes('dynamic')) {
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 3) {
                    const ip = parts[0];
                    const mac = parts[1];
                    if (ip.endsWith('.1') || ip.endsWith('.255')) continue;
                    devices.push({
                        id: `dev-${mac.replace(/-/g, '')}`,
                        name: this.getDeviceName(ip, mac),
                        ip: ip,
                        mac: mac,
                        signal: -Math.floor(Math.random() * 40 + 30),
                        connectedAt: 'Active',
                        traffic: '---'
                    });
                }
            }
        }
        return devices.slice(0, 5);
    }

    getDeviceName(ip, mac) {
        const m = mac.toLowerCase();
        if (m.startsWith('00:') || m.startsWith('00-')) return 'Apple iPhone';
        if (m.startsWith('0a:') || m.startsWith('0a-')) return 'Android Workstation';
        if (m.startsWith('b4:') || m.startsWith('b4-')) return 'Samsung Node';
        if (m.startsWith('3c:') || m.startsWith('3c-')) return 'Remote Console';
        return `U-Node ${ip.split('.').pop()}`;
    }
}

export const hotspotService = new HotspotService();
