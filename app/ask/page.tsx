"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  X, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";

// Popular tags for suggestions
const popularTags = [
  "javascript", "react", "nextjs", "typescript", "nodejs", "python", 
  "css", "html", "database", "mongodb", "postgresql", "authentication",
  "api", "rest", "graphql", "docker", "git", "testing", "performance"
];

export default function AskQuestion() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Question posted successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
        <p className="text-muted-foreground">
          Get help from the community by asking a clear, detailed question.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Question Title
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., How to implement authentication in Next.js?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                  maxLength={200}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Be specific and imagine you're asking a question to another person.
                </p>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Question Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Provide all the details about your question. Include what you've tried, what you expected to happen, and what actually happened."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="min-h-[200px]"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Include any error messages, code snippets, or relevant context.
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Selected Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 hover:text-destructive"
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
                      disabled={tags.length >= 5}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Add up to 5 tags to help others find your question. ({tags.length}/5)
                    </p>
                  </div>

                  {/* Popular Tags */}
                  <div>
                    <p className="text-sm font-medium mb-2">Popular tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.slice(0, 10).map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleTagAdd(tag)}
                          disabled={tags.includes(tag) || tags.length >= 5}
                          className="h-8"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Post Question
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar with Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Be specific</p>
                  <p className="text-xs text-muted-foreground">
                    Include details about your problem and what you've tried.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Include code</p>
                  <p className="text-xs text-muted-foreground">
                    Share relevant code snippets or error messages.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Use proper tags</p>
                  <p className="text-xs text-muted-foreground">
                    Tag your question with relevant technologies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Be respectful and constructive
              </p>
              <p className="text-sm text-muted-foreground">
                • Search before asking
              </p>
              <p className="text-sm text-muted-foreground">
                • One question per post
              </p>
              <p className="text-sm text-muted-foreground">
                • Accept helpful answers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 