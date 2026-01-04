import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import socketService from './services/socketService';
import { mcpClient } from './services/mcpClient';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MonitoringPage from './pages/MonitoringPage';
import ConfigPage from './pages/ConfigPage';
import Footer from './components/Footer';
import './styles/global.css';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = socketService.connect();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Initialize MCP connection
    mcpClient.connect().catch(err => console.error("MCP Connection Failed:", err));

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Navigation />
        <div className="main-layout">
          <Header connected={connected} />

          <div className="content-area">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route path="/config" element={<ConfigPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
