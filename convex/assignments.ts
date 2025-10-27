import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all active assignments
export const getActiveAssignments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return assignments;
  },
});

// Get all assignments (active and user's claimed/completed)
export const getAllAssignments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      return [];
    }

    const allAssignments = await ctx.db.query("assignments").collect();
    
    return allAssignments.filter((assignment) => {
      if (assignment.status === "active") return true;
      if (assignment.claimedBy === user._id) return true;
      return false;
    });
  },
});

// Get user's claimed assignments only
export const getMyClaimedAssignments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      return [];
    }

    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_claimed_user", (q) => q.eq("claimedBy", user._id))
      .filter((q) => q.eq(q.field("status"), "claimed"))
      .collect();

    return assignments;
  },
});

// Get assignments with location (for map view)
export const getAssignmentsWithLocation = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const assignments = await ctx.db
      .query("assignments")
      .filter((q) => q.neq(q.field("location"), undefined))
      .collect();

    return assignments;
  },
});

// Create a new assignment (admin function)
export const createAssignment = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("digital"), v.literal("physical")),
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const assignmentId = await ctx.db.insert("assignments", {
      title: args.title,
      description: args.description,
      type: args.type,
      status: "active",
      location: args.location,
    });

    return assignmentId;
  },
});

// Get assignment by ID
export const getAssignmentById = query({
  args: {
    id: v.id("assignments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const assignment = await ctx.db.get(args.id);
    return assignment;
  },
});

// Claim an assignment
export const claimAssignment = mutation({
  args: {
    id: v.id("assignments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const assignment = await ctx.db.get(args.id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    if (assignment.status !== "active") {
      throw new Error("Assignment is not available for claiming");
    }

    if (assignment.claimedBy && assignment.claimedBy !== user._id) {
      throw new Error("Assignment already claimed by another operative");
    }

    await ctx.db.patch(args.id, {
      status: "claimed",
      claimedBy: user._id,
      claimedAt: Date.now(),
    });

    return { success: true };
  },
});

// Unclaim an assignment (release it back to active pool)
export const unclaimAssignment = mutation({
  args: {
    id: v.id("assignments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const assignment = await ctx.db.get(args.id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    if (assignment.claimedBy !== user._id) {
      throw new Error("You can only unclaim assignments you have claimed");
    }

    if (assignment.status !== "claimed") {
      throw new Error("Assignment is not in claimed status");
    }

    await ctx.db.patch(args.id, {
      status: "active",
      claimedBy: undefined,
      claimedAt: undefined,
    });

    return { success: true };
  },
});

// Mark assignment as completed
export const completeAssignment = mutation({
  args: {
    assignmentId: v.id("assignments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    if (assignment.status !== "claimed") {
      throw new Error("Assignment must be claimed before completion");
    }

    if (assignment.claimedBy !== user._id) {
      throw new Error("You can only complete assignments you have claimed");
    }

    const reputationGain = assignment.type === "physical" ? 150 : 100;

    await ctx.db.patch(args.assignmentId, {
      status: "completed",
      completedAt: Date.now(),
    });

    await ctx.db.patch(user._id, {
      reputation: user.reputation + reputationGain,
    });

    return { reputationGain };
  },
});
