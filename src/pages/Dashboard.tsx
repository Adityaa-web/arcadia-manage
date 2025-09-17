import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Sun, Moon, BarChart3, Users, FileText, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="academic-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-3xl font-bold">125</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="academic-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average CGPA</p>
                    <p className="text-3xl font-bold">7.8</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="academic-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    <p className="text-3xl font-bold">89%</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="academic-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Settings className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Students Management</h2>
            <div className="academic-card">
              <p className="text-muted-foreground">Student management features will be available here.</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports</h2>
            <div className="academic-card">
              <p className="text-muted-foreground">Reporting features will be available here.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="academic-card">
              <p className="text-muted-foreground">Settings panel will be available here.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
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
                  {user?.name} • {user?.department || 'All Departments'} • {user?.role}
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
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-muted rounded-lg p-1">
            <button 
              className={`tab-btn ${currentTab === 'overview' ? 'active' : ''}`}
              onClick={() => setCurrentTab('overview')}
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </button>
            <button 
              className={`tab-btn ${currentTab === 'students' ? 'active' : ''}`}
              onClick={() => setCurrentTab('students')}
            >
              <Users className="h-4 w-4" />
              Students
            </button>
            <button 
              className={`tab-btn ${currentTab === 'reports' ? 'active' : ''}`}
              onClick={() => setCurrentTab('reports')}
            >
              <FileText className="h-4 w-4" />
              Reports
            </button>
            <button 
              className={`tab-btn ${currentTab === 'settings' ? 'active' : ''}`}
              onClick={() => setCurrentTab('settings')}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div id="tab-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;