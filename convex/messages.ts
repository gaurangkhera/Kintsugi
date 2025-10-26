import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const getMessages = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channel", args.channel))
      .order("desc")
      .take(100);

    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.userId);
        return {
          ...message,
          userName: user?.name ?? "Unknown",
        };
      })
    );

    return messagesWithUsers.reverse();
  },
});

export const sendMessage = mutation({
  args: {
    channel: v.string(),
    body: v.string(),
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

    const messageId = await ctx.db.insert("messages", {
      userId: user._id,
      channel: args.channel,
      body: args.body,
    });

    return messageId;
  },
});

export const getChannels = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const messages = await ctx.db.query("messages").collect();
    //@ts-ignore
    const channels = [...new Set(messages.map((m) => m.channel))];
    return channels.sort();
  },
});
