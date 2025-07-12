"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell, 
  Search, 
  Plus, 
  User, 
  Settings,
  LogOut,
  Tag,
  Home,
  Users
} from "lucide-react";

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const notifications = [
    { id: 1, type: "answer", message: "New answer to your question", time: "2 min ago" },
    { id: 2, type: "comment", message: "Someone commented on your answer", time: "1 hour ago" },
    { id: 3, type: "mention", message: "You were mentioned in a comment", time: "3 hours ago" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav">
      <div className="container max-w-7xl mx-auto flex h-20 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
            <span className="text-2xl font-black">S</span>
          </div>
          <span className="text-3xl font-black text-white">
            <span className="text-orange-400">Stack</span>It
          </span>
        </Link>

        {/* Navigation */}
        <nav className="ml-12 hidden md:flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 font-semibold text-gray-300 hover:text-white transition-colors group">
            <Home className="h-5 w-5 group-hover:text-orange-400 transition-colors" />
            <span>Home</span>
          </Link>
          <Link href="/tags" className="flex items-center space-x-2 font-semibold text-gray-300 hover:text-white transition-colors group">
            <Tag className="h-5 w-5 group-hover:text-orange-400 transition-colors" />
            <span>Tags</span>
          </Link>
          <Link href="/users" className="flex items-center space-x-2 font-semibold text-gray-300 hover:text-white transition-colors group">
            <Users className="h-5 w-5 group-hover:text-orange-400 transition-colors" />
            <span>Users</span>
          </Link>
        </nav>

        {/* Search */}
        <div className="ml-auto flex items-center space-x-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search questions..."
              className="w-80 pl-12 pr-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Ask Question Button */}
          <Link href="/ask">
            <Button className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-5 w-5" />
              <span>Ask Question</span>
            </Button>
          </Link>



          {/* Notifications */}
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h4 className="font-medium">Notifications</h4>
                </div>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex-col items-start p-3">
                    <div className="text-sm">{notification.message}</div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {isLoginMode ? "Login to StackIt" : "Join StackIt"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  {!isLoginMode && (
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Display Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your display name"
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    {isLoginMode ? "Login" : "Create Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                  >
                    {isLoginMode
                      ? "Need an account? Sign up"
                      : "Already have an account? Login"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
} 