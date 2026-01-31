import NetworkOverview from '../components/NetworkOverview';
import SystemHealth from '../components/SystemHealth';
import ConnectedServers from '../components/ConnectedServers';
import { motion } from 'framer-motion';
import '../App.css';

const DashboardPage = () => {
    return (
        <motion.main
            className="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="network-overview" style={{ gridColumn: 'span 8' }}>
                <NetworkOverview />
                <ConnectedServers />
            </div>
            <div className="system-health" style={{ gridColumn: 'span 4' }}>
                <SystemHealth />
            </div>
        </motion.main>
    );
};

export default DashboardPage;
