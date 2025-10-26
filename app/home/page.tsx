"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const tasks = useQuery(api.tasks.getTasks) ?? [];
  const journals = useQuery(api.journal.getJournalEntries) ?? [];
  const focusSessions = useQuery(api.focus.getFocusSessions) ?? [];
  const user = useUser();
  
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

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  const recentJournals = journals.slice(0, 3);
  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.duration, 0);
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/home" className="text-xl font-semibold text-white hover:text-gray-300 transition-colors">
            Kintsugi
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex gap-6">
              <Link href="/home" className="text-white font-medium">
                Home
              </Link>
              <Link href="/tasks" className="text-gray-400 hover:text-white transition-colors">
                Tasks
              </Link>
              <Link href="/focus" className="text-gray-400 hover:text-white transition-colors">
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

      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome back, {user.user?.firstName}.
            </h1>
            <p className="text-xl text-gray-500">
              Have a look at your recent statistics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Tasks Completed</span>
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-blue-400 rounded"></div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{completedTasks}/{totalTasks}</div>
              <p className="text-xs text-gray-600 mt-1">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Focus Time</span>
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-purple-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{totalFocusMinutes}</div>
              <p className="text-xs text-gray-600 mt-1">minutes focused today</p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Journal Entries</span>
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-1 bg-cyan-400 rounded"></div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{journals.length}</div>
              <p className="text-xs text-gray-600 mt-1">total reflections</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/tasks">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:border-blue-400/50 transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <div className="w-6 h-6 border-2 border-blue-400 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Tasks</h3>
                <p className="text-gray-500 text-sm">
                  Manage your daily to-dos
                </p>
              </Card>
            </Link>

            <Link href="/focus">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:border-purple-400/50 transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <div className="w-6 h-6 border-2 border-purple-400 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Focus</h3>
                <p className="text-gray-500 text-sm">
                  Start a focus session
                </p>
              </Card>
            </Link>

            <Link href="/journal">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:border-cyan-400/50 transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                  <div className="w-6 h-1 bg-cyan-400 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Journal</h3>
                <p className="text-gray-500 text-sm">
                  Reflect on your day
                </p>
              </Card>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Journals</h3>
              {recentJournals.length > 0 ? (
                <div className="space-y-3">
                  {recentJournals.map((journal) => (
                    <div key={journal._id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <p className="text-gray-400 text-sm line-clamp-2">{journal.content}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        {new Date(journal._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No journal entries yet</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Focus Sessions</h3>
              {focusSessions.length > 0 ? (
                <div className="space-y-3">
                  {focusSessions.slice(0, 5).map((session) => (
                    <div key={session._id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white text-sm">{session.duration} minutes</span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {new Date(session.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No focus sessions yet</p>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-2xl text-white font-light italic mb-4">
              "The wound is the place where the Light enters you."
            </p>
            <p className="text-gray-500">— Rumi</p>
          </div>
        </div>
      </main>
    </div>
  );
}
