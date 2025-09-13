import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initializeDemoUsers } from '@/utils/initializeDemoUsers';

interface User {
  id: string;
  email: string;
  role: 'teacher' | 'student';
  profile?: StudentProfile;
}

interface StudentProfile {
  rollNo: string;
  name: string;
  branch: string;
  year: string;
  cgpa: number;
  attendance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'teacher' | 'student', profile?: StudentProfile) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize demo users
    initializeDemoUsers();
    
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - In real app, this would be Supabase auth
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const foundUser = mockUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        profile: foundUser.profile
      };

      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.role}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: 'teacher' | 'student', profile?: StudentProfile) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      
      // Check if user already exists
      if (mockUsers.find((u: any) => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password, // In real app, this would be hashed
        role,
        profile: role === 'student' ? profile : undefined
      };

      mockUsers.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));

      const userData = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      };

      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      toast({
        title: "Account created",
        description: `Welcome to StudentFlow, ${role}!`,
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};