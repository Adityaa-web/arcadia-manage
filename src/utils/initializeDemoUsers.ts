// Initialize demo users for testing
export const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem('mock_users');
  
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 'teacher1',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'teacher'
      },
      {
        id: 'student1',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
        profile: {
          rollNo: 'CS001',
          name: 'John Doe',
          branch: 'Computer Science',
          year: '3',
          cgpa: 8.5,
          attendance: 85
        }
      },
      {
        id: 'student2',
        email: 'student2@example.com',
        password: 'password123',
        role: 'student',
        profile: {
          rollNo: 'CS002',
          name: 'Jane Smith',
          branch: 'Computer Science',
          year: '2',
          cgpa: 9.2,
          attendance: 92
        }
      }
    ];
    
    localStorage.setItem('mock_users', JSON.stringify(demoUsers));
  }
};