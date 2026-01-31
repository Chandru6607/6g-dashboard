// Mock Data Generators for 6G Network Dashboard
import { simulationState } from './state.js';

// Generate random number within range
const randomRange = (min, max) => Math.random() * (max - min) + min;

// Generate random integer within range
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate network topology data
const getTopologyLayout = (type) => {
  // Base gNBs and UEs for stability, but positioned differently
  const gNBs = [];
  const UEs = [];
  const width = 800;
  const height = 400;

  switch (type) {
    case 'Ring':
      // Circular arrangement
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 150;
        gNBs.push({
          id: `gnb-${i + 1}`, type: 'gNB',
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          status: 'active'
        });
        // UEs around ring
        UEs.push({ id: `ue-${i * 2 + 1}`, type: 'UE', x: width / 2 + Math.cos(angle) * (radius + 40), y: height / 2 + Math.sin(angle) * (radius + 40), connectedTo: `gnb-${i + 1}`, status: 'active' });
        UEs.push({ id: `ue-${i * 2 + 2}`, type: 'UE', x: width / 2 + Math.cos(angle) * (radius - 40), y: height / 2 + Math.sin(angle) * (radius - 40), connectedTo: `gnb-${i + 1}`, status: 'active' });
      }
      break;

    case 'Bus':
      // Linear arrangement
      for (let i = 0; i < 5; i++) {
        gNBs.push({
          id: `gnb-${i + 1}`, type: 'gNB',
          x: 100 + (i * 150),
          y: height / 2,
          status: 'active'
        });
        UEs.push({ id: `ue-${i * 2 + 1}`, type: 'UE', x: 100 + (i * 150), y: height / 2 - 60, connectedTo: `gnb-${i + 1}`, status: 'active' });
        UEs.push({ id: `ue-${i * 2 + 2}`, type: 'UE', x: 100 + (i * 150), y: height / 2 + 60, connectedTo: `gnb-${i + 1}`, status: 'active' });
      }
      break;

    case 'Star':
      // Central node with satellites
      gNBs.push({ id: 'gnb-1', type: 'gNB', x: width / 2, y: height / 2, status: 'active' });
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        gNBs.push({
          id: `gnb-${i + 2}`, type: 'gNB',
          x: width / 2 + Math.cos(angle) * 180,
          y: height / 2 + Math.sin(angle) * 180,
          status: 'active'
        });
      }
      // Distribute UEs
      UEs.push({ id: 'ue-1', type: 'UE', x: width / 2 + 50, y: height / 2 + 50, connectedTo: 'gnb-1', status: 'active' });
      UEs.push({ id: 'ue-2', type: 'UE', x: width / 2 - 50, y: height / 2 - 50, connectedTo: 'gnb-1', status: 'active' });
      // ... more quick UEs randomly
      for (let i = 0; i < 8; i++) {
        UEs.push({ id: `ue-${i + 3}`, type: 'UE', x: randomInt(100, 700), y: randomInt(50, 350), connectedTo: `gnb-${randomInt(1, 5)}`, status: 'active' });
      }
      break;

    case 'Tree':
      // Hierarchical
      gNBs.push({ id: 'gnb-1', type: 'gNB', x: width / 2, y: 50, status: 'active' }); // Root
      gNBs.push({ id: 'gnb-2', type: 'gNB', x: width / 4, y: 150, status: 'active' });
      gNBs.push({ id: 'gnb-3', type: 'gNB', x: (width / 4) * 3, y: 150, status: 'active' });
      gNBs.push({ id: 'gnb-4', type: 'gNB', x: width / 8, y: 250, status: 'active' });
      gNBs.push({ id: 'gnb-5', type: 'gNB', x: (width / 8) * 3, y: 250, status: 'active' });
      for (let i = 0; i < 10; i++) {
        UEs.push({ id: `ue-${i + 1}`, type: 'UE', x: randomInt(100, 700), y: randomInt(200, 350), connectedTo: `gnb-${randomInt(1, 5)}`, status: 'active' });
      }
      break;

    case 'Hybrid':
    case 'Mesh':
    default:
      // The original random-ish scatter
      return simulationState.topology;
  }
  return { gNBs, UEs };
};

export const generateNetworkTopology = () => {
  // If state has a specific topology type requested, generate it
  if (simulationState.currentTopologyType && simulationState.currentTopologyType !== 'Mesh') {
    return getTopologyLayout(simulationState.currentTopologyType);
  }
  return simulationState.topology;
};

// Generate real-time network metrics
export const generateNetworkMetrics = () => ({
  latency: randomRange(1, 5).toFixed(2),
  throughput: randomRange(8, 15).toFixed(2),
  packetLoss: randomRange(0, 0.5).toFixed(3),
  activeNodes: randomInt(15, 20),
  timestamp: Date.now(),
});

// Generate agent states
export const generateAgentStates = () => {
  if (!simulationState.active) return simulationState.agents;

  // Increment episodes and reward slightly if simulation is active
  simulationState.agents = simulationState.agents.map(agent => ({
    ...agent,
    episodes: agent.state === 'training' ? agent.episodes + 1 : agent.episodes,
    avgReward: agent.state === 'training'
      ? Math.min(0.99, parseFloat(agent.avgReward) + 0.0001).toFixed(4)
      : agent.avgReward,
    convergence: agent.state === 'training'
      ? Math.min(100, parseFloat(agent.convergence) + 0.01).toFixed(2)
      : agent.convergence
  }));

  return simulationState.agents;
};

// Generate telemetry events
const severities = ['info', 'warning', 'error', 'critical'];
const sources = ['kafka.network.metrics', 'mqtt.telemetry', 'kafka.events', 'mqtt.alerts', 'kafka.analytics'];
const eventTypes = [
  'NETWORK_METRIC_UPDATE',
  'HANDOVER_COMPLETED',
  'RESOURCE_ALLOCATED',
  'CONGESTION_DETECTED',
  'ANOMALY_DETECTED',
  'POLICY_UPDATED',
  'TRAINING_COMPLETED',
  'SYNC_STATUS_CHANGED',
];

export const generateTelemetryEvent = () => {
  const severity = severities[randomInt(0, severities.length - 1)];
  const eventType = eventTypes[randomInt(0, eventTypes.length - 1)];

  const messages = {
    info: `${eventType}: Operation completed successfully`,
    warning: `${eventType}: Performance degradation detected`,
    error: `${eventType}: Retry attempt in progress`,
    critical: `${eventType}: Immediate attention required`,
  };

  return {
    id: `evt-${Date.now()}-${randomInt(1000, 9999)}`,
    timestamp: new Date().toISOString(),
    severity,
    source: sources[randomInt(0, sources.length - 1)],
    type: eventType,
    message: messages[severity],
  };
};

// Generate alerts
export const generateAlert = () => {
  const severities = ['info', 'warning', 'critical'];
  const severity = severities[randomInt(0, severities.length - 1)];

  const alertMessages = {
    info: [
      'Agent training epoch completed',
      'Network topology updated',
      'Scheduled maintenance completed',
    ],
    warning: [
      'High latency detected in sector 3',
      'Resource utilization above 85%',
      'Packet loss increasing',
    ],
    critical: [
      'Base station gNB-4 connection lost',
      'Agent convergence failure',
      'Security breach attempt detected',
    ],
  };

  const messages = alertMessages[severity];
  const message = messages[randomInt(0, messages.length - 1)];

  return {
    id: `alert-${Date.now()}-${randomInt(1000, 9999)}`,
    timestamp: new Date().toISOString(),
    severity,
    source: `System Monitor`,
    message,
  };
};

// Generate predictive analytics data
export const generatePredictiveData = () => {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: now + i * 60000, // 1 minute intervals
    predicted: randomRange(2, 6).toFixed(2),
    confidence: randomRange(85, 98).toFixed(1),
  }));
};

// Generate reward curve data for agents
export const generateRewardCurves = () => ({
  labels: Array.from({ length: 50 }, (_, i) => i * 100),
  datasets: [
    {
      label: 'Resource Allocation',
      data: Array.from({ length: 50 }, (_, i) =>
        Math.min(0.9, 0.3 + (i / 50) * 0.6 + randomRange(-0.05, 0.05))
      ),
    },
    {
      label: 'Congestion Control',
      data: Array.from({ length: 50 }, (_, i) =>
        Math.min(0.8, 0.2 + (i / 50) * 0.6 + randomRange(-0.08, 0.08))
      ),
    },
    {
      label: 'Mobility Management',
      data: Array.from({ length: 50 }, (_, i) =>
        Math.min(0.95, 0.35 + (i / 50) * 0.6 + randomRange(-0.04, 0.04))
      ),
    },
  ],
});

// Generate performance analytics data
export const generateAnalyticsData = () => ({
  metrics: [
    {
      name: 'Latency',
      baseline: randomRange(8, 12).toFixed(2),
      proposed: randomRange(4, 7).toFixed(2),
      unit: 'ms',
      improvement: -23,
    },
    {
      name: 'Throughput',
      baseline: randomRange(8, 10).toFixed(2),
      proposed: randomRange(11, 14).toFixed(2),
      unit: 'Gbps',
      improvement: 18,
    },
    {
      name: 'Packet Loss',
      baseline: randomRange(0.8, 1.2).toFixed(2),
      proposed: randomRange(0.3, 0.6).toFixed(2),
      unit: '%',
      improvement: -41,
    },
  ],
  timeSeries: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    baseline: Array.from({ length: 24 }, () => randomRange(5, 10)),
    proposed: Array.from({ length: 24 }, () => randomRange(2, 6)),
  },
});

// Sync progress simulation
let syncProgress = 87;
export const getSyncProgress = () => {
  syncProgress = Math.min(100, syncProgress + randomRange(0, 0.5));
  if (syncProgress >= 99.5) syncProgress = Math.max(85, randomRange(85, 95));
  return syncProgress.toFixed(1);
};

// AI Confidence simulation
let aiConfidence = 94;
export const getAIConfidence = () => {
  aiConfidence = Math.min(99, Math.max(88, aiConfidence + randomRange(-1, 1)));
  return aiConfidence.toFixed(1);
};
