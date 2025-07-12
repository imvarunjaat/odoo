"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useQuestions } from "@/lib/contexts/questions-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { toast } from "sonner";
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  Share,
  Bookmark,
  Flag,
  MoreHorizontal,
  User,
  Calendar,
  ArrowLeft,
  Send,
  Edit3
} from "lucide-react";

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    getQuestionById, 
    getAnswersByQuestionId, 
    incrementViews,
    voteQuestion,
    voteAnswer,
    acceptAnswer,
    addAnswer,
    addComment
  } = useQuestions();
  const { user, isAuthenticated } = useAuth();
  
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentingOnAnswer, setCommentingOnAnswer] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const questionId = params.id as string;
  const question = getQuestionById(questionId);
  const answers = getAnswersByQuestionId(questionId);

  useEffect(() => {
    if (question) {
      incrementViews(questionId);
    }
  }, [question, questionId, incrementViews]);

  if (!question) {
  return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Question Not Found</h2>
          <p className="text-gray-400 mb-6">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const handleVoteQuestion = (voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    voteQuestion(questionId, voteType);
  };

  const handleVoteAnswer = (answerId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    voteAnswer(answerId, voteType);
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Only question author can accept answers
    if (user?.id !== question.author.id) {
      toast.error("Only the question author can accept answers");
      return;
    }
    
    acceptAnswer(answerId);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!newAnswer.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    setIsSubmittingAnswer(true);
    
    try {
      addAnswer({
        questionId,
        content: newAnswer.trim(),
    author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          reputation: user.reputation
        }
      });
      
      setNewAnswer("");
      toast.success("Answer posted successfully!");
    } catch (error) {
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, answerId: string) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter your comment");
      return;
    }

    setIsSubmittingComment(true);
    
    try {
      addComment({
        answerId,
        content: newComment.trim(),
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          reputation: user.reputation
        }
      });
      
      setNewComment("");
      setCommentingOnAnswer(null);
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </button>
        </div>

          {/* Question */}
        <Card className="glass-card border-gray-700/50 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              {/* Vote Section */}
              <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                <button
                  onClick={() => handleVoteQuestion('up')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    question.userVote === 'up' 
                      ? 'bg-orange-500/20 text-orange-400' 
                      : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                  title={isAuthenticated ? "Upvote" : "Login to vote"}
                >
                  <ArrowUp className="h-6 w-6" />
                </button>
                <span className={`text-2xl font-bold ${
                  question.votes > 0 ? 'text-green-400' : 
                  question.votes < 0 ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {question.votes}
                </span>
                <button
                  onClick={() => handleVoteQuestion('down')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    question.userVote === 'down' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                  title={isAuthenticated ? "Downvote" : "Login to vote"}
                >
                  <ArrowDown className="h-6 w-6" />
                </button>
                </div>

                {/* Question Content */}
                <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-black text-white">
                    {question.title}
                    {question.hasAcceptedAnswer && (
                      <CheckCircle className="inline h-8 w-8 text-green-400 ml-3" />
                    )}
                  </h1>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Asked {question.createdAt}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {question.views} views
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {question.answers} answers
                  </span>
                </div>

                <div className="prose prose-invert max-w-none mb-6">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {question.content}
                  </div>
                  </div>
                  
                  {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-gray-800 text-green-400 border-green-400/30 hover:bg-green-400/10 px-3 py-1"
                    >
                      #{tag}
                      </Badge>
                    ))}
                  </div>

                {/* Author Info */}
                                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-orange-500/30">
                        <AvatarImage src={question.author.avatar} alt={question.author.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-sm">
                          {getInitials(question.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-white">{question.author.name}</div>
                        <div className="text-xs text-gray-400">{question.author.reputation} reputation</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
          </div>
            
          {/* Answers List */}
          <div className="space-y-6">
            {answers.map((answer) => (
              <Card key={answer.id} className={`glass-card border-gray-700/50 ${
                answer.isAccepted ? 'border-green-500/50 bg-green-500/5' : ''
              }`}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                      <button
                        onClick={() => handleVoteAnswer(answer.id, 'up')}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          answer.userVote === 'up' 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                        }`}
                        title={isAuthenticated ? "Upvote" : "Login to vote"}
                      >
                        <ArrowUp className="h-5 w-5" />
                      </button>
                      <span className={`text-lg font-bold ${
                        answer.votes > 0 ? 'text-green-400' : 
                        answer.votes < 0 ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        {answer.votes}
                      </span>
                      <button
                        onClick={() => handleVoteAnswer(answer.id, 'down')}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          answer.userVote === 'down' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                        }`}
                        title={isAuthenticated ? "Downvote" : "Login to vote"}
                      >
                        <ArrowDown className="h-5 w-5" />
                      </button>
                      
                      {/* Accept Button */}
                      {isAuthenticated && user?.id === question.author.id && (
                        <button
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className={`p-2 rounded-lg transition-all duration-300 mt-2 ${
                            answer.isAccepted 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'hover:bg-gray-700/50 text-gray-400 hover:text-green-400'
                          }`}
                          title={answer.isAccepted ? "Unaccept answer" : "Accept answer"}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      {answer.isAccepted && (
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-sm font-semibold text-green-400">Accepted Answer</span>
                        </div>
                      )}
                      
                      <div className="prose prose-invert max-w-none mb-6">
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {answer.content}
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-blue-500/30">
                            <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs">
                              {getInitials(answer.author.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold text-white">{answer.author.name}</div>
                            <div className="text-xs text-gray-400">{answer.author.reputation} reputation</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>answered {answer.createdAt}</span>
                        </div>
                      </div>

                      {/* Comments */}
                      {answer.comments.length > 0 && (
                        <div className="border-t border-gray-700/50 pt-4">
                          <div className="space-y-3">
                                                      {answer.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-3 text-sm">
                                <Avatar className="h-6 w-6 border border-gray-500/30 flex-shrink-0">
                                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white text-xs">
                                    {getInitials(comment.author.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <span className="text-gray-300">{comment.content}</span>
                                  <span className="text-gray-500 ml-2">
                                    – {comment.author.name} {comment.createdAt}
                                  </span>
                                </div>
                              </div>
                            ))}
                            </div>
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="mt-4">
                        {commentingOnAnswer === answer.id ? (
                          <form onSubmit={(e) => handleSubmitComment(e, answer.id)} className="flex gap-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                              disabled={isSubmittingComment}
                            />
                            <Button 
                              type="submit" 
                              size="sm" 
                              disabled={isSubmittingComment}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              {isSubmittingComment ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setCommentingOnAnswer(null);
                                setNewComment("");
                              }}
                            >
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                router.push('/login');
                                return;
                              }
                              setCommentingOnAnswer(answer.id);
                            }}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            Add a comment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>

          {/* Answer Form */}
        {isAuthenticated ? (
          <Card className="glass-card border-gray-700/50">
            <CardHeader>
              <h3 className="text-xl font-black text-white">Your Answer</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="min-h-[200px] bg-gray-800 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/50"
                  rows={8}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmittingAnswer}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-xl"
                  >
                    {isSubmittingAnswer ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                    Post Answer
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card border-gray-700/50">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Want to Answer?</h3>
              <p className="text-gray-400 mb-6">
                Sign in to post your answer and help the community.
              </p>
              <Button 
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold"
              >
                Sign In to Answer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 