import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internalMutation } from "./_generated/server";

export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (existingUser) {
      return existingUser;
    }

    // Create new user with public mode as default
    const userId = await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "",
      tokenIdentifier: identity.tokenIdentifier,
      mode: "public",
      reputation: 0,
    });

    return await ctx.db.get(userId);
  },
});

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    return user;
  },
});

export const activateWorkshop = mutation({
  args: {},
  handler: async (ctx) => {
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

    if (user.mode === "private") {
      return user; // Already activated
    }

    await ctx.db.patch(user._id, {
      mode: "private",
    });

    return await ctx.db.get(user._id);
  },
});

export const deactivateWorkshop = mutation({
  args: {},
  handler: async (ctx) => {
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

    if (user.mode === "public") {
      return user; // Already in public mode
    }

    await ctx.db.patch(user._id, {
      mode: "public",
    });

    return await ctx.db.get(user._id);
  },
});

export const createUser = internalMutation({
  args: { name: v.string(), email: v.string(), tokenIdentifier: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: args.tokenIdentifier,
      mode: "public",
      reputation: 0,
    });
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  }, 
  async handler(ctx, args) {
    return await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).first();
  },
})
