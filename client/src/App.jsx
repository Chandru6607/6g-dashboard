import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import socketService from './services/socketService';
import { mcpClient } from './services/mcpClient';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MonitoringPage from './pages/MonitoringPage';
import ConfigPage from './pages/ConfigPage';
import DocsPage from './pages/DocsPage';
import ApiRefPage from './pages/ApiRefPage';
import SupportPage from './pages/SupportPage';
import ComparisonPage from './pages/ComparisonPage';
import Footer from './components/Footer';
import './styles/global.css';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = socketService.connect();

    // Set initial state if already connected
    if (socket && socket.connected) {
      console.log('✅ WebSocket already connected');
      setConnected(true);
    }

    // Use wrapper methods that persist listeners across reconnections
    socketService.on('connect', () => {
      console.log('✅ WebSocket connect event');
      setConnected(true);
    });

    socketService.on('disconnect', () => {
      console.log('❌ WebSocket disconnect event');
      setConnected(false);
    });

    socketService.on('simulation:state', (state) => {
      console.log('📡 Simulation state update:', state);
      setSimulationActive(state.active);
    });

    // Initialize MCP connection
    mcpClient.connect();

    // Cleanup not strictly necessary for singleton service in top-level App, 
    // but good practice if App could unmount.
    return () => {
      // We don't want to kill the service here typically, but if we did:
      // socketService.disconnect(); 
      // For now, we leave the service running or just handle unmount if needed.
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
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
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/digital-twin" element={<DigitalTwinPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/monitoring" element={<MonitoringPage />} />
                <Route path="/config" element={<ConfigPage />} />
                <Route path="/comparison" element={<ComparisonPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/api-ref" element={<ApiRefPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <Footer />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
