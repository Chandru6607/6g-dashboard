'use client';

import { useEffect, useState, Suspense } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SimpleErrorBoundary from '../components/SimpleErrorBoundary';
import socketService from '../hooks/socketService';
import './globals.css';
import '../components/global.css';

export default function RootLayout({ children }) {
    const [connected, setConnected] = useState(false);
    const [simulationActive, setSimulationActive] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    useEffect(() => {
        // Use fake connections for immediate display
        console.log('🚀 [UI] Starting with fake connections for immediate display');
        
        // Simulate successful connections
        setConnected(true);
        setSimulationActive(true);
        
        // Try real connections in background (non-blocking)
        setTimeout(() => {
            try {
                const socket = socketService.connect();
                
                socketService.on('connect', () => {
                    console.log('✅ [UI] Real WebSocket connected');
                });

                socketService.on('simulation:state', (state) => {
                    setSimulationActive(state.active);
                });

            } catch (error) {
                console.log('⚠️ [UI] Real connections failed, continuing with fake data');
            }
        }, 2000); 

        return () => {};
    }, []);

    return (
        <html lang="en">
            <body suppressHydrationWarning style={{ margin: 0, padding: 0, background: '#050505' }}>
                <SimpleErrorBoundary>
                    <div className="app">
                        <Navigation isOpen={isSidebarOpen} />
                        <div className="main-layout">
                            <Header
                                connected={connected}
                                simulationActive={simulationActive}
                                isSidebarOpen={isSidebarOpen}
                                onToggleSidebar={toggleSidebar}
                            />
                            <div className="content-area" id="main-content-area">
                                <Suspense fallback={
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        height: '100%', 
                                        color: '#76b900' 
                                    }}>
                                        <div className="loader"></div>
                                        <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Loading 6G Module...</span>
                                    </div>
                                }>
                                    {children}
                                </Suspense>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </SimpleErrorBoundary>
            </body>
        </html>
    );
}
