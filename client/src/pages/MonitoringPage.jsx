import { motion } from 'framer-motion';
import DigitalTwinControl from '../components/DigitalTwinControl';
import TelemetryStream from '../components/TelemetryStream';
import '../App.css';

const MonitoringPage = () => {
    return (
        <motion.div
            className="monitoring-page"
            style={{ padding: 'var(--spacing-xl)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 className="page-title">Real-time Monitoring</h1>
                <p className="page-subtitle">Live control and telemetry stream</p>
            </div>

            <div className="dashboard">
                <div className="digital-twin-control" style={{ gridColumn: 'span 6' }}>
                    <DigitalTwinControl />
                </div>
                <div className="telemetry-stream" style={{ gridColumn: 'span 6' }}>
                    <TelemetryStream />
                </div>
            </div>
        </motion.div>
    );
};

export default MonitoringPage;
