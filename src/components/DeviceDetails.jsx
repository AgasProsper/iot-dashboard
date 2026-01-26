import { useState } from 'react';
import { LayoutDashboard, LineChart, Bell, Battery, Thermometer, Droplets, Navigation, Clock, Activity } from 'lucide-react';
import MetricCard from './MetricCard';
import TelemetryChart from './TelemetryChart';
import clsx from 'clsx';

export default function DeviceDetails({ boat, history, alerts }) {
    const [activeTab, setActiveTab] = useState('overview');

    if (!boat) {
        return (
            <div className="bg-card rounded-xl border border-gray-800 p-8 flex flex-col items-center justify-center text-gray-500 h-full">
                <LayoutDashboard size={48} className="mb-4 opacity-20" />
                <p>Select a boat from the list to view details</p>
            </div>
        );
    }

    const sensors = boat.sensors || {};
    const location = boat.location || {};

    // Filter alerts for this boat
    const deviceAlerts = alerts.filter(a => a.boat_id === boat.boat_id);

    return (
        <div className="bg-card rounded-xl border border-gray-800 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-white/5">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {boat.boat_id}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white">Active</span>
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                        Last seen: {new Date().toLocaleTimeString()}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-900 rounded-lg p-1">
                    <TabButton
                        id="overview"
                        label="Overview"
                        icon={<LayoutDashboard size={14} />}
                        active={activeTab === 'overview'}
                        onClick={setActiveTab}
                    />
                    <TabButton
                        id="history"
                        label="History"
                        icon={<LineChart size={14} />}
                        active={activeTab === 'history'}
                        onClick={setActiveTab}
                    />
                    <TabButton
                        id="alerts"
                        label="Alerts"
                        icon={<Bell size={14} />}
                        active={activeTab === 'alerts'}
                        count={deviceAlerts.length}
                        onClick={setActiveTab}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        {/* Key Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MetricCard
                                title="Speed"
                                value={location.speed?.toFixed(1) || 0}
                                unit="km/h"
                                icon={<Activity size={20} />}
                                color="primary"
                            />
                            <MetricCard
                                title="Battery"
                                value={sensors.battery?.percentage || 0}
                                unit="%"
                                icon={<Battery size={20} />}
                                color={sensors.battery?.percentage < 20 ? "danger" : "success"}
                            />
                            <MetricCard
                                title="Temp"
                                value={sensors.temperature || 0}
                                unit="°C"
                                icon={<Thermometer size={20} />}
                                color="warning"
                            />
                            <MetricCard
                                title="Moisture"
                                value={sensors.rain_status === 'WATER DETECTED' ? 'Wet' : 'Dry'}
                                icon={<Droplets size={20} />}
                                color={sensors.rain_status === 'WATER DETECTED' ? "danger" : "success"}
                            />
                        </div>

                        {/* Location Details */}
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                                <Navigation size={16} /> Location Data
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Latitude</span>
                                    <span className="text-white font-mono">{location.latitude?.toFixed(6)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Longitude</span>
                                    <span className="text-white font-mono">{location.longitude?.toFixed(6)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Altitude</span>
                                    <span className="text-white font-mono">{location.altitude?.toFixed(1)} m</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Satellites</span>
                                    <span className="text-white font-mono">{location.satellites || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="h-full flex flex-col">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 px-1">
                            Live Trends (Last 50 points)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[400px]">
                            {/* Temp Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-orange-400 font-medium mb-2 uppercase">Temperature Trends</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="sensors.temperature"
                                        color="#F97316"
                                        unit="°C"
                                    />
                                </div>
                            </div>

                            {/* Humidity Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-cyan-400 font-medium mb-2 uppercase">Humidity Levels</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="sensors.humidity"
                                        color="#06B6D4"
                                        unit="%"
                                    />
                                </div>
                            </div>

                            {/* Speed Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-blue-400 font-medium mb-2 uppercase">Water Speed</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="location.speed"
                                        color="#3B82F6"
                                        unit="km/h"
                                    />
                                </div>
                            </div>

                            {/* Battery Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-green-400 font-medium mb-2 uppercase">Battery Status</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="sensors.battery.percentage"
                                        color="#22C55E"
                                        unit="%"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'alerts' && (
                    <div className="space-y-2">
                        {deviceAlerts.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                No alerts for this device
                            </div>
                        ) : (
                            deviceAlerts.map((alert, i) => (
                                <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
                                    <Bell size={18} className="text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white text-sm font-medium">{alert.message}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-red-300/70">
                                            <Clock size={10} />
                                            <span>Recent</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ id, label, icon, active, count, onClick }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                active ? "bg-card text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
        >
            {icon}
            {label}
            {count > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                    {count}
                </span>
            )}
        </button>
    );
}
