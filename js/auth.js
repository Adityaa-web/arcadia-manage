/**
 * Authentication Service
 * Handles user authentication, session management, and demo users
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.initializeDemoUsers();
        this.loadSession();
    }

    // Initialize demo users in localStorage
    initializeDemoUsers() {
        const demoUsers = [
            {
                id: 'teacher-1',
                email: 'teacher@example.com',
                password: 'password123', // In real app, this would be hashed
                role: 'teacher',
                name: 'Dr. Sarah Johnson'
            },
            {
                id: 'student-1',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
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
            },
            {
                id: 'student-2',
                email: 'jane@example.com',
                password: 'password123',
                role: 'student',
                name: 'Jane Doe',
                profile: {
                    rollNo: 'CS21B002',
                    name: 'Jane Doe',
                    branch: 'Computer Science',
                    year: '3',
                    cgpa: 9.2,
                    attendance: 88,
                    email: 'jane@example.com',
                    phone: '9876543211',
                    dateOfBirth: '2003-03-20',
                    address: '456 Academic Avenue, City'
                }
            }
        ];

        // Only initialize if not already present
        if (!localStorage.getItem('mock_users')) {
            localStorage.setItem('mock_users', JSON.stringify(demoUsers));
        }
    }

    // Load existing session
    loadSession() {
        try {
            const storedUser = localStorage.getItem('auth_user');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('Error loading session:', error);
            localStorage.removeItem('auth_user');
        }
    }

    // Login method
    async login(email, password, role, department = null) {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const user = mockUsers.find(u => u.email === email && u.password === password);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            if (user.role !== role) {
                throw new Error(`Invalid role. This account is registered as ${user.role}`);
            }

            // Create user session
            const userData = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                department: role === 'teacher' ? department : undefined,
                profile: user.profile
            };

            this.currentUser = userData;
            localStorage.setItem('auth_user', JSON.stringify(userData));

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Signup method
    async signup(email, password, role, profile = null, department = null) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            
            // Check if user already exists
            if (mockUsers.find(u => u.email === email)) {
                throw new Error('An account with this email already exists');
            }

            const newUser = {
                id: `${role}-${Date.now()}`,
                email,
                password, // In real app, this would be hashed
                role,
                name: profile ? profile.name : email.split('@')[0],
                profile: role === 'student' ? profile : undefined
            };

            mockUsers.push(newUser);
            localStorage.setItem('mock_users', JSON.stringify(mockUsers));

            // Auto-login after signup
            const userData = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                department: role === 'teacher' ? department : undefined,
                profile: newUser.profile
            };

            this.currentUser = userData;
            localStorage.setItem('auth_user', JSON.stringify(userData));

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Logout method
    logout() {
        this.currentUser = null;
        localStorage.removeItem('auth_user');
        window.location.href = 'login.html';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Require authentication (redirect to login if not authenticated)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Require specific role
    requireRole(role) {
        if (!this.requireAuth()) return false;
        
        if (!this.hasRole(role)) {
            showToast(`Access denied. This page requires ${role} privileges.`, 'error');
            this.redirectToDashboard();
            return false;
        }
        return true;
    }

    // Redirect to appropriate dashboard
    redirectToDashboard() {
        if (this.isAuthenticated()) {
            if (this.hasRole('student')) {
                window.location.href = 'student-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            window.location.href = 'login.html';
        }
    }

    // Update user profile
    updateProfile(profileData) {
        if (!this.isAuthenticated()) return false;

        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const userIndex = mockUsers.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
            localStorage.setItem('mock_users', JSON.stringify(mockUsers));
            
            // Update current session
            this.currentUser = { ...this.currentUser, ...profileData };
            localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
            
            return true;
        }
        
        return false;
    }
}

// Create global auth service instance
const authService = new AuthService();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}