"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { MapPin, Target, Navigation, Activity } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/private/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-8rem)] bg-black border border-white/5 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-400/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-amber-400 text-sm tracking-wider uppercase">Initializing tactical map...</p>
      </div>
    </div>
  ),
});


export default function MapPage() {
  const assignments = useQuery(api.assignments.getAssignmentsWithLocation) ?? [];
  
  const activeCount = assignments.filter((a: any) => a.status === "active").length;
  const claimedCount = assignments.filter((a: any) => a.status === "claimed").length;
  const completedCount = assignments.filter((a: any) => a.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-amber-400"></div>
          <h1 className="text-4xl font-light tracking-tight text-white">
            Tactical Map
          </h1>
        </div>
        <p className="text-gray-500 text-sm tracking-wide">
          Real-time operational overview • Delhi NCR region
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.03] transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">Total Markers</span>
          </div>
          <p className="text-3xl font-light text-white">{assignments.length}</p>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.03] transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">Active</span>
          </div>
          <p className="text-3xl font-light text-green-400">{activeCount}</p>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.03] transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">Claimed</span>
          </div>
          <p className="text-3xl font-light text-blue-400">{claimedCount}</p>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.03] transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">Completed</span>
          </div>
          <p className="text-3xl font-light text-gray-400">{completedCount}</p>
        </div>
      </div>

      {/* Map Container */}
      {assignments.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="relative">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <h3 className="text-lg font-light text-white mb-2">No Active Locations</h3>
            <p className="text-sm text-gray-600">Physical assignments with coordinates will appear on the tactical map</p>
          </div>
        </div>
      ) : (
        <div className="bg-black border border-amber-400/20 overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.1)] relative">
          <div className="absolute top-4 right-4 z-[1000] bg-black/90 border border-amber-400/20 p-3 backdrop-blur-sm">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span className="text-gray-400">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-400">Claimed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span className="text-gray-400">Completed</span>
              </div>
            </div>
          </div>
          <MapComponent
          //@ts-ignore
           assignments={assignments} />
        </div>
      )}
    </div>
  );
}
