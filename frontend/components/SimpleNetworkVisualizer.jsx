'use client';

import { useState } from 'react';

const SimpleNetworkVisualizer = ({ topology, onNodeClick, agents }) => {
    const [selectedNode, setSelectedNode] = useState(null);

    // Default topology if none provided
    const defaultTopology = {
        gNBs: [
            { id: 'gNB-1', x: 50, y: 50, status: 'active' },
            { id: 'gNB-2', x: 150, y: 50, status: 'active' },
            { id: 'gNB-3', x: 100, y: 150, status: 'active' }
        ],
        UEs: [
            { id: 'UE-1', x: 75, y: 75, status: 'active' },
            { id: 'UE-2', x: 125, y: 75, status: 'active' },
            { id: 'UE-3', x: 100, y: 100, status: 'active' }
        ]
    };

    const currentTopology = topology || defaultTopology;
    const currentAgents = agents || [
        { id: 'agent-1', name: 'Resource Allocation', state: 'training', episodes: 150, avgReward: 0.85, trainingProgress: 75 },
        { id: 'agent-2', name: 'Congestion Control', state: 'training', episodes: 200, avgReward: 0.92, trainingProgress: 60 },
        { id: 'agent-3', name: 'Mobility Management', state: 'inference', episodes: 300, avgReward: 0.78, trainingProgress: 100 }
    ];

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        if (onNodeClick) onNodeClick(node);
    };

    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Title */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                color: '#00f3ff',
                fontSize: '18px',
                fontWeight: 'bold',
                zIndex: 10
            }}>
                🌐 6G Network Topology - Demo Mode
            </div>

            {/* Network Visualization */}
            <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ marginTop: '30px' }}>
                {/* Connections */}
                {currentTopology.UEs.map((ue) => {
                    const connectedGnb = currentTopology.gNBs[0]; // Connect to first gNB
                    return (
                        <line
                            key={`line-${ue.id}-${connectedGnb.id}`}
                            x1={ue.x}
                            y1={ue.y}
                            x2={connectedGnb.x}
                            y2={connectedGnb.y}
                            stroke="#00f3ff"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            opacity="0.6"
                        />
                    );
                })}

                {/* gNB Nodes */}
                {currentTopology.gNBs.map((gnb) => (
                    <g key={gnb.id}>
                        <circle
                            cx={gnb.x}
                            cy={gnb.y}
                            r="15"
                            fill="#00f3ff"
                            stroke="#ffffff"
                            strokeWidth="2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNodeClick(gnb)}
                        />
                        <text
                            x={gnb.x}
                            y={gnb.y + 5}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                            style={{ pointerEvents: 'none' }}
                        >
                            gNB
                        </text>
                    </g>
                ))}

                {/* UE Nodes */}
                {currentTopology.UEs.map((ue) => (
                    <g key={ue.id}>
                        <circle
                            cx={ue.x}
                            cy={ue.y}
                            r="8"
                            fill="#8b5cf6"
                            stroke="#ffffff"
                            strokeWidth="1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNodeClick(ue)}
                        />
                        <text
                            x={ue.x}
                            y={ue.y + 3}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="8"
                            style={{ pointerEvents: 'none' }}
                        >
                            UE
                        </text>
                    </g>
                ))}
            </svg>

            {/* Training Status Panel */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #00f3ff',
                borderRadius: '8px',
                padding: '15px',
                color: '#ffffff',
                fontSize: '12px',
                minWidth: '200px'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#00f3ff' }}>
                    🧠 AI Agent Training
                </div>
                {currentAgents.map((agent) => (
                    <div key={agent.id} style={{ marginBottom: '8px' }}>
                        <div style={{ fontWeight: 'bold' }}>{agent.name}</div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            marginTop: '2px'
                        }}>
                            <div style={{
                                flex: 1,
                                height: '4px',
                                background: '#333',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                marginRight: '8px'
                            }}>
                                <div style={{
                                    width: `${agent.trainingProgress}%`,
                                    height: '100%',
                                    background: agent.state === 'training' ? '#10b981' : '#f59e0b',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                            <span style={{ fontSize: '10px' }}>
                                {agent.trainingProgress}%
                            </span>
                        </div>
                        <div style={{ fontSize: '10px', opacity: 0.7 }}>
                            Episodes: {agent.episodes} | Reward: {agent.avgReward}
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Node Details */}
            {selectedNode && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid #00f3ff',
                    borderRadius: '8px',
                    padding: '15px',
                    color: '#ffffff',
                    fontSize: '12px'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00f3ff' }}>
                        📡 Node Details
                    </div>
                    <div><strong>ID:</strong> {selectedNode.id}</div>
                    <div><strong>Type:</strong> {selectedNode.id.includes('gNB') ? 'Base Station' : 'User Equipment'}</div>
                    <div><strong>Status:</strong> <span style={{ color: '#10b981' }}>{selectedNode.status}</span></div>
                    <div><strong>Position:</strong> ({selectedNode.x}, {selectedNode.y})</div>
                </div>
            )}

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #00f3ff',
                borderRadius: '8px',
                padding: '10px',
                color: '#ffffff',
                fontSize: '10px'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#00f3ff' }}>
                    📊 Legend
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#00f3ff', borderRadius: '50%', marginRight: '5px' }} />
                    <span>Base Station (gNB)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%', marginRight: '5px' }} />
                    <span>User Equipment (UE)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '2px', background: '#00f3ff', marginRight: '5px' }} />
                    <span>Network Connection</span>
                </div>
            </div>
        </div>
    );
};

export default SimpleNetworkVisualizer;
