import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAnswer = mutation({
  args: {
    content: v.string(),
    questionId: v.id("questions"),
    authorToken: v.string(), // User's session token
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to submit an answer");
    }

    // Get the user data
    const user = await ctx.db.get(session.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate content
    if (!args.content.trim()) {
      throw new Error("Answer content is required");
    }

    // Create the answer
    const answerId = await ctx.db.insert("answers", {
      content: args.content.trim(),
      questionId: args.questionId,
      authorId: session.userId,
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return answerId;
  },
});

export const getAnswersByQuestion = query({
  args: {
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const answers = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .order("desc")
      .collect();

    // Get author information for each answer
    const answersWithAuthors = await Promise.all(
      answers.map(async (answer) => {
        const author = await ctx.db.get(answer.authorId);
        return {
          ...answer,
          author: author ? {
            _id: author._id,
            name: author.name,
            email: author.email,
            image: author.image,
          } : null,
        };
      })
    );

    return answersWithAuthors;
  },
});

export const updateAnswer = mutation({
  args: {
    answerId: v.id("answers"),
    content: v.string(),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to update an answer");
    }

    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer.authorId !== session.userId) {
      throw new Error("You can only edit your own answers");
    }

    await ctx.db.patch(args.answerId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    return args.answerId;
  },
});

export const deleteAnswer = mutation({
  args: {
    answerId: v.id("answers"),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to delete an answer");
    }

    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer.authorId !== session.userId) {
      throw new Error("You can only delete your own answers");
    }

    await ctx.db.delete(args.answerId);

    return args.answerId;
  },
});

export const acceptAnswer = mutation({
  args: {
    answerId: v.id("answers"),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to accept an answer");
    }

    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }

    // Get the question to verify the user is the author
    const question = await ctx.db.get(answer.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.authorId !== session.userId) {
      throw new Error("Only the question author can accept answers");
    }

    // Unaccept any previously accepted answer
    const previouslyAccepted = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("questionId", answer.questionId))
      .filter((q) => q.eq(q.field("isAccepted"), true))
      .first();

    if (previouslyAccepted) {
      await ctx.db.patch(previouslyAccepted._id, { isAccepted: false });
    }

    // Accept the new answer
    await ctx.db.patch(args.answerId, { isAccepted: true });

    // Update the question's acceptedAnswerId
    await ctx.db.patch(answer.questionId, { acceptedAnswerId: args.answerId });

    return args.answerId;
  },
});

export const voteOnAnswer = mutation({
  args: {
    answerId: v.id("answers"),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to vote");
    }

    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }

    // Check if user has already voted on this answer
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_target", (q) => 
        q.eq("userId", session.userId).eq("targetId", args.answerId)
      )
      .first();

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.type === args.voteType) {
        await ctx.db.delete(existingVote._id);
        
        // Update answer vote count
        if (args.voteType === "upvote") {
          await ctx.db.patch(args.answerId, {
            upvotes: Math.max(0, answer.upvotes - 1),
          });
        } else {
          await ctx.db.patch(args.answerId, {
            downvotes: Math.max(0, answer.downvotes - 1),
          });
        }
        
        return { action: "removed", voteType: args.voteType };
      } else {
        // Different vote type, update the existing vote
        await ctx.db.patch(existingVote._id, {
          type: args.voteType,
          createdAt: Date.now(),
        });
        
        // Update answer vote counts (remove old vote, add new vote)
        if (args.voteType === "upvote") {
          await ctx.db.patch(args.answerId, {
            upvotes: answer.upvotes + 1,
            downvotes: Math.max(0, answer.downvotes - 1),
          });
        } else {
          await ctx.db.patch(args.answerId, {
            downvotes: answer.downvotes + 1,
            upvotes: Math.max(0, answer.upvotes - 1),
          });
        }
        
        return { action: "updated", voteType: args.voteType };
      }
    } else {
      // No existing vote, create new vote
      await ctx.db.insert("votes", {
        userId: session.userId,
        targetId: args.answerId,
        targetType: "answer",
        type: args.voteType,
        createdAt: Date.now(),
      });
      
      // Update answer vote count
      if (args.voteType === "upvote") {
        await ctx.db.patch(args.answerId, {
          upvotes: answer.upvotes + 1,
        });
      } else {
        await ctx.db.patch(args.answerId, {
          downvotes: answer.downvotes + 1,
        });
      }
      
      return { action: "added", voteType: args.voteType };
    }
  },
});

export const getUserVoteOnAnswer = query({
  args: {
    answerId: v.id("answers"),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_target", (q) => 
        q.eq("userId", session.userId).eq("targetId", args.answerId)
      )
      .first();

    return vote ? vote.type : null;
  },
});

export const addCommentToAnswer = mutation({
  args: {
    answerId: v.id("answers"),
    content: v.string(),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to comment");
    }

    // Validate content
    if (!args.content.trim()) {
      throw new Error("Comment content is required");
    }

    if (args.content.length > 500) {
      throw new Error("Comment must be 500 characters or less");
    }

    // Verify the answer exists
    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }

    // Create the comment
    const commentId = await ctx.db.insert("comments", {
      content: args.content.trim(),
      targetId: args.answerId,
      targetType: "answer",
      authorId: session.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return commentId;
  },
});

export const getCommentsForAnswer = query({
  args: {
    answerId: v.id("answers"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_target", (q) => q.eq("targetId", args.answerId))
      .order("asc") // Show oldest comments first
      .collect();

    // Get author information for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          author: author ? {
            _id: author._id,
            name: author.name,
            email: author.email,
            image: author.image,
          } : null,
        };
      })
    );

    return commentsWithAuthors;
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
    authorToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to delete a comment");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorId !== session.userId) {
      throw new Error("You can only delete your own comments");
    }

    await ctx.db.delete(args.commentId);

    return args.commentId;
  },
});