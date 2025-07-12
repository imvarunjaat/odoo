"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reputation: number;
  questions: number;
  answers: number;
  acceptedAnswers: number;
  location?: string;
  bio?: string;
  joinedDate: string;
  lastActive: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Dummy users for authentication
const dummyUsers: Record<string, User> = {
  'admin@stackit.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@stackit.com',
    avatar: '/placeholder-avatar.jpg',
    reputation: 15420,
    questions: 45,
    answers: 234,
    acceptedAnswers: 189,
    location: 'Mumbai, India',
    bio: 'Full-stack developer and community moderator. Passionate about helping developers grow.',
    joinedDate: '2 years ago',
    lastActive: 'now'
  },
  'user@stackit.com': {
    id: '2',
    name: 'Regular User',
    email: 'user@stackit.com',
    avatar: '/placeholder-avatar.jpg',
    reputation: 2450,
    questions: 12,
    answers: 34,
    acceptedAnswers: 23,
    location: 'Delhi, India',
    bio: 'Frontend developer learning React and Next.js',
    joinedDate: '6 months ago',
    lastActive: '5 minutes ago'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('stackit_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('stackit_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('stackit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stackit_user');
    }
  }, [user]);

  // Login function with dummy authentication
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in dummy users
      const foundUser = dummyUsers[email.toLowerCase()];
      
      if (foundUser && password === 'password') {
        setUser({
          ...foundUser,
          lastActive: 'now'
        });
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) => {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = redirectTo;
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}; 