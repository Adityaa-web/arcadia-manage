import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, GraduationCap, User } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    // Student specific fields
    rollNo: '',
    branch: '',
    year: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup, isAuthenticated, user } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.role === 'teacher' && !formData.department) {
      toast.error('Please select your department');
      return;
    }

    if (formData.role === 'student' && (!formData.rollNo || !formData.branch || !formData.year)) {
      toast.error('Please fill in all required student information');
      return;
    }

    setLoading(true);

    try {
      const profile = formData.role === 'student' ? {
        rollNo: formData.rollNo,
        name: formData.name,
        branch: formData.branch,
        year: formData.year,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        cgpa: 0,
        attendance: 0
      } : { name: formData.name };

      await signup(formData.email, formData.password, formData.role, profile, formData.department);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
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

  const years = ['1', '2', '3', '4'];

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 hero-gradient rounded-2xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join StudentFlow today</p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="academic-card">
          <div className="card-header">
            <h2 className="text-2xl font-bold">Sign Up</h2>
            <p className="text-muted-foreground">Create your StudentFlow account</p>
          </div>
          
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="form-group">
                <label htmlFor="role" className="label">I am a</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value, department: '' })}
                  className="select academic-input"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="name" className="label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input academic-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input academic-input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="password" className="label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input academic-input pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input academic-input pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role-specific fields */}
              {formData.role === 'teacher' && (
                <div className="form-group">
                  <label htmlFor="department" className="label">Department</label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="select academic-input"
                    required
                  >
                    <option value="">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.role === 'student' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group">
                      <label htmlFor="rollNo" className="label">Roll Number</label>
                      <input
                        id="rollNo"
                        type="text"
                        placeholder="CS21B001"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                        className="input academic-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="branch" className="label">Branch</label>
                      <select
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="select academic-input"
                        required
                      >
                        <option value="">Select branch</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="year" className="label">Year</label>
                      <select
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="select academic-input"
                        required
                      >
                        <option value="">Select year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="phone" className="label">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input academic-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="dateOfBirth" className="label">Date of Birth</label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="input academic-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address" className="label">Address</label>
                    <textarea
                      id="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="input academic-input min-h-[80px] resize-none"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gradient w-full disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium text-primary hover:text-primary-glow transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;