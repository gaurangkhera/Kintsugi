"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { TodoList } from "@/components/public/TodoList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TasksPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

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
              <Link href="/tasks" className="text-white font-medium">
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

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-400 rounded"></div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white">Tasks</h1>
                  <p className="text-gray-500 mt-2">Organize your day, one task at a time</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <TodoList />
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Quick Tips</h3>
              <p className="text-gray-500 text-sm">Break down large tasks into smaller, manageable steps for better progress tracking.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Stay Focused</h3>
              <p className="text-gray-500 text-sm">Prioritize 3-5 key tasks each day to maintain focus and avoid overwhelm.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
