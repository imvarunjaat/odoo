"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useQuestions } from "@/lib/contexts/questions-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Plus
} from "lucide-react";

const stats = {
  totalQuestions: 15420,
  totalAnswers: 48920,
  totalUsers: 3240,
  questionsToday: 45
};

export default function Home() {
  const [filter, setFilter] = useState("latest");
  const { questions, voteQuestion } = useQuestions();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const getFilteredQuestions = () => {
    switch (filter) {
      case "popular":
        return [...questions].sort((a, b) => b.votes - a.votes);
      case "unanswered":
        return questions.filter(q => q.answers === 0);
      case "latest":
      default:
        return questions;
    }
  };

  const handleVote = (questionId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    voteQuestion(questionId, voteType);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Stack
              </span>
              <span className="text-white">It</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-2xl font-light text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            The premier Q&A community for developers
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Ask questions, share knowledge, and build amazing things together with thousands of developers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {isAuthenticated ? (
              <Link href="/ask">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group">
                  <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Ask Your First Question
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group">
                  <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Join StackIt
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg" className="border-2 border-gray-600 hover:border-orange-500 hover:bg-orange-500/10 text-gray-300 hover:text-white px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300">
              <BookOpen className="h-5 w-5 mr-3" />
              Browse Questions
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="glass-card p-8 rounded-2xl hover-lift text-center">
            <div className="mb-4">
              <div className="inline-flex p-4 bg-orange-500/20 rounded-2xl mb-4">
                <BookOpen className="h-8 w-8 text-orange-400" />
              </div>
              <div className="text-4xl font-black text-white mb-2">{stats.totalQuestions.toLocaleString()}</div>
              <div className="text-gray-400 font-medium uppercase tracking-wide text-sm">Questions</div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-2xl hover-lift text-center">
            <div className="mb-4">
              <div className="inline-flex p-4 bg-blue-500/20 rounded-2xl mb-4">
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-4xl font-black text-white mb-2">{stats.totalAnswers.toLocaleString()}</div>
              <div className="text-gray-400 font-medium uppercase tracking-wide text-sm">Answers</div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-2xl hover-lift text-center">
            <div className="mb-4">
              <div className="inline-flex p-4 bg-green-500/20 rounded-2xl mb-4">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-4xl font-black text-white mb-2">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-gray-400 font-medium uppercase tracking-wide text-sm">Users</div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-2xl hover-lift text-center">
            <div className="mb-4">
              <div className="inline-flex p-4 bg-purple-500/20 rounded-2xl mb-4">
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <div className="text-4xl font-black text-white mb-2">{stats.questionsToday}</div>
              <div className="text-gray-400 font-medium uppercase tracking-wide text-sm">Today</div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === "latest" 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setFilter("latest")}
          >
            <Clock className="h-4 w-4 mr-2 inline" />
            Latest
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === "popular" 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setFilter("popular")}
          >
            <TrendingUp className="h-4 w-4 mr-2 inline" />
            Popular
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === "unanswered" 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setFilter("unanswered")}
          >
            <MessageSquare className="h-4 w-4 mr-2 inline" />
            Unanswered
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {getFilteredQuestions().map((question) => (
            <div key={question.id} className="glass-card p-8 rounded-2xl hover-lift group">
              <div className="flex items-start gap-6">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                  <button
                    onClick={() => handleVote(question.id, 'up')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      question.userVote === 'up' 
                        ? 'bg-orange-500/20 text-orange-400' 
                        : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                    }`}
                    title={isAuthenticated ? "Upvote" : "Login to vote"}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                  <span className={`text-lg font-bold ${
                    question.votes > 0 ? 'text-green-400' : 
                    question.votes < 0 ? 'text-red-400' : 'text-gray-300'
                  }`}>
                    {question.votes}
                  </span>
                  <button
                    onClick={() => handleVote(question.id, 'down')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      question.userVote === 'down' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                    }`}
                    title={isAuthenticated ? "Downvote" : "Login to vote"}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </button>
                </div>

                {/* Question Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <Link href={`/questions/${question.id}`} className="block">
                        <h3 className="text-2xl font-bold text-white hover:text-orange-400 transition-colors line-clamp-2 group-hover:text-orange-400 mb-3">
                          {question.title}
                          {question.hasAcceptedAnswer && (
                            <CheckCircle className="inline h-6 w-6 text-green-400 ml-3" />
                          )}
                        </h3>
                      </Link>
                      <p className="text-gray-300 text-base leading-relaxed line-clamp-2">
                        {question.content}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {question.tags.map((tag) => (
                      <span key={tag} className="bg-gray-800 text-green-400 border border-green-400/30 hover:bg-green-400/10 transition-colors px-4 py-2 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Bottom Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8 text-gray-400">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">{question.answers}</span>
                        <span className="text-sm">answers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        <span className="font-medium">{question.views}</span>
                        <span className="text-sm">views</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={question.author.avatar} alt={question.author.name} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-bold">
                            {getInitials(question.author.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold text-white">{question.author.name}</div>
                          <div className="text-xs text-gray-400">{question.author.reputation} reputation</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {question.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredQuestions().length === 0 && (
          <div className="text-center py-20">
            <div className="glass-card p-12 rounded-2xl inline-block">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No questions found</h3>
              <p className="text-gray-400 mb-6">
                {filter === "unanswered" 
                  ? "All questions have been answered!" 
                  : "Be the first to ask a question!"}
              </p>
              {isAuthenticated && (
                <Link href="/ask">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
