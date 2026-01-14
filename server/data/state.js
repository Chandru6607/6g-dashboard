// Global Simulation State
export const simulationState = {
    active: false,
    startTime: null,
    scenario: 'default',
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
    ]
};
