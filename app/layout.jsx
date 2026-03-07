'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import socketService from '../services/socketService';
import { mcpClient } from '../services/mcpClient';
import '../styles/global.css';
import '../App.css';

export default function RootLayout({ children }) {
    const [connected, setConnected] = useState(false);
    const [simulationActive, setSimulationActive] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = socketService.connect();

        if (socket && socket.connected) {
            setConnected(true);
        }

        socketService.on('connect', () => {
            setConnected(true);
        });

        socketService.on('disconnect', () => {
            setConnected(false);
        });

        socketService.on('simulation:state', (state) => {
            setSimulationActive(state.active);
        });

        // Initialize MCP connection
        mcpClient.connect();

        return () => {
            // socketService.disconnect();
        };
    }, []);

    return (
        <html lang="en">
            <body suppressHydrationWarning>
                <ErrorBoundary>
                    <div className="app">
                        <Navigation isOpen={isSidebarOpen} />
                        <div className="main-layout">
                            <Header
                                connected={connected}
                                simulationActive={simulationActive}
                                isSidebarOpen={isSidebarOpen}
                                onToggleSidebar={toggleSidebar}
                            />
                            <div className="content-area">
                                {children}
                            </div>
                            <Footer />
                        </div>
                    </div>
                </ErrorBoundary>
            </body>
        </html>
    );
}
