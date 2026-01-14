import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import apiService from '../services/apiService';
import socketService from '../services/socketService';
import './ExperimentManager.css';

const scenarios = [
    { id: 'urban', title: 'Urban Dense Deployment', desc: 'High UE density with varying mobility patterns' },
    { id: 'highway', title: 'Highway Mobility', desc: 'High-speed handover optimization' },
    { id: 'industrial', title: 'Industrial IoT', desc: 'Ultra-reliable low-latency communications' },
    { id: 'stadium', title: 'Stadium Event', desc: 'Massive connectivity stress test' },
];

const ExperimentManager = () => {
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [trafficProfile, setTrafficProfile] = useState('normal');
    const [duration, setDuration] = useState(300);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    // Sync with global simulation state
    const simState = useSocket('simulation:state');
    useEffect(() => {
        if (simState) {
            setIsRunning(simState.active);
        }
    }, [simState]);

    const handleSelectScenario = async (scenarioId) => {
        setSelectedScenario(scenarioId);
        // await apiService.selectScenario(scenarioId);
    };

    const handleStartExperiment = async () => {
        if (!selectedScenario) {
            alert('Please select a scenario first');
            return;
        }

        setIsRunning(true);
        setProgress(0);

        const response = await apiService.startExperiment(selectedScenario, trafficProfile, duration);
        socketService.emit('experiment:start', response);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsRunning(false);
                    return 100;
                }
                return prev + (100 / (duration / 1000));
            });
        }, 1000);
    };

    const handleStopExperiment = async () => {
        setIsRunning(false);
        setProgress(0);
        await apiService.stopExperiment();
        socketService.emit('experiment:stop');
    };

    return (
        <div className="panel experiment-manager">
            <div className="panel-header">
                <h2 className="panel-title">Experiment & Scenario Manager</h2>
                <div className="panel-actions">
                    <span className={`badge ${isRunning ? 'badge-success' : ''}`}>
                        {isRunning ? 'Running' : 'Idle'}
                    </span>
                </div>
            </div>
            <div className="panel-body">
                <div className="scenario-grid">
                    {scenarios.map((scenario) => (
                        <div
                            key={scenario.id}
                            className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
                            onClick={() => handleSelectScenario(scenario.id)}
                        >
                            <h4 className="scenario-title">{scenario.title}</h4>
                            <p className="scenario-desc">{scenario.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="experiment-controls">
                    <div className="control-group">
                        <label className="control-label">Traffic Profile</label>
                        <select
                            className="select-input"
                            value={trafficProfile}
                            onChange={(e) => setTrafficProfile(e.target.value)}
                            disabled={isRunning}
                        >
                            <option value="normal">Normal Load</option>
                            <option value="high">High Load</option>
                            <option value="burst">Burst Traffic</option>
                            <option value="lowlatency">Low Latency Priority</option>
                        </select>
                    </div>
                    <div className="control-group">
                        <label className="control-label">Duration</label>
                        <input
                            type="number"
                            className="input-number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            min="60"
                            max="3600"
                            disabled={isRunning}
                        />
                        <span className="input-unit">seconds</span>
                    </div>
                    <div className="control-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={handleStartExperiment}
                            disabled={isRunning}
                        >
                            <span>▶</span> Start Experiment
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleStopExperiment}
                            disabled={!isRunning}
                        >
                            <span>⏹</span> Stop
                        </button>
                    </div>
                </div>
                {isRunning && (
                    <div className="experiment-progress">
                        <div className="progress-header">
                            <span>{scenarios.find(s => s.id === selectedScenario)?.title}</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperimentManager;
