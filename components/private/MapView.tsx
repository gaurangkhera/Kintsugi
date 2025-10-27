"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Assignment {
  _id: string;
  title: string;
  description: string;
  type: "digital" | "physical";
  status: "active" | "completed" | "claimed";
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  estimatedDuration?: string;
}

interface MapViewProps {
  assignments: Assignment[];
}

function MapView({ assignments }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with better zoom on Delhi
    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 13);
    mapInstanceRef.current = map;

    // Add dark CartoDB tile layer (much better dark theme)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    // Add new markers
    assignments.forEach((assignment) => {
      if (!assignment.location) return;

      const latLng = L.latLng(assignment.location.lat, assignment.location.lng);
      bounds.extend(latLng);

      // Create custom icon based on status
      const iconHtml = `
        <div style="position: relative;">
          <div style="position: absolute; inset: 0; background: ${assignment.status === 'active' ? '#fbbf24' : assignment.status === 'claimed' ? '#60a5fa' : '#6b7280'}; border-radius: 50%; filter: blur(12px); opacity: ${assignment.status === 'completed' ? '0.3' : '0.6'}; animation: ${assignment.status === 'completed' ? 'none' : 'pulse 2s infinite'};"></div>
          <div style="position: relative; width: 32px; height: 32px; background: ${assignment.status === 'active' ? '#fbbf24' : assignment.status === 'claimed' ? '#60a5fa' : '#6b7280'}; border-radius: 50%; border: 2px solid #000; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 12px; height: 12px; background: #000; border-radius: 50%;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(latLng, {
        icon: customIcon,
      }).addTo(mapInstanceRef.current!);

      // Create popup content
      const popupContent = `
        <div style="padding: 16px; min-width: 280px; background: rgba(0,0,0,0.95); color: white; font-family: system-ui;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <div style="width: 16px; height: 16px; background: #fbbf24; border-radius: 50%;"></div>
            <h3 style="margin: 0; font-size: 18px; font-weight: 300; color: white;">${assignment.title}</h3>
          </div>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">${assignment.description}</p>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <span style="padding: 4px 8px; font-size: 10px; text-transform: uppercase; border: 1px solid ${assignment.status === 'active' ? '#22c55e' : assignment.status === 'claimed' ? '#60a5fa' : '#6b7280'}; color: ${assignment.status === 'active' ? '#22c55e' : assignment.status === 'claimed' ? '#60a5fa' : '#6b7280'}; background: ${assignment.status === 'active' ? 'rgba(34,197,94,0.1)' : assignment.status === 'claimed' ? 'rgba(96,165,250,0.1)' : 'rgba(107,114,128,0.1)'}; letter-spacing: 0.05em;">${assignment.status}</span>
            <span style="padding: 4px 8px; font-size: 10px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); color: #9ca3af; background: rgba(255,255,255,0.05);">${assignment.type}</span>
          </div>
          ${assignment.location.address ? `<div style="display: flex; gap: 8px; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; font-size: 12px; color: #6b7280;"><span>${assignment.location.address}</span></div>` : ''}
          <div style="display: flex; gap: 8px;">
            <a href="/assignments/${assignment._id}" style="flex: 1; padding: 8px 12px; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2); color: #fbbf24; text-align: center; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">View Details</a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${assignment.location.lat},${assignment.location.lng}" target="_blank" style="padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #9ca3af; text-decoration: none; font-size: 12px;">Navigate</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 400,
        className: 'custom-popup',
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers with padding
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
      });
    }
  }, [assignments]);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .leaflet-container {
            background: #000000;
            font-family: system-ui, -apple-system, sans-serif;
          }
          .custom-marker {
            background: transparent !important;
            border: none !important;
          }
          .leaflet-popup-content-wrapper {
            background: rgba(0, 0, 0, 0.95) !important;
            border: 1px solid rgba(251, 191, 36, 0.2) !important;
            border-radius: 0 !important;
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.3) !important;
            padding: 0 !important;
          }
          .leaflet-popup-tip {
            background: rgba(0, 0, 0, 0.95) !important;
            border: 1px solid rgba(251, 191, 36, 0.2) !important;
          }
          .leaflet-popup-close-button {
            color: #fbbf24 !important;
            font-size: 24px !important;
            padding: 4px 8px !important;
          }
          .leaflet-popup-close-button:hover {
            color: #ffffff !important;
          }
        `
      }} />
      <div 
        ref={mapRef} 
        className="h-[calc(100vh-16rem)] rounded-lg overflow-hidden relative border border-amber-400/20"
        style={{ zIndex: 0 }}
      />
    </>
  );
}

export default MapView;
