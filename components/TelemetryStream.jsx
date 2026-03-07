import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import './TelemetryStream.css';

const TelemetryStream = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const newEvent = useSocket('telemetry:event');
    const throughput = useSocket('telemetry:throughput');
    const timelineRef = useRef(null);

    useEffect(() => {
        if (newEvent) {
            setEvents(prev => [newEvent, ...prev].slice(0, 50));

            // Auto-scroll to top
            if (timelineRef.current) {
                timelineRef.current.scrollTop = 0;
            }
        }
    }, [newEvent]);

    const filteredEvents = filter === 'all'
        ? events
        : events.filter(e => e.severity === filter);

    return (
        <div className="panel telemetry-stream">
            <div className="panel-header">
                <h2 className="panel-title">Event-Driven Telemetry</h2>
                <div className="panel-actions">
                    <select
                        className="select-filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Severity</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>
            <div className="panel-body">
                <div className="telemetry-stats">
                    <div className="telemetry-stat">
                        <span className="stat-label">Event Throughput</span>
                        <span className="stat-value">{throughput?.throughput || 0}</span>
                        <span className="stat-unit">events/s</span>
                    </div>
                    <div className="telemetry-stat">
                        <span className="stat-label">Kafka Topics</span>
                        <span className="stat-value">12</span>
                    </div>
                    <div className="telemetry-stat">
                        <span className="stat-label">MQTT Streams</span>
                        <span className="stat-value">8</span>
                    </div>
                </div>
                <div className="event-timeline" ref={timelineRef}>
                    {filteredEvents.map((event) => (
                        <div key={event.id} className={`event-item severity-${event.severity}`}>
                            <div className="event-header">
                                <span className="event-timestamp">{new Date(event.timestamp).toLocaleTimeString()}</span>
                                <span className="event-source">{event.source}</span>
                            </div>
                            <div className="event-message">{event.message}</div>
                        </div>
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="empty-state">No events to display</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TelemetryStream;
