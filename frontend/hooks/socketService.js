// WebSocket Service for Real-time Communication

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? 'http://localhost:3001' : '');

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map(); // Store listeners: event -> [callbacks]
    }

    connect() {
        if (!this.socket) {
            console.log('🔌 Connecting WebSocket...');
            this.socket = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
            });

            this.socket.on('connect', () => {
                console.log('✅ WebSocket connected:', this.socket.id);
                this._reattachListeners();
            });

            this.socket.on('disconnect', () => {
                console.log('❌ WebSocket disconnected');
            });

            this.socket.on('connect_error', (error) => {
                console.error('🔴 WebSocket connection error:', error);
            });

            // Attach any existing listeners that were registered before connect
            this._reattachListeners();
        }

        return this.socket;
    }

    _simulateConnection() {
        // Simulate connection for demo mode
        setTimeout(() => {
            this._triggerEvent('connect', { id: 'demo-socket' });
        }, 100);
    }

    _createMockSocket() {
        return {
            id: 'demo-socket',
            connected: true,
            on: (event, callback) => {
                this.listeners.set(event, this.listeners.get(event) || []);
                this.listeners.get(event).push(callback);
            },
            off: (event, callback) => {
                const callbacks = this.listeners.get(event) || [];
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            },
            emit: (event, data) => {
                console.log(`📡 [Demo] Socket emit: ${event}`, data);
            },
            disconnect: () => {
                console.log('🔌 [Demo] Mock socket disconnected');
            }
        };
    }

    _triggerEvent(event, data) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(callback => callback(data));
    }

    disconnect() {
        if (this.socket) {
            console.log('🔌 Disconnecting WebSocket...');
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Helper to attach all stored listeners to the current socket
    _reattachListeners() {
        if (!this.socket) return;

        this.listeners.forEach((callbacks, event) => {
            // Remove existing listeners for this event to avoid duplicates if re-attaching
            this.socket.removeAllListeners(event);

            callbacks.forEach(callback => {
                this.socket.on(event, callback);
            });
        });
    }

    on(event, callback) {
        // Store listener locally
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // If socket exists, attach immediately
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        // Remove from local storage
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
            if (callbacks.length === 0) {
                this.listeners.delete(event);
            }
        }

        // Remove from actual socket
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        } else {
            console.warn('⚠️ Cannot emit, socket not connected:', event);
        }
    }
}

export default new SocketService();
