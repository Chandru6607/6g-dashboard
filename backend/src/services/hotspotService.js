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
            // Step 1: Discover the Hotspot Interface Index
            // Usually Windows Hotspot uses the 192.168.137.x subnet
            const findInterfaceCmd = `powershell -Command "Get-NetIPAddress -IPAddress '192.168.137.1' | Select-Object -ExpandProperty InterfaceIndex"`;
            let interfaceIndex = 17; // Default fallback
            try {
                const { stdout: idx } = await execAsync(findInterfaceCmd);
                if (idx.trim()) interfaceIndex = parseInt(idx.trim());
            } catch (e) {}

            // Step 2: Get neighbors on that specific interface
            // We include Reachable, Stale, Delay, and Permanent (ignore Unreachable/Incomplete)
            const psCommand = `powershell -Command "Get-NetNeighbor -InterfaceIndex ${interfaceIndex} | Where-Object { $_.State -match 'Reachable|Stale|Delay|Permanent' } | Select-Object IPAddress, LinkLayerAddress, State | ConvertTo-Json"`;
            const { stdout } = await execAsync(psCommand);
            
            let neighbors = [];
            if (stdout.trim()) {
                try {
                    neighbors = JSON.parse(stdout);
                    if (!Array.isArray(neighbors)) neighbors = [neighbors];
                } catch (e) {
                    console.error('⚠️ [Hotspot] PS Parse Error:', e.message);
                }
            }

            // Step 3: Parse and Map
            const devices = neighbors.map(n => {
                const ip = n.IPAddress;
                const mac = n.LinkLayerAddress;

                // Filter out non-IPv4 or gateway
                if (!ip || ip.includes(':') || ip === '192.168.137.1' || ip.endsWith('.255')) return null;

                return {
                    id: `dev-${mac.replace(/[:-]/g, '').toLowerCase()}`,
                    name: this.getDeviceName(ip, mac),
                    ip: ip,
                    mac: mac,
                    signal: -Math.floor(Math.random() * 25 + 40),
                    connectedAt: this.getConnectionTime(mac),
                    traffic: (Math.random() * 8 + 0.5).toFixed(1) + ' Mbps'
                };
            }).filter(Boolean);

            // Step 4: Final State Update
            simulationState.hotspot.connectedDevices = devices;
            
            if (this.io) {
                this.io.emit('hotspot:update', simulationState.hotspot);
            }
        } catch (error) {
            // Robust Fallback: ARP scan for the specific hotspot subnet
            try {
                const { stdout: arpOut } = await execAsync('arp -a');
                const devices = this.parseArpOutput(arpOut);
                simulationState.hotspot.connectedDevices = devices;
                if (this.io) this.io.emit('hotspot:update', simulationState.hotspot);
            } catch (arpError) {
                console.error('❌ [Hotspot] Critical discovery failure:', arpError);
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
            // Specifically look for dynamic entries in the Hotspot subnet
            if (trimmed.includes('192.168.137.') && trimmed.includes('dynamic')) {
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 3) {
                    const ip = parts[0];
                    const mac = parts[1];
                    if (ip === '192.168.137.1' || ip.endsWith('.255')) continue;
                    
                    devices.push({
                        id: `dev-${mac.replace(/-/g, '').toLowerCase()}`,
                        name: this.getDeviceName(ip, mac),
                        ip: ip,
                        mac: mac,
                        signal: -Math.floor(Math.random() * 30 + 35),
                        connectedAt: 'Active',
                        traffic: (Math.random() * 4 + 0.1).toFixed(1) + ' Mbps'
                    });
                }
            }
        }
        return devices;
    }

    getDeviceName(ip, mac) {
        const m = mac.toLowerCase();
        if (m.startsWith('00:') || m.startsWith('00-')) return 'iPhone 6G-Fabric';
        if (m.startsWith('0a:') || m.startsWith('0a-')) return 'Android Neural Node';
        if (m.startsWith('b4:') || m.startsWith('b4-')) return 'Samsung Galaxy Core';
        if (m.startsWith('3c:') || m.startsWith('3c-')) return '6G Dev Terminal';
        if (m.startsWith('d8:') || m.startsWith('d8-')) return 'Nvidia Jetson Node';
        return `U-Node ${ip.split('.').pop()}`;
    }
}

export const hotspotService = new HotspotService();
