import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Layers, Map as MapIcon } from 'lucide-react';
import clsx from 'clsx';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = "DEMO_MAP_ID";

export default function LiveMap({ boatsData, selectedBoatId, onBoatSelect }) {
    const defaultPosition = { lat: 6.5244, lng: 3.3792 }; // Lagos
    const [mapTypeId, setMapTypeId] = useState('roadmap'); // roadmap, satellite, hybrid, terrain

    // Compute center based on selected boat
    const selectedBoat = boatsData && selectedBoatId ? boatsData[selectedBoatId] : null;
    const center = selectedBoat?.location?.latitude
        ? { lat: selectedBoat.location.latitude, lng: selectedBoat.location.longitude }
        : defaultPosition;

    return (
        <APIProvider apiKey={API_KEY}>
            <div className="w-full h-full rounded-xl overflow-hidden border border-gray-800 relative group">
                <Map
                    defaultCenter={defaultPosition}
                    defaultZoom={15}
                    mapId={MAP_ID}
                    mapTypeId={mapTypeId}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    style={{ width: '100%', height: '100%' }}
                    className="w-full h-full"
                >
                    <RecenterMap center={center} />

                    {/* Render Boats */}
                    {Object.values(boatsData || {}).map(boat => {
                        const lat = Number(boat.location?.latitude);
                        const lng = Number(boat.location?.longitude);

                        // Skip if invalid coordinates
                        if (isNaN(lat) || isNaN(lng)) return null;

                        const pos = { lat, lng };
                        const isSelected = boat.boat_id === selectedBoatId;

                        return (
                            <AdvancedMarker
                                key={boat.boat_id}
                                position={pos}
                                onClick={() => onBoatSelect(boat.boat_id)}
                                title={boat.boat_id}
                                zIndex={isSelected ? 100 : 1}
                            >
                                <div className="relative flex items-center justify-center group/marker">
                                    {/* Pulse effect for selected/active */}
                                    <div className={clsx(
                                        "absolute w-8 h-8 rounded-full opacity-50 transition-all",
                                        isSelected ? "bg-blue-500 animate-ping" : "bg-gray-500 group-hover/marker:bg-gray-400"
                                    )}></div>

                                    {/* Boat Icon/Dot */}
                                    <div className={clsx(
                                        "relative w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform duration-300",
                                        isSelected ? "bg-blue-600 scale-125" : "bg-gray-600"
                                    )}></div>

                                    {/* Label */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
                                        {boat.boat_id}
                                    </div>
                                </div>
                            </AdvancedMarker>
                        )
                    })}
                </Map>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-card/90 backdrop-blur border border-gray-700 p-1 rounded-lg shadow-xl z-10">
                    <button
                        onClick={() => setMapTypeId('roadmap')}
                        className={clsx(
                            "p-2 rounded-md transition-colors",
                            mapTypeId === 'roadmap' ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                        )}
                        title="Map View"
                    >
                        <MapIcon size={20} />
                    </button>
                    <button
                        onClick={() => setMapTypeId('hybrid')}
                        className={clsx(
                            "p-2 rounded-md transition-colors",
                            mapTypeId === 'hybrid' ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                        )}
                        title="Satellite View"
                    >
                        <Layers size={20} />
                    </button>
                </div>
            </div>
        </APIProvider>
    );
}

function RecenterMap({ center }) {
    const map = useMap();
    useEffect(() => {
        if (map && center && center.lat && center.lng) {
            map.panTo(center);
        }
    }, [map, center]);
    return null;
}
