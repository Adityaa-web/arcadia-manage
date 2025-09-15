/**
 * Main Application Script
 * Initializes the StudentFlow application and handles global functionality
 */

// Global application state
let currentTab = 'overview';
let currentPage = 1;
let itemsPerPage = 10;
let sortConfig = { key: null, direction: 'asc' };
let searchQuery = '';
let filters = { branch: '', year: '' };

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 300);
        }, 1000);
    }
    
    // Initialize theme
    initializeTheme();
    
    // Initialize router
    router.handleRoute();
});

// Tab switching functionality
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update content
    const content = generateTabContent(tabName);
    document.getElementById('tab-content').innerHTML = content;
    
    // Initialize tab-specific functionality
    initializeTab(tabName);
}

// Generate tab content based on tab name
function generateTabContent(tabName) {
    const user = authService.getCurrentUser();
    const students = user.department ? 
        dataService.getStudentsByDepartment(user.department) : 
        dataService.getStudents();
    
    switch (tabName) {
        case 'overview':
            return generateOverviewTab(dataService.getStatistics(user.department));
        case 'students':
            return generateStudentsTab(students);
        case 'reports':
            return generateReportsTab(students);
        case 'settings':
            return generateSettingsTab();
        default:
            return '<div>Tab not found</div>';
    }
}

// Generate overview tab content
function generateOverviewTab(stats) {
    return `
        <div class="space-y-6">
            <!-- Hero Section -->
            <div class="academic-card p-8 text-center hero-gradient text-primary-foreground">
                <h2 class="text-3xl font-bold mb-2">Academic Management System</h2>
                <p class="text-primary-foreground/80">Comprehensive student data management and analytics</p>
            </div>

            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="stats-card text-center">
                    ${createIcon('students', 'icon-lg text-primary mx-auto mb-2')}
                    <h3 class="font-semibold text-muted-foreground">Total Students</h3>
                    <p class="text-3xl font-bold text-primary">${stats.totalStudents}</p>
                </div>
                <div class="stats-card text-center">
                    ${createIcon('award', 'icon-lg text-success mx-auto mb-2')}
                    <h3 class="font-semibold text-muted-foreground">Average CGPA</h3>
                    <p class="text-3xl font-bold text-success">${stats.averageCGPA}</p>
                </div>
                <div class="stats-card text-center">
                    ${createIcon('calendar', 'icon-lg text-warning mx-auto mb-2')}
                    <h3 class="font-semibold text-muted-foreground">Average Attendance</h3>
                    <p class="text-3xl font-bold text-warning">${stats.averageAttendance}%</p>
                </div>
                <div class="stats-card text-center">
                    ${createIcon('trending', 'icon-lg text-primary mx-auto mb-2')}
                    <h3 class="font-semibold text-muted-foreground">Active Branches</h3>
                    <p class="text-3xl font-bold text-primary">${Object.keys(stats.branchDistribution).length}</p>
                </div>
            </div>

            <!-- Branch Distribution -->
            <div class="grid md:grid-cols-2 gap-6">
                <div class="academic-card">
                    <div class="card-header">
                        <h3 class="card-title">Branch-wise Distribution</h3>
                    </div>
                    <div class="card-content">
                        ${Object.entries(stats.branchDistribution).map(([branch, count]) => `
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-sm">${branch}</span>
                                <div class="flex items-center space-x-2">
                                    <div class="w-24 bg-secondary rounded-full h-2">
                                        <div class="bg-primary h-2 rounded-full" style="width: ${(count / stats.totalStudents) * 100}%"></div>
                                    </div>
                                    <span class="text-sm font-medium">${count}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="academic-card">
                    <div class="card-header">
                        <h3 class="card-title">Performance Distribution</h3>
                    </div>
                    <div class="card-content">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm">Excellent (8.5+)</span>
                            <div class="flex items-center space-x-2">
                                <div class="w-24 bg-secondary rounded-full h-2">
                                    <div class="bg-success h-2 rounded-full" style="width: ${(stats.performanceDistribution.excellent / stats.totalStudents) * 100}%"></div>
                                </div>
                                <span class="text-sm font-medium">${stats.performanceDistribution.excellent}</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm">Good (7.0-8.4)</span>
                            <div class="flex items-center space-x-2">
                                <div class="w-24 bg-secondary rounded-full h-2">
                                    <div class="bg-primary h-2 rounded-full" style="width: ${(stats.performanceDistribution.good / stats.totalStudents) * 100}%"></div>
                                </div>
                                <span class="text-sm font-medium">${stats.performanceDistribution.good}</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm">Average (6.0-6.9)</span>
                            <div class="flex items-center space-x-2">
                                <div class="w-24 bg-secondary rounded-full h-2">
                                    <div class="bg-warning h-2 rounded-full" style="width: ${(stats.performanceDistribution.average / stats.totalStudents) * 100}%"></div>
                                </div>
                                <span class="text-sm font-medium">${stats.performanceDistribution.average}</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm">Needs Improvement (&lt;6.0)</span>
                            <div class="flex items-center space-x-2">
                                <div class="w-24 bg-secondary rounded-full h-2">
                                    <div class="bg-destructive h-2 rounded-full" style="width: ${(stats.performanceDistribution.poor / stats.totalStudents) * 100}%"></div>
                                </div>
                                <span class="text-sm font-medium">${stats.performanceDistribution.poor}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate students tab content
function generateStudentsTab(students) {
    const filteredStudents = applyFilters(students);
    const paginatedStudents = paginate(filteredStudents, currentPage, itemsPerPage);
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    
    return `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold">Students Management</h2>
                    <p class="text-muted-foreground">Manage student records and information</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="importStudents()" class="btn btn-outline">
                        ${createIcon('upload', 'icon')} Import
                    </button>
                    <button onclick="exportStudents()" class="btn btn-outline">
                        ${createIcon('download', 'icon')} Export
                    </button>
                    <button onclick="addStudent()" class="btn btn-primary">
                        ${createIcon('plus', 'icon')} Add Student
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="academic-card p-4">
                <div class="grid md:grid-cols-4 gap-4">
                    <div>
                        <label class="label">Search</label>
                        <div class="relative">
                            ${createIcon('search', 'absolute left-3 top-3 text-muted-foreground icon')}
                            <input 
                                type="text" 
                                placeholder="Search students..." 
                                class="input academic-input pl-10"
                                value="${searchQuery}"
                                onkeyup="handleSearch(this.value)"
                            />
                        </div>
                    </div>
                    <div>
                        <label class="label">Branch</label>
                        <select class="select academic-input" onchange="handleBranchFilter(this.value)">
                            <option value="">All Branches</option>
                            ${[...new Set(students.map(s => s.branch))].map(branch => 
                                `<option value="${branch}" ${filters.branch === branch ? 'selected' : ''}>${branch}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="label">Year</label>
                        <select class="select academic-input" onchange="handleYearFilter(this.value)">
                            <option value="">All Years</option>
                            ${[...new Set(students.map(s => s.year))].sort().map(year => 
                                `<option value="${year}" ${filters.year === year ? 'selected' : ''}>Year ${year}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button onclick="clearFilters()" class="btn btn-outline w-full">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-muted-foreground">
                Showing ${paginatedStudents.length} of ${filteredStudents.length} students
            </div>

            <!-- Students Table -->
            <div class="academic-card">
                ${generateStudentsTable(paginatedStudents)}
            </div>

            <!-- Pagination -->
            ${createPagination(currentPage, totalPages, 'goToPage')}
        </div>
    `;
}

// Initialize page-specific functionality
function initializeTab(tabName) {
    switch (tabName) {
        case 'students':
            // Initialize student management functionality
            break;
        case 'reports':
            // Initialize reports functionality
            break;
        case 'settings':
            // Initialize settings functionality
            break;
    }
}

// Student management functions
function addStudent() {
    const formContent = generateStudentForm();
    const modal = createModal('Add New Student', formContent);
    initializeStudentForm(modal);
}

function editStudent(studentId) {
    const student = dataService.getStudentById(studentId);
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }
    
    const formContent = generateStudentForm(student);
    const modal = createModal('Edit Student', formContent);
    initializeStudentForm(modal, student);
}

function deleteStudent(studentId) {
    const student = dataService.getStudentById(studentId);
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }
    
    showConfirm(
        'Delete Student',
        `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
        () => {
            if (dataService.deleteStudent(studentId)) {
                showToast('Student deleted successfully', 'success');
                refreshStudentsTab();
            } else {
                showToast('Failed to delete student', 'error');
            }
        }
    );
}

// Filter and search functions
function handleSearch(query) {
    searchQuery = query;
    currentPage = 1;
    refreshStudentsTab();
}

function handleBranchFilter(branch) {
    filters.branch = branch;
    currentPage = 1;
    refreshStudentsTab();
}

function handleYearFilter(year) {
    filters.year = year;
    currentPage = 1;
    refreshStudentsTab();
}

function clearFilters() {
    searchQuery = '';
    filters = { branch: '', year: '' };
    currentPage = 1;
    
    // Reset form values
    const searchInput = document.querySelector('input[type="text"]');
    const branchSelect = document.querySelector('select');
    const yearSelect = document.querySelectorAll('select')[1];
    
    if (searchInput) searchInput.value = '';
    if (branchSelect) branchSelect.value = '';
    if (yearSelect) yearSelect.value = '';
    
    refreshStudentsTab();
}

function applyFilters(students) {
    let filtered = [...students];
    
    // Apply search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.rollNo.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.branch.toLowerCase().includes(query)
        );
    }
    
    // Apply branch filter
    if (filters.branch) {
        filtered = filtered.filter(student => student.branch === filters.branch);
    }
    
    // Apply year filter
    if (filters.year) {
        filtered = filtered.filter(student => student.year === filters.year);
    }
    
    return filtered;
}

function paginate(data, page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
}

function goToPage(page) {
    currentPage = page;
    refreshStudentsTab();
}

function refreshStudentsTab() {
    if (currentTab === 'students') {
        const user = authService.getCurrentUser();
        const students = user.department ? 
            dataService.getStudentsByDepartment(user.department) : 
            dataService.getStudents();
        
        const content = generateStudentsTab(students);
        document.getElementById('tab-content').innerHTML = content;
    }
}

// Import/Export functions
function importStudents() {
    const content = `
        <div class="space-y-4">
            <p class="text-muted-foreground">Import student data from CSV or JSON file</p>
            <div class="grid grid-cols-2 gap-4">
                <button onclick="importFromCSV()" class="btn btn-outline">
                    Import CSV
                </button>
                <button onclick="importFromJSON()" class="btn btn-outline">
                    Import JSON
                </button>
            </div>
        </div>
    `;
    
    createModal('Import Students', content);
}

function importFromCSV() {
    createFileUpload('.csv', (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const students = dataService.importFromCSV(e.target.result);
                showToast(`Successfully imported ${students.length} students`, 'success');
                closeModal(document.querySelector('.modal-overlay'));
                refreshStudentsTab();
            } catch (error) {
                showToast(error.message, 'error');
            }
        };
        reader.readAsText(file);
    });
}

function importFromJSON() {
    createFileUpload('.json', (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const students = dataService.importFromJSON(e.target.result);
                showToast(`Successfully imported ${students.length} students`, 'success');
                closeModal(document.querySelector('.modal-overlay'));
                refreshStudentsTab();
            } catch (error) {
                showToast(error.message, 'error');
            }
        };
        reader.readAsText(file);
    });
}

function exportStudents() {
    const content = `
        <div class="space-y-4">
            <p class="text-muted-foreground">Export student data to file</p>
            <div class="grid grid-cols-2 gap-4">
                <button onclick="exportToCSV()" class="btn btn-primary">
                    Export as CSV
                </button>
                <button onclick="exportToJSON()" class="btn btn-primary">
                    Export as JSON
                </button>
            </div>
        </div>
    `;
    
    createModal('Export Students', content);
}

function exportToCSV() {
    try {
        const csvContent = dataService.exportToCSV();
        downloadFile(csvContent, 'students.csv', 'text/csv');
        showToast('Students exported successfully', 'success');
        closeModal(document.querySelector('.modal-overlay'));
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function exportToJSON() {
    try {
        const jsonContent = dataService.exportToJSON();
        downloadFile(jsonContent, 'students.json', 'application/json');
        showToast('Students exported successfully', 'success');
        closeModal(document.querySelector('.modal-overlay'));
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Make functions globally available
window.switchTab = switchTab;
window.addStudent = addStudent;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.handleSearch = handleSearch;
window.handleBranchFilter = handleBranchFilter;
window.handleYearFilter = handleYearFilter;
window.clearFilters = clearFilters;
window.goToPage = goToPage;
window.importStudents = importStudents;
window.importFromCSV = importFromCSV;
window.importFromJSON = importFromJSON;
window.exportStudents = exportStudents;
window.exportToCSV = exportToCSV;
window.exportToJSON = exportToJSON;