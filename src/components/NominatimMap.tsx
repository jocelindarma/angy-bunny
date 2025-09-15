import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

export function NominatimMap({
  lat,
  lon,
  onMarkerMoved,
}: {
  lat: number;
  lon: number;
  onMarkerMoved?: (lat: number, lon: number, address: string) => void;
}) {
  // Jakarta & Tangerang bounding box: [SouthWest, NorthEast]
  const JAKARTA_TANGERANG_BOUNDS: [[number, number], [number, number]] = [
    [-6.37, 106.62], // SW: near Tangerang Selatan
    [-5.99, 106.97], // NE: North Jakarta
  ];

  const [markerPos, setMarkerPos] = useState<[number, number]>([lat, lon]);
  const [address, setAddress] = useState("");
  const [pendingAddress, setPendingAddress] = useState<string>("");
  const [popupOpen, setPopupOpen] = useState(true);

  useEffect(() => {
    setMarkerPos([lat, lon]);
  }, [lat, lon]);

  // Custom rose marker icon
  const roseIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
          <circle cx='20' cy='20' r='16' fill='#f43f5e' stroke='#be123c' stroke-width='3'/>
          <circle cx='20' cy='20' r='7' fill='white' stroke='#be123c' stroke-width='2'/>
        </svg>
      `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: undefined,
  });

  // Helper to check if a point is inside bounds
  function isInBounds(lat: number, lon: number) {
    const [[minLat, minLon], [maxLat, maxLon]] = JAKARTA_TANGERANG_BOUNDS;
    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  }

  const handleDragEnd = async (e: any) => {
    let newLat = e.target.getLatLng().lat;
    let newLon = e.target.getLatLng().lng;
    // Restrict marker to bounds
    if (!isInBounds(newLat, newLon)) {
      // Snap back to previous position
      newLat = markerPos[0];
      newLon = markerPos[1];
      setMarkerPos([newLat, newLon]);
      return;
    }
    setMarkerPos([newLat, newLon]);
    // Reverse geocode
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLon}`;
    const res = await fetch(url);
    const data = await res.json();
    const newAddress = data.display_name || "";
    setPendingAddress(newAddress);
    setPopupOpen(true);
  };

  // Only render map on client
  if (typeof window === "undefined") return null;

  return (
    <MapContainer
      center={markerPos}
      zoom={16}
      style={{
        height: "270px",
        width: "100%",
        borderRadius: 16,
        border: "2px solid #f43f5e",
        boxShadow: "0 2px 12px #fda4af55",
      }}
      scrollWheelZoom={false}
      maxBounds={JAKARTA_TANGERANG_BOUNDS}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={markerPos}
        icon={roseIcon}
        draggable={true}
        eventHandlers={{ dragend: handleDragEnd }}
      >
        <Popup position={markerPos}>
          <div
            style={{ cursor: "pointer", color: "#f43f5e", fontWeight: 600 }}
            onClick={() => {
              setAddress(pendingAddress || address);
              setPopupOpen(false);
              if (onMarkerMoved && pendingAddress) {
                onMarkerMoved(markerPos[0], markerPos[1], pendingAddress);
              }
            }}
          >
            {pendingAddress ||
              address ||
              "Drag marker, then click here to use this address!"}
            <div style={{ fontSize: 12, color: "#be123c", fontWeight: 400 }}>
              Click to use this address
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
