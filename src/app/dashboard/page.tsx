"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button-component";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type FilterType = "newest" | "unanswered" | "popular" | "trending";

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

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
      <div className="container mx-auto px-4 py-6">
        {/* Controls Bar */}
        <div className="mb-6 space-y-4">
          {/* Ask Question Button */}
          <div className="flex justify-start">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ask New Question
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Button
                variant={activeFilter === "newest" ? "default" : "outline"}
                onClick={() => handleFilterChange("newest")}
                className="text-sm"
              >
                Newest
              </Button>
              <Button
                variant={activeFilter === "unanswered" ? "default" : "outline"}
                onClick={() => handleFilterChange("unanswered")}
                className="text-sm"
              >
                Unanswered
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-sm">
                    More
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleFilterChange("popular")}>
                    Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange("trending")}>
                    Trending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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
        </div>

        {/* Questions List */}
        <div className="space-y-4 mb-8">
          {mockQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>

        {/* Pagination */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={7}
        />
      </div>
    </div>
  );
}