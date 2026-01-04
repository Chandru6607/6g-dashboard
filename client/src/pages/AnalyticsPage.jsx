import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import PerformanceAnalytics from '../components/PerformanceAnalytics';
import MultiAgentRL from '../components/MultiAgentRL';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import './AnalyticsPage.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AnalyticsPage = () => {
    // Sample historical data
    const historicalData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
            {
                label: 'Latency (ms)',
                data: Array.from({ length: 24 }, () => Math.random() * 5 + 2),
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                fill: true,
            },
            {
                label: 'Throughput (Gbps)',
                data: Array.from({ length: 24 }, () => Math.random() * 5 + 10),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
            },
        ],
    };

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
        <motion.div
            className="analytics-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="page-header">
                <h1 className="page-title">Advanced Analytics</h1>
                <p className="page-subtitle">Historical data and trend analysis</p>
            </div>

            <div className="analytics-grid">
                <div className="analytics-panel large">
                    <div className="panel-header">
                        <h3>Historical Performance Trends</h3>
                        <select className="time-range-select">
                            <option>Last 24 Hours</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="chart-wrapper">
                        <Line data={historicalData} options={chartOptions} />
                    </div>
                </div>

                <div className="analytics-panel">
                    <div className="panel-header">
                        <h3>Network KPIs</h3>
                    </div>
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <span className="kpi-label">Uptime</span>
                            <span className="kpi-value">99.98%</span>
                            <span className="kpi-trend positive">+0.02%</span>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-label">Avg Response</span>
                            <span className="kpi-value">3.2ms</span>
                            <span className="kpi-trend positive">-0.8ms</span>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-label">Success Rate</span>
                            <span className="kpi-value">98.5%</span>
                            <span className="kpi-trend negative">-0.3%</span>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-label">Data Processed</span>
                            <span className="kpi-value">1.2TB</span>
                            <span className="kpi-trend positive">+120GB</span>
                        </div>
                    </div>
                </div>

                <div className="analytics-panel">
                    <div className="panel-header">
                        <h3>Agent Performance</h3>
                    </div>
                    <div className="agent-performance">
                        <div className="performance-item">
                            <span className="performance-name">Resource Allocation</span>
                            <div className="performance-bar">
                                <div className="performance-fill" style={{ width: '96%' }}></div>
                                <span className="performance-label">96%</span>
                            </div>
                        </div>
                        <div className="performance-item">
                            <span className="performance-name">Congestion Control</span>
                            <div className="performance-bar">
                                <div className="performance-fill" style={{ width: '83%' }}></div>
                                <span className="performance-label">83%</span>
                            </div>
                        </div>
                        <div className="performance-item">
                            <span className="performance-name">Mobility Management</span>
                            <div className="performance-bar">
                                <div className="performance-fill" style={{ width: '98%' }}></div>
                                <span className="performance-label">98%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ gridColumn: 'span 12' }}>
                    <PerformanceAnalytics />
                </div>
                <div style={{ gridColumn: 'span 12' }}>
                    <MultiAgentRL />
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;
