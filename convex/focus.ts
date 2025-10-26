import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all focus sessions for current user
export const getFocusSessions = query({
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

    const sessions = await ctx.db
      .query("focusSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return sessions;
  },
});

// Create a new focus session
export const createFocusSession = mutation({
  args: {
    duration: v.number(),
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

    const sessionId = await ctx.db.insert("focusSessions", {
      userId: user._id,
      duration: args.duration,
      completedAt: Date.now(),
    });

    return sessionId;
  },
});
