import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import './SystemHealth.css';

const SystemHealth = () => {
    const [alerts, setAlerts] = useState([]);
    const newAlert = useSocket('alert:new'); // Corrected channel
    const alertsRef = useRef(null);

    const handleRescueTroubleshoot = async () => {
        try {
            console.log('🆘 [UI] Triggering Rescue Agent troubleshooting...');
            const response = await fetch('/api/system/rescue', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                alert('🛡️ Rescue Agent: ' + data.message);
            }
        } catch (error) {
            console.error('❌ Rescue request failed:', error);
        }
    };

    useEffect(() => {
        if (newAlert) {
            setAlerts(prev => [newAlert, ...prev].slice(0, 30));

            // Auto-scroll to top
            if (alertsRef.current) {
                alertsRef.current.scrollTop = 0;
            }
        }
    }, [newAlert]);

    return (
        <div className="panel system-health">
            <div className="panel-header">
                <div className="title-with-icon">
                    <h2 className="panel-title">System Health & Alerts</h2>
                    <span className="rescue-agent-badge" title="Rescue Agent is active and monitoring">🛡️ Rescue Active</span>
                </div>
                <div className="panel-actions">
                    <button className="rescue-action-btn" onClick={handleRescueTroubleshoot} title="Perform Intensive System Troubleshooting">
                        Fix Everything
                    </button>
                    <span className="alert-count">{alerts.length}</span>
                </div>
            </div>
            <div className="panel-body">
                <div className="alerts-container" ref={alertsRef}>
                    {alerts.map((alert) => (
                        <div key={alert.id} className={`alert-item severity-${alert.severity}`}>
                            <div className="alert-header">
                                <span className={`badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}`}>
                                    {alert.severity.toUpperCase()}
                                </span>
                                <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="alert-message">{alert.message}</div>
                            <div className="alert-source">{alert.source}</div>
                        </div>
                    ))}
                    {alerts.length === 0 && (
                        <div className="empty-state">No alerts</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
