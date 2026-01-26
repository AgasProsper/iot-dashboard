import { AlertTriangle, AlertOctagon, Info, Clock } from 'lucide-react';

export default function AlertsPanel({ alerts }) {
    return (
        <div className="bg-card rounded-xl border border-gray-800 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <AlertTriangle size={18} className="text-warning" />
                    System Alerts
                </h3>
                <span className="text-xs text-gray-500">{alerts.length} Active</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                        <Info size={32} className="mb-2" />
                        <p>No active alerts</p>
                    </div>
                ) : (
                    alerts.map((alert, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="mt-1">
                                {alert.type === 'critical' || alert.type === 'battery_low' ? (
                                    <AlertOctagon size={16} className="text-danger" />
                                ) : (
                                    <AlertTriangle size={16} className="text-warning" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium text-gray-200">{alert.message}</h4>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{alert.boat_id}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                    <Clock size={10} />
                                    <span>Just now</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
