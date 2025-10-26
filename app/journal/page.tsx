"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMode } from "@/app/providers/ModeProvider";
import { UserButton, useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";

const TRIGGER_PHRASE = "I am Jack's complete lack of surprise";

export default function JournalPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const createJournalEntry = useMutation(api.journal.createJournalEntry);
  const deleteJournalEntry = useMutation(api.journal.deleteJournalEntry);
  const journals = useQuery(api.journal.getJournalEntries) ?? [];
  const { activateWorkshop } = useMode();

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

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);

    try {
      // Check for the trigger phrase
      if (content.includes(TRIGGER_PHRASE)) {
        // ACTIVATE THE WORKSHOP
        await activateWorkshop();
        // Redirect to dashboard after activation
        router.push("/dashboard");
      } else {
        // Normal journal entry save
        await createJournalEntry({ content });
        setContent("");
      }
    } catch (error) {
      console.error("Error saving journal:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
              <Link href="/focus" className="text-gray-400 hover:text-white transition-colors">
                Focus
              </Link>
              <Link href="/journal" className="text-white font-medium">
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-1 bg-cyan-400 rounded"></div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white">Daily Journal</h1>
                  <p className="text-gray-500 mt-2">Reflect on your thoughts and experiences</p>
                </div>
              </div>
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="border-white/20 text-gray-400 hover:bg-white/5"
              >
                {showHistory ? "New Entry" : "View History"}
              </Button>
            </div>
          </div>

          {!showHistory ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Today's Entry</label>
                  <span className="text-xs text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
                className="min-h-[500px] text-lg border-none focus-visible:ring-0 resize-none bg-transparent text-white placeholder:text-gray-600"
              />

              <div className="mt-8 flex justify-between items-center">
                <div className="text-xs text-gray-600">
                  {content.length} characters
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setContent("")}
                    disabled={isSaving}
                    className="border-white/20 text-gray-400 hover:bg-white/5"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !content.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Your Journal History</h2>
                <p className="text-gray-500 text-sm mb-6">{journals.length} total entries</p>
                
                {journals.length > 0 ? (
                  <div className="space-y-4">
                    {journals.map((journal) => (
                      <div key={journal._id} className="bg-white/5 border border-white/10 rounded-xl p-6 group">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm text-gray-400">
                            {new Date(journal._creationTime).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteJournalEntry({ entryId: journal._id })}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-white text-base leading-relaxed whitespace-pre-wrap">{journal.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No journal entries yet</p>
                    <p className="text-gray-600 text-sm mt-2">Start writing to see your entries here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Private & Secure</h3>
              <p className="text-gray-500 text-sm">Your journal entries are encrypted and only visible to you.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Daily Practice</h3>
              <p className="text-gray-500 text-sm">Regular journaling helps process emotions and track personal growth.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
