"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, TrendingUp, Hash, BookOpen } from "lucide-react";

// Mock data for tags
const tagsData = [
  { name: "javascript", count: 2540, description: "A high-level programming language primarily used for web development" },
  { name: "react", count: 1890, description: "A JavaScript library for building user interfaces" },
  { name: "nextjs", count: 1340, description: "A React framework for production applications" },
  { name: "typescript", count: 1180, description: "A strongly typed programming language that builds on JavaScript" },
  { name: "nodejs", count: 950, description: "A JavaScript runtime built on Chrome's V8 JavaScript engine" },
  { name: "python", count: 840, description: "A high-level programming language known for its simplicity" },
  { name: "css", count: 720, description: "A stylesheet language used for describing presentation of documents" },
  { name: "html", count: 680, description: "The standard markup language for creating web pages" },
  { name: "database", count: 590, description: "Systems for storing, retrieving, and managing data" },
  { name: "authentication", count: 480, description: "The process of verifying the identity of users" },
  { name: "api", count: 450, description: "Application Programming Interface for software communication" },
  { name: "mongodb", count: 420, description: "A NoSQL document-oriented database" },
  { name: "postgresql", count: 380, description: "An open-source relational database management system" },
  { name: "rest", count: 350, description: "Representational State Transfer architectural style" },
  { name: "graphql", count: 320, description: "A query language and runtime for APIs" },
  { name: "docker", count: 290, description: "A platform for containerizing applications" },
  { name: "git", count: 280, description: "A distributed version control system" },
  { name: "testing", count: 250, description: "The process of evaluating software functionality" },
  { name: "performance", count: 230, description: "Optimization techniques for better application speed" },
  { name: "security", count: 210, description: "Practices and measures to protect applications" },
  { name: "deployment", count: 200, description: "The process of releasing applications to production" },
  { name: "aws", count: 190, description: "Amazon Web Services cloud computing platform" },
  { name: "redux", count: 180, description: "A predictable state container for JavaScript apps" },
  { name: "express", count: 170, description: "A web application framework for Node.js" },
  { name: "tailwindcss", count: 160, description: "A utility-first CSS framework" },
  { name: "firebase", count: 150, description: "A mobile and web application development platform" },
  { name: "kubernetes", count: 140, description: "An open-source container orchestration platform" },
  { name: "microservices", count: 130, description: "An architectural approach to building applications" },
  { name: "webpack", count: 120, description: "A static module bundler for JavaScript applications" },
  { name: "serverless", count: 110, description: "A cloud computing execution model" }
];

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "name" | "newest">("popular");

  const filteredTags = tagsData
    .filter(tag => 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.count - a.count;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return Math.random() - 0.5; // Mock newest sort
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tags</h1>
        <p className="text-muted-foreground">
          Browse questions by topic. Tags help organize and categorize questions.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Popular
            </Button>
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              onClick={() => setSortBy("name")}
              className="flex items-center gap-2"
            >
              <Hash className="h-4 w-4" />
              Name
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {tagsData.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Tags</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {tagsData.reduce((sum, tag) => sum + tag.count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {Math.max(...tagsData.map(tag => tag.count))}
            </div>
            <div className="text-sm text-muted-foreground">Most Popular</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {filteredTags.length}
            </div>
            <div className="text-sm text-muted-foreground">Showing</div>
          </CardContent>
        </Card>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTags.map((tag) => (
          <Card key={tag.name} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Link href={`/questions/tagged/${tag.name}`}>
                  <Badge variant="secondary" className="text-sm font-medium hover:bg-secondary/80">
                    {tag.name}
                  </Badge>
                </Link>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  <span>{tag.count}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tag.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <Link href={`/questions/tagged/${tag.name}`}>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Questions
                  </Button>
                </Link>
                <span className="text-xs text-muted-foreground">
                  {tag.count} questions
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredTags.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Tags
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No tags found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or browse all available tags.
          </p>
        </div>
      )}
    </div>
  );
} 