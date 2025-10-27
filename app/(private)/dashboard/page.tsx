"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function WorkshopDashboard() {
  const user = useQuery(api.users.getCurrentUser);
  const claimedAssignments = useQuery(api.assignments.getMyClaimedAssignments) ?? [];
  const messages = useQuery(api.messages.getMessages, { channel: "#general" }) ?? [];

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-amber-400"></div>
          <h1 className="text-4xl font-light tracking-tight text-white">
            Dashboard
          </h1>
        </div>
        <p className="text-gray-500 text-sm tracking-wide">
          Welcome back, <span className="text-gray-400">{user?.name ?? "Operative"}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.03] transition-colors">
          <div className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-4">Reputation</div>
          <div className="text-4xl font-light text-white mb-2">
            {user?.reputation ?? 0}
          </div>
          <div className="text-xs text-gray-600">Points earned</div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.03] transition-colors">
          <div className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-4">Assignments</div>
          <div className="text-4xl font-light text-white mb-2">
            {claimedAssignments.length}
          </div>
          <div className="text-xs text-gray-600">Currently claimed</div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.03] transition-colors">
          <div className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-4">Status</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-2xl font-light text-white">Active</div>
          </div>
          <div className="text-xs text-gray-600">System operational</div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-light text-white tracking-tight">Your Claimed Assignments</h2>
            <p className="text-xs text-gray-600 mt-1">{claimedAssignments.length} in progress</p>
          </div>
          <Link
            href="/assignments"
            className="text-xs text-gray-500 hover:text-white transition-colors tracking-wide"
          >
            View All →
          </Link>
        </div>
        {claimedAssignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">No claimed assignments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {claimedAssignments.slice(0, 3).map((assignment: any) => (
              <Link
                key={assignment._id}
                href={`/assignments/${assignment._id}`}
                className="block group p-5 bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-light text-base">
                    {assignment.title}
                  </h3>
                  <span className="text-[10px] px-2 py-1 bg-blue-400/10 text-blue-400 tracking-wider uppercase">
                    {assignment.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {assignment.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-light text-white tracking-tight">Recent Communications</h2>
            <p className="text-xs text-gray-600 mt-1">{messages.length} messages</p>
          </div>
          <Link
            href="/comms/general"
            className="text-xs text-gray-500 hover:text-white transition-colors tracking-wide"
          >
            Open Comms →
          </Link>
        </div>
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">No recent messages</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.slice(-5).reverse().map((message: any) => (
              <div
                key={message._id}
                className="p-4 bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all"
              >
                <p className="text-[10px] text-gray-500 mb-2 tracking-wider uppercase">
                  {message.userName}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">{message.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
