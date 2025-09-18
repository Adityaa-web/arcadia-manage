import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  User, 
  Award,
  BarChart3,
  Clock,
  LogOut
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  if (!user || !user.profile) {
    return <div>Loading...</div>;
  }

  const { profile } = user;

  // Calculate performance status
  const getPerformanceStatus = (cgpa: number) => {
    if (cgpa >= 8.5) return { label: 'Excellent', color: 'bg-success' };
    if (cgpa >= 7.0) return { label: 'Good', color: 'bg-primary' };
    if (cgpa >= 6.0) return { label: 'Average', color: 'bg-warning' };
    return { label: 'Needs Improvement', color: 'bg-destructive' };
  };

  const getAttendanceStatus = (attendance: number) => {
    if (attendance >= 90) return { label: 'Excellent', color: 'bg-success' };
    if (attendance >= 75) return { label: 'Good', color: 'bg-primary' };
    if (attendance >= 60) return { label: 'Average', color: 'bg-warning' };
    return { label: 'Low', color: 'bg-destructive' };
  };

  const performanceStatus = getPerformanceStatus(profile.cgpa);
  const attendanceStatus = getAttendanceStatus(profile.attendance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent-light/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Student Portal</h1>
              <p className="text-primary-foreground/80">Welcome back, {profile.name}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="bg-white/20 border-white/30 text-primary-foreground hover:bg-white/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Personal Info Card */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-semibold">{profile.rollNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-semibold">{profile.branch}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-semibold">Year {profile.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Performance Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CGPA Card */}
          <Card className="academic-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Academic Performance</span>
                </div>
                <Badge className={performanceStatus.color}>
                  {performanceStatus.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {profile.cgpa.toFixed(2)}
                </div>
                <p className="text-muted-foreground">Current CGPA</p>
              </div>
              <Progress 
                value={(profile.cgpa / 10) * 100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0.0</span>
                <span>10.0</span>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="academic-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Attendance</span>
                </div>
                <Badge className={attendanceStatus.color}>
                  {attendanceStatus.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {profile.attendance}%
                </div>
                <p className="text-muted-foreground">Overall Attendance</p>
              </div>
              <Progress 
                value={profile.attendance} 
                className="h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="academic-card">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Current Semester</h3>
              <p className="text-2xl font-bold text-primary">Semester {profile.year}</p>
            </CardContent>
          </Card>

          <Card className="academic-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold">Academic Rank</h3>
              <p className="text-2xl font-bold text-success">
                {profile.cgpa >= 8.5 ? 'Top 10%' : profile.cgpa >= 7.0 ? 'Top 25%' : 'Average'}
              </p>
            </CardContent>
          </Card>

          <Card className="academic-card">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold">Status</h3>
              <p className="text-2xl font-bold text-warning">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Academic Insights */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Academic Insights</span>
            </CardTitle>
            <CardDescription>
              Your performance overview and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-success mb-2">Strengths</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {profile.cgpa >= 7.0 && <li>• Strong academic performance</li>}
                  {profile.attendance >= 75 && <li>• Good attendance record</li>}
                  <li>• Consistent progress in {profile.branch}</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-warning mb-2">Areas for Improvement</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {profile.cgpa < 7.0 && <li>• Focus on improving CGPA</li>}
                  {profile.attendance < 75 && <li>• Improve attendance rate</li>}
                  <li>• Consider additional skill development</li>
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Recommendations</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {profile.cgpa < 7.0 && <p>• Schedule regular study sessions to improve your CGPA</p>}
                {profile.attendance < 75 && <p>• Maintain consistent class attendance for better learning</p>}
                <p>• Participate in department activities and technical events</p>
                <p>• Consider joining study groups with your classmates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;