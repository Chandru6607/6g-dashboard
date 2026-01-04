import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import apiService from '../services/apiService';
import './PerformanceAnalytics.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PerformanceAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        apiService.getAnalytics().then((data) => {
            setAnalyticsData(data);
        });
    }, []);

    const handleExport = async () => {
        const data = await apiService.exportAnalytics();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `6g-analytics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const chartData = analyticsData ? {
        labels: analyticsData.metrics.map(m => m.name),
        datasets: [
            {
                label: 'Baseline',
                data: analyticsData.metrics.map(m => parseFloat(m.baseline)),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Proposed',
                data: analyticsData.metrics.map(m => parseFloat(m.proposed)),
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
            },
        ],
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
        <div className="panel performance-analytics">
            <div className="panel-header">
                <h2 className="panel-title">Performance Analytics</h2>
                <div className="panel-actions">
                    <button className="btn btn-small btn-secondary" onClick={handleExport}>
                        <span>📥</span> Export Results
                    </button>
                </div>
            </div>
            <div className="panel-body">
                {analyticsData && (
                    <>
                        <div className="analytics-summary">
                            {analyticsData.metrics.map((metric) => (
                                <div key={metric.name} className="summary-card">
                                    <span className="summary-label">{metric.name} Improvement</span>
                                    <span className="summary-value improvement">
                                        {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="chart-container">
                            <h3 className="chart-title">Baseline vs Proposed Approach</h3>
                            {chartData && (
                                <div style={{ height: '250px' }}>
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PerformanceAnalytics;
