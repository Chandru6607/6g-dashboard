import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { Line } from 'react-chartjs-2';
import apiService from '../services/apiService';
import './MultiAgentRL.css';

const MultiAgentRL = () => {
    const agents = useSocket('agents:update');
    const [rewardData, setRewardData] = useState(null);

    useEffect(() => {
        apiService.getRewardCurves().then((data) => {
            setRewardData(data);
        });
    }, []);

    const chartData = rewardData ? {
        labels: rewardData.labels,
        datasets: rewardData.datasets.map((dataset, idx) => ({
            ...dataset,
            borderColor: ['#00f3ff', '#8b5cf6', '#10b981'][idx],
            backgroundColor: `rgba(${idx === 0 ? '0,243,255' : idx === 1 ? '139,92,246' : '16,185,129'},0.1)`,
            tension: 0.4,
        })),
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#ffffff' },
            },
        },
        scales: {
            y: {
                ticks: { color: '#ffffff99' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            x: {
                ticks: { color: '#ffffff99' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    };

    return (
        <div className="panel multi-agent-rl">
            <div className="panel-header">
                <h2 className="panel-title">Multi-Agent Reinforcement Learning</h2>
            </div>
            <div className="panel-body">
                <div className="agents-list">
                    {agents?.map((agent) => (
                        <div key={agent.id} className="agent-card">
                            <div className="agent-header">
                                <span className="agent-name">{agent.name}</span>
                                <span className={`badge ${agent.state === 'inference' ? 'badge-success' : 'badge-warning'}`}>
                                    {agent.state.charAt(0).toUpperCase() + agent.state.slice(1)}
                                </span>
                            </div>
                            <div className="agent-stats">
                                <div className="agent-stat">
                                    <span className="stat-label">Episodes</span>
                                    <span className="stat-value">{agent.episodes?.toLocaleString()}</span>
                                </div>
                                <div className="agent-stat">
                                    <span className="stat-label">Avg Reward</span>
                                    <span className="stat-value">+{agent.avgReward}</span>
                                </div>
                                <div className="agent-stat">
                                    <span className="stat-label">Convergence</span>
                                    <span className="stat-value">{agent.convergence}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chart-container">
                    <h3 className="chart-title">Reward Curves - Training Progress</h3>
                    {chartData && (
                        <div style={{ height: '200px' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiAgentRL;
