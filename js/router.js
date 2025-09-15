/**
 * Simple Router for SPA Navigation
 * Handles client-side routing without page reloads
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle initial load
        this.handleRoute();
    }

    // Register a route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to a route
    navigate(path, addToHistory = true) {
        if (addToHistory) {
            history.pushState(null, null, path);
        }
        this.currentRoute = path;
        this.handleRoute();
    }

    // Handle current route
    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path];

        if (route) {
            route();
        } else {
            // Default route or 404
            this.handle404();
        }
    }

    // Handle 404 errors
    handle404() {
        document.title = '404 - Page Not Found | StudentFlow';
        const content = `
            <div class="min-h-screen flex items-center justify-center gradient-bg">
                <div class="text-center max-w-md">
                    <div class="mb-8">
                        <div class="text-6xl font-bold text-primary mb-4">404</div>
                        <h1 class="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
                        <p class="text-muted-foreground">The page you're looking for doesn't exist.</p>
                    </div>
                    <div class="space-y-4">
                        <button onclick="router.navigate('/')" class="btn btn-primary">
                            Go Home
                        </button>
                        <button onclick="history.back()" class="btn btn-outline">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('main-content').innerHTML = content;
    }

    // Get current path
    getCurrentPath() {
        return window.location.pathname;
    }

    // Check if current path matches
    isCurrentPath(path) {
        return this.getCurrentPath() === path;
    }
}

// Create global router instance
const router = new Router();

// Route handlers
function handleHome() {
    // Check authentication and redirect appropriately
    if (!authService.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const user = authService.getCurrentUser();
    if (user.role === 'student') {
        router.navigate('/student-dashboard');
    } else {
        router.navigate('/dashboard');
    }
}

function handleLogin() {
    // If already authenticated, redirect to dashboard
    if (authService.isAuthenticated()) {
        handleHome();
        return;
    }

    document.title = 'Login | StudentFlow';
    loadLoginPage();
}

function handleDashboard() {
    // Require teacher authentication
    if (!authService.requireRole('teacher')) {
        return;
    }

    document.title = 'Dashboard | StudentFlow';
    loadDashboardPage();
}

function handleStudentDashboard() {
    // Require student authentication
    if (!authService.requireRole('student')) {
        return;
    }

    document.title = 'Student Dashboard | StudentFlow';
    loadStudentDashboardPage();
}

function handleSignup() {
    // If already authenticated, redirect to dashboard
    if (authService.isAuthenticated()) {
        handleHome();
        return;
    }

    document.title = 'Sign Up | StudentFlow';
    loadSignupPage();
}

// Register routes
router.addRoute('/', handleHome);
router.addRoute('/login', handleLogin);
router.addRoute('/signup', handleSignup);
router.addRoute('/dashboard', handleDashboard);
router.addRoute('/student-dashboard', handleStudentDashboard);

// Page loaders (these will be implemented in separate files)
function loadLoginPage() {
    fetch('login.html')
        .then(response => response.text())
        .then(html => {
            // Extract body content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            
            document.getElementById('main-content').innerHTML = bodyContent;
            
            // Execute page-specific scripts
            initializeLoginPage();
        })
        .catch(error => {
            console.error('Error loading login page:', error);
            showToast('Error loading page', 'error');
        });
}

function loadDashboardPage() {
    const user = authService.getCurrentUser();
    const students = user.department ? 
        dataService.getStudentsByDepartment(user.department) : 
        dataService.getStudents();
    
    const stats = dataService.getStatistics(user.department);
    
    const content = `
        <div class="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent-light/20">
            <!-- Navigation -->
            <nav class="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-4 shadow-lg">
                <div class="container flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <div class="p-2 bg-white/20 rounded-lg">
                            ${createIcon('graduation', 'icon-lg text-primary-foreground')}
                        </div>
                        <div>
                            <h1 class="text-xl font-bold">StudentFlow</h1>
                            <p class="text-primary-foreground/80">Teacher Dashboard</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">Welcome, ${user.name}</span>
                        ${user.department ? `<span class="badge badge-outline text-primary-foreground border-primary-foreground/30">${user.department}</span>` : ''}
                        <button onclick="toggleTheme()" class="btn btn-ghost" id="theme-toggle">
                            <span id="theme-icon">${createIcon('moon', 'icon')}</span>
                        </button>
                        <button onclick="authService.logout()" class="btn btn-outline bg-white/20 border-white/30 text-primary-foreground hover:bg-white/30">
                            ${createIcon('logout', 'icon')}
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <div class="container py-8">
                <!-- Dashboard Tabs -->
                <div id="dashboard-tabs" class="mb-8">
                    <div class="flex space-x-1 bg-muted p-1 rounded-lg inline-flex">
                        <button class="tab-btn active" data-tab="overview" onclick="switchTab('overview')">
                            ${createIcon('home', 'icon')} Overview
                        </button>
                        <button class="tab-btn" data-tab="students" onclick="switchTab('students')">
                            ${createIcon('students', 'icon')} Students
                        </button>
                        <button class="tab-btn" data-tab="reports" onclick="switchTab('reports')">
                            ${createIcon('reports', 'icon')} Reports
                        </button>
                        <button class="tab-btn" data-tab="settings" onclick="switchTab('settings')">
                            ${createIcon('settings', 'icon')} Settings
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div id="tab-content">
                    ${generateOverviewTab(stats)}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = content;
    initializeDashboardPage();
}

function loadStudentDashboardPage() {
    const user = authService.getCurrentUser();
    if (!user.profile) {
        showToast('Student profile not found', 'error');
        authService.logout();
        return;
    }

    const { profile } = user;
    
    const content = `
        <div class="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent-light/20">
            <!-- Header -->
            <div class="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6 shadow-lg">
                <div class="container flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <div class="p-3 bg-white/20 rounded-2xl">
                            ${createIcon('graduation', 'icon-lg')}
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold">Student Portal</h1>
                            <p class="text-primary-foreground/80">Welcome back, ${profile.name}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button onclick="toggleTheme()" class="btn btn-ghost" id="theme-toggle">
                            <span id="theme-icon">${createIcon('moon', 'icon')}</span>
                        </button>
                        <button onclick="authService.logout()" class="btn btn-outline bg-white/20 border-white/30 text-primary-foreground hover:bg-white/30">
                            ${createIcon('logout', 'icon')}
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div class="container py-6 space-y-6">
                ${generateStudentDashboardContent(profile)}
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = content;
}

function loadSignupPage() {
    fetch('signup.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            
            document.getElementById('main-content').innerHTML = bodyContent;
            initializeSignupPage();
        })
        .catch(error => {
            console.error('Error loading signup page:', error);
            showToast('Error loading page', 'error');
        });
}

// Make router globally available
window.router = router;