import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Sun, Moon, User, BookOpen, Calendar, Award } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent-light/20">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="p-2 hero-gradient rounded-lg">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">StudentFlow</h1>
                <p className="text-xs text-muted-foreground">
                  {user?.name} • {user?.profile?.rollNo} • {user?.role}
                </p>
              </div>
            </div>
            
            {/* Navigation and Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="btn btn-ghost" title="Toggle theme">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              
              {/* Logout Button */}
              <button onClick={handleLogout} className="btn btn-outline">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Welcome back, {user?.name}!</h2>
          </div>

          {/* Student Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="academic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CGPA</p>
                  <p className="text-3xl font-bold">{user?.profile?.cgpa || '0.0'}</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="academic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-3xl font-bold">{user?.profile?.attendance || 0}%</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="academic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Year</p>
                  <p className="text-3xl font-bold">{user?.profile?.year || 'N/A'}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="academic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="text-lg font-bold">{user?.profile?.branch || 'N/A'}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Student Profile */}
          <div className="academic-card">
            <div className="card-header">
              <h3 className="text-xl font-bold">Profile Information</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{user?.profile?.rollNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user?.profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium">{user?.profile?.branch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Year</p>
                    <p className="font-medium">{user?.profile?.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{user?.profile?.dateOfBirth || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{user?.profile?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="academic-card">
            <div className="card-header">
              <h3 className="text-xl font-bold">Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn btn-outline p-6 h-auto flex-col space-y-2">
                  <BookOpen className="h-8 w-8" />
                  <span>View Courses</span>
                </button>
                <button className="btn btn-outline p-6 h-auto flex-col space-y-2">
                  <Calendar className="h-8 w-8" />
                  <span>View Timetable</span>
                </button>
                <button className="btn btn-outline p-6 h-auto flex-col space-y-2">
                  <Award className="h-8 w-8" />
                  <span>View Grades</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;