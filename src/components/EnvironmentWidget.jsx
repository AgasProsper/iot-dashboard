
import { useEffect, useState } from 'react';
import { CloudRain, Wind, Thermometer, Cloud, RefreshCw } from 'lucide-react';
import { fetchWeather } from '../services/weatherService';

export default function EnvironmentWidget({ location }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location?.latitude && location?.longitude) {
            loadWeather(location.latitude, location.longitude);
        }
    }, [location?.latitude, location?.longitude]);

    const loadWeather = async (lat, lon) => {
        setLoading(true);
        const data = await fetchWeather(lat, lon);
        if (data) setWeather(data);
        setLoading(false);
    };

    if (!location?.latitude) return null;

    return (
        <div className="bg-card rounded-xl border border-gray-800 p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Cloud size={16} /> External Weather (Live)
                </h3>
                <button
                    onClick={() => loadWeather(location.latitude, location.longitude)}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {weather ? (
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 bg-blue-500/10 rounded-lg">
                        <Thermometer size={16} className="text-blue-400 mb-1" />
                        <span className="text-lg font-bold text-white">{weather.temperature_2m}°C</span>
                        <span className="text-[10px] text-gray-400">Air Temp</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-500/10 rounded-lg">
                        <Wind size={16} className="text-gray-400 mb-1" />
                        <span className="text-lg font-bold text-white">{weather.wind_speed_10m}</span>
                        <span className="text-[10px] text-gray-400">km/h Wind</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-cyan-500/10 rounded-lg">
                        <CloudRain size={16} className="text-cyan-400 mb-1" />
                        <span className="text-lg font-bold text-white">{weather.rain > 0 ? `${weather.rain}mm` : "Dry"}</span>
                        <span className="text-[10px] text-gray-400">Precip</span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-xs text-gray-500 py-4">
                    {loading ? "Loading weather data..." : "Weather unavailable"}
                </div>
            )}
        </div>
    );
}
