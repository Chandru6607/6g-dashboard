import { execSync } from 'child_process';
import os from 'os';

const ports = [3000, 5000, 5173];

console.log('🔍 [Autoconfig] Checking for port conflicts...');

ports.forEach(port => {
    try {
        let cmd = '';
        if (os.platform() === 'win32') {
            cmd = `netstat -ano | findstr :${port}`;
        } else {
            cmd = `lsof -i :${port} -t`;
        }

        const output = execSync(cmd).toString().trim();
        if (output) {
            console.log(`⚠️  [Autoconfig] Port ${port} is in use. Cleaning up...`);
            if (os.platform() === 'win32') {
                // Get the PID from netstat output (last column)
                const lines = output.split('\n');
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && pid !== '0') {
                        try {
                            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
                            console.log(`✅ [Autoconfig] Terminated PID ${pid} on port ${port}`);
                        } catch (e) {
                            // PID might have closed already
                        }
                    }
                });
            } else {
                try {
                    execSync(`kill -9 ${output}`, { stdio: 'ignore' });
                    console.log(`✅ [Autoconfig] Terminated process on port ${port}`);
                } catch (e) { }
            }
        }
    } catch (e) {
        // Port is free
    }
});

console.log('✨ [Autoconfig] Environment is clean and ready.');
