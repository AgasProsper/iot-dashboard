import { Battery, Signal, Zap, MapPin } from 'lucide-react';
import clsx from 'clsx';

export default function FleetList({ boatsData, selectedBoatId, onSelect }) {
    const boats = Object.values(boatsData || {});

    return (
        <div className="bg-card rounded-xl border border-gray-800 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Active Fleet</h3>
                <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">{boats.length} Devices</span>
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase sticky top-0 backdrop-blur-md">
                        <tr>
                            <th className="p-4 font-medium">Boat ID</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Battery</th>
                            <th className="p-4 font-medium">Speed</th>
                            <th className="p-4 font-medium hidden md:table-cell">Location</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-800">
                        {boats.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No boats connected
                                </td>
                            </tr>
                        ) : (
                            boats.map(boat => {
                                const isSelected = boat.boat_id === selectedBoatId;
                                const battery = boat.sensors?.battery?.percentage || 0;
                                const isCritical = battery < 20;

                                // Network Status Logic
                                const netStatus = boat.network?.status || "ONLINE"; // Default to existing behavior
                                const signal = boat.network?.signal_strength ?? 100;
                                const buffered = boat.network?.buffered_packets || 0;

                                let statusColor = "bg-green-500/20 text-green-400";
                                let statusText = "Online";

                                if (netStatus === "OFFLINE") {
                                    statusColor = "bg-red-500/20 text-red-400";
                                    statusText = "Offline";
                                } else if (netStatus === "POOR") {
                                    statusColor = "bg-yellow-500/20 text-yellow-400";
                                    statusText = "Poor Signal";
                                }

                                return (
                                    <tr
                                        key={boat.boat_id}
                                        onClick={() => onSelect(boat.boat_id)}
                                        className={clsx(
                                            "cursor-pointer transition-colors hover:bg-white/5",
                                            isSelected ? "bg-primary/10 border-l-2 border-primary" : "border-l-2 border-transparent"
                                        )}
                                    >
                                        <td className="p-4 font-medium text-white flex items-center gap-2">
                                            <div className={clsx("w-2 h-2 rounded-full", netStatus === "OFFLINE" ? "bg-gray-500" : "bg-blue-500")}></div>
                                            <div>
                                                {boat.boat_id}
                                                {buffered > 0 && <div className="text-[10px] text-yellow-500">{buffered} pkts buffered</div>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={clsx("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit", statusColor)}>
                                                    {statusText}
                                                </span>
                                                {netStatus !== "OFFLINE" && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Signal size={12} /> {signal}%
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Battery size={16} className={isCritical ? "text-red-500" : "text-green-500"} />
                                                <span className={isCritical ? "text-red-400" : "text-gray-300"}>
                                                    {battery}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {boat.location?.speed?.toFixed(1) || 0} km/h
                                        </td>
                                        <td className="p-4 text-gray-500 font-mono text-xs hidden md:table-cell">
                                            {boat.location?.latitude?.toFixed(4)}, {boat.location?.longitude?.toFixed(4)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
