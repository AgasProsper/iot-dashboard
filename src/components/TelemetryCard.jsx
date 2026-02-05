import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import './TelemetryCard.css';

export default function TelemetryCard({ icon, title, value, unit, color, trend, showProgress }) {
    const getTrendIcon = () => {
        if (trend === 'warning' || trend === 'critical') {
            return <AlertCircle size={16} color="#ffa726" />;
        }
        return null;
    };

    // Determine if we should show progress bar (for percentage values)
    const numericValue = typeof value === 'number' ? value : null;
    const shouldShowProgress = showProgress && numericValue !== null;

    return (
        <div className="telemetry-card card">
            <div className="card-header">
                <div className="icon-wrapper" style={{ background: `${color}20`, color }}>
                    {icon}
                </div>
                <span className="card-title">{title}</span>
            </div>

            <div className="card-value" style={{ color }}>
                <span className="value">{typeof value === 'number' ? value.toFixed(1) : value}</span>
                <span className="unit">{unit}</span>
            </div>

            {shouldShowProgress && (
                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${Math.min(numericValue, 100)}%`,
                            background: `linear-gradient(90deg, ${color}, ${color}dd)`
                        }}
                    />
                </div>
            )}

            {trend && (
                <div className={`trend ${trend}`}>
                    {getTrendIcon()}
                    <span>{trend === 'critical' ? 'Critical' : trend === 'warning' ? 'Warning' : 'Normal'}</span>
                </div>
            )}
        </div>
    );
}
