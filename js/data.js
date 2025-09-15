/**
 * Data Management Service
 * Handles student data, storage, import/export functionality
 */

class DataService {
    constructor() {
        this.storageKey = 'students';
        this.initializeSampleData();
    }

    // Initialize sample student data
    initializeSampleData() {
        const existingData = localStorage.getItem(this.storageKey);
        if (!existingData) {
            const sampleStudents = this.generateSampleData();
            localStorage.setItem(this.storageKey, JSON.stringify(sampleStudents));
        }
    }

    // Generate sample student data
    generateSampleData() {
        const branches = [
            'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
            'Civil Engineering', 'Electronics & Communication', 'Information Technology',
            'Chemical Engineering', 'Biotechnology'
        ];

        const firstNames = [
            'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
            'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Melissa', 'Daniel',
            'Michelle', 'Matthew', 'Kimberly', 'Anthony', 'Amy', 'Mark', 'Angela',
            'Donald', 'Helen', 'Steven', 'Deborah', 'Paul', 'Rachel', 'Andrew', 'Carolyn'
        ];

        const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
            'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
            'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
        ];

        const students = [];
        const currentYear = new Date().getFullYear();

        for (let i = 1; i <= 150; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const branch = branches[Math.floor(Math.random() * branches.length)];
            const year = Math.floor(Math.random() * 4) + 1; // 1-4 years
            const rollNo = `${branch.substring(0, 2).toUpperCase()}${(currentYear % 100)}B${i.toString().padStart(3, '0')}`;
            
            // Generate realistic CGPA (weighted towards higher values)
            let cgpa = Math.random() * 10;
            if (cgpa < 5) cgpa = 5 + Math.random() * 2; // Minimum 5.0
            cgpa = Math.round(cgpa * 100) / 100; // Round to 2 decimal places
            
            // Generate attendance (weighted towards higher values)
            let attendance = Math.random() * 100;
            if (attendance < 60) attendance = 60 + Math.random() * 20; // Minimum 60%
            attendance = Math.round(attendance);

            const student = {
                id: `student-${i}`,
                rollNo,
                name: `${firstName} ${lastName}`,
                branch,
                year: year.toString(),
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edu`,
                phone: `98765${(43210 + i).toString().slice(-5)}`,
                dateOfBirth: this.generateRandomDate(2000 + (4 - year), 2005 + (4 - year)),
                cgpa,
                attendance,
                address: `${i + 10} Student Street, Academic City, State ${i % 50 + 10000}`,
                notes: Math.random() > 0.7 ? this.generateRandomNote() : ''
            };

            students.push(student);
        }

        return students.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
    }

    // Generate random date for date of birth
    generateRandomDate(startYear, endYear) {
        const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid month issues
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    // Generate random note
    generateRandomNote() {
        const notes = [
            'Excellent performance in programming courses',
            'Active in extracurricular activities',
            'Needs improvement in attendance',
            'Outstanding project work',
            'Good leadership skills',
            'Participates in coding competitions',
            'Member of technical club',
            'Requires academic counseling'
        ];
        return notes[Math.floor(Math.random() * notes.length)];
    }

    // Get all students
    getStudents() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Get students filtered by department (for teachers)
    getStudentsByDepartment(department) {
        const students = this.getStudents();
        if (!department) return students;
        
        return students.filter(student => 
            student.branch.toLowerCase().includes(department.toLowerCase()) ||
            student.branch === department
        );
    }

    // Get student by ID
    getStudentById(id) {
        const students = this.getStudents();
        return students.find(student => student.id === id);
    }

    // Add new student
    addStudent(studentData) {
        const students = this.getStudents();
        const newStudent = {
            id: `student-${Date.now()}`,
            ...studentData
        };
        students.push(newStudent);
        localStorage.setItem(this.storageKey, JSON.stringify(students));
        return newStudent;
    }

    // Update student
    updateStudent(id, studentData) {
        const students = this.getStudents();
        const index = students.findIndex(student => student.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...studentData };
            localStorage.setItem(this.storageKey, JSON.stringify(students));
            return students[index];
        }
        return null;
    }

    // Delete student
    deleteStudent(id) {
        const students = this.getStudents();
        const filteredStudents = students.filter(student => student.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredStudents));
        return filteredStudents.length < students.length;
    }

    // Export to CSV
    exportToCSV() {
        const students = this.getStudents();
        if (students.length === 0) {
            throw new Error('No student data to export');
        }

        const headers = [
            'Roll No', 'Name', 'Branch', 'Year', 'Email', 'Phone', 
            'Date of Birth', 'CGPA', 'Attendance', 'Address', 'Notes'
        ];

        const csvContent = [
            headers.join(','),
            ...students.map(student => [
                student.rollNo,
                `"${student.name}"`,
                `"${student.branch}"`,
                student.year,
                student.email,
                student.phone,
                student.dateOfBirth,
                student.cgpa,
                student.attendance,
                `"${student.address}"`,
                `"${student.notes || ''}"`
            ].join(','))
        ].join('\n');

        return csvContent;
    }

    // Export to JSON
    exportToJSON() {
        const students = this.getStudents();
        if (students.length === 0) {
            throw new Error('No student data to export');
        }
        return JSON.stringify(students, null, 2);
    }

    // Import from CSV
    importFromCSV(csvContent) {
        try {
            const lines = csvContent.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            const expectedHeaders = [
                'Roll No', 'Name', 'Branch', 'Year', 'Email', 'Phone',
                'Date of Birth', 'CGPA', 'Attendance', 'Address', 'Notes'
            ];

            // Validate headers
            const normalizedHeaders = headers.map(h => h.replace(/"/g, ''));
            const hasValidHeaders = expectedHeaders.every(expected => 
                normalizedHeaders.some(header => header.toLowerCase().includes(expected.toLowerCase()))
            );

            if (!hasValidHeaders) {
                throw new Error('Invalid CSV format. Please check the headers.');
            }

            const students = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const values = this.parseCSVLine(line);
                if (values.length < 10) continue;

                const student = {
                    id: `imported-${Date.now()}-${i}`,
                    rollNo: values[0],
                    name: values[1].replace(/"/g, ''),
                    branch: values[2].replace(/"/g, ''),
                    year: values[3],
                    email: values[4],
                    phone: values[5],
                    dateOfBirth: values[6],
                    cgpa: parseFloat(values[7]) || 0,
                    attendance: parseInt(values[8]) || 0,
                    address: values[9].replace(/"/g, ''),
                    notes: values[10] ? values[10].replace(/"/g, '') : ''
                };

                students.push(student);
            }

            if (students.length === 0) {
                throw new Error('No valid student records found in the CSV file.');
            }

            // Replace existing data
            localStorage.setItem(this.storageKey, JSON.stringify(students));
            return students;
        } catch (error) {
            throw new Error(`CSV import failed: ${error.message}`);
        }
    }

    // Parse CSV line (handles quoted values)
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current);
        return values;
    }

    // Import from JSON
    importFromJSON(jsonContent) {
        try {
            const data = JSON.parse(jsonContent);
            
            if (!Array.isArray(data)) {
                throw new Error('JSON data must be an array of student objects.');
            }

            const requiredFields = ['rollNo', 'name', 'branch', 'year', 'email'];
            const students = data.map((item, index) => {
                // Validate required fields
                for (const field of requiredFields) {
                    if (!item[field]) {
                        throw new Error(`Missing required field '${field}' in record ${index + 1}`);
                    }
                }

                return {
                    id: item.id || `imported-${Date.now()}-${index}`,
                    rollNo: item.rollNo,
                    name: item.name,
                    branch: item.branch,
                    year: item.year.toString(),
                    email: item.email,
                    phone: item.phone || '',
                    dateOfBirth: item.dateOfBirth || '',
                    cgpa: parseFloat(item.cgpa) || 0,
                    attendance: parseInt(item.attendance) || 0,
                    address: item.address || '',
                    notes: item.notes || ''
                };
            });

            localStorage.setItem(this.storageKey, JSON.stringify(students));
            return students;
        } catch (error) {
            throw new Error(`JSON import failed: ${error.message}`);
        }
    }

    // Clear all data
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        return true;
    }

    // Get statistics
    getStatistics(department = null) {
        const students = department ? 
            this.getStudentsByDepartment(department) : 
            this.getStudents();

        if (students.length === 0) {
            return {
                totalStudents: 0,
                averageCGPA: 0,
                averageAttendance: 0,
                branchDistribution: {},
                yearDistribution: {},
                performanceDistribution: {
                    excellent: 0,
                    good: 0,
                    average: 0,
                    poor: 0
                }
            };
        }

        const totalStudents = students.length;
        const averageCGPA = students.reduce((sum, s) => sum + s.cgpa, 0) / totalStudents;
        const averageAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents;

        // Branch distribution
        const branchDistribution = {};
        students.forEach(student => {
            branchDistribution[student.branch] = (branchDistribution[student.branch] || 0) + 1;
        });

        // Year distribution
        const yearDistribution = {};
        students.forEach(student => {
            yearDistribution[student.year] = (yearDistribution[student.year] || 0) + 1;
        });

        // Performance distribution
        const performanceDistribution = {
            excellent: students.filter(s => s.cgpa >= 8.5).length,
            good: students.filter(s => s.cgpa >= 7.0 && s.cgpa < 8.5).length,
            average: students.filter(s => s.cgpa >= 6.0 && s.cgpa < 7.0).length,
            poor: students.filter(s => s.cgpa < 6.0).length
        };

        return {
            totalStudents,
            averageCGPA: Math.round(averageCGPA * 100) / 100,
            averageAttendance: Math.round(averageAttendance),
            branchDistribution,
            yearDistribution,
            performanceDistribution
        };
    }

    // Search students
    searchStudents(query, filters = {}) {
        let students = this.getStudents();

        // Apply department filter for teachers
        if (filters.department) {
            students = this.getStudentsByDepartment(filters.department);
        }

        // Apply search query
        if (query) {
            const searchTerm = query.toLowerCase();
            students = students.filter(student =>
                student.name.toLowerCase().includes(searchTerm) ||
                student.rollNo.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm) ||
                student.branch.toLowerCase().includes(searchTerm)
            );
        }

        // Apply additional filters
        if (filters.branch) {
            students = students.filter(student => student.branch === filters.branch);
        }

        if (filters.year) {
            students = students.filter(student => student.year === filters.year);
        }

        return students;
    }

    // Get backup info
    getBackupInfo() {
        const students = this.getStudents();
        const sizeInBytes = JSON.stringify(students).length;
        const lastUpdated = localStorage.getItem(`${this.storageKey}_last_updated`) || new Date().toISOString();
        
        return {
            totalRecords: students.length,
            sizeInBytes,
            sizeFormatted: this.formatBytes(sizeInBytes),
            lastUpdated: new Date(lastUpdated).toLocaleDateString()
        };
    }

    // Format bytes to human readable
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update last modified timestamp
    updateTimestamp() {
        localStorage.setItem(`${this.storageKey}_last_updated`, new Date().toISOString());
    }
}

// Create global data service instance
const dataService = new DataService();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}