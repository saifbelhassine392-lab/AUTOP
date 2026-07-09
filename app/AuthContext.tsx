"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "pro" | "admin";
  phone?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPro: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
  role?: "client" | "pro";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données de démo (à remplacer par appel API)
const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "Saif Belhassine",
    email: "saifbelhassine392@gmail.com",
    role: "client",
    phone: "+216 20 123 456",
  },
  {
    id: "2",
    name: "Garage Charguia Pro",
    email: "pro@garage.tn",
    role: "pro",
    phone: "+216 71 123 456",
    company: "Garage Charguia",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("autop_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("autop_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (found) {
      setUser(found);
      localStorage.setItem("autop_user", JSON.stringify(found));
      return true;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      role: "client",
    };
    setUser(newUser);
    localStorage.setItem("autop_user", JSON.stringify(newUser));
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role || "client",
      phone: data.phone,
      company: data.company,
    };
    
    setUser(newUser);
    localStorage.setItem("autop_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("autop_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("autop_user", JSON.stringify(updated));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPro: user?.role === "pro" || user?.role === "admin",
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}