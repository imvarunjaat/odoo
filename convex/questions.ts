import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createQuestion = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    authorToken: v.string(), // User's session token
  },
  handler: async (ctx, args) => {
    const { title, description, tags, authorToken } = args;

    // Verify the user is authenticated by checking their session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", authorToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("You must be logged in to ask a question");
    }

    // Get the user data
    const user = await ctx.db.get(session.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate inputs
    if (!title.trim()) {
      throw new Error("Question title is required");
    }
    
    if (!description.trim()) {
      throw new Error("Question description is required");
    }

    if (title.length > 200) {
      throw new Error("Question title must be 200 characters or less");
    }

    if (tags.length > 5) {
      throw new Error("Maximum 5 tags allowed");
    }

    // Create the question
    const questionId = await ctx.db.insert("questions", {
      title: title.trim(),
      description: description.trim(),
      tags: tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag !== ""),
      authorId: session.userId,
      acceptedAnswerId: undefined,
      upvotes: 0,
      downvotes: 0,
      views: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update tag counts (create tags if they don't exist)
    for (const tagName of tags) {
      const cleanTag = tagName.trim().toLowerCase();
      if (cleanTag) {
        const existingTag = await ctx.db
          .query("tags")
          .withIndex("by_name", (q) => q.eq("name", cleanTag))
          .first();

        if (existingTag) {
          // Increment count for existing tag
          await ctx.db.patch(existingTag._id, {
            questionCount: existingTag.questionCount + 1,
          });
        } else {
          // Create new tag
          await ctx.db.insert("tags", {
            name: cleanTag,
            description: undefined,
            color: undefined,
            questionCount: 1,
            createdAt: Date.now(),
          });
        }
      }
    }

    return { 
      questionId,
      message: "Question submitted successfully!" 
    };
  },
});

export const getQuestions = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const offset = args.offset ?? 0;

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_created_at")
      .order("desc")
      .paginate({ cursor: null, numItems: limit });

    // Get author information for each question
    const questionsWithAuthors = await Promise.all(
      questions.page.map(async (question) => {
        const author = await ctx.db.get(question.authorId);
        return {
          ...question,
          author: author ? {
            name: author.name,
            image: author.image,
          } : null,
        };
      })
    );

    return {
      questions: questionsWithAuthors,
      hasMore: questions.isDone === false,
    };
  },
});

export const getQuestionById = query({
  args: {
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    
    if (!question) {
      return null;
    }

    // Get author information
    const author = await ctx.db.get(question.authorId);

    return {
      ...question,
      author: author ? {
        name: author.name,
        image: author.image,
      } : null,
    };
  },
});

export const incrementQuestionViews = mutation({
  args: {
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    
    if (!question) {
      throw new Error("Question not found");
    }

    // Increment view count
    await ctx.db.patch(args.questionId, {
      views: question.views + 1,
    });

    return { success: true };
  },
});