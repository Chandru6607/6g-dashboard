'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import apiService from '../../hooks/apiService';
import PerformanceAnalytics from '../../components/PerformanceAnalytics';
import MultiAgentRL from '../../components/MultiAgentRL';
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

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('Last 24 Hours');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleGlobalExport = async () => {
        setIsExporting(true);
        try {
            const { jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');

            let metrics = [];
            try {
                const analytics = await apiService.getAnalytics();
                metrics = analytics?.metrics || [];
            } catch (apiError) {
                metrics = [
                    { name: 'Latency', baseline: '10.2 ms', proposed: '7.8 ms', improvement: -23.5 },
                    { name: 'Throughput', baseline: '8.4 Gbps', proposed: '12.6 Gbps', improvement: 50.0 },
                    { name: 'Packet Loss', baseline: '1.2%', proposed: '0.4%', improvement: -66.7 }
                ];
            }

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('6G DIGITAL TWIN: ANALYTICS REPORT', 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated: ${new Date().toLocaleString()} | Range: ${timeRange}`, 14, 32);

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

            doc.save(`6G-Global-Analytics-Report-${Date.now()}.pdf`);
            alert("✅ Report generated successfully!");
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert("❌ Failed to generate report.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleRangeChange = (e) => {
        const range = e.target.value;
        setTimeRange(range);
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

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
            legend: { labels: { color: '#ffffff' } },
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
                    <h3>Network KPIs</h3>
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <span className="kpi-label">Uptime</span>
                            <span className="kpi-value">99.98%</span>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-label">Avg Response</span>
                            <span className="kpi-value">3.2ms</span>
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
}
