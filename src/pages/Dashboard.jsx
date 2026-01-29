import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Ship, Wifi, MapPin } from 'lucide-react';
import LiveMap from '../components/LiveMap';
import MetricCard from '../components/MetricCard';
import FleetList from '../components/FleetList';
import DeviceDetails from '../components/DeviceDetails';
import Layout from '../components/Layout';

export default function Dashboard({ connected, telemetryData, alerts }) {
    const [boatsData, setBoatsData] = useState({});
    const [selectedBoatId, setSelectedBoatId] = useState(null);
    const [history, setHistory] = useState([]);

    // Update boats data
    useEffect(() => {
        if (telemetryData) {
            setBoatsData(prev => {
                const newData = { ...prev, [telemetryData.boat_id]: telemetryData };

                // Select first boat automatically if none selected
                if (!selectedBoatId) {
                    setSelectedBoatId(telemetryData.boat_id);
                }

                return newData;
            });

            // Update history for selected boat
            if (selectedBoatId && telemetryData.boat_id === selectedBoatId) {
                setHistory(prev => [...prev, telemetryData].slice(-50)); // Keep last 50 points
            }
        }
    }, [telemetryData, selectedBoatId]);

    const handleBoatSelect = (boatId) => {
        if (boatId !== selectedBoatId) {
            setSelectedBoatId(boatId);
            setHistory([]); // Clear history on boat switch
        }
    };

    // Calculate Aggregate Stats
    const boats = Object.values(boatsData);
    const totalBoats = boats.length;
    // Count boats that are NOT explicitly offline
    const onlineBoats = connected
        ? boats.filter(b => (b.network?.status || 'ONLINE') !== 'OFFLINE').length
        : 0;
    const criticalAlerts = alerts.filter(a => a.type === 'critical' || a.type === 'battery_low').length;

    const selectedBoat = boatsData[selectedBoatId];

    return (
        <Layout connected={connected}>
            <div className="p-4 md:p-6 h-full flex flex-col gap-6 max-w-[1920px] mx-auto">
                {/* 1. Top Bar: Aggregate Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Fleet"
                        value={totalBoats}
                        icon={<Ship size={20} />}
                        color="primary"
                    />
                    <MetricCard
                        title="Online"
                        value={onlineBoats}
                        icon={<Wifi size={20} />}
                        color="success"
                    />
                    <MetricCard
                        title="Alerts"
                        value={criticalAlerts}
                        icon={<AlertTriangle size={20} />}
                        color={criticalAlerts > 0 ? "danger" : "success"}
                    />
                    <MetricCard
                        title="Tracking"
                        value={selectedBoatId || "None"}
                        icon={<MapPin size={20} />}
                        color="warning"
                        subtext="Selected"
                    />
                </div>

                {/* 2. Main Workspace */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

                    {/* Left Column: Fleet List (4 cols) */}
                    <div className="lg:col-span-4 h-full min-h-[400px]">
                        <FleetList
                            boatsData={boatsData}
                            selectedBoatId={selectedBoatId}
                            onSelect={handleBoatSelect}
                        />
                    </div>

                    {/* Right Column: Map & Details (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                        {/* Map Area */}
                        <div className="flex-1 min-h-[300px] bg-card rounded-xl border border-gray-800 p-1 relative">
                            <LiveMap
                                boatsData={boatsData}
                                selectedBoatId={selectedBoatId}
                                onBoatSelect={handleBoatSelect}
                            />
                        </div>

                        {/* Details Tab Panel */}
                        <div className="h-[350px]">
                            <DeviceDetails
                                boat={selectedBoat}
                                history={history}
                                alerts={alerts}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
