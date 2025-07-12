"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, TrendingUp, Users, Award, MessageSquare, CheckCircle, Star, Crown } from "lucide-react";

// Counter animation hook
const useCounter = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [end, duration]);
  
  return count;
};

// Component for animated counter
const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1000 }) => {
  const count = useCounter(value, duration);
  return <span>{count.toLocaleString()}</span>;
};

// Component for reputation badge
const ReputationBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-1.5 shadow-lg">
        <Crown className="h-3 w-3" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-300 to-gray-400 text-white rounded-full p-1.5 shadow-lg">
        <Star className="h-3 w-3" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full p-1.5 shadow-lg">
        <Award className="h-3 w-3" />
      </div>
    );
  }
  return null;
};

// Component for user initials avatar
const UserInitials: React.FC<{ name: string; size?: "sm" | "md" | "lg" }> = ({ name, size = "md" }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-16 w-16 text-lg",
    lg: "h-20 w-20 text-xl"
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center font-bold text-primary`}>
      {initials}
    </div>
  );
};

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
    topTags: [
      { name: "react", description: "A JavaScript library for building user interfaces" },
      { name: "javascript", description: "High-level programming language" },
      { name: "nodejs", description: "JavaScript runtime built on Chrome's V8 engine" },
      { name: "typescript", description: "Typed superset of JavaScript" }
    ],
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
    topTags: [
      { name: "aws", description: "Amazon Web Services cloud platform" },
      { name: "docker", description: "Platform for developing, shipping, and running applications" },
      { name: "kubernetes", description: "Container orchestration system" },
      { name: "microservices", description: "Architectural approach to building applications" }
    ],
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
    topTags: [
      { name: "mongodb", description: "NoSQL document database" },
      { name: "postgresql", description: "Open source relational database" },
      { name: "database", description: "Structured collection of data" },
      { name: "performance", description: "System optimization and efficiency" }
    ],
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
    topTags: [
      { name: "css", description: "Cascading Style Sheets for web styling" },
      { name: "html", description: "HyperText Markup Language" },
      { name: "ui/ux", description: "User Interface and User Experience design" },
      { name: "accessibility", description: "Making web content usable for all people" }
    ],
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
    topTags: [
      { name: "react-native", description: "Framework for building native mobile apps" },
      { name: "flutter", description: "Google's UI toolkit for mobile development" },
      { name: "mobile", description: "Mobile application development" },
      { name: "firebase", description: "Google's mobile and web application development platform" }
    ],
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
    topTags: [
      { name: "devops", description: "Development and Operations practices" },
      { name: "ci/cd", description: "Continuous Integration and Deployment" },
      { name: "automation", description: "Automated processes and workflows" },
      { name: "jenkins", description: "Open source automation server" }
    ],
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
    topTags: [
      { name: "python", description: "High-level programming language" },
      { name: "data-science", description: "Extracting insights from data" },
      { name: "machine-learning", description: "AI that learns from data" },
      { name: "pandas", description: "Data manipulation and analysis library" }
    ],
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
    topTags: [
      { name: "vue", description: "Progressive JavaScript framework" },
      { name: "javascript", description: "High-level programming language" },
      { name: "frontend", description: "Client-side web development" },
      { name: "webpack", description: "Module bundler for modern JavaScript applications" }
    ],
    joinedDate: "6 months ago",
    lastActive: "1 week ago"
  }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"reputation" | "newest" | "activity">("reputation");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const usersPerPage = 6;

  const filteredUsers = usersData
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.topTags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the amazing developers in our community. Connect, learn, and grow together.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="glass-container p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, bio, location, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg bg-background/50 border-2 border-primary/20 focus:border-primary/40 rounded-xl"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant={sortBy === "reputation" ? "default" : "outline"}
                  onClick={() => setSortBy("reputation")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  <Award className="h-4 w-4" />
                  Reputation
                </Button>
                <Button
                  variant={sortBy === "activity" ? "default" : "outline"}
                  onClick={() => setSortBy("activity")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  <TrendingUp className="h-4 w-4" />
                  Activity
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-container hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">
                <AnimatedCounter value={usersData.length} duration={800} />
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card className="glass-container hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-2 border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-black text-secondary mb-2">
                <AnimatedCounter value={usersData.reduce((sum, user) => sum + user.reputation, 0)} duration={1200} />
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Total Reputation</div>
            </CardContent>
          </Card>
          <Card className="glass-container hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-2 border-accent/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-black text-accent mb-2">
                <AnimatedCounter value={usersData.reduce((sum, user) => sum + user.answers, 0)} duration={1000} />
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Total Answers</div>
            </CardContent>
          </Card>
          <Card className="glass-container hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">
                <AnimatedCounter value={filteredUsers.length} duration={600} />
              </div>
              <div className="text-sm font-semibold text-muted-foreground">Showing</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedUsers.map((user, index) => {
            const userRank = filteredUsers.findIndex(u => u.id === user.id) + 1;
            return (
              <Card key={user.id} className="glass-container hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl border-2 border-primary/20 overflow-hidden group relative bg-gradient-to-br from-background/80 to-muted/20">
                <ReputationBadge rank={userRank} />
                <CardHeader className="pb-6 p-8">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-20 w-20 ring-4 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="sr-only">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <UserInitials name={user.name} size="lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-xl mb-2 group-hover:text-primary transition-colors">{user.name}</h3>
                      <p className="text-muted-foreground font-medium mb-3">{user.location}</p>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold text-primary">
                          <AnimatedCounter value={user.reputation} duration={1500} />
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">reputation</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-8 pt-0">
                  <p className="text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                    {user.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-primary/10 rounded-xl p-4 hover:bg-primary/20 transition-colors">
                      <div className="text-2xl font-black text-primary mb-1">{user.questions}</div>
                      <div className="text-xs font-semibold text-muted-foreground">Questions</div>
                    </div>
                    <div className="bg-secondary/10 rounded-xl p-4 hover:bg-secondary/20 transition-colors">
                      <div className="text-2xl font-black text-secondary mb-1">{user.answers}</div>
                      <div className="text-xs font-semibold text-muted-foreground">Answers</div>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-4 hover:bg-accent/20 transition-colors">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-2xl font-black text-accent">{user.acceptedAnswers}</span>
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground">Accepted</div>
                    </div>
                  </div>

                  {/* Top Tags */}
                  <div>
                    <p className="text-sm font-bold mb-3 text-foreground">Top Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.topTags.map((tag) => (
                        <div
                          key={tag.name}
                          className="relative"
                          onMouseEnter={() => setHoveredTag(tag.name)}
                          onMouseLeave={() => setHoveredTag(null)}
                        >
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            #{tag.name}
                          </Badge>
                          {hoveredTag === tag.name && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                              {tag.description}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="border-t border-primary/20 pt-4">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Joined {user.joinedDate}</span>
                      <span>Active {user.lastActive}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Link href={`/users/${user.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary">
                        View Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform border-2 border-primary/30 hover:border-primary/60">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform border-2 border-primary/30"
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-12 h-12 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform border-2 border-primary/30"
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="glass-container p-12 rounded-2xl max-w-md mx-auto">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-black mb-4 text-foreground">No users found</h3>
              <p className="text-muted-foreground font-medium">
                Try adjusting your search terms or browse all community members.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 