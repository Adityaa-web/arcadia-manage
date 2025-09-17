import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  department?: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string, department?: string) => Promise<boolean>;
  signup: (email: string, password: string, role: string, profile: any, department?: string) => Promise<boolean>;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Demo users data
  const demoUsers = [
    {
      id: 'teacher-1',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher' as const,
      name: 'Dr. Sarah Johnson',
      department: 'Computer Science'
    },
    {
      id: 'student-1',
      email: 'student@example.com',
      password: 'password123',
      role: 'student' as const,
      name: 'John Smith',
      profile: {
        rollNo: 'CS21B001',
        name: 'John Smith',
        branch: 'Computer Science',
        year: '3',
        cgpa: 8.5,
        attendance: 92,
        email: 'student@example.com',
        phone: '9876543210',
        dateOfBirth: '2003-05-15',
        address: '123 Student Street, City'
      }
    }
  ];

  // Initialize users in localStorage
  useEffect(() => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }

    // Check for existing session
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: string, department?: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password && u.role === role);
    
    if (foundUser) {
      const userSession = { ...foundUser };
      if (department && role === 'teacher') {
        userSession.department = department;
      }
      delete userSession.password;
      
      setUser(userSession);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return true;
    }
    
    throw new Error('Invalid credentials');
  };

  const signup = async (email: string, password: string, role: string, profile: any, department?: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: `${role}-${Date.now()}`,
      email,
      password,
      role,
      name: profile.name,
      department: role === 'teacher' ? department : undefined,
      profile: role === 'student' ? profile : undefined
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login after signup
    return await login(email, password, role, department);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};