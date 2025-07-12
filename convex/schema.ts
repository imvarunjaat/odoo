import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  questions: defineTable({
    title: v.string(),
    description: v.string(), // Rich text HTML content
    tags: v.array(v.string()),
    authorId: v.id("users"),
    acceptedAnswerId: v.optional(v.id("answers")),
    upvotes: v.number(),
    downvotes: v.number(),
    views: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_created_at", ["createdAt"])
    .index("by_tags", ["tags"]),

  answers: defineTable({
    content: v.string(), // Rich text HTML content
    questionId: v.id("questions"),
    authorId: v.id("users"),
    upvotes: v.number(),
    downvotes: v.number(),
    isAccepted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_question", ["questionId"])
    .index("by_author", ["authorId"])
    .index("by_created_at", ["createdAt"]),

  votes: defineTable({
    userId: v.id("users"),
    targetId: v.union(v.id("questions"), v.id("answers")),
    targetType: v.union(v.literal("question"), v.literal("answer")),
    type: v.union(v.literal("upvote"), v.literal("downvote")),
    createdAt: v.number(),
  })
    .index("by_user_target", ["userId", "targetId"])
    .index("by_target", ["targetId"]),

  comments: defineTable({
    content: v.string(),
    targetId: v.union(v.id("questions"), v.id("answers")),
    targetType: v.union(v.literal("question"), v.literal("answer")),
    authorId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_target", ["targetId"])
    .index("by_author", ["authorId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("answer"),
      v.literal("comment"),
      v.literal("mention"),
      v.literal("accepted_answer")
    ),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.union(v.id("questions"), v.id("answers"), v.id("comments"))),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "isRead"]),

  tags: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    questionCount: v.number(),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"]),
});