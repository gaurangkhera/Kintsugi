"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/private/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-8rem)] bg-white/[0.02] flex items-center justify-center">
      <p className="text-gray-600 text-sm">Loading map...</p>
    </div>
  ),
});


export default function MapPage() {
  const assignments = useQuery(api.assignments.getAssignmentsWithLocation) ?? [];

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-amber-400"></div>
          <h1 className="text-4xl font-light tracking-tight text-white">
            Tactical Map
          </h1>
        </div>
        <p className="text-gray-500 text-sm tracking-wide">
          Physical assignment locations • <span className="text-gray-400">{assignments.length}</span> active markers
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 p-16 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-700" />
          <h3 className="text-lg font-light text-white mb-2">No Locations</h3>
          <p className="text-sm text-gray-600">Physical assignments with locations will appear here</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
          <MapComponent
          //@ts-ignore
           assignments={assignments} />
        </div>
      )}
    </div>
  );
}
