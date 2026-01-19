import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import './ChartPanel.css';

export default function ChartPanel({ history }) {
    // Prepare data for charts
    const chartData = history.slice(-30).map((item, index) => ({
        time: index,
        battery: item.sensors?.battery?.percentage || 0,
        temperature: item.sensors?.temperature || 0,
        speed: item.location?.speed || 0,
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p style={{ color: '#00a8e8', fontWeight: 600 }}>
                        {payload[0].name}: {payload[0].value.toFixed(1)} {payload[0].unit}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-panel card">
            <h2 className="section-title">
                <TrendingUp size={20} />
                Real-time Telemetry Charts
            </h2>

            <div className="charts-grid">
                {/* Battery Chart */}
                <div className="chart-container">
                    <h3 className="chart-title">Battery Level</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00c853" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00c853" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e4976" />
                            <XAxis dataKey="time" stroke="#b2bac2" hide />
                            <YAxis stroke="#b2bac2" domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="battery"
                                stroke="#00c853"
                                fill="url(#batteryGradient)"
                                name="Battery"
                                unit="%"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Speed Chart */}
                <div className="chart-container">
                    <h3 className="chart-title">Speed</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e4976" />
                            <XAxis dataKey="time" stroke="#b2bac2" hide />
                            <YAxis stroke="#b2bac2" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="speed"
                                stroke="#00a8e8"
                                strokeWidth={3}
                                dot={false}
                                name="Speed"
                                unit=" km/h"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Temperature Chart */}
                <div className="chart-container">
                    <h3 className="chart-title">Temperature</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e4976" />
                            <XAxis dataKey="time" stroke="#b2bac2" hide />
                            <YAxis stroke="#b2bac2" domain={[0, 50]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke="#ff6b6b"
                                strokeWidth={3}
                                dot={false}
                                name="Temperature"
                                unit="°C"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
