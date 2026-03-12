'use client';

import Link from 'next/link';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-main-text">
                    <p>&copy; {new Date().getFullYear()} 6G Digital Twin Platform <span className="footer-bullet">•</span> Multi-Agent RL Ecosystem <span className="footer-bullet">•</span> Research & Development</p>
                </div>
                <div className="footer-links">
                    <Link href="/docs" className="footer-link">Documentation</Link>
                    <Link href="#" className="footer-link">Privacy Policy</Link>
                    <Link href="#" className="footer-link">Terms of Service</Link>
                    <Link href="#" className="footer-link">System Status</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
