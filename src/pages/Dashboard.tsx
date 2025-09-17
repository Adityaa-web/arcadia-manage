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
          <div className="space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent animate-slide-up">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="academic-card card-hover animate-bounce-in glass-effect" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Students</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">125</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Users className="h-8 w-8 text-primary animate-pulse-glow" />
                  </div>
                </div>
              </div>
              <div className="academic-card card-hover animate-bounce-in glass-effect" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Average CGPA</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">7.8</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <BarChart3 className="h-8 w-8 text-primary animate-pulse-glow" />
                  </div>
                </div>
              </div>
              <div className="academic-card card-hover animate-bounce-in glass-effect" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Attendance Rate</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">89%</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <FileText className="h-8 w-8 text-primary animate-pulse-glow" />
                  </div>
                </div>
              </div>
              <div className="academic-card card-hover animate-bounce-in glass-effect" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Active Courses</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">12</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Settings className="h-8 w-8 text-primary animate-pulse-glow" />
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent-light/10 relative overflow-hidden animate-fade-in">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg relative z-10 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 animate-slide-in-right">
              <div className="p-3 hero-gradient rounded-xl hover-scale animate-pulse-glow">
                <svg className="h-7 w-7 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">StudentFlow</h1>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{user?.name}</span> • {user?.department || 'All Departments'} • <span className="capitalize text-primary">{user?.role}</span>
                </p>
              </div>
            </div>
            
            {/* Navigation and Actions */}
            <div className="flex items-center space-x-4 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="btn btn-ghost hover-scale btn-hover-lift neon-border" title="Toggle theme">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Logout Button */}
              <button onClick={handleLogout} className="btn btn-outline hover-scale btn-hover-lift">
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <nav className="flex space-x-2 bg-muted/80 backdrop-blur-sm rounded-xl p-2 glass-effect hover-scale">
            <button 
              className={`tab-btn hover-scale btn-hover-lift ${currentTab === 'overview' ? 'active neon-border' : ''}`}
              onClick={() => setCurrentTab('overview')}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
            </button>
            <button 
              className={`tab-btn hover-scale btn-hover-lift ${currentTab === 'students' ? 'active neon-border' : ''}`}
              onClick={() => setCurrentTab('students')}
            >
              <Users className="h-5 w-5" />
              <span>Students</span>
            </button>
            <button 
              className={`tab-btn hover-scale btn-hover-lift ${currentTab === 'reports' ? 'active neon-border' : ''}`}
              onClick={() => setCurrentTab('reports')}
            >
              <FileText className="h-5 w-5" />
              <span>Reports</span>
            </button>
            <button 
              className={`tab-btn hover-scale btn-hover-lift ${currentTab === 'settings' ? 'active neon-border' : ''}`}
              onClick={() => setCurrentTab('settings')}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div id="tab-content" className="animate-fade-in" key={currentTab}>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;