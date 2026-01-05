import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2026 6G Digital Twin Platform | Multi-Agent RL Ecosystem | Research & Development</p>
                <div className="footer-links">
                    <Link to="/docs" className="footer-link">Documentation</Link>
                    <Link to="/api-ref" className="footer-link">API Reference</Link>
                    <Link to="/support" className="footer-link">Support</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
