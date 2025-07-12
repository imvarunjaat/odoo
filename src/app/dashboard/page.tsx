"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
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

// Mock data for development
const mockQuestions = [
  {
    id: "1",
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine...",
    tags: ["SQL", "Database"],
    author: "User Name",
    answers: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Question.....",
    description: "Descriptions....",
    tags: ["React", "JavaScript"],
    author: "User Name",
    answers: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Question.....",
    description: "Descriptions....",
    tags: ["Python", "Django"],
    author: "User Name",
    answers: 2,
    createdAt: new Date().toISOString(),
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="w-full px-4 py-6">
        <div className="max-w-[775px] mx-auto">
          {/* Controls Bar */}
          <div className="mb-6 space-y-4">
            {/* Ask Question Button and Search */}
            <div className="flex justify-between items-center gap-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ask New Question
              </Button>
              
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
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
          <div className="space-y-4 mb-8">
            {mockQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
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