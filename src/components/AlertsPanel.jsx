import { AlertTriangle, Bell } from 'lucide-react';
import './AlertsPanel.css';

export default function AlertsPanel({ alerts }) {
    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle size={20} color="#f44336" />;
            case 'warning':
                return <AlertTriangle size={20} color="#ffa726" />;
            default:
                return <Bell size={20} color="#00a8e8" />;
        }
    };

    return (
        <div className="alerts-panel card">
            <h2 className="section-title">
                <Bell size={20} />
                Alerts & Notifications
            </h2>

            <div className="alerts-list">
                {alerts.length === 0 ? (
                    <div className="no-alerts">
                        <Bell size={48} color="#00c853" />
                        <p>No active alerts</p>
                        <span>System operating normally</span>
                    </div>
                ) : (
                    alerts.map((alert, index) => (
                        <div key={index} className={`alert-item ${alert.severity}`}>
                            <div className="alert-icon">
                                {getSeverityIcon(alert.severity)}
                            </div>
                            <div className="alert-content">
                                <p className="alert-message">{alert.message}</p>
                                <span className="alert-time">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
