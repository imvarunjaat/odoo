"use client";

import { useState, useId } from "react";
import { ArrowRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button-component";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { QuestionCard } from "@/components/question-card";
import PaginationComponent from "@/components/pagination";
import Navbar from "@/components/navbar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const searchId = useId();

  // Fetch questions from Convex
  const questionsData = useQuery(api.questions.getQuestions, {
    limit: 20,
    offset: (currentPage - 1) * 20,
  });

  // Transform Convex data to match QuestionCard format
  const questions = questionsData?.questions?.map((q) => ({
    id: q._id,
    title: q.title,
    description: q.description,
    tags: q.tags,
    author: q.author?.name || "Anonymous",
    answers: q.answerCount || 0,
    score: q.upvotes - q.downvotes,
    createdAt: new Date(q.createdAt).toISOString(),
  })) || [];

  const isLoading = questionsData === undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="w-full flex-1 flex justify-center">
        <div className="max-w-[775px] w-full border-l border-r border-border">
          {/* Controls Bar */}
          <div className="mb-6 space-y-4 px-4 pt-6">
            {/* Ask Question Button and Search */}
            <div className="flex justify-between items-center gap-4">
              <Button asChild size="sm">
                <a href="/ask-question">
                  <Plus className="mr-2 h-4 w-4" />
                  Ask New Question
                </a>
              </Button>
              
              {/* Search */}
              <form onSubmit={handleSearch} className="w-72">
                <div className="relative">
                  <Input
                    id={searchId}
                    className="peer ps-9 pe-9 h-9"
                    placeholder="Search..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Search size={16} />
                  </div>
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Submit search"
                    type="submit"
                  >
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>

            {/* Tabs */}
            <div className="relative">
              <div className="flex justify-start">
                <Tabs defaultValue="newest" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="relative h-auto w-auto gap-0.5 bg-transparent p-0">
                    <TabsTrigger
                      value="newest"
                      className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      Newest
                    </TabsTrigger>
                    <TabsTrigger
                      value="unanswered"
                      className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      Unanswered
                    </TabsTrigger>
                    <TabsTrigger
                      value="popular"
                      className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      Popular
                    </TabsTrigger>
                    <TabsTrigger
                      value="trending"
                      className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      Trending
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
            </div>
          </div>

          {/* Questions List */}
          <div className="mb-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-muted-foreground">Loading questions...</div>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-4">No questions found</div>
                <Button asChild size="sm">
                  <a href="/ask-question">
                    <Plus className="mr-2 h-4 w-4" />
                    Ask the First Question
                  </a>
                </Button>
              </div>
            ) : (
              questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={7}
          />
        </div>
      </div>
    </div>
  );
}