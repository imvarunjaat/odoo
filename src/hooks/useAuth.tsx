"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  name: string;
  email: string;
  image?: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOutMutation = useMutation(api.auth.signOut);

  // Get token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  // Query user data if we have a token
  const user = useQuery(
    api.auth.getCurrentUser,
    token ? { token } : "skip"
  );

  const signOut = async () => {
    if (token) {
      try {
        await signOutMutation({ token });
      } catch (error) {
        console.error("Sign out error:", error);
      }
    }
    localStorage.removeItem("authToken");
    setToken(null);
    window.location.href = "/";
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading || (token !== null && user === undefined),
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}