"use client";

import { useState, use } from "react";
import { HomeIcon, ChevronUp, ChevronDown, Check, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge-component";
import { Button } from "@/components/ui/button-component";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/navbar";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";

interface AnswerCardProps {
  answerItem: any;
  user: any;
  question: any;
  userVotes: Record<string, "upvote" | "downvote" | null>;
  commentTexts: Record<string, string>;
  showCommentForm: Record<string, boolean>;
  onVote: (answerId: string, voteType: "upvote" | "downvote") => void;
  onAcceptAnswer: (answerId: string) => void;
  onSubmitComment: (answerId: string) => void;
  onToggleCommentForm: (answerId: string) => void;
  onCommentTextChange: (answerId: string, text: string) => void;
}

function AnswerCard({
  answerItem,
  user,
  question,
  userVotes,
  commentTexts,
  showCommentForm,
  onVote,
  onAcceptAnswer,
  onSubmitComment,
  onToggleCommentForm,
  onCommentTextChange,
}: AnswerCardProps) {
  // Fetch comments for this answer
  const comments = useQuery(api.answers.getCommentsForAnswer, {
    answerId: answerItem._id,
  });

  return (
    <div className="border border-border bg-card hover:bg-muted/20 transition-colors">
      <div className="px-6 py-5 space-y-4">
        
        {/* Accepted badge */}
        {answerItem.isAccepted && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-md">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Accepted Answer</span>
          </div>
        )}
        
        {/* Answer content */}
        <div 
          className="prose max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: answerItem.content }}
        />
        
        {/* Footer with voting and metadata */}
        <div className="flex items-center justify-between pt-4 border-t">
          {/* Voting */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onVote(answerItem._id, "upvote")}
              disabled={!user}
              className={userVotes[answerItem._id] === "upvote" ? "text-green-600 bg-green-50" : ""}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="font-medium">{answerItem.upvotes - answerItem.downvotes}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onVote(answerItem._id, "downvote")}
              disabled={!user}
              className={userVotes[answerItem._id] === "downvote" ? "text-red-600 bg-red-50" : ""}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Accept button and author */}
          <div className="flex items-center gap-4">
            {user && question && user._id === question.authorId && !answerItem.isAccepted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcceptAnswer(answerItem._id)}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Check className="mr-2 h-4 w-4" />
                Accept
              </Button>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={answerItem.author?.image} alt={answerItem.author?.name} />
                <AvatarFallback className="text-xs">
                  {answerItem.author?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <span>{answerItem.author?.name || 'Anonymous'}</span>
              <span>•</span>
              <span>{new Date(answerItem.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="mt-4 pt-4 border-t border-muted">
          {/* Comment button */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleCommentForm(answerItem._id)}
              className="text-muted-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add comment
            </Button>
            {comments && comments.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Comment form */}
          {showCommentForm[answerItem._id] && (
            <div className="mb-4 space-y-2">
              <textarea
                value={commentTexts[answerItem._id] || ""}
                onChange={(e) => onCommentTextChange(answerItem._id, e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 text-sm border rounded-md resize-none"
                rows={2}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {(commentTexts[answerItem._id] || "").length}/500
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleCommentForm(answerItem._id)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSubmitComment(answerItem._id)}
                    disabled={!commentTexts[answerItem._id]?.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comments list */}
          {comments && comments.length > 0 && (
            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment._id} className="text-sm bg-muted/20 p-3 rounded">
                  <p className="mb-1">{comment.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={comment.author?.image} alt={comment.author?.name} />
                      <AvatarFallback className="text-xs">
                        {comment.author?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{comment.author?.name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuestionDetail({ params }: { params: Promise<{ id: string }> }) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, "upvote" | "downvote" | null>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [showCommentForm, setShowCommentForm] = useState<Record<string, boolean>>({});
  const { uploadImage, isUploading } = useImageUpload();
  const { user } = useAuth();
  
  // Unwrap the params Promise
  const { id } = use(params);

  // Fetch question data from Convex
  const question = useQuery(api.questions.getQuestionById, {
    questionId: id as Id<"questions">,
  });

  // Fetch answers for this question
  const answers = useQuery(api.answers.getAnswersByQuestion, {
    questionId: id as Id<"questions">,
  });



  const createAnswer = useMutation(api.answers.createAnswer);
  const acceptAnswer = useMutation(api.answers.acceptAnswer);
  const voteOnAnswer = useMutation(api.answers.voteOnAnswer);
  const addCommentToAnswer = useMutation(api.answers.addCommentToAnswer);

  const isLoading = question === undefined;

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please sign in to submit an answer");
      return;
    }

    if (!answer.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please sign in to submit an answer");
        return;
      }

      await createAnswer({
        content: answer,
        questionId: id as Id<"questions">,
        authorToken: token,
      });
      setAnswer("");
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: Id<"answers">) => {
    if (!user || user._id !== question?.authorId) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please sign in to accept an answer");
        return;
      }

      await acceptAnswer({ 
        answerId,
        authorToken: token,
      });
    } catch (error) {
      console.error("Failed to accept answer:", error);
      alert("Failed to accept answer. Please try again.");
    }
  };

  const handleVote = async (answerId: Id<"answers">, voteType: "upvote" | "downvote") => {
    if (!user) {
      alert("Please sign in to vote");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please sign in to vote");
        return;
      }

      const result = await voteOnAnswer({
        answerId,
        voteType,
        authorToken: token,
      });

      // Update local vote state based on the result
      setUserVotes(prev => ({
        ...prev,
        [answerId]: result.action === "removed" ? null : voteType
      }));
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  const handleSubmitComment = async (answerId: string) => {
    if (!user) {
      alert("Please sign in to comment");
      return;
    }

    const commentText = commentTexts[answerId];
    if (!commentText?.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please sign in to comment");
        return;
      }

      await addCommentToAnswer({
        answerId: answerId as Id<"answers">,
        content: commentText,
        authorToken: token,
      });

      // Clear the comment text and hide form
      setCommentTexts(prev => ({ ...prev, [answerId]: "" }));
      setShowCommentForm(prev => ({ ...prev, [answerId]: false }));
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const toggleCommentForm = (answerId: string) => {
    setShowCommentForm(prev => ({ ...prev, [answerId]: !prev[answerId] }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="w-full flex-1 flex justify-center items-center">
          <div className="text-muted-foreground">Loading question...</div>
        </div>
      </div>
    );
  }

  // Error state (question not found)
  if (!question) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="w-full flex-1 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Question Not Found</h1>
            <p className="text-muted-foreground mb-4">The question you're looking for doesn't exist.</p>
            <Button asChild>
              <a href="/home">Go Back to Questions</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="w-full flex-1 flex justify-center">
        <div className="max-w-[775px] w-full border-l border-r border-border">
          <div className="px-6 py-6 space-y-6">
            
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/home">
                    <HomeIcon size={16} aria-hidden="true" />
                    <span className="sr-only">Home</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/home">Questions</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{question.title.substring(0, 30)}...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Question Section */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">
                {question.title}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="text-muted-foreground leading-relaxed" 
                   dangerouslySetInnerHTML={{ __html: question.description }} />
              
              {/* Question metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={question.author?.image} alt={question.author?.name} />
                    <AvatarFallback className="text-xs">
                      {question.author?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span>Asked by {question.author?.name || 'Anonymous'}</span>
                </div>
                <span>•</span>
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{question.views} views</span>
                <span>•</span>
                <span>Score: {question.upvotes - question.downvotes}</span>
              </div>
            </div>

            {/* Submit Answer Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Submit Your Answer</h3>
              
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  content={answer}
                  onChange={setAnswer}
                  placeholder="Write your answer here... Use the toolbar to format your text, add links, images, and more."
                  onImageUpload={uploadImage}
                  className="min-h-[150px]"
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={!answer.trim() || isUploading || isSubmitting || !user}>
                    {isSubmitting ? "Submitting..." : isUploading ? "Uploading..." : "Submit Answer"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Answers Section */}
          <div className="space-y-6">
            <div className="px-6">
              <h2 className="text-xl font-semibold text-foreground">
                Answers {answers && answers.length > 0 && `(${answers.length})`}
              </h2>
            </div>
            
            {!answers ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading answers...</p>
              </div>
            ) : answers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No answers yet. Be the first to answer this question!</p>
              </div>
            ) : (
              <div>
                {answers.map((answerItem) => (
                  <AnswerCard
                    key={answerItem._id}
                    answerItem={answerItem}
                    user={user}
                    question={question}
                    userVotes={userVotes}
                    commentTexts={commentTexts}
                    showCommentForm={showCommentForm}
                    onVote={handleVote}
                    onAcceptAnswer={handleAcceptAnswer}
                    onSubmitComment={handleSubmitComment}
                    onToggleCommentForm={toggleCommentForm}
                    onCommentTextChange={(answerId, text) =>
                      setCommentTexts(prev => ({ ...prev, [answerId]: text }))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}