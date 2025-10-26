"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Assignment {
  _id: string;
  title: string;
  description: string;
  type: "digital" | "physical";
  status: "active" | "completed";
  location?: {
    lat: number;
    lng: number;
  };
}

interface MapViewProps {
  assignments: Assignment[];
}

function MapView({ assignments }: MapViewProps) {
  // Default center (San Francisco)
  const defaultCenter: [number, number] = [37.7749, -122.4194];

  // Calculate center based on assignments or use default
  const center: [number, number] =
    assignments.length > 0 && assignments[0].location
      ? [assignments[0].location.lat, assignments[0].location.lng]
      : defaultCenter;

  return (
    <div className="h-[calc(100vh-16rem)] rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {assignments.map((assignment) =>
          assignment.location ? (
            <Marker
              key={assignment._id}
              position={[assignment.location.lat, assignment.location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="font-mono p-2">
                  <h3 className="font-bold text-purple-600 text-lg mb-2">{assignment.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{assignment.description}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {assignment.type}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      assignment.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
