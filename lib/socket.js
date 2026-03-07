// Socket.io client configuration for 6G Dashboard
import { io } from 'socket.io-client';

// WebSocket URL from environment or fallback to localhost
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

// Create socket connection with configuration
const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket', 'polling']
});

// Connection event handlers
socket.on('connect', () => {
    console.log('✅ [Socket] Connected to backend:', SOCKET_URL);
});

socket.on('disconnect', (reason) => {
    console.log('❌ [Socket] Disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('❌ [Socket] Connection error:', error);
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 [Socket] Reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
    console.error('❌ [Socket] Reconnection error:', error);
});

// Export socket instance
export default socket;
