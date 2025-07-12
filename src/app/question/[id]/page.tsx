"use client";

import { useState } from "react";
import { HomeIcon, ChevronUp, ChevronDown } from "lucide-react";
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
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function QuestionDetail({ params }: { params: { id: string } }) {
  const [answer, setAnswer] = useState("");
  const { uploadImage, isUploading } = useImageUpload();

  // Fetch question data from Convex
  const question = useQuery(api.questions.getQuestionById, {
    questionId: params.id as Id<"questions">,
  });

  const isLoading = question === undefined;

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting answer:", answer);
    setAnswer("");
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
                  <Button type="submit" disabled={!answer.trim() || isUploading}>
                    {isUploading ? "Uploading..." : "Submit Answer"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Answers Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Answers</h2>
              
              {/* Placeholder for answers - will be implemented later */}
              <div className="text-center py-8 text-muted-foreground">
                <p>No answers yet. Be the first to answer this question!</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}