import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, GraduationCap } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'student' ? '/student-dashboard' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast.error('Please select your role');
      return;
    }

    if (formData.role === 'teacher' && !formData.department) {
      toast.error('Please select your department');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password, formData.role, formData.department);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-4 hero-gradient rounded-2xl shadow-lg animate-bounce-in animate-pulse-glow">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your StudentFlow account</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="academic-card card-hover animate-slide-up neon-border" style={{animationDelay: '0.4s'}}>
          <div className="card-header">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="form-group animate-slide-in-right" style={{animationDelay: '0.6s'}}>
                <label htmlFor="role" className="label">I am a</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value, department: '' })}
                  className="select academic-input hover-scale focus:scale-105 transition-all duration-300"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              {/* Department Selection (for teachers) */}
              {formData.role === 'teacher' && (
                <div className="form-group animate-bounce-in">
                  <label htmlFor="department" className="label">Department</label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="select academic-input hover-scale focus:scale-105 transition-all duration-300"
                    required
                  >
                    <option value="">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email */}
              <div className="form-group animate-slide-in-right" style={{animationDelay: '0.8s'}}>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors" />
                  <input
                    id="email"
                    type="email"
                    placeholder={formData.role === 'teacher' ? 'teacher@example.com' : 'student@example.com'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input academic-input pl-10 hover-scale focus:scale-105 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group animate-slide-in-right" style={{animationDelay: '1s'}}>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input academic-input pl-10 pr-10 hover-scale focus:scale-105 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-all duration-300 hover-scale"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gradient w-full h-12 disabled:opacity-50 btn-hover-lift animate-pulse-glow animate-slide-up"
                style={{animationDelay: '1.2s'}}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center animate-slide-up" style={{animationDelay: '1.4s'}}>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="font-medium text-primary hover:text-primary-glow transition-all duration-300 hover-scale"
                >
                  Create account
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 glass-effect rounded-lg hover-scale animate-bounce-in" style={{animationDelay: '1.6s'}}>
              <p className="text-xs font-medium text-primary mb-3">Demo Credentials:</p>
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="p-3 bg-muted/50 rounded-lg hover-scale">
                  <p className="font-medium text-primary">Teacher</p>
                  <p className="text-muted-foreground">teacher@example.com / password123</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg hover-scale">
                  <p className="font-medium text-primary">Student</p>
                  <p className="text-muted-foreground">student@example.com / password123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;