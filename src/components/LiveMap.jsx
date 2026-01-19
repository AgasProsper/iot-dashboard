import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useMemo, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to get color for boat
const getBoatColor = (boatId) => {
    // Specific colors for known prototypes
    if (boatId === 'PROTOTYPE_001') return '#00a8e8'; // Blue
    if (boatId === 'PROTOTYPE_002') return '#00c853'; // Green

    // Hash-based color for others
    let hash = 0;
    for (let i = 0; i < boatId.length; i++) {
        hash = boatId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Function to create colored icon
const createBoatIcon = (color) => {
    return new L.DivIcon({
        className: 'boat-beacon',
        html: `
            <div class="beacon-pulse" style="background: ${color}4D"></div>
            <div class="nav-arrow" style="background: ${color}; border-color: white;"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

// Helper component to auto-center map
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function LiveMap({ boatsData, selectedBoatId, onBoatSelect, history }) {
    // Default center (Lagos, Nigeria)
    const defaultCenter = [6.5244, 3.3792];

    // Get selected boat data
    const selectedBoat = boatsData && selectedBoatId ? boatsData[selectedBoatId] : null;

    // Center map on selected boat
    const centerPosition = selectedBoat?.location?.latitude && selectedBoat?.location?.longitude
        ? [selectedBoat.location.latitude, selectedBoat.location.longitude]
        : defaultCenter;

    // Trail path for selected boat
    const trail = useMemo(() => {
        if (!history || history.length === 0) return [];
        return history
            .filter(d => d.location && d.location.latitude && d.location.longitude)
            .map(d => [d.location.latitude, d.location.longitude]);
    }, [history]);

    return (
        <div style={{ height: '100%', width: '100%', minHeight: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer
                center={centerPosition}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <ChangeView center={centerPosition} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Trail for selected boat */}
                {trail.length > 1 && (
                    <Polyline
                        positions={trail}
                        pathOptions={{
                            color: selectedBoatId ? getBoatColor(selectedBoatId) : '#00a8e8',
                            weight: 3,
                            opacity: 0.6,
                            dashArray: '5, 10'
                        }}
                    />
                )}

                {/* Render ALL boats */}
                {Object.values(boatsData || {}).map(boat => {
                    const pos = [boat.location.latitude, boat.location.longitude];
                    if (!pos[0] || !pos[1]) return null;

                    const isSelected = boat.boat_id === selectedBoatId;
                    const color = getBoatColor(boat.boat_id);

                    return (
                        <Marker
                            key={boat.boat_id}
                            position={pos}
                            icon={createBoatIcon(color)}
                            eventHandlers={{
                                click: () => onBoatSelect(boat.boat_id),
                            }}
                            opacity={isSelected ? 1 : 0.6} // Fade out unselected boats
                        >
                            <Popup>
                                <div style={{ minWidth: '200px' }}>
                                    <h3 style={{ marginBottom: '0.5rem', color: color }}>
                                        {boat.boat_id}
                                    </h3>
                                    <div style={{ fontSize: '0.875rem' }}>
                                        <p><strong>Speed:</strong> {boat.location?.speed?.toFixed(1) || '0'} km/h</p>
                                        <p><strong>Status:</strong> {isSelected ? 'Selected' : 'Click to Select'}</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
