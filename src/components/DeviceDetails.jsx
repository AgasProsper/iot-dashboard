
import { useState, useMemo } from 'react';
import { LayoutDashboard, LineChart, Bell, Battery, Thermometer, Droplets, Navigation, Clock, Activity, Zap, Brain, Wrench, TrendingUp, AlertTriangle, MapPin, Gauge } from 'lucide-react';
import MetricCard from './MetricCard';
import TelemetryChart from './TelemetryChart';
import clsx from 'clsx';
import { analyzeTelemetry } from '../utils/aiAnalyst';

export default function DeviceDetails({ boat, history, alerts }) {
    const [activeTab, setActiveTab] = useState('overview');

    const analysis = useMemo(() => boat ? analyzeTelemetry(boat) : null, [boat]);

    if (!boat) {
        return (
            <div className="bg-card rounded-xl border border-gray-800 p-8 flex flex-col items-center justify-center text-gray-500 h-full">
                <LayoutDashboard size={48} className="mb-4 opacity-20" />
                <p>Select a boat from the list to view details</p>
            </div>
        );
    }

    const sensors = boat.sensors || {};
    // Fallbacks for simulation vs prototype schema
    const temp = sensors.temperature ?? boat.environment?.ambient_temp;
    const humidity = sensors.humidity ?? 0;
    const rainStatus = sensors.rain_status ?? boat.environment?.rain_status ?? "UNKNOWN";
    const voltage = sensors.battery?.voltage;
    const batteryPct = sensors.battery?.percentage;
    const accel = sensors.motion || {};

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
                        id="ai"
                        label="AI Analyst"
                        icon={<Brain size={14} />}
                        active={activeTab === 'ai'}
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
                        {/* 1. Main Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Engine Temp (remapped from sensors.temperature) */}
                            {temp !== undefined && (
                                <MetricCard
                                    title="Engine Temp"
                                    value={temp}
                                    unit="°C"
                                    icon={<Thermometer size={20} />}
                                    color={temp > 90 ? "danger" : (temp > 75 ? "warning" : "primary")}
                                    subtext="Sensor 1"
                                />
                            )}

                            {/* Internal Moisture (remapped from humidity) */}
                            {humidity !== undefined && (
                                <MetricCard
                                    title="Internal Moisture"
                                    value={humidity}
                                    unit="%"
                                    icon={<Droplets size={20} />}
                                    color={humidity > 80 ? "danger" : "blue"}
                                    subtext="Leak Monitor"
                                />
                            )}

                            {/* Battery Health */}
                            {voltage !== undefined && (
                                <MetricCard
                                    title="Battery"
                                    value={voltage.toFixed(2)}
                                    unit="V"
                                    icon={<Battery size={20} />}
                                    color={voltage < 3.3 ? "danger" : "success"}
                                    progressBar={batteryPct}
                                    subtext={`${batteryPct}% Charged`}
                                />
                            )}

                            {/* Rain Status */}
                            <MetricCard
                                title="Rain Status"
                                value={rainStatus === "NO WATER" ? "Dry" : "Rain"}
                                icon={<Gauge size={20} />}
                                color={rainStatus !== "NO WATER" ? "blue" : "neutral"}
                                subtext={sensors.rain_value ? `Val: ${sensors.rain_value}` : "Sensor OK"}
                            />
                        </div>

                        {/* 2. Motion & Stability */}
                        {accel.accel_z !== undefined && (
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                                    <Activity size={16} /> Motion & Stability
                                </h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-500 text-xs uppercase">Accel X</span>
                                        <p className="text-white font-mono">{accel.accel_x?.toFixed(2) ?? 0}g</p>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-500 text-xs uppercase">Accel Y</span>
                                        <p className="text-white font-mono">{accel.accel_y?.toFixed(2) ?? 0}g</p>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded border border-blue-500/20">
                                        <span className="text-blue-400 text-xs uppercase">Accel Z (Vert)</span>
                                        <p className="text-white font-mono font-bold">{accel.accel_z?.toFixed(2) ?? 0}g</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ai' && analysis && (
                    <div className="space-y-4">
                        {/* Safety Score */}
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard
                                title="Safety Score"
                                value={analysis.safetyScore}
                                unit="/ 100"
                                icon={<Brain size={20} />}
                                color={analysis.safetyScore > 80 ? "success" : "warning"}
                                progressBar={analysis.safetyScore}
                            />
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex flex-col justify-center">
                                <h3 className="text-purple-400 text-sm font-bold flex items-center gap-2 mb-1">
                                    <Brain size={16} /> AI Maintenance
                                </h3>
                                <p className="text-2xl text-white font-bold">{analysis.maintenance}</p>
                                <p className="text-xs text-gray-400">Based on {analysis.anomalyCount} anomalies</p>
                            </div>
                        </div>

                        {/* Insights List */}
                        <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Real-time Insights</h3>
                            {analysis.insights.length > 0 ? (
                                <div className="space-y-2">
                                    {analysis.insights.map((insight, i) => (
                                        <div key={i} className="flex gap-3 items-start p-2 bg-white/5 rounded">
                                            <AlertTriangle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                                            <p className="text-sm text-gray-200">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Activity size={24} className="mx-auto mb-2 opacity-50" />
                                    No anomalies detected. Operations normal.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="h-full flex flex-col">
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col h-[200px] mb-4">
                            <p className="text-xs text-orange-400 font-medium mb-2 uppercase">Engine Temp History</p>
                            <div className="flex-1">
                                <TelemetryChart
                                    data={history}
                                    dataKey="sensors.temperature" // Use new path
                                    color="#F97316"
                                    unit="°C"
                                />
                            </div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-white/5 flex flex-col h-[200px]">
                            <p className="text-xs text-blue-400 font-medium mb-2 uppercase">Internal Moisture History</p>
                            <div className="flex-1">
                                <TelemetryChart
                                    data={history}
                                    dataKey="sensors.humidity" // Use new path
                                    color="#3B82F6"
                                    unit="%"
                                />
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
