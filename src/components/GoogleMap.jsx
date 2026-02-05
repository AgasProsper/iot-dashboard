import { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap as GoogleMapComponent, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { Ship, Anchor, Battery, Thermometer, Droplets, Activity } from 'lucide-react';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '12px'
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
};

// Helper to get color for boat
const getBoatColor = (boatId) => {
    if (boatId === 'PROTOTYPE_001') return '#00a8e8';
    if (boatId === 'PROTOTYPE_002') return '#00c853';

    let hash = 0;
    for (let i = 0; i < boatId.length; i++) {
        hash = boatId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Detect stops in the history
const detectStops = (history) => {
    if (!history || history.length < 2) return [];

    const stops = [];
    let currentStop = null;

    history.forEach((point, index) => {
        if (!point.location || point.location.speed === undefined) return;

        const speed = point.location.speed;
        const timestamp = point.timestamp || new Date().toISOString();

        if (speed < 0.5) { // Stopped or very slow
            if (!currentStop) {
                currentStop = {
                    position: { lat: point.location.latitude, lng: point.location.longitude },
                    startTime: new Date(timestamp),
                    endTime: new Date(timestamp),
                    duration: 0
                };
            } else {
                currentStop.endTime = new Date(timestamp);
                currentStop.duration = (currentStop.endTime - currentStop.startTime) / 1000; // seconds
            }
        } else {
            // Moving again
            if (currentStop && currentStop.duration > 30) { // Only record stops > 30 seconds
                stops.push({ ...currentStop });
            }
            currentStop = null;
        }
    });

    // Add final stop if still stopped
    if (currentStop && currentStop.duration > 30) {
        stops.push(currentStop);
    }

    return stops;
};

// Format duration for display
const formatDuration = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
};

export default function GoogleMap({ boatsData, selectedBoatId, onBoatSelect, history }) {
    const [map, setMap] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    // Default center (Lagos, Nigeria)
    const defaultCenter = { lat: 6.5244, lng: 3.3792 };

    // Get selected boat data
    const selectedBoat = boatsData && selectedBoatId ? boatsData[selectedBoatId] : null;

    // Center map on selected boat
    const center = selectedBoat?.location?.latitude && selectedBoat?.location?.longitude
        ? { lat: selectedBoat.location.latitude, lng: selectedBoat.location.longitude }
        : defaultCenter;

    // Trail path for selected boat
    const trail = useMemo(() => {
        if (!history || history.length === 0) return [];
        return history
            .filter(d => d.location && d.location.latitude && d.location.longitude)
            .map(d => ({ lat: d.location.latitude, lng: d.location.longitude }));
    }, [history]);

    // Detect stops
    const stops = useMemo(() => detectStops(history), [history]);

    // Auto-center map when selected boat changes
    useEffect(() => {
        if (map && selectedBoat?.location?.latitude && selectedBoat?.location?.longitude) {
            map.panTo({ lat: selectedBoat.location.latitude, lng: selectedBoat.location.longitude });
        }
    }, [map, selectedBoat, selectedBoatId]);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Custom marker icon using SVG
    const createMarkerIcon = (color, isSelected) => {
        const size = isSelected ? 40 : 32;
        return {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: size / 24,
            anchor: { x: 12, y: 22 }
        };
    };

    // Anchor icon for stops
    const anchorIcon = {
        path: 'M12 2C10.34 2 9 3.34 9 5c0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm0 14c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0-2c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z',
        fillColor: '#ffa726',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.2,
        anchor: { x: 12, y: 12 }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMapComponent
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                options={mapOptions}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {/* Trail for selected boat */}
                {trail.length > 1 && (
                    <Polyline
                        path={trail}
                        options={{
                            strokeColor: selectedBoatId ? getBoatColor(selectedBoatId) : '#00a8e8',
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                            geodesic: true
                        }}
                    />
                )}

                {/* Render ALL boats */}
                {Object.values(boatsData || {}).map(boat => {
                    if (!boat.location?.latitude || !boat.location?.longitude) return null;

                    const position = { lat: boat.location.latitude, lng: boat.location.longitude };
                    const isSelected = boat.boat_id === selectedBoatId;
                    const color = getBoatColor(boat.boat_id);

                    return (
                        <Marker
                            key={boat.boat_id}
                            position={position}
                            icon={createMarkerIcon(color, isSelected)}
                            onClick={() => {
                                onBoatSelect(boat.boat_id);
                                setSelectedMarker(boat.boat_id);
                            }}
                            opacity={isSelected ? 1 : 0.7}
                            label={{
                                text: boat.boat_id,
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            {selectedMarker === boat.boat_id && (
                                <InfoWindow
                                    onCloseClick={() => setSelectedMarker(null)}
                                    options={{
                                        pixelOffset: new window.google.maps.Size(0, -40)
                                    }}
                                >
                                    <div style={{
                                        minWidth: '250px',
                                        padding: '10px',
                                        color: '#0a1929',
                                        fontFamily: 'Inter, sans-serif'
                                    }}>
                                        <h3 style={{
                                            marginBottom: '10px',
                                            color: color,
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            borderBottom: `2px solid ${color}`,
                                            paddingBottom: '5px'
                                        }}>
                                            {boat.boat_id}
                                        </h3>
                                        <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                                            <p><strong>⚡ Speed:</strong> {boat.location?.speed?.toFixed(1) || '0'} km/h</p>
                                            <p><strong>🔋 Battery:</strong> {boat.sensors?.battery?.percentage || '--'}%</p>
                                            <p><strong>🌡️ Engine Temp:</strong> {boat.sensors?.temperature || '--'}°C</p>
                                            <p><strong>💧 Humidity:</strong> {boat.sensors?.humidity || '--'}%</p>
                                            <p><strong>🌧️ Rain:</strong> {boat.sensors?.rain_status || '--'}</p>
                                            <p style={{
                                                marginTop: '8px',
                                                padding: '5px',
                                                background: isSelected ? '#e3f2fd' : '#fff3e0',
                                                borderRadius: '4px',
                                                textAlign: 'center',
                                                fontWeight: 'bold'
                                            }}>
                                                {isSelected ? '✓ Selected' : 'Click to Select'}
                                            </p>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    );
                })}
            </GoogleMapComponent>
        </LoadScript>
    );
}
