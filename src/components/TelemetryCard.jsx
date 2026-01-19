import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import './TelemetryCard.css';

export default function TelemetryCard({ icon, title, value, unit, color, trend }) {
    const getTrendIcon = () => {
        if (trend === 'warning' || trend === 'critical') {
            return <AlertCircle size={16} color="#ffa726" />;
        }
        return null;
    };

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

            {trend && (
                <div className={`trend ${trend}`}>
                    {getTrendIcon()}
                    <span>{trend === 'critical' ? 'Critical' : trend === 'warning' ? 'Warning' : 'Normal'}</span>
                </div>
            )}
        </div>
    );
}
