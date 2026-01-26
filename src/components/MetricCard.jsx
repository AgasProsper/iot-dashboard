import clsx from 'clsx';

export default function MetricCard({ title, value, unit, icon, trend, subtext, color }) {
    return (
        <div className="bg-card rounded-xl p-4 border border-gray-800 shadow-md flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-gray-400 text-sm font-medium mb-1">{title}</span>
                <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
                    {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
                </div>
                {subtext && (
                    <span className="text-xs text-gray-500 mt-1">{subtext}</span>
                )}
            </div>

            <div className={clsx(
                "w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-20",
                color === 'danger' && "bg-red-500/20 text-red-500",
                color === 'warning' && "bg-yellow-500/20 text-yellow-500",
                color === 'success' && "bg-green-500/20 text-green-500",
                color === 'primary' || !color && "bg-blue-500/20 text-blue-500",
            )}>
                {icon}
            </div>
        </div>
    );
}
