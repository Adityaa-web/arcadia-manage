import React from 'react';
import { Users, GraduationCap, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import academicHero from '@/assets/academic-hero.jpg';

interface DashboardProps {
  students: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  // Calculate statistics
  const totalStudents = students.length;
  const branches = [...new Set(students.map(s => s.branch))];
  const totalBranches = branches.length;
  const avgCGPA = students.length > 0 
    ? (students.reduce((sum, s) => sum + (parseFloat(s.cgpa) || 0), 0) / students.length).toFixed(2)
    : "0.00";
  const avgAttendance = students.length > 0 
    ? (students.reduce((sum, s) => sum + (parseFloat(s.attendance) || 0), 0) / students.length).toFixed(1)
    : "0.0";

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Branches",
      value: totalBranches,
      icon: GraduationCap,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Average CGPA",
      value: avgCGPA,
      icon: Award,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Avg Attendance",
      value: `${avgAttendance}%`,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  // Year-wise distribution
  const yearDistribution = students.reduce((acc, student) => {
    const year = student.year || 'Unknown';
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Branch-wise distribution
  const branchDistribution = students.reduce((acc, student) => {
    const branch = student.branch || 'Unknown';
    acc[branch] = (acc[branch] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <img 
            src={academicHero} 
            alt="Academic Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-90"></div>
        </div>
        <div className="relative px-8 py-16 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up">
            Welcome to StudentFlow
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Modern Student Management System
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm opacity-80">Last Updated:</span>
              <div className="font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm opacity-80">Active Users:</span>
              <div className="font-semibold">{totalStudents}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="stats-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Quick Overview Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Year Distribution */}
        <Card className="academic-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Year-wise Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(yearDistribution).map(([year, count]) => {
              const studentCount = count as number;
              return (
                <div key={year} className="flex items-center justify-between">
                  <span className="text-sm font-medium">Year {year}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
                        style={{ width: `${totalStudents > 0 ? (studentCount / totalStudents) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{studentCount}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Branch Distribution */}
        <Card className="academic-card animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Branch-wise Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(branchDistribution).slice(0, 5).map(([branch, count]) => {
              const studentCount = count as number;
              return (
                <div key={branch} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{branch}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-success rounded-full"
                        style={{ width: `${totalStudents > 0 ? (studentCount / totalStudents) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{studentCount}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;