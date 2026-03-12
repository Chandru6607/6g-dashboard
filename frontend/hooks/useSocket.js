// Custom Hook for WebSocket Events

import { useEffect, useState } from 'react';
import socketService from './socketService';

// Fake data generators for immediate display
const generateFakeData = (event) => {
    switch (event) {
        case 'network:update':
            return {
                timestamp: new Date().toISOString(),
                topology: {
                    gNBs: [
                        { id: 'gNB-1', x: 0, y: 0, z: 0, status: 'active' },
                        { id: 'gNB-2', x: 100, y: 0, z: 0, status: 'active' },
                        { id: 'gNB-3', x: 50, y: 100, z: 0, status: 'active' }
                    ],
                    UEs: [
                        { id: 'UE-1', x: 25, y: 25, z: 0, status: 'active' },
                        { id: 'UE-2', x: 75, y: 25, z: 0, status: 'active' },
                        { id: 'UE-3', x: 50, y: 75, z: 0, status: 'active' }
                    ]
                },
                topologyType: 'Mesh',
                metrics: {
                    latency: 12,
                    throughput: 850,
                    packetLoss: 0.2,
                    connectedDevices: 6
                },
                agents: [
                    { id: 'agent-1', name: 'Resource Allocation', state: 'training', episodes: 150, avgReward: 0.85, trainingProgress: 75 },
                    { id: 'agent-2', name: 'Congestion Control', state: 'training', episodes: 200, avgReward: 0.92, trainingProgress: 60 },
                    { id: 'agent-3', name: 'Mobility Management', state: 'inference', episodes: 300, avgReward: 0.78, trainingProgress: 100 }
                ]
            };
        case 'agents:update':
            return [
                { id: 'agent-1', name: 'Resource Allocation', state: 'training', episodes: 150, avgReward: 0.85, trainingProgress: 75 },
                { id: 'agent-2', name: 'Congestion Control', state: 'training', episodes: 200, avgReward: 0.92, trainingProgress: 60 },
                { id: 'agent-3', name: 'Mobility Management', state: 'inference', episodes: 300, avgReward: 0.78, trainingProgress: 100 }
            ];
        case 'topology:changed':
            return { topology: 'Mesh' };
        default:
            return null;
    }
};

export const useSocket = (event, initialValue = null) => {
    const [data, setData] = useState(initialValue || generateFakeData(event));

    useEffect(() => {
        const handleData = (newData) => {
            setData(newData);
        };

        // Try to set up real socket listener
        try {
            socketService.on(event, handleData);
        } catch (error) {
            console.log('⚠️ [UI] Socket not available, using fake data');
        }

        return () => {
            try {
                socketService.off(event, handleData);
            } catch (error) {
                console.log('⚠️ [UI] Socket cleanup failed');
            }
        };
    }, [event]);

    return data;
};

export const useSocketEmit = () => {
    return (event, data) => {
        try {
            socketService.emit(event, data);
        } catch (error) {
            console.log('⚠️ [UI] Socket emit failed, using fake behavior');
        }
    };
};
