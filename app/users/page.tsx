"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, TrendingUp, Users, Award, MessageSquare, CheckCircle } from "lucide-react";

// Mock data for users
const usersData = [
  {
    id: 1,
    name: "Priya Patel",
    avatar: "/placeholder-avatar.jpg",
    reputation: 8950,
    questions: 45,
    answers: 178,
    acceptedAnswers: 142,
    location: "Mumbai, India",
    bio: "Full-stack developer passionate about React and Node.js. Love helping fellow developers!",
    topTags: ["react", "javascript", "nodejs", "typescript"],
    joinedDate: "3 years ago",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Arjun Singh",
    avatar: "/placeholder-avatar.jpg",
    reputation: 7200,
    questions: 32,
    answers: 156,
    acceptedAnswers: 98,
    location: "Bangalore, India",
    bio: "Senior Software Engineer specializing in cloud architecture and microservices.",
    topTags: ["aws", "docker", "kubernetes", "microservices"],
    joinedDate: "2 years ago",
    lastActive: "1 hour ago"
  },
  {
    id: 3,
    name: "Kiran Kumar",
    avatar: "/placeholder-avatar.jpg",
    reputation: 6100,
    questions: 28,
    answers: 134,
    acceptedAnswers: 89,
    location: "Hyderabad, India",
    bio: "Database architect and performance optimization expert. MongoDB and PostgreSQL enthusiast.",
    topTags: ["mongodb", "postgresql", "database", "performance"],
    joinedDate: "2 years ago",
    lastActive: "30 minutes ago"
  },
  {
    id: 4,
    name: "Sneha Reddy",
    avatar: "/placeholder-avatar.jpg",
    reputation: 5800,
    questions: 56,
    answers: 89,
    acceptedAnswers: 67,
    location: "Chennai, India",
    bio: "UI/UX Developer with a passion for creating beautiful and accessible web experiences.",
    topTags: ["css", "html", "ui/ux", "accessibility"],
    joinedDate: "1 year ago",
    lastActive: "5 minutes ago"
  },
  {
    id: 5,
    name: "Rahul Sharma",
    avatar: "/placeholder-avatar.jpg",
    reputation: 4500,
    questions: 67,
    answers: 78,
    acceptedAnswers: 45,
    location: "Delhi, India",
    bio: "Mobile app developer working with React Native and Flutter. Always learning new technologies.",
    topTags: ["react-native", "flutter", "mobile", "firebase"],
    joinedDate: "1 year ago",
    lastActive: "1 day ago"
  },
  {
    id: 6,
    name: "Meera Shah",
    avatar: "/placeholder-avatar.jpg",
    reputation: 3900,
    questions: 23,
    answers: 112,
    acceptedAnswers: 78,
    location: "Pune, India",
    bio: "DevOps engineer passionate about automation and CI/CD pipelines.",
    topTags: ["devops", "ci/cd", "automation", "jenkins"],
    joinedDate: "1 year ago",
    lastActive: "3 hours ago"
  },
  {
    id: 7,
    name: "Vikram Joshi",
    avatar: "/placeholder-avatar.jpg",
    reputation: 3200,
    questions: 34,
    answers: 67,
    acceptedAnswers: 43,
    location: "Jaipur, India",
    bio: "Python developer with expertise in data science and machine learning.",
    topTags: ["python", "data-science", "machine-learning", "pandas"],
    joinedDate: "8 months ago",
    lastActive: "2 days ago"
  },
  {
    id: 8,
    name: "Anjali Gupta",
    avatar: "/placeholder-avatar.jpg",
    reputation: 2800,
    questions: 45,
    answers: 56,
    acceptedAnswers: 34,
    location: "Kolkata, India",
    bio: "Frontend developer specializing in modern JavaScript frameworks and libraries.",
    topTags: ["vue", "javascript", "frontend", "webpack"],
    joinedDate: "6 months ago",
    lastActive: "1 week ago"
  }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"reputation" | "newest" | "activity">("reputation");

  const filteredUsers = usersData
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.topTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "reputation":
          return b.reputation - a.reputation;
        case "newest":
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case "activity":
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-muted-foreground">
          Meet the amazing developers in our community. Connect, learn, and grow together.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name, bio, location, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "reputation" ? "default" : "outline"}
              onClick={() => setSortBy("reputation")}
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Reputation
            </Button>
            <Button
              variant={sortBy === "activity" ? "default" : "outline"}
              onClick={() => setSortBy("activity")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {usersData.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {usersData.reduce((sum, user) => sum + user.reputation, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Reputation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {usersData.reduce((sum, user) => sum + user.answers, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Answers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {filteredUsers.length}
            </div>
            <div className="text-sm text-muted-foreground">Showing</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {user.reputation.toLocaleString()} reputation
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">{user.questions}</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-secondary">{user.answers}</div>
                  <div className="text-xs text-muted-foreground">Answers</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span className="text-lg font-bold text-accent">{user.acceptedAnswers}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Accepted</div>
                </div>
              </div>

              {/* Top Tags */}
              <div>
                <p className="text-sm font-medium mb-2">Top Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {user.topTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Joined {user.joinedDate}</span>
                  <span>Active {user.lastActive}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/users/${user.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredUsers.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Users
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or browse all community members.
          </p>
        </div>
      )}
    </div>
  );
} 