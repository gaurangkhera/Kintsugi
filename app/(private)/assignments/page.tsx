"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Target, MapPin, Inbox, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AssignmentsPage() {
  const assignments = useQuery(api.assignments.getAllAssignments) ?? [];

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-amber-400"></div>
          <h1 className="text-4xl font-light tracking-tight text-white">
            Assignments
          </h1>
        </div>
        <p className="text-gray-500 text-sm tracking-wide">
          Active operations and completed missions • <span className="text-gray-400">{assignments.length}</span> total
        </p>
      </div>

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 p-16 text-center">
            <Inbox className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p className="text-gray-600 text-sm">No assignments available</p>
          </div>
        ) : (
          assignments.map((assignment: any) => (
            <Link
              key={assignment._id}
              href={`/assignments/${assignment._id}`}
              className="block bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-light text-white tracking-tight">
                      {assignment.title}
                    </h2>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-3 py-1 text-[10px] tracking-wider uppercase ${
                        assignment.status === "active"
                          ? "bg-green-400/10 text-green-400"
                          : assignment.status === "claimed"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {assignment.status}
                    </span>
                    <span className="px-3 py-1 text-[10px] tracking-wider uppercase bg-white/5 text-gray-500">
                      {assignment.type}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{assignment.description}</p>
                {assignment.location && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/[0.02] px-3 py-2 border border-white/5">
                    <MapPin className="w-3 h-3" />
                    <span>{assignment.location.lat.toFixed(4)}, {assignment.location.lng.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
