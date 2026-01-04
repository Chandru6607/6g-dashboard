import { motion } from 'framer-motion';
import ExperimentManager from '../components/ExperimentManager';
import '../App.css';

const ConfigPage = () => {
    return (
        <motion.div
            className="config-page"
            style={{ padding: 'var(--spacing-xl)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 className="page-title">Configuration</h1>
                <p className="page-subtitle">System settings and experiment management</p>
            </div>

            <div className="dashboard">
                <div className="experiment-manager" style={{ gridColumn: 'span 12' }}>
                    <ExperimentManager />
                </div>
            </div>
        </motion.div>
    );
};

export default ConfigPage;
