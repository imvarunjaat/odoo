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

// Mock data for the question
const mockQuestion = {
  id: "1",
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine...",
  tags: ["SQL", "Database"],
  author: "User Name",
  score: 42,
  createdAt: new Date().toISOString(),
};

const mockAnswers = [
  {
    id: "1",
    content: "The || Operator.\nThe + Operator.\nThe CONCAT Function.",
    author: "Expert User",
    score: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2", 
    content: "Details",
    author: "Another User",
    score: 8,
    createdAt: new Date().toISOString(),
  },
];

export default function QuestionDetail({ params }: { params: { id: string } }) {
  const [answer, setAnswer] = useState("");
  const { uploadImage, isUploading } = useImageUpload();

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting answer:", answer);
    setAnswer("");
  };

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
                  <BreadcrumbPage>{mockQuestion.title.substring(0, 30)}...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Question Section */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">
                {mockQuestion.title}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                {mockQuestion.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {mockQuestion.description}
              </p>
            </div>

            {/* Answers Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Answers</h2>
              
              {mockAnswers.map((answer, index) => (
                <div key={answer.id} className="border-b border-border pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2 pt-2">
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <ChevronUp size={20} className="text-muted-foreground hover:text-foreground" />
                      </button>
                      <span className="text-lg font-semibold text-foreground min-w-[2rem] text-center">
                        {answer.score}
                      </span>
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <ChevronDown size={20} className="text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Answer {index + 1}</span>
                      </div>
                      
                      <div className="text-foreground whitespace-pre-line">
                        {answer.content}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="" alt={answer.author} />
                          <AvatarFallback className="text-xs">
                            {answer.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{answer.author}</span>
                        <span>•</span>
                        <span>answered recently</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

          </div>
        </div>
      </div>
    </div>
  );
}