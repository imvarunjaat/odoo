"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, withAuth } from "@/lib/contexts/auth-context";
import { 
  Plus, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Clock, 
  LogOut,
  Settings,
  Edit3,
  BookOpen,
  Users,
  CheckCircle,
  Calendar,
  MapPin,
  Mail
} from "lucide-react";

function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "question",
      title: "How to implement authentication in Next.js 15?",
      action: "asked",
      time: "2 hours ago",
      votes: 12,
      answers: 3
    },
    {
      id: 2,
      type: "answer",
      title: "Best practices for React state management",
      action: "answered",
      time: "1 day ago",
      votes: 8,
      accepted: true
    },
    {
      id: 3,
      type: "comment",
      title: "TypeScript generic constraints",
      action: "commented on",
      time: "2 days ago",
      votes: 5,
      answers: 0
    }
  ];

  // Mock badges/achievements
  const badges = [
    { name: "Popular Question", description: "Question with 100+ views", earned: "2 days ago" },
    { name: "Good Answer", description: "Answer with 25+ upvotes", earned: "1 week ago" },
    { name: "Active Member", description: "30 days of activity", earned: "1 month ago" }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const acceptanceRate = user.answers > 0 ? Math.round((user.acceptedAnswers / user.answers) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-400">
              Here's your StackIt dashboard overview
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-600 text-gray-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="glass-card border-gray-700/50">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-orange-500/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-black">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 h-6 w-6 rounded-full border-2 border-background"></div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-black text-white mb-2">
                  {user.name}
                </CardTitle>
                <div className="flex items-center justify-center text-gray-400 text-sm mb-2">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
                {user.location && (
                  <div className="flex items-center justify-center text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {user.location}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-orange-400 mb-1">
                    {user.reputation.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Reputation</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{user.questions}</div>
                    <div className="text-xs text-gray-400">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{user.answers}</div>
                    <div className="text-xs text-gray-400">Answers</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Answer Accept Rate</span>
                    <span className="text-white font-semibold">{acceptanceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${acceptanceRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>Member since</span>
                  <span>{user.joinedDate}</span>
                </div>

                {user.bio && (
                  <div className="text-sm text-gray-300 text-center">
                    {user.bio}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white font-black">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/ask">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                </Link>
                <Link href="/questions">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Questions
                  </Button>
                </Link>
                <Link href="/users">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Users className="h-4 w-4 mr-2" />
                    View Community
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white font-black">Recent Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex-shrink-0">
                        <Award className="h-5 w-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{badge.name}</div>
                        <div className="text-xs text-gray-400">{badge.description}</div>
                      </div>
                      <div className="text-xs text-gray-500">{badge.earned}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card border-gray-700/50 p-6 text-center">
                <div className="mb-3">
                  <div className="inline-flex p-3 bg-orange-500/20 rounded-2xl mb-2">
                    <BookOpen className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{user.questions}</div>
                  <div className="text-sm text-gray-400">Questions</div>
                </div>
              </Card>
              <Card className="glass-card border-gray-700/50 p-6 text-center">
                <div className="mb-3">
                  <div className="inline-flex p-3 bg-blue-500/20 rounded-2xl mb-2">
                    <MessageSquare className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{user.answers}</div>
                  <div className="text-sm text-gray-400">Answers</div>
                </div>
              </Card>
              <Card className="glass-card border-gray-700/50 p-6 text-center">
                <div className="mb-3">
                  <div className="inline-flex p-3 bg-green-500/20 rounded-2xl mb-2">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{user.acceptedAnswers}</div>
                  <div className="text-sm text-gray-400">Accepted</div>
                </div>
              </Card>
              <Card className="glass-card border-gray-700/50 p-6 text-center">
                <div className="mb-3">
                  <div className="inline-flex p-3 bg-purple-500/20 rounded-2xl mb-2">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{user.reputation.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Reputation</div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white font-black">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === "question" && <BookOpen className="h-5 w-5 text-orange-400" />}
                        {activity.type === "answer" && <MessageSquare className="h-5 w-5 text-blue-400" />}
                        {activity.type === "comment" && <Edit3 className="h-5 w-5 text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-400">You {activity.action}</span>
                          {activity.accepted && (
                            <Badge variant="outline" className="text-green-400 border-green-400/30">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accepted
                            </Badge>
                          )}
                        </div>
                        <div className="text-white font-semibold mb-2">{activity.title}</div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {activity.votes} votes
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {activity.answers} answers
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard); 