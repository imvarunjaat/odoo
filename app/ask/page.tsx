"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuestions } from "@/lib/contexts/questions-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { toast } from "sonner";
import { 
  X, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowLeft
} from "lucide-react";

// Popular tags for suggestions
const popularTags = [
  "javascript", "react", "nextjs", "typescript", "nodejs", "python", 
  "css", "html", "database", "mongodb", "postgresql", "authentication",
  "api", "rest", "graphql", "docker", "git", "testing", "performance"
];

export default function AskQuestion() {
  const router = useRouter();
  const { addQuestion } = useQuestions();
  const { user, isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleTagAdd = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < 5) {
      setTags([...tags, normalizedTag]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        handleTagAdd(tagInput);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title for your question");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please provide details about your question");
      return;
    }

    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    setIsSubmitting(true);

    try {
      const questionId = addQuestion({
        title: title.trim(),
        content: content.trim(),
        tags,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          reputation: user.reputation
        }
      });
      
      // Redirect to the newly created question
      router.push(`/questions/${questionId}`);
    } catch (error) {
      toast.error("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Ask a Question</h1>
          <p className="text-gray-400">
            Get help from the community by asking a clear, detailed question.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Card className="glass-card border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <HelpCircle className="h-5 w-5" />
                    Question Title
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g., How to implement authentication in Next.js?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg bg-gray-800 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/50"
                    maxLength={200}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Be specific and imagine you're asking a question to another person.
                  </p>
                </CardContent>
              </Card>

              {/* Content */}
              <Card className="glass-card border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="h-5 w-5" />
                    What's your question?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe your problem in detail. Include any code, error messages, or specific requirements..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] bg-gray-800 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/50"
                    rows={10}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Include all relevant details and what you've already tried.
                  </p>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="glass-card border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Plus className="h-5 w-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Current Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-gray-800 text-green-400 border-green-400/30 hover:bg-green-400/10 px-3 py-1"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Tag Input */}
                    <div>
                      <Input
                        placeholder="Add tags (press Enter or comma to add)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="bg-gray-800 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/50"
                        disabled={tags.length >= 5}
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Add up to 5 tags to describe your question ({tags.length}/5)
                      </p>
                    </div>

                    {/* Popular Tags */}
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Popular tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.filter(tag => !tags.includes(tag)).slice(0, 10).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagAdd(tag)}
                            className="text-xs bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                            disabled={tags.length >= 5}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Question
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Tips */}
              <Card className="glass-card border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="h-5 w-5 text-orange-400" />
                    Writing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Be specific and descriptive in your title</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Include relevant code snippets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Add error messages if applicable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Use proper tags for better visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Explain what you've already tried</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card className="glass-card border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Be respectful and constructive</li>
                    <li>• Search before asking</li>
                    <li>• One question per post</li>
                    <li>• Use clear, proper grammar</li>
                    <li>• Accept helpful answers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 