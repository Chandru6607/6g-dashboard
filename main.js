import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess = null;
let frontendProcess = null;
let mainWindow = null;

// ─── Spawn a child process ───────────────────────────────────────────────────
function spawnProcess(command, args, cwd, label) {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '0' }
  });
  child.on('error', (err) => console.error(`[${label}] error:`, err.message));
  child.on('exit', (code) => console.log(`[${label}] exited with code ${code}`));
  return child;
}

// ─── Poll until a server responds ───────────────────────────────────────────
function waitForServer(url, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const { hostname, port, pathname } = new URL(url);
    const check = () => {
      const req = http.request({ hostname, port: Number(port), path: pathname, method: 'GET' }, (res) => {
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
        } else {
          setTimeout(check, 1000);
        }
      });
      req.end();
    };
    check();
  });
}

// ─── Create Browser Window ───────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,   // allow localhost cross-origin in dev
    },
    backgroundColor: '#050505',
    show: false,            // shown only after page loads
    title: '6G Command Center',
  });

  mainWindow.loadURL('http://localhost:3000');

  // Show only once content has loaded — no blank flash
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  // Open external links in browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── App lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  console.log('🚀 [Electron] Starting 6G Command Center...');

  const root = __dirname;
  const backendDir  = path.join(root, 'backend');
  const frontendDir = path.join(root, 'frontend');

  // 1. Start Backend (port 3001)
  console.log('🔧 [Electron] Launching backend...');
  backendProcess = spawnProcess('npm', ['run', 'dev'], backendDir, 'Backend');

  // 2. Start Frontend (port 3000)
  console.log('🎨 [Electron] Launching frontend...');
  frontendProcess = spawnProcess('npm', ['run', 'dev'], frontendDir, 'Frontend');

  // 3. Wait for frontend to be ready, then open window
  console.log('⏳ [Electron] Waiting for services to be ready...');
  try {
    await waitForServer('http://localhost:3000', 120000);
    console.log('✅ [Electron] Frontend ready — opening window');
    createWindow();
  } catch (err) {
    console.error('❌ [Electron] Services failed to start:', err.message);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ─── Clean up child processes on quit ───────────────────────────────────────
app.on('before-quit', () => {
  console.log('🛑 [Electron] Shutting down services...');
  if (backendProcess)  { backendProcess.kill();  backendProcess  = null; }
  if (frontendProcess) { frontendProcess.kill(); frontendProcess = null; }
});
