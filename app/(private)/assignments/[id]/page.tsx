"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, CheckCircle2, ArrowLeft, ChevronRight, Navigation, Clock, ListChecks, Package } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as Id<"assignments">;
  
  const assignment = useQuery(api.assignments.getAssignmentById, { id: assignmentId });
  const claimAssignment = useMutation(api.assignments.claimAssignment);
  const completeAssignment = useMutation(api.assignments.completeAssignment);
  
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  
  const [completeDragPosition, setCompleteDragPosition] = useState(0);
  const [isCompleteDragging, setIsCompleteDragging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const completeContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const completeStartXRef = useRef(0);

  const CLAIM_THRESHOLD = 0.8;
  const COMPLETE_THRESHOLD = 0.8;

  useEffect(() => {
    if (!isDragging && dragPosition > 0 && dragPosition < CLAIM_THRESHOLD) {
      const animation = setInterval(() => {
        setDragPosition((prev) => {
          const next = prev - 0.05;
          if (next <= 0) {
            clearInterval(animation);
            return 0;
          }
          return next;
        });
      }, 16);
      return () => clearInterval(animation);
    }
  }, [isDragging, dragPosition]);

  useEffect(() => {
    if (!isCompleteDragging && completeDragPosition > 0 && completeDragPosition < COMPLETE_THRESHOLD) {
      const animation = setInterval(() => {
        setCompleteDragPosition((prev) => {
          const next = prev - 0.05;
          if (next <= 0) {
            clearInterval(animation);
            return 0;
          }
          return next;
        });
      }, 16);
      return () => clearInterval(animation);
    }
  }, [isCompleteDragging, completeDragPosition]);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const diff = clientX - startXRef.current;
    const progress = Math.max(0, Math.min(1, diff / containerWidth));
    setDragPosition(progress);
  };

  const handleEnd = async () => {
    setIsDragging(false);
    
    if (dragPosition >= CLAIM_THRESHOLD) {
      setIsClaiming(true);
      setError(null);
      try {
        await claimAssignment({ id: assignmentId });
        setTimeout(() => {
          router.push("/assignments");
        }, 1000);
      } catch (error: any) {
        console.error("Failed to claim assignment:", error);
        setError(error.message || "Failed to claim assignment. It may have been claimed by another operative.");
        setDragPosition(0);
        setIsClaiming(false);
      }
    }
  };

  const handleCompleteStart = (clientX: number) => {
    setIsCompleteDragging(true);
    completeStartXRef.current = clientX;
  };

  const handleCompleteMove = (clientX: number) => {
    if (!isCompleteDragging || !completeContainerRef.current) return;
    
    const containerWidth = completeContainerRef.current.offsetWidth;
    const diff = clientX - completeStartXRef.current;
    const progress = Math.max(0, Math.min(1, diff / containerWidth));
    setCompleteDragPosition(progress);
  };

  const handleCompleteEnd = async () => {
    setIsCompleteDragging(false);
    
    if (completeDragPosition >= COMPLETE_THRESHOLD) {
      setIsCompleting(true);
      setError(null);
      try {
        await completeAssignment({ assignmentId });
        setTimeout(() => {
          router.push("/assignments");
        }, 1000);
      } catch (error: any) {
        console.error("Failed to complete assignment:", error);
        setError(error.message || "Failed to complete assignment. Please try again.");
        setCompleteDragPosition(0);
        setIsCompleting(false);
      }
    }
  };

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading assignment...</p>
        </div>
      </div>
    );
  }

  const isClaimed = assignment.status === "claimed" || assignment.status === "completed";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button
        onClick={() => router.push("/assignments")}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </button>

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 p-4 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-amber-400"></div>
              <h1 className="text-3xl font-light tracking-tight text-white">
                {assignment.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="px-2 py-1 bg-white/5 tracking-wider uppercase">
                {assignment.type}
              </span>
              <span className={`px-2 py-1 tracking-wider uppercase ${
                assignment.status === "active" ? "bg-green-400/10 text-green-400" :
                assignment.status === "claimed" ? "bg-blue-400/10 text-blue-400" :
                "bg-gray-400/10 text-gray-400"
              }`}>
                {assignment.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-3">
              Description
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {assignment.description}
            </p>
          </div>

          {assignment.estimatedDuration && (
            <div>
              <h2 className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-3">
                Estimated Duration
              </h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm">{assignment.estimatedDuration}</span>
              </div>
            </div>
          )}

          {assignment.requirements && assignment.requirements.length > 0 && (
            <div>
              <h2 className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-3">
                Requirements
              </h2>
              <div className="space-y-2">
                {assignment.requirements.map((req: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 text-gray-400">
                    <Package className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignment.location && (
            <div>
              <h2 className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-3">
                Location
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">
                    {assignment.location.address || `${assignment.location.lat.toFixed(4)}, ${assignment.location.lng.toFixed(4)}`}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${assignment.location.lat},${assignment.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 text-sm transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-3">
              Created
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-sm">
                {new Date(assignment._creationTime).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {assignment.steps && assignment.steps.length > 0 && assignment.status === "claimed" && (
        <div className="bg-white/[0.02] border border-white/5 p-8">
          <div className="flex items-center gap-3 mb-6">
            <ListChecks className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-light text-white tracking-tight">
              Mission Steps
            </h2>
          </div>
          <div className="space-y-4">
            {assignment.steps.map((step: string, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <span className="text-amber-400 text-sm font-light">{idx + 1}</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-400 text-sm leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isClaimed && (
        <div className="bg-white/[0.02] border border-white/5 p-8">
          <h2 className="text-xl font-light text-white tracking-tight mb-4">
            Claim Assignment
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Swipe right to accept this assignment and add it to your active workload.
          </p>

          <div
            ref={containerRef}
            className="relative h-16 bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden cursor-pointer select-none"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={() => {
              if (isDragging) handleEnd();
            }}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400/20 to-amber-400/10 transition-all"
              style={{ width: `${dragPosition * 100}%` }}
            />

            <div
              className="absolute inset-y-0 left-0 w-16 bg-amber-400 flex items-center justify-center transition-all"
              style={{
                transform: `translateX(${dragPosition * (containerRef.current?.offsetWidth ?? 0) - 64}px)`,
              }}
            >
              {isClaiming ? (
                <CheckCircle2 className="w-6 h-6 text-black" />
              ) : (
                <ChevronRight className="w-6 h-6 text-black" />
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm text-gray-500 tracking-wide">
                {isClaiming ? "Claiming..." : dragPosition > 0.5 ? "Release to claim" : "Swipe to claim"}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-4 text-center">
            This action cannot be undone. Ensure you can complete this assignment.
          </p>
        </div>
      )}

      {assignment.status === "claimed" && (
        <div className="bg-white/[0.02] border border-white/5 p-8">
          <h2 className="text-xl font-light text-white tracking-tight mb-4">
            Complete Assignment
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Swipe right to mark this assignment as completed and earn reputation points.
          </p>

          <div
            ref={completeContainerRef}
            className="relative h-16 bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden cursor-pointer select-none"
            onMouseDown={(e) => handleCompleteStart(e.clientX)}
            onMouseMove={(e) => handleCompleteMove(e.clientX)}
            onMouseUp={handleCompleteEnd}
            onMouseLeave={() => {
              if (isCompleteDragging) handleCompleteEnd();
            }}
            onTouchStart={(e) => handleCompleteStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleCompleteMove(e.touches[0].clientX)}
            onTouchEnd={handleCompleteEnd}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400/20 to-green-400/10 transition-all"
              style={{ width: `${completeDragPosition * 100}%` }}
            />

            <div
              className="absolute inset-y-0 left-0 w-16 bg-green-400 flex items-center justify-center transition-all"
              style={{
                transform: `translateX(${completeDragPosition * (completeContainerRef.current?.offsetWidth ?? 0) - 64}px)`,
              }}
            >
              {isCompleting ? (
                <CheckCircle2 className="w-6 h-6 text-black" />
              ) : (
                <ChevronRight className="w-6 h-6 text-black" />
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm text-gray-500 tracking-wide">
                {isCompleting ? "Completing..." : completeDragPosition > 0.5 ? "Release to complete" : "Swipe to complete"}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-4 text-center">
            Completing this assignment will update your reputation and mark it as finished.
          </p>
        </div>
      )}

      {assignment.status === "completed" && (
        <div className="bg-green-400/10 border border-green-400/20 p-8 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-light text-green-400 tracking-tight">
              Assignment Completed
            </h2>
          </div>
          <p className="text-gray-400 text-sm">
            This assignment has been successfully completed. Excellent work, operative.
          </p>
        </div>
      )}
    </div>
  );
}
