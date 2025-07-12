import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const signUp = action({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ token: string; userId: Id<"users"> }> => {
    // Check if user already exists
    const existingUser = await ctx.runQuery(internal.authHelpers.getUserByEmail, { 
      email: args.email 
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(args.password, 10);

    // Create the user and session
    const result = await ctx.runMutation(internal.authHelpers.createUserWithSession, {
      name: args.name,
      email: args.email,
      passwordHash,
    });

    return result;
  },
});

export const signIn = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ token: string; userId: Id<"users"> }> => {
    // Find user by email
    const user = await ctx.runQuery(internal.authHelpers.getUserByEmail, { 
      email: args.email 
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValid = await bcrypt.compare(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Create a new session
    const result = await ctx.runMutation(internal.authHelpers.createSession, {
      userId: user._id,
    });

    return result;
  },
});

export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find session by token
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    // Get user data
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    // Don't return the password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

export const signOut = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find and delete the session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, image } = args;
    
    // Update the user's profile
    await ctx.db.patch(userId, {
      ...(image && { image }),
    });

    return { success: true };
  },
});