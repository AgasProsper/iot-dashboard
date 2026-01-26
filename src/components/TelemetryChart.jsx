import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function TelemetryChart({ data, dataKey, color, unit }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No history data available
            </div>
        );
    }

    // Helper to access nested keys like "sensors.battery.percentage"
    const getValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || 0;
    };

    // Format data for chart
    const chartData = data.map(d => ({
        time: new Date(d.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        value: getValue(d, dataKey)
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                    dataKey="time"
                    stroke="#9CA3AF"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#9CA3AF"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    // domain={dataKey.includes('percentage') ? [0, 100] : ['auto', 'auto']}
                    width={30}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                    itemStyle={{ color: color }}
                    formatter={(value) => [`${value} ${unit || ''}`, 'Value']}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    fillOpacity={1}
                    fill={`url(#color-${dataKey})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
