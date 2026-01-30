import clsx from 'clsx';

export default function MetricCard({ title, value, unit, icon, trend, subtext, color, progressBar }) {
    return (
        <div className="bg-card rounded-xl p-4 border border-gray-800 shadow-md flex flex-col justify-between overflow-hidden relative group hover:border-gray-700 transition-all">
            <div className="flex justify-between items-start">
                <div className="flex flex-col z-10">
                    <span className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-2">
                        {title}
                        {trend && (
                            <span className={clsx(
                                "text-xs px-1.5 py-0.5 rounded flex items-center",
                                trend.direction === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            )}>
                                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
                            </span>
                        )}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
                        {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
                    </div>
                    {subtext && (
                        <span className="text-xs text-gray-500 mt-1">{subtext}</span>
                    )}
                </div>

                <div className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-20 backdrop-blur-sm",
                    color === 'danger' && "bg-red-500/20 text-red-500",
                    color === 'warning' && "bg-yellow-500/20 text-yellow-500",
                    color === 'success' && "bg-green-500/20 text-green-500",
                    (color === 'primary' || !color) && "bg-blue-500/20 text-blue-500",
                )}>
                    {icon}
                </div>
            </div>

            {/* Progress Bar for things like Fuel, Battery, Signal */}
            {progressBar !== undefined && (
                <div className="mt-3 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={clsx(
                            "h-full rounded-full transition-all duration-500",
                            color === 'danger' ? "bg-red-500" :
                                color === 'warning' ? "bg-yellow-500" :
                                    color === 'success' ? "bg-green-500" : "bg-blue-500"
                        )}
                        style={{ width: `${Math.min(100, Math.max(0, progressBar))}%` }}
                    />
                </div>
            )}
        </div>
    );
}
