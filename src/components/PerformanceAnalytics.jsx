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
        try {
            const { jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');

            // Fetch fresh data if needed, or use existing
            const data = analyticsData;
            if (!data) throw new Error("No data available to export");

            const doc = new jsPDF();

            // Header Branding
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text('6G DASHBOARD: PERFORMANCE REPORT', 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

            // 1. KPI Summary Table
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.text('Network KPI Improvement Summary', 14, 55);

            const tableBody = data.metrics.map(m => [
                m.name,
                m.baseline + (m.unit || ''),
                m.proposed + (m.unit || ''),
                `${m.improvement}%`
            ]);

            autoTable(doc, {
                startY: 60,
                head: [['Metric', 'Baseline', 'Proposed', 'Improvement']],
                body: tableBody,
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129] }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
            }

            doc.save(`6g-performance-report-${Date.now()}.pdf`);
            alert("✅ Performance report generated and download started!");
        } catch (error) {
            console.error('Export Error:', error);
            alert("❌ Failed to export report: " + error.message);
        }
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
