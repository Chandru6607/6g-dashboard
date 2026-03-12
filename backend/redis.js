// Redis Configuration and Clients
import { createClient } from 'redis';

// Redis URL from environment or fallback to localhost
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis clients for pub/sub
export const pubClient = createClient({ url: REDIS_URL });
export const subClient = createClient({ url: REDIS_URL });

// Flag to track Redis availability
let redisAvailable = false;

// Connection event handlers
pubClient.on('error', (err) => {
    if (redisAvailable) {
        console.error('❌ [Redis] Pub client error:', err);
        redisAvailable = false;
    }
});

pubClient.on('connect', () => {
    console.log('✅ [Redis] Pub client connected');
    redisAvailable = true;
});

subClient.on('error', (err) => {
    if (redisAvailable) {
        console.error('❌ [Redis] Sub client error:', err);
        redisAvailable = false;
    }
});

subClient.on('connect', () => {
    console.log('✅ [Redis] Sub client connected');
    redisAvailable = true;
});

// Initialize Redis connections (optional for development)
export async function initializeRedis() {
    try {
        await Promise.all([
            pubClient.connect(),
            subClient.connect()
        ]);
        console.log('🔗 [Redis] Both clients initialized successfully');
        redisAvailable = true;
        return true;
    } catch (error) {
        console.warn('⚠️ [Redis] Failed to initialize Redis, running without Redis adapter:', error.message);
        redisAvailable = false;
        return false;
    }
}

// Check if Redis is available
export function isRedisAvailable() {
    return redisAvailable;
}

// Graceful shutdown
export async function closeRedisConnections() {
    try {
        if (redisAvailable) {
            await Promise.all([
                pubClient.quit(),
                subClient.quit()
            ]);
            console.log('🔌 [Redis] Connections closed');
        }
    } catch (error) {
        console.error('❌ [Redis] Error closing connections:', error);
    }
}
