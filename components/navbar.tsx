"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/auth-context";
import {
  Bell, 
  Search, 
  Plus, 
  User, 
  Settings,
  LogOut,
  Tag,
  Home,
  Users,
  BarChart3,
  BookOpen
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const notifications = [
    { id: 1, type: "answer", message: "New answer to your question", time: "2 min ago" },
    { id: 2, type: "comment", message: "Someone commented on your answer", time: "1 hour ago" },
    { id: 3, type: "mention", message: "You were mentioned in a comment", time: "3 hours ago" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

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
          {isAuthenticated && (
            <Link href="/dashboard" className="flex items-center space-x-2 font-semibold text-gray-300 hover:text-white transition-colors group">
              <BarChart3 className="h-5 w-5 group-hover:text-orange-400 transition-colors" />
              <span>Dashboard</span>
            </Link>
          )}
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
          {isAuthenticated ? (
            <Link href="/ask">
              <Button className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5" />
                <span>Ask Question</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <User className="h-5 w-5" />
                <span>Login</span>
              </Button>
            </Link>
          )}

          {/* Notifications & User Menu */}
          {isAuthenticated && (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl">
                    <Bell className="h-6 w-6" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-orange-500 text-white border-0 flex items-center justify-center">
                      {notifications.length}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-80 bg-gray-800 border-gray-700 text-white"
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <h4 className="font-semibold">Notifications</h4>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="px-4 py-3 hover:bg-gray-700/50">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm text-gray-300">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-xl hover:bg-gray-700/50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 bg-gray-800 border-gray-700 text-white"
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                        <p className="text-xs text-orange-400">{user?.reputation} reputation</p>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700/50">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-700/50">
                      <User className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-700/50">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile menu button for non-authenticated users */}
          {!isAuthenticated && (
            <div className="md:hidden">
              <Link href="/login">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 