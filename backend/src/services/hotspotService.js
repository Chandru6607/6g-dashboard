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
        
        console.log('🔍 [Hotspot] Starting real-time device monitoring...');
        this.monitorInterval = setInterval(async () => {
            await this.updateConnectedDevices();
        }, 3000); // Poll every 3 seconds
    }

    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
    }

    async updateConnectedDevices() {
        try {
            // We use 'arp -a' to find devices in the local network
            // Note: On Windows, hotspot devices usually appear on a specific interface (e.g. 192.168.137.x)
            const { stdout } = await execAsync('arp -a');
            const devices = this.parseArpOutput(stdout);
            
            simulationState.hotspot.connectedDevices = devices;
            
            if (this.io) {
                this.io.emit('hotspot:update', simulationState.hotspot);
            }
        } catch (error) {
            console.error('❌ [Hotspot] Monitoring error:', error);
        }
    }

    parseArpOutput(output) {
        const lines = output.split('\n');
        const devices = [];
        let currentInterface = '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('Interface:')) {
                currentInterface = trimmed.split(' ')[1];
                continue;
            }

            // Look for dynamic entries which are typically client devices
            if (trimmed.includes('dynamic')) {
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 3) {
                    const ip = parts[0];
                    const mac = parts[1];

                    // Filter out common infrastructure IPs (like .1 or .255)
                    if (ip.endsWith('.1') || ip.endsWith('.255')) continue;

                    // Filter for Hotspot default subnet (192.168.137.x) if we want to be specific
                    // or just include all dynamic ones on the likely hotspot interface
                    
                    devices.push({
                        id: `dev-${mac.replace(/-/g, '')}`,
                        name: this.getDeviceName(ip, mac),
                        ip: ip,
                        mac: mac,
                        signal: -Math.floor(Math.random() * 40 + 30) // Simulated signal strength since ARP doesn't give it
                    });
                }
            }
        }

        // Limit to 5 for UI density
        return devices.slice(0, 5);
    }

    getDeviceName(ip, mac) {
        // Mock name lookup based on MAC prefixes or common patterns
        if (mac.startsWith('00-')) return 'Apple iPhone';
        if (mac.startsWith('0a-')) return 'Android Device';
        if (mac.startsWith('b4-')) return 'Samsung Galaxy';
        if (mac.startsWith('3c-')) return 'Intel Laptop';
        return `Station-${ip.split('.').pop()}`;
    }
}

export const hotspotService = new HotspotService();
