import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  branch: string;
  year: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  attendance: string;
  cgpa: string;
  notes: string;
}

interface ReportsProps {
  students: Student[];
}

const Reports: React.FC<ReportsProps> = ({ students }) => {
  // Branch-wise statistics
  const branchStats = students.reduce((acc, student) => {
    const branch = student.branch || 'Unknown';
    if (!acc[branch]) {
      acc[branch] = { count: 0, totalCgpa: 0, totalAttendance: 0 };
    }
    acc[branch].count += 1;
    acc[branch].totalCgpa += parseFloat(student.cgpa) || 0;
    acc[branch].totalAttendance += parseFloat(student.attendance) || 0;
    return acc;
  }, {} as Record<string, { count: number; totalCgpa: number; totalAttendance: number }>);

  // Year-wise statistics
  const yearStats = students.reduce((acc, student) => {
    const year = student.year || 'Unknown';
    if (!acc[year]) {
      acc[year] = { count: 0, totalCgpa: 0, totalAttendance: 0 };
    }
    acc[year].count += 1;
    acc[year].totalCgpa += parseFloat(student.cgpa) || 0;
    acc[year].totalAttendance += parseFloat(student.attendance) || 0;
    return acc;
  }, {} as Record<string, { count: number; totalCgpa: number; totalAttendance: number }>);

  // Performance ranges
  const cgpaRanges = {
    'Excellent (8.5+)': students.filter(s => parseFloat(s.cgpa) >= 8.5).length,
    'Good (7.0-8.4)': students.filter(s => parseFloat(s.cgpa) >= 7.0 && parseFloat(s.cgpa) < 8.5).length,
    'Average (6.0-6.9)': students.filter(s => parseFloat(s.cgpa) >= 6.0 && parseFloat(s.cgpa) < 7.0).length,
    'Below Average (<6.0)': students.filter(s => parseFloat(s.cgpa) < 6.0).length,
  };

  const attendanceRanges = {
    'Excellent (85%+)': students.filter(s => parseFloat(s.attendance) >= 85).length,
    'Good (75-84%)': students.filter(s => parseFloat(s.attendance) >= 75 && parseFloat(s.attendance) < 85).length,
    'Average (65-74%)': students.filter(s => parseFloat(s.attendance) >= 65 && parseFloat(s.attendance) < 75).length,
    'Poor (<65%)': students.filter(s => parseFloat(s.attendance) < 65).length,
  };

  const maxCount = Math.max(...Object.values(branchStats).map(stat => stat.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive analysis of student data</p>
        </div>
      </div>

      {/* Branch Performance Chart */}
      <Card className="academic-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Branch-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(branchStats).map(([branch, stats]) => {
            const avgCgpa = stats.count > 0 ? (stats.totalCgpa / stats.count).toFixed(2) : '0.00';
            const avgAttendance = stats.count > 0 ? (stats.totalAttendance / stats.count).toFixed(1) : '0.0';
            
            return (
              <div key={branch} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">{branch}</h4>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Students: {stats.count}</span>
                    <span>Avg CGPA: {avgCgpa}</span>
                    <span>Avg Attendance: {avgAttendance}%</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(stats.count / maxCount) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{stats.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Year-wise Distribution */}
      <Card className="academic-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Year-wise Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(yearStats).map(([year, stats]) => {
              const avgCgpa = stats.count > 0 ? (stats.totalCgpa / stats.count).toFixed(2) : '0.00';
              const avgAttendance = stats.count > 0 ? (stats.totalAttendance / stats.count).toFixed(1) : '0.0';
              
              return (
                <div key={year} className="stats-card">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-primary">Year {year}</h3>
                    <div className="text-2xl font-bold">{stats.count}</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Avg CGPA: {avgCgpa}</div>
                      <div>Avg Attendance: {avgAttendance}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CGPA Distribution */}
        <Card className="academic-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              CGPA Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(cgpaRanges).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <span className="text-sm font-medium">{range}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-success to-accent rounded-full"
                      style={{ width: `${students.length > 0 ? (count / students.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attendance Distribution */}
        <Card className="academic-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              Attendance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(attendanceRanges).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <span className="text-sm font-medium">{range}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-warning to-primary rounded-full"
                      style={{ width: `${students.length > 0 ? (count / students.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="academic-card animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Summary Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Top Performing Branch</h4>
              <div className="text-xl font-bold text-primary">
                {Object.entries(branchStats).reduce((top, [branch, stats]) => {
                  const avgCgpa = stats.count > 0 ? stats.totalCgpa / stats.count : 0;
                  const topAvg = branchStats[top] ? branchStats[top].totalCgpa / branchStats[top].count : 0;
                  return avgCgpa > topAvg ? branch : top;
                }, Object.keys(branchStats)[0] || 'N/A')}
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Students with 85%+ Attendance</h4>
              <div className="text-xl font-bold text-success">
                {attendanceRanges['Excellent (85%+)']} 
                <span className="text-sm text-muted-foreground ml-1">
                  ({students.length > 0 ? ((attendanceRanges['Excellent (85%+)'] / students.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Students with 8.5+ CGPA</h4>
              <div className="text-xl font-bold text-accent">
                {cgpaRanges['Excellent (8.5+)']}
                <span className="text-sm text-muted-foreground ml-1">
                  ({students.length > 0 ? ((cgpaRanges['Excellent (8.5+)'] / students.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;