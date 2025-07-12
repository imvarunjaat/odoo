import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("answer"),
      v.literal("comment"),
      v.literal("mention"),
      v.literal("accepted_answer"),
      v.literal("upvote"),
      v.literal("downvote")
    ),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.union(v.id("questions"), v.id("answers"), v.id("comments"))),
  },
  handler: async (ctx, args) => {
    // Create the notification
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      relatedId: args.relatedId,
      isRead: false,
      createdAt: Date.now(),
    });

    return notificationId;
  },
});

export const getUserNotifications = query({
  args: {
    authorToken: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return [];
    }

    const limit = args.limit ?? 20;

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .take(limit);

    return notifications;
  },
});

export const getUnreadNotificationCount = query({
  args: {
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return 0;
    }

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => 
        q.eq("userId", session.userId).eq("isRead", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to mark notifications as read");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== session.userId) {
      throw new Error("You can only mark your own notifications as read");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });

    return args.notificationId;
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to mark notifications as read");
    }

    // Get all unread notifications for the user
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => 
        q.eq("userId", session.userId).eq("isRead", false)
      )
      .collect();

    // Mark them all as read
    await Promise.all(
      unreadNotifications.map((notification) =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );

    return unreadNotifications.length;
  },
});

// Internal function to create notification when someone answers a question
export const notifyQuestionAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    answererName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the question and its author
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      return;
    }

    const questionAuthor = await ctx.db.get(question.authorId);
    if (!questionAuthor) {
      return;
    }

    // Create notification for the question author
    await ctx.db.insert("notifications", {
      userId: question.authorId,
      type: "answer",
      title: "New Answer",
      message: `${args.answererName} answered your question: "${question.title}"`,
      relatedId: args.questionId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

// Internal function to create notification when someone comments on an answer
export const notifyAnswerComment = mutation({
  args: {
    answerId: v.id("answers"),
    commenterName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the answer and its author
    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      return;
    }

    const answerAuthor = await ctx.db.get(answer.authorId);
    if (!answerAuthor) {
      return;
    }

    // Get the question for context
    const question = await ctx.db.get(answer.questionId);
    const questionTitle = question ? question.title : "your answer";

    // Create notification for the answer author
    await ctx.db.insert("notifications", {
      userId: answer.authorId,
      type: "comment",
      title: "New Comment",
      message: `${args.commenterName} commented on your answer to: "${questionTitle}"`,
      relatedId: args.answerId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

// Internal function to create notification when an answer is accepted
export const notifyAnswerAccepted = mutation({
  args: {
    answerId: v.id("answers"),
  },
  handler: async (ctx, args) => {
    // Get the answer and its author
    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      return;
    }

    const answerAuthor = await ctx.db.get(answer.authorId);
    if (!answerAuthor) {
      return;
    }

    // Get the question for context
    const question = await ctx.db.get(answer.questionId);
    const questionTitle = question ? question.title : "a question";

    // Create notification for the answer author
    await ctx.db.insert("notifications", {
      userId: answer.authorId,
      type: "accepted_answer",
      title: "Answer Accepted",
      message: `Your answer to "${questionTitle}" was accepted!`,
      relatedId: args.answerId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});