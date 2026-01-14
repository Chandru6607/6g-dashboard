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
        const { jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const data = analyticsData;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text('6G Dashboard: Performance Report', 14, 22);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // Summary
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('Network KPI Improvement Summary', 14, 45);

        const tableBody = data.metrics.map(m => [
            m.name,
            m.baseline,
            m.proposed,
            `${m.improvement}%`
        ]);

        autoTable(doc, {
            startY: 50,
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

        doc.save(`6g-analytics-report-${Date.now()}.pdf`);
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
