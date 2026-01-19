import { BarChart3, Navigation, Zap, Clock, ShieldCheck } from 'lucide-react';
import './Analytics.css';

export default function Analytics({ telemetryData, history }) {
    // Calculate analytics
    const avgSpeed = history.length > 0
        ? (history.reduce((sum, d) => sum + (d.location?.speed || 0), 0) / history.length).toFixed(1)
        : '0';

    const totalDistance = history.length > 0
        ? ((avgSpeed * history.length * 2) / 3600).toFixed(2)
        : '0';

    const operatingTime = Math.floor((history.length * 2) / 60);

    const batteryTrend = history.length > 1
        ? history[history.length - 1].sensors?.battery?.percentage - history[0].sensors?.battery?.percentage
        : 0;

    // Calculate Safety/Stability Index based on accelerometer
    // Ideal static gravity is ~9.8 m/s^2. Deviation means instability.
    let stabilityScore = 100;
    if (telemetryData?.sensors?.motion) {
        const { accel_x, accel_y, accel_z } = telemetryData.sensors.motion;
        // Calculate magnitude of acceleration vector
        const magnitude = Math.sqrt(accel_x * accel_x + accel_y * accel_y + accel_z * accel_z);
        // Deviation from standard gravity (9.8)
        const deviation = Math.abs(magnitude - 9.8);
        // Deduct score based on deviation (sensitivity factor 5)
        stabilityScore = Math.max(0, Math.min(100, 100 - (deviation * 5))).toFixed(0);
    }

    return (
        <div className="analytics-panel card">
            <h2 className="section-title">
                <BarChart3 size={20} />
                Fleet Analytics & Insights
            </h2>

            <div className="analytics-grid">
                <div className="metric-card">
                    <div className="metric-icon" style={{ background: 'rgba(0, 168, 232, 0.2)' }}>
                        <Navigation size={24} color="#00a8e8" />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Average Speed</span>
                        <span className="metric-value">{avgSpeed} km/h</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon" style={{ background: 'rgba(0, 200, 83, 0.2)' }}>
                        <Navigation size={24} color="#00c853" />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Distance Today</span>
                        <span className="metric-value">{totalDistance} km</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon" style={{ background: 'rgba(255, 167, 38, 0.2)' }}>
                        <Clock size={24} color="#ffa726" />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Operating Time</span>
                        <span className="metric-value">{operatingTime} min</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon" style={{ background: 'rgba(156, 39, 176, 0.2)' }}>
                        <Zap size={24} color="#9c27b0" />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Battery Consumption</span>
                        <span className="metric-value" style={{ color: batteryTrend < 0 ? '#f44336' : '#00c853' }}>
                            {batteryTrend > 0 ? '+' : ''}{batteryTrend.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Safety Index Card */}
                <div className="metric-card">
                    <div className="metric-icon" style={{ background: 'rgba(244, 67, 54, 0.2)' }}>
                        <ShieldCheck size={24} color="#f44336" />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Safety Index</span>
                        <span className="metric-value" style={{ color: stabilityScore < 80 ? '#f44336' : '#00c853' }}>
                            {stabilityScore}%
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>
                            {stabilityScore < 80 ? 'Rough Water' : 'Stable'}
                        </span>
                    </div>
                </div>
            </div>

            {/* AI Insights (mock for demo) */}
            <div className="insights-section">
                <h3 className="insights-title">🤖 AI-Powered Insights</h3>
                <div className="insight-list">
                    <div className="insight-item">
                        <span className="insight-dot" style={{ background: '#00c853' }}></span>
                        <p>Boat operating within normal parameters</p>
                    </div>
                    <div className="insight-item">
                        <span className="insight-dot" style={{ background: '#00a8e8' }}></span>
                        <p>Average speed 12% higher than yesterday - excellent performance</p>
                    </div>
                    <div className="insight-item">
                        <span className="insight-dot" style={{ background: '#ffa726' }}></span>
                        <p>Battery consumption rate: Normal. Estimated 4.5 hours remaining</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
