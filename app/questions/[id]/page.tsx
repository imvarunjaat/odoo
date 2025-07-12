"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  Share,
  Bookmark,
  Flag,
  MoreHorizontal,
  User,
  Calendar
} from "lucide-react";

// Mock data for demonstration
const questionData = {
  id: 1,
  title: "How to implement authentication in Next.js 15 with App Router?",
  content: `I'm trying to implement authentication in my Next.js 15 application using the new App Router. I want to create protected routes and manage user sessions properly.

Here's what I've tried so far:

\`\`\`javascript
// app/login/page.tsx
export default function LoginPage() {
  const handleLogin = async (email, password) => {
    // How do I handle authentication here?
  };
  
  return (
    <form onSubmit={handleLogin}>
      {/* Login form */}
    </form>
  );
}
\`\`\`

What's the best approach for:
1. Handling user authentication
2. Creating protected routes
3. Managing user sessions
4. Redirecting users after login/logout

I've looked at NextAuth.js but I'm not sure if it's the best choice for the new App Router. Any recommendations?`,
  tags: ["nextjs", "authentication", "app-router", "react"],
  author: {
    name: "Rahul Sharma",
    avatar: "/placeholder-avatar.jpg",
    reputation: 2450,
    joined: "2 years ago"
  },
  votes: 42,
  views: 1250,
  createdAt: "2 hours ago",
  hasAcceptedAnswer: true
};

const answers = [
  {
    id: 1,
    content: `Great question! For Next.js 15 with App Router, I recommend using NextAuth.js v5 (Auth.js). Here's a complete setup:

## Installation

\`\`\`bash
npm install next-auth@beta
\`\`\`

## Configuration

Create \`auth.ts\` in your project root:

\`\`\`typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
\`\`\`

## Protected Routes

Create a middleware.ts file:

\`\`\`typescript
import { auth } from "./auth"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
\`\`\`

This approach works perfectly with the App Router and provides excellent TypeScript support.`,
    author: {
      name: "Priya Patel",
      avatar: "/placeholder-avatar.jpg",
      reputation: 8950,
      joined: "3 years ago"
    },
    votes: 28,
    createdAt: "1 hour ago",
    isAccepted: true,
    comments: [
      {
        id: 1,
        content: "This is exactly what I was looking for! The middleware approach is clean.",
        author: {
          name: "Rahul Sharma",
          avatar: "/placeholder-avatar.jpg"
        },
        createdAt: "45 minutes ago"
      },
      {
        id: 2,
        content: "Does this work with database sessions as well?",
        author: {
          name: "Kiran Kumar",
          avatar: "/placeholder-avatar.jpg"
        },
        createdAt: "30 minutes ago"
      }
    ]
  },
  {
    id: 2,
    content: `Another approach is to use Clerk, which provides excellent Next.js 15 support:

\`\`\`bash
npm install @clerk/nextjs
\`\`\`

Then wrap your app with ClerkProvider:

\`\`\`typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
\`\`\`

For protected routes, you can use the \`auth()\` helper:

\`\`\`typescript
import { auth } from "@clerk/nextjs/server"

export default function ProtectedPage() {
  const { userId } = auth()
  
  if (!userId) {
    return <div>Please sign in</div>
  }
  
  return <div>Protected content</div>
}
\`\`\`

Clerk handles all the complexity for you and has great documentation.`,
    author: {
      name: "Arjun Singh",
      avatar: "/placeholder-avatar.jpg",
      reputation: 5200,
      joined: "1 year ago"
    },
    votes: 15,
    createdAt: "45 minutes ago",
    isAccepted: false,
    comments: []
  }
];

export default function QuestionDetail() {
  const params = useParams();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [votes, setVotes] = useState(questionData.votes);
  const [newAnswer, setNewAnswer] = useState("");
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(prev => prev + (type === 'up' ? -1 : 1));
    } else {
      const prevVote = userVote;
      setUserVote(type);
      
      if (prevVote === null) {
        setVotes(prev => prev + (type === 'up' ? 1 : -1));
      } else {
        setVotes(prev => prev + (type === 'up' ? 2 : -2));
      }
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    
    toast.success("Answer posted successfully!");
    setNewAnswer("");
  };

  const toggleComments = (answerId: number) => {
    setShowComments(prev => ({
      ...prev,
      [answerId]: !prev[answerId]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Question */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                {/* Voting */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote('up')}
                    className={`p-2 ${userVote === 'up' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-bold">{votes}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote('down')}
                    className={`p-2 ${userVote === 'down' ? 'bg-destructive text-destructive-foreground' : ''}`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Question Content */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-4">{questionData.title}</h1>
                  <div className="prose max-w-none mb-4">
                    <pre className="whitespace-pre-wrap text-sm">{questionData.content}</pre>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {questionData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Question Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{questionData.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>asked {questionData.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={questionData.author.avatar} alt={questionData.author.name} />
                        <AvatarFallback>{questionData.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{questionData.author.name}</div>
                        <div className="text-muted-foreground">{questionData.author.reputation} reputation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Answers */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>
            
            {answers.map((answer) => (
              <Card key={answer.id} className={answer.isAccepted ? 'border-secondary' : ''}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="outline" size="sm" className="p-2">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-bold">{answer.votes}</span>
                      <Button variant="outline" size="sm" className="p-2">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      {answer.isAccepted && (
                        <CheckCircle className="h-5 w-5 text-secondary" />
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      {answer.isAccepted && (
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-secondary" />
                          <span className="text-sm text-secondary font-medium">Accepted Answer</span>
                        </div>
                      )}
                      
                      <div className="prose max-w-none mb-4">
                        <pre className="whitespace-pre-wrap text-sm">{answer.content}</pre>
                      </div>

                      {/* Answer Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(answer.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {answer.comments.length} comments
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                            <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <div className="font-medium">{answer.author.name}</div>
                            <div className="text-muted-foreground">{answer.createdAt}</div>
                          </div>
                        </div>
                      </div>

                      {/* Comments */}
                      {showComments[answer.id] && answer.comments.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-muted space-y-2">
                          {answer.comments.map((comment) => (
                            <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                              <p className="text-sm">{comment.content}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{comment.author.name}</span>
                                <span>•</span>
                                <span>{comment.createdAt}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Answer Form */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Your Answer</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <Textarea
                  placeholder="Write your answer here..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={8}
                  className="min-h-[200px]"
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={!newAnswer.trim()}>
                    Post Answer
                  </Button>
                  <Button type="button" variant="outline">
                    Preview
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Question Stats */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Question Stats</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Asked {questionData.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Viewed {questionData.views} times</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{votes} votes</span>
              </div>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Asked by</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={questionData.author.avatar} alt={questionData.author.name} />
                  <AvatarFallback>{questionData.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{questionData.author.name}</div>
                  <div className="text-sm text-muted-foreground">{questionData.author.reputation} reputation</div>
                  <div className="text-xs text-muted-foreground">Joined {questionData.author.joined}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Questions */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Related Questions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a href="#" className="block text-sm hover:text-primary">
                  How to handle protected routes in Next.js 13?
                </a>
                <a href="#" className="block text-sm hover:text-primary">
                  NextAuth.js vs Clerk for authentication
                </a>
                <a href="#" className="block text-sm hover:text-primary">
                  Best practices for session management
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 