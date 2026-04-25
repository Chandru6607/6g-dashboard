'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../logo.png';
import './Navigation.css';

const Navigation = ({ isOpen }) => {
    const pathname = usePathname();
    const navItems = [
        { path: '/', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }, // Home
        { path: '/digital-twin', label: 'Twin Engine', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }, // Server
        { path: '/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }, // Chart
        { path: '/monitoring', label: 'Telemetry', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' }, // Eye
        { path: '/docs', label: 'Docs', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }, // Book
    ];

    return (
        <nav className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-content">
                <div className="nav-group">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                title={!isOpen ? item.label : ''}
                            >
                                <span className="icon-wrapper">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {isActive && <div className="active-glow"></div>}
                                </span>
                                {isOpen && <span className="label">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">CN</div>
                        {isOpen && (
                            <div className="user-info">
                                <span className="name">Command Node</span>
                                <span className="role">Operator</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .sidebar {
                    width: ${isOpen ? 'var(--sidebar-width)' : '68px'};
                    height: 100vh;
                    background: var(--sidebar-bg);
                    border-right: 1px solid var(--card-border);
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 24px 12px;
                }
                .nav-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px;
                    border-radius: 10px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--foreground);
                }
                .nav-link.active {
                    background: rgba(0, 243, 255, 0.08);
                    color: var(--accent-primary);
                }
                .icon-wrapper {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .active-glow {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
                    opacity: 0.2;
                    filter: blur(8px);
                }
                .label { font-size: 0.85rem; font-weight: 500; }
                .sidebar-footer { margin-top: auto; padding-top: 20px; border-top: 1px solid var(--card-border); }
                .user-profile { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 8px; cursor: pointer; }
                .user-profile:hover { background: rgba(255, 255, 255, 0.05); }
                .avatar { width: 32px; height: 32px; background: var(--accent-purple); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; }
                .user-info { display: flex; flex-direction: column; }
                .user-info .name { font-size: 0.8rem; font-weight: 600; }
                .user-info .role { font-size: 0.65rem; color: var(--text-secondary); }
            `}</style>
        </nav>
    );
};

export default Navigation;
