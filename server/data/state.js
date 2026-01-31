// Global Simulation State
export const simulationState = {
    active: false,
    startTime: null,
    scenario: 'default',
    currentTopologyType: 'Mesh',
    agents: [
        {
            id: 'resource-allocation',
            name: 'Resource Allocation Agent',
            state: 'inference',
            episodes: 15420,
            avgReward: 0.88,
            convergence: 94,
        },
        {
            id: 'congestion-control',
            name: 'Congestion Control Agent',
            state: 'training',
            episodes: 8750,
            avgReward: 0.72,
            convergence: 82,
        },
        {
            id: 'mobility-management',
            name: 'Mobility Management Agent',
            state: 'inference',
            episodes: 12100,
            avgReward: 0.91,
            convergence: 96,
        },
    ],
    topology: {
        gNBs: [
            { id: 'gnb-1', type: 'gNB', x: 200, y: 150, status: 'active' },
            { id: 'gnb-2', type: 'gNB', x: 400, y: 120, status: 'active' },
            { id: 'gnb-3', type: 'gNB', x: 600, y: 180, status: 'degraded' },
            { id: 'gnb-4', type: 'gNB', x: 300, y: 250, status: 'active' },
            { id: 'gnb-5', type: 'gNB', x: 500, y: 220, status: 'active' },
        ],
        UEs: [
            { id: 'ue-1', type: 'UE', x: 180, y: 170, connectedTo: 'gnb-1', status: 'active' },
            { id: 'ue-2', type: 'UE', x: 220, y: 130, connectedTo: 'gnb-1', status: 'active' },
            { id: 'ue-3', type: 'UE', x: 380, y: 140, connectedTo: 'gnb-2', status: 'active' },
            { id: 'ue-4', type: 'UE', x: 420, y: 100, connectedTo: 'gnb-2', status: 'active' },
            { id: 'ue-5', type: 'UE', x: 580, y: 200, connectedTo: 'gnb-3', status: 'active' },
            { id: 'ue-6', type: 'UE', x: 620, y: 160, connectedTo: 'gnb-3', status: 'active' },
            { id: 'ue-7', type: 'UE', x: 280, y: 270, connectedTo: 'gnb-4', status: 'active' },
            { id: 'ue-8', type: 'UE', x: 320, y: 230, connectedTo: 'gnb-4', status: 'active' },
            { id: 'ue-9', type: 'UE', x: 480, y: 240, connectedTo: 'gnb-5', status: 'active' },
            { id: 'ue-10', type: 'UE', x: 520, y: 200, connectedTo: 'gnb-5', status: 'active' },
            { id: 'ue-11', type: 'UE', x: 350, y: 180, connectedTo: 'gnb-2', status: 'active' },
            { id: 'ue-12', type: 'UE', x: 450, y: 160, connectedTo: 'gnb-5', status: 'active' },
        ]
    }
};
