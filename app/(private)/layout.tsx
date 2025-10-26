"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useMode } from "../providers/ModeProvider";
import { useEffect } from "react";

const navigation = [
  { name: "DASHBOARD", href: "/dashboard" },
  { name: "ASSIGNMENTS", href: "/assignments" },
  { name: "MAP", href: "/map" },
  { name: "COMMS", href: "/comms/general" },
];

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, isLoading } = useMode();

  useEffect(() => {
    if (!isLoading && mode !== "private") {
      router.push("/");
    }
  }, [mode, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-400/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-yellow-400 text-sm tracking-wider">LOADING WORKSHOP...</p>
        </div>
      </div>
    );
  }

  if (mode !== "private") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <aside className="w-64 border-r border-white/5 flex flex-col relative z-10 bg-black/50 backdrop-blur-sm">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">System Active</span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white mt-4">
            THE WORKSHOP
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group block px-4 py-3 text-sm font-light tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/5 border-l-2 border-amber-400"
                    : "text-gray-500 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent hover:border-white/10"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {isActive && <span className="text-amber-400 text-xs">●</span>}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 tracking-wide">Operative</div>
              <div className="text-[10px] text-gray-700 tracking-wider uppercase mt-0.5">Authenticated</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-12 relative z-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
