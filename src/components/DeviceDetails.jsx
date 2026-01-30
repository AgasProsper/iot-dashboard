import { useState } from 'react';
import { LayoutDashboard, LineChart, Bell, Battery, Thermometer, Droplets, Navigation, Clock, Activity, Zap, Brain, Wrench, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
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
                    <TabButton
                        id="ai"
                        label="AI Insights"
                        icon={<Brain size={14} />}
                        active={activeTab === 'ai'}
                        onClick={setActiveTab}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        {/* 1. Engine & Fuel Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MetricCard
                                title="Engine RPM"
                                value={boat.engine?.rpm || 0}
                                unit="RPM"
                                icon={<Activity size={20} />}
                                color="primary"
                            />
                            <MetricCard
                                title="Fuel Level"
                                value={boat.engine?.fuel_percentage || 0}
                                unit="%"
                                icon={<Battery size={20} />} // Using Battery icon for Fuel gauge metaphor
                                color={boat.engine?.fuel_percentage < 20 ? "danger" : "success"}
                            />
                            <MetricCard
                                title="Engine Temp"
                                value={boat.engine?.temperature || 0}
                                unit="°C"
                                icon={<Thermometer size={20} />}
                                color={boat.engine?.temperature > 100 ? "danger" : "warning"}
                            />
                            <MetricCard
                                title="Voltage"
                                value={boat.engine?.voltage?.toFixed(1) || 0}
                                unit="V"
                                icon={<Zap size={20} />}
                                color="success"
                            />
                        </div>

                        {/* 2. Safety & Environment */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MetricCard
                                title="Speed (SOG)"
                                value={location.speed?.toFixed(1) || 0}
                                unit="km/h"
                                icon={<Navigation size={20} />}
                                color="blue"
                            />
                            <MetricCard
                                title="Roll Angle"
                                value={boat.safety?.roll_angle || 0}
                                unit="°"
                                icon={<Activity size={20} />}
                                color={Math.abs(boat.safety?.roll_angle) > 30 ? "danger" : "success"}
                            />
                            <MetricCard
                                title="Impact Force"
                                value={boat.safety?.g_force || 0}
                                unit="g"
                                icon={<Activity size={20} />}
                                color={boat.safety?.g_force > 3 ? "danger" : "success"}
                            />
                            <MetricCard
                                title="Ambient Temp"
                                value={boat.environment?.ambient_temp || 0}
                                unit="°C"
                                icon={<Thermometer size={20} />}
                                color="neutral"
                            />
                        </div>

                        {/* Location Details */}
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <MapPin size={16} /> GPS Diagnostics
                                </h3>
                                <div className="text-xs text-gray-500">
                                    Satellites: <span className="text-white ml-1">{location.satellites}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Latitude</span>
                                    <span className="text-white font-mono">{location.latitude?.toFixed(6)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Longitude</span>
                                    <span className="text-white font-mono">{location.longitude?.toFixed(6)}</span>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
                            {/* Engine Temp Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-orange-400 font-medium mb-2 uppercase">Engine Temperature</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="engine.temperature"
                                        color="#F97316"
                                        unit="°C"
                                    />
                                </div>
                            </div>

                            {/* Fuel Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-green-400 font-medium mb-2 uppercase">Fuel Level</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="engine.fuel_percentage"
                                        color="#22C55E"
                                        unit="%"
                                    />
                                </div>
                            </div>

                            {/* RPM Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-blue-400 font-medium mb-2 uppercase">Engine RPM</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="engine.rpm"
                                        color="#3B82F6"
                                        unit="RPM"
                                    />
                                </div>
                            </div>

                            {/* Roll Angle Chart */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col">
                                <p className="text-xs text-red-400 font-medium mb-2 uppercase">Roll Angle (Stability)</p>
                                <div className="flex-1 min-h-[150px]">
                                    <TelemetryChart
                                        data={history}
                                        dataKey="safety.roll_angle"
                                        color="#EF4444"
                                        unit="°"
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

                {activeTab === 'ai' && (
                    <div className="space-y-4">
                        {/* AI Summary Panel */}
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <h3 className="text-purple-400 font-bold flex items-center gap-2 mb-3">
                                <Brain size={18} />
                                Captain's Assistant
                            </h3>
                            <div className="space-y-3">
                                {boat.ai?.anomalies?.length > 0 ? (
                                    boat.ai.anomalies.map((issue, i) => (
                                        <div key={i} className="bg-red-500/10 p-2 rounded flex items-center gap-2 text-red-200 text-sm">
                                            <AlertTriangle size={16} className="shrink-0" />
                                            <span>Anomaly Detected: <strong>{issue}</strong></span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-green-300 text-sm flex items-center gap-2">
                                        <Activity size={16} /> System functioning normally.
                                    </div>
                                )}

                                <div className="bg-gray-900/50 p-3 rounded flex items-start gap-3 border border-gray-700/50">
                                    <TrendingUp size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase mb-1">Recommendation</p>
                                        <p className="text-sm text-gray-200">
                                            {boat.ai?.efficiency_score < 90
                                                ? `Reduce engine RPM to ${boat.ai?.recommended_rpm} to improve fuel efficiency by approx 15%.`
                                                : "Current cruising speed is optimal for fuel consumption."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard
                                title="Efficiency Score"
                                value={boat.ai?.efficiency_score || 0}
                                unit="/ 100"
                                icon={<Zap size={20} />}
                                color={boat.ai?.efficiency_score > 80 ? "success" : "warning"}
                            />
                            <MetricCard
                                title="Pred. Range"
                                value={boat.ai?.predicted_range_km || 0}
                                unit="km"
                                icon={<Navigation size={20} />}
                                color="primary"
                            />
                            <MetricCard
                                title="Maintenance"
                                value={boat.ai?.maintenance_status || "Good"}
                                icon={<Wrench size={20} />}
                                color={boat.ai?.maintenance_status === "Good" ? "success" : "danger"}
                            />
                            <MetricCard
                                title="Est. Fuel Life"
                                value={(boat.ai?.predicted_range_km / 25).toFixed(1)}
                                subtext="Hours"
                                icon={<Clock size={20} />}
                                color="neutral"
                            />
                        </div>
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
