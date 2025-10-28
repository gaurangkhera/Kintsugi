"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMode } from "./providers/ModeProvider";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { mode, isLoading } = useMode();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoaded && isSignedIn) {
      router.push('/home')
    }
  }, [mode, isLoading, isSignedIn, isLoaded, router]);

  if (isLoading || !isLoaded) {
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
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-6 py-5 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Kintsugi Logo" 
                width={36} 
                height={36}
                className="rounded-full"
              />
              <div className="text-xl font-semibold text-white">Kintsugi</div>
            </Link>
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-white text-black hover:bg-gray-200">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <section className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                <span className="text-gray-400 text-sm">Mindful productivity</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tight">
                Focus.
                <br />
                <span className="text-gray-600">Reflect.</span>
                <br />
                <span className="text-gray-800">Grow.</span>
              </h1>
              
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                A minimal space for your tasks, focus sessions, and daily reflections.
              </p>

              <div className="pt-4">
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-base">
                    Start now
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </section>

          <section className="py-32 px-6">
            <div className="container mx-auto max-w-5xl">
              <div className="grid md:grid-cols-3 gap-16">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-400 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Tasks</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Simple task management without the clutter.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-purple-400 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Focus</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Pomodoro timer for deep work sessions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-1 bg-cyan-400 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Journal</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Daily reflections in a distraction-free space.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 px-6">
            <div className="container mx-auto max-w-3xl text-center space-y-8">
              <h2 className="text-5xl font-bold text-white">
                Ready?
              </h2>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-base">
                  Get started
                </Button>
              </SignUpButton>
            </div>
          </section>

          <footer className="border-t border-white/5 py-12 px-6">
            <div className="container mx-auto max-w-6xl text-center">
              <p className="text-gray-600 text-sm">
                © 2025
              </p>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  return null;
}
