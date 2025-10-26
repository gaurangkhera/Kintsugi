"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FocusTimer } from "@/components/public/FocusTimer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function FocusPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const focusSessions = useQuery(api.focus.getFocusSessions) ?? [];

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/home" className="text-xl font-semibold text-white hover:text-gray-300 transition-colors">
            Kintsugi
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex gap-6">
              <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/tasks" className="text-gray-400 hover:text-white transition-colors">
                Tasks
              </Link>
              <Link href="/focus" className="text-white font-medium">
                Focus
              </Link>
              <Link href="/journal" className="text-gray-400 hover:text-white transition-colors">
                Journal
              </Link>
            </nav>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-10 h-10 border-2 border-purple-400 rounded-full"></div>
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">Focus Timer</h1>
                <p className="text-gray-500 text-lg">
                  Use the Pomodoro technique to maximize your productivity
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="border-white/20 text-gray-400 hover:bg-white/5"
              >
                {showHistory ? "Back to Timer" : "View History"}
              </Button>
            </div>
          </div>

          {!showHistory ? (
            <>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
                <FocusTimer />
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">1</div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Choose a task</h3>
                  <p className="text-gray-500 text-xs">Pick one thing to focus on</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">2</div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Work for 25 min</h3>
                  <p className="text-gray-500 text-xs">Deep focus, no distractions</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">3</div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Take a break</h3>
                  <p className="text-gray-500 text-xs">Rest for 5 minutes</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Focus Session History</h2>
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{focusSessions.length}</div>
                    <p className="text-xs text-gray-500">Total Sessions</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {focusSessions.reduce((sum, s) => sum + s.duration, 0)}
                    </div>
                    <p className="text-xs text-gray-500">Total Minutes</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {Math.round(focusSessions.reduce((sum, s) => sum + s.duration, 0) / 60)}
                    </div>
                    <p className="text-xs text-gray-500">Total Hours</p>
                  </div>
                </div>
              </div>

              {focusSessions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {focusSessions.map((session) => (
                    <div key={session._id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-purple-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{session.duration} minutes</p>
                          <p className="text-xs text-gray-500">Focus session completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {new Date(session.completedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(session.completedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No focus sessions yet</p>
                  <p className="text-gray-600 text-sm mt-2">Complete a focus session to see it here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
