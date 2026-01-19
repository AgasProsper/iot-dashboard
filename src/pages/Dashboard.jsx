import { useState, useEffect } from 'react';
import { Ship, Wifi, WifiOff, Activity, Droplets, Thermometer, Battery } from 'lucide-react';
import LiveMap from '../components/LiveMap';
import TelemetryCard from '../components/TelemetryCard';
import ChartPanel from '../components/ChartPanel';
import AlertsPanel from '../components/AlertsPanel';
import Analytics from '../components/Analytics';
import './Dashboard.css';

export default function Dashboard({ connected, telemetryData, alerts, socket }) {
    // Store data for ALL boats: { 'PROTO001': data, 'PROTO002': data }
    const [boatsData, setBoatsData] = useState({});

    // Store history for the CURRENTLY SELECTED boat
    const [history, setHistory] = useState([]);

    // Which boat is currently selected (default to first one found)
    const [selectedBoatId, setSelectedBoatId] = useState(null);

    // Update boats dictionary when new telemetry arrives
    useEffect(() => {
        if (telemetryData) {
            setBoatsData(prev => {
                const newData = { ...prev, [telemetryData.boat_id]: telemetryData };

                // If this is the first boat data we've seen, select it
                if (!selectedBoatId) {
                    setSelectedBoatId(telemetryData.boat_id);
                }
                return newData;
            });

            // Only update history if the data matches the SELECTED boat
            if (selectedBoatId && telemetryData.boat_id === selectedBoatId) {
                setHistory(prev => [...prev, telemetryData].slice(-100));
            }
        }
    }, [telemetryData, selectedBoatId]);

    // Handle boat selection change
    const handleBoatSelect = (boatId) => {
        setSelectedBoatId(boatId);
        setHistory([]); // Clear history (in a real app, you'd fetch history for this boat)
    };

    // Get data for selected boat (or null)
    const selectedBoatData = selectedBoatId ? boatsData[selectedBoatId] : null;

    const getStatusColor = () => {
        if (!connected) return '#9e9e9e';
        if (!selectedBoatData) return '#ffa726';
        return '#00c853';
    };

    const getStatusText = () => {
        if (!connected) return 'Disconnected';
        if (!selectedBoatData) return 'Waiting for data...';
        return 'Online';
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <Ship size={32} color="#00a8e8" />
                        <div>
                            <h1>Nigerian Waterway Fleet Management</h1>
                            <p className="subtitle">Real-time Boat Monitoring System</p>
                        </div>
                    </div>

                    <div className="header-right">
                        {/* Boat Selector */}
                        <div className="boat-selector">
                            <select
                                value={selectedBoatId || ''}
                                onChange={(e) => handleBoatSelect(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', marginRight: '1rem' }}
                            >
                                {Object.keys(boatsData).length === 0 && <option value="">No boats detected</option>}
                                {Object.keys(boatsData).map(id => (
                                    <option key={id} value={id}>
                                        {id} ({boatsData[id].location?.speed?.toFixed(1) || 0} km/h)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="connection-status" style={{ borderColor: getStatusColor() }}>
                            {connected ? <Wifi size={20} /> : <WifiOff size={20} />}
                            <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
                            {connected && selectedBoatData && (
                                <span className="pulse-dot" style={{ background: getStatusColor() }}></span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Top Section - Map and Status */}
                <div className="top-section">
                    <div className="map-container card">
                        <h2 className="section-title">
                            <Activity size={20} />
                            Live Location Tracking
                        </h2>
                        {/* Pass ALL boats data to map, and current selection */}
                        <LiveMap
                            boatsData={boatsData}
                            selectedBoatId={selectedBoatId}
                            onBoatSelect={handleBoatSelect}
                            history={history}
                        />
                    </div>

                    <div className="status-panel">
                        <TelemetryCard
                            icon={<Thermometer size={24} />}
                            title="Temperature"
                            value={selectedBoatData?.sensors?.temperature || '--'}
                            unit="°C"
                            color="#ff6b6b"
                            trend={selectedBoatData?.sensors?.temperature > 35 ? 'warning' : 'normal'}
                        />

                        <TelemetryCard
                            icon={<Droplets size={24} />}
                            title="Humidity"
                            value={selectedBoatData?.sensors?.humidity || '--'}
                            unit="%"
                            color="#4ecdc4"
                        />

                        <TelemetryCard
                            icon={<Droplets size={24} />}
                            title="Water Detection"
                            value={
                                <div>
                                    {selectedBoatData?.sensors?.rain_status || '--'}
                                    <span style={{ fontSize: '0.6em', color: '#999', display: 'block' }}>
                                        (Raw: {selectedBoatData?.sensors?.rain_value || 0})
                                    </span>
                                </div>
                            }
                            unit=""
                            color={
                                selectedBoatData?.sensors?.rain_status === 'WATER DETECTED' ? '#f44336' : '#00c853'
                            }
                            trend={selectedBoatData?.sensors?.rain_status === 'WATER DETECTED' ? 'warning' : 'normal'}
                        />

                        <TelemetryCard
                            icon={<Battery size={24} />}
                            title="Battery"
                            value={selectedBoatData?.sensors?.battery?.percentage || '--'}
                            unit="%"
                            color={
                                selectedBoatData?.sensors?.battery?.percentage > 50 ? '#00c853' :
                                    selectedBoatData?.sensors?.battery?.percentage > 20 ? '#ffa726' : '#f44336'
                            }
                            trend={selectedBoatData?.sensors?.battery?.percentage < 20 ? 'critical' : 'normal'}
                        />

                        <TelemetryCard
                            icon={<Activity size={24} />}
                            title="Speed"
                            value={selectedBoatData?.location?.speed?.toFixed(1) || '--'}
                            unit="km/h"
                            color="#00a8e8"
                        />
                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    <ChartPanel history={history} />
                </div>

                {/* Bottom Section - Analytics and Alerts */}
                <div className="bottom-section">
                    <Analytics telemetryData={selectedBoatData} history={history} />
                    <AlertsPanel alerts={alerts} />
                </div>
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>© 2026 Nigerian Waterway Fleet Management | Prototype v1.0</p>
                {selectedBoatData && (
                    <p className="last-update">
                        Last Update: {new Date().toLocaleTimeString()}
                    </p>
                )}
            </footer>
        </div>
    );
}
