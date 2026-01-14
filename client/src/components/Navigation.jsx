import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navigation.css';

const Navigation = ({ isOpen }) => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/digital-twin', label: 'Digital Twin', icon: '🌐' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
        { path: '/monitoring', label: 'Monitoring', icon: '👁️' },
        { path: '/config', label: 'Configuration', icon: '⚙️' },
        { path: '/docs', label: 'Documentation', icon: '📝' },
        { path: '/api-ref', label: 'API Reference', icon: '💻' },
        { path: '/support', label: 'Support', icon: '🤝' },
    ];

    return (
        <motion.nav
            className={`navigation ${!isOpen ? 'collapsed' : ''}`}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="nav-header">
                <div className="nav-logo">
                    <img src={logo} alt="6G Control" className="nav-logo-image" />
                    <span className="nav-logo-text">6G Control</span>
                </div>
            </div>

            <div className="nav-items">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={item.path === '/'}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                        <div className="nav-indicator"></div>
                    </NavLink>
                ))}
            </div>

            <div className="nav-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        <span>👤</span>
                    </div>
                    <div className="user-details">
                        <span className="user-name">Admin User</span>
                        <span className="user-role">System Administrator</span>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navigation;
