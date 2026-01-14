import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import apiService from '../services/apiService';
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
    const [timeRange, setTimeRange] = useState('Last 24 Hours');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleGlobalExport = async () => {
        setIsExporting(true);
        try {
            const { jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');

            // Get data from services
            let metrics = [];
            try {
                const analytics = await apiService.getAnalytics();
                metrics = analytics?.metrics || [];
            } catch (apiError) {
                console.warn("⚠️ [Analytics] Direct API fetch failed, using localized stats for report:", apiError.message);
                // Fallback metrics if API fails
                metrics = [
                    { name: 'Latency', baseline: '10.2 ms', proposed: '7.8 ms', improvement: -23.5 },
                    { name: 'Throughput', baseline: '8.4 Gbps', proposed: '12.6 Gbps', improvement: 50.0 },
                    { name: 'Packet Loss', baseline: '1.2%', proposed: '0.4%', improvement: -66.7 }
                ];
            }

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            // Header Branding
            doc.setFillColor(15, 23, 42); // Theme Dark Blue
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('6G DIGITAL TWIN: ANALYTICS REPORT', 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated: ${new Date().toLocaleString()} | Range: ${timeRange}`, 14, 32);

            // 1. Historical Trends Table (Simulated for Report)
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.text('1. Historical Performance Summary', 14, 55);

            const trendTable = [['Hour', 'Latency (ms)', 'Throughput (Gbps)']];
            for (let i = 0; i < 24; i += 2) {
                trendTable.push([
                    `${i}:00`,
                    (Math.random() * 5 + 2).toFixed(2),
                    (Math.random() * 5 + 10).toFixed(2)
                ]);
            }

            autoTable(doc, {
                startY: 60,
                head: [trendTable[0]],
                body: trendTable.slice(1),
                headStyles: { fillColor: [96, 165, 250] },
            });

            // 2. Network KPIs
            doc.setFontSize(16);
            doc.text('2. Network Key Performance Indicators', 14, doc.lastAutoTable.finalY + 15);

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 20,
                head: [['KPI Metric', 'Current Value', 'Trend (%)']],
                body: [
                    ['Network Uptime', '99.98%', '+0.02%'],
                    ['Avg Response Time', '3.2ms', '-0.8%'],
                    ['Request Success Rate', '98.5%', '-0.3%'],
                    ['Total Data Processed', '1.2TB', '+12GB']
                ],
                headStyles: { fillColor: [16, 185, 129] },
            });

            // 3. Agent Performance (Using Live Metrics if available)
            doc.setFontSize(16);
            doc.text('3. Intelligent Agent Efficiency', 14, doc.lastAutoTable.finalY + 15);

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 20,
                head: [['Agent / Metric', 'Status / Score', 'Optimization']],
                body: metrics.map(m => [m.name, m.proposed || 'N/A', `${m.improvement}% Improvement`]),
                headStyles: { fillColor: [139, 92, 246] },
            });

            doc.save(`6G-Global-Analytics-Report-${Date.now()}.pdf`);
            alert("✅ Report generated and download started successfully!");
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert("❌ Failed to generate report. Please check if jspdf is correctly installed.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleRangeChange = (e) => {
        const range = e.target.value;
        setTimeRange(range);
        setIsRefreshing(true);

        // Simulate a server query delay
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

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
                <div className="header-titles">
                    <h1 className="page-title">Advanced Analytics</h1>
                    <p className="page-subtitle">Historical data and trend analysis</p>
                </div>
                <button
                    className={`export-global-btn ${isExporting ? 'loading' : ''}`}
                    onClick={handleGlobalExport}
                    disabled={isExporting}
                >
                    {isExporting ? 'Generating PDF...' : '📥 Export Complete Report'}
                </button>
            </div>

            <div className="analytics-grid">
                <div className="analytics-panel large">
                    <div className="panel-header">
                        <h3>Historical Performance Trends</h3>
                        <div className="analytics-controls">
                            {isRefreshing && <span className="refresh-spinner">🔄</span>}
                            <select
                                className="time-range-select"
                                value={timeRange}
                                onChange={handleRangeChange}
                                disabled={isRefreshing}
                            >
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                    <div className={`chart-wrapper ${isRefreshing ? 'refreshing' : ''}`}>
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
