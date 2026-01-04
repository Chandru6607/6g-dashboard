import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import apiService from '../services/apiService';
import './DigitalTwinControl.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DigitalTwinControl = () => {
    const [isLiveMode, setIsLiveMode] = useState(true);
    const [predictiveData, setPredictiveData] = useState(null);
    const syncData = useSocket('sync:progress');

    useEffect(() => {
        apiService.getPredictiveData().then((data) => {
            if (data.predictions) {
                setPredictiveData(data.predictions);
            }
        });
    }, []);

    const chartData = predictiveData ? {
        labels: predictiveData.map((_, i) => `T+${i}m`),
        datasets: [
            {
                label: 'Predicted Latency',
                data: predictiveData.map(d => d.predicted),
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
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
        <div className="panel digital-twin-control">
            <div className="panel-header">
                <h2 className="panel-title">Digital Twin Control</h2>
                <div className="panel-actions">
                    <span className="badge badge-info">
                        {syncData ? `${syncData.progress}% Synced` : 'Syncing...'}
                    </span>
                </div>
            </div>
            <div className="panel-body">
                <div className="control-section">
                    <div className="control-item">
                        <label className="control-label">Operation Mode</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="modeToggle"
                                checked={isLiveMode}
                                onChange={(e) => setIsLiveMode(e.target.checked)}
                            />
                            <label htmlFor="modeToggle" className="toggle-slider">
                                <span className="toggle-label-left">Simulation</span>
                                <span className="toggle-label-right">Live</span>
                            </label>
                        </div>
                    </div>
                    <div className="control-item">
                        <label className="control-label">Sync Progress</label>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${syncData?.progress || 87}%` }}
                            ></div>
                            <span className="progress-label">{syncData?.progress || 87}%</span>
                        </div>
                    </div>
                    <div className="control-item">
                        <label className="control-label">AI Confidence</label>
                        <div className="confidence-meter">
                            <div
                                className="confidence-bar"
                                style={{ width: `${syncData?.confidence || 94}%` }}
                            ></div>
                            <span className="confidence-label">{syncData?.confidence || 94}%</span>
                        </div>
                    </div>
                </div>
                <div className="chart-container">
                    <h3 className="chart-title">Predictive Analytics - Future Network State</h3>
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

export default DigitalTwinControl;
