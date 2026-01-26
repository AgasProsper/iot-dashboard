import { Battery, Thermometer, Droplets, Activity, MapPin } from 'lucide-react';
import clsx from 'clsx';

export default function DeviceCard({ boat, selected, onClick }) {
    const sensors = boat.sensors || {};
    const location = boat.location || {};
    const battery = sensors.battery?.percentage || 0;

    // Status Logic
    const isOnline = true; // Assuming online if receiving data
    const isLowBatt = battery < 20;

    return (
        <div
            onClick={onClick}
            className={clsx(
                "p-4 rounded-xl border transition-all cursor-pointer bg-card hover:bg-white/5",
                selected ? "border-primary ring-1 ring-primary" : "border-gray-800 hover:border-gray-700"
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-white text-lg">{boat.boat_id}</h3>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                        <MapPin size={10} />
                        {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
                    </p>
                </div>
                <div className={clsx("w-2.5 h-2.5 rounded-full", isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500")} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Speed */}
                <div className="bg-gray-900/50 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-blue-400">
                        <Activity size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Speed</span>
                    </div>
                    <span className="text-white font-mono font-medium">{location.speed?.toFixed(1) || 0} <span className="text-xs text-gray-500">km/h</span></span>
                </div>

                {/* Temp */}
                <div className="bg-gray-900/50 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-orange-400">
                        <Thermometer size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Temp</span>
                    </div>
                    <span className="text-white font-mono font-medium">{sensors.temperature || 0}<span className="text-xs text-gray-500">°C</span></span>
                </div>

                {/* Humidity */}
                <div className="bg-gray-900/50 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-cyan-400">
                        <Droplets size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Hum</span>
                    </div>
                    <span className="text-white font-mono font-medium">{sensors.humidity || 0}<span className="text-xs text-gray-500">%</span></span>
                </div>

                {/* Battery */}
                <div className="bg-gray-900/50 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-green-400">
                        <Battery size={14} className={isLowBatt ? "text-red-500" : ""} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Batt</span>
                    </div>
                    <span className={clsx("font-mono font-medium", isLowBatt ? "text-red-500" : "text-white")}>
                        {battery}<span className="text-xs text-gray-500">%</span>
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-[10px] text-gray-500 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                    {boat.boat_id.split('-').pop()}
                </span>
                <span className="text-[10px] text-gray-400">Just now</span>
            </div>
        </div>
    );
}
