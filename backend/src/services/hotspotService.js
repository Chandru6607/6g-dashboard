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
            // Step 1: Use the native Windows Hotspot Manager to get the client list
            // This is the most accurate source and reflects the same list seen in Windows Settings
            const command = `powershell -ExecutionPolicy Bypass -File "${SCRIPT_PATH}" -action get-clients`;
            const { stdout } = await execAsync(command);
            
            let clients = [];
            if (stdout.trim() && stdout.trim() !== '[]') {
                try {
                    // Extract JSON from stdout (in case PS writes other info)
                    const jsonMatch = stdout.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        clients = JSON.parse(jsonMatch[0]);
                        if (!Array.isArray(clients)) clients = [clients];
                    }
                } catch (e) {
                    console.error('⚠️ [Hotspot] Native Client Parse Error:', e.message);
                }
            }

            // Step 2: Parse and Map
            const devices = clients.map(c => {
                const ip = c.IPAddress;
                const mac = c.MacAddress;

                if (!ip || !mac) return null;

                return {
                    id: `dev-${mac.replace(/[:-]/g, '').toLowerCase()}-${ip.split('.').pop()}`,
                    name: this.getDeviceName(ip, mac),
                    ip: ip,
                    mac: mac,
                    signal: -Math.floor(Math.random() * 20 + 40),
                    connectedAt: this.getConnectionTime(mac),
                    traffic: (Math.random() * 6 + 0.5).toFixed(1) + ' Mbps'
                };
            }).filter(Boolean);

            // Step 3: Final State Update
            simulationState.hotspot.connectedDevices = devices;
            
            if (this.io) {
                this.io.emit('hotspot:update', simulationState.hotspot);
            }
        } catch (error) {
            console.error('❌ [Hotspot] Native discovery failed, falling back to ARP:', error.message);
            // Fallback: ARP scan as a safety net
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
