import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      name: v.string(),
      email: v.string(),
      tokenIdentifier: v.string(),
      mode: v.union(v.literal("public"), v.literal("private")),
      reputation: v.number(),
    })
      .index("by_token", ["tokenIdentifier"])
      .index("by_email", ["email"]),

    tasks: defineTable({
      userId: v.id("users"),
      body: v.string(),
      isCompleted: v.boolean(),
    }).index("by_user", ["userId"]),

    // Journal entries for public mode
    journalEntries: defineTable({
      userId: v.id("users"),
      content: v.string(),
    }).index("by_user", ["userId"]),

    // Focus sessions for public mode
    focusSessions: defineTable({
      userId: v.id("users"),
      duration: v.number(), // in minutes
      completedAt: v.number(), // timestamp
    }).index("by_user", ["userId"]),

    // Assignments table for private mode (The Workshop)
    assignments: defineTable({
      title: v.string(),
      description: v.string(),
      type: v.union(v.literal("digital"), v.literal("physical")),
      status: v.union(v.literal("active"), v.literal("claimed"), v.literal("completed")),
      claimedBy: v.optional(v.id("users")),
      claimedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      location: v.optional(
        v.object({
          lat: v.number(),
          lng: v.number(),
          address: v.optional(v.string()),
        })
      ),
      steps: v.optional(v.array(v.string())),
      requirements: v.optional(v.array(v.string())),
      estimatedDuration: v.optional(v.string()),
    })
      .index("by_status", ["status"])
      .index("by_claimed_user", ["claimedBy"]),

    // Messages table for private mode (The Workshop comms)
    messages: defineTable({
      userId: v.id("users"),
      channel: v.string(),
      body: v.string(),
    })
      .index("by_channel", ["channel"])
      .index("by_user", ["userId"]),
  },
  { schemaValidation: true }
);
