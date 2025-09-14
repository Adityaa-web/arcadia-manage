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

export const exportToCSV = (students: Student[], filename: string = 'students') => {
  const headers = [
    'Roll No',
    'Name',
    'Branch',
    'Year',
    'Date of Birth',
    'Email',
    'Phone',
    'Address',
    'Attendance (%)',
    'CGPA',
    'Notes'
  ];

  const csvContent = [
    headers.join(','),
    ...students.map(student => [
      student.rollNo,
      `"${student.name}"`,
      `"${student.branch}"`,
      student.year,
      student.dob,
      student.email,
      student.phone,
      `"${student.address.replace(/"/g, '""')}"`,
      student.attendance,
      student.cgpa,
      `"${student.notes.replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (students: Student[], filename: string = 'students_backup') => {
  const dataStr = JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    totalStudents: students.length,
    students: students
  }, null, 2);
  
  const blob = new Blob([dataStr], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Update last backup timestamp
  localStorage.setItem('lastBackup', new Date().toISOString());
};

export const parseCSV = (csvText: string): Student[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const students: Student[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handles quoted fields)
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    
    if (values.length >= headers.length - 1) {
      const student: Student = {
        id: `student_${Date.now()}_${i}`,
        rollNo: values[0]?.replace(/"/g, '') || '',
        name: values[1]?.replace(/"/g, '') || '',
        branch: values[2]?.replace(/"/g, '') || '',
        year: values[3]?.replace(/"/g, '') || '',
        dob: values[4]?.replace(/"/g, '') || '',
        email: values[5]?.replace(/"/g, '') || '',
        phone: values[6]?.replace(/"/g, '') || '',
        address: values[7]?.replace(/"/g, '') || '',
        attendance: values[8]?.replace(/"/g, '') || '0',
        cgpa: values[9]?.replace(/"/g, '') || '0',
        notes: values[10]?.replace(/"/g, '') || ''
      };
      
      students.push(student);
    }
  }
  
  return students;
};

export const generateSampleData = (): Student[] => {
  const branches = [
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
  const sampleNames = [
    'Arjun Kumar', 'Priya Sharma', 'Rohit Singh', 'Sneha Patel', 'Vikram Yadav',
    'Anjali Gupta', 'Rajesh Verma', 'Pooja Reddy', 'Amit Joshi', 'Kavya Nair',
    'Sanjay Tiwari', 'Ritika Agarwal', 'Nikhil Chandra', 'Deepika Malhotra', 'Akash Mehta'
  ];
  
  return sampleNames.map((name, index) => ({
    id: `student_${Date.now()}_${index}`,
    rollNo: `2024${String(index + 1).padStart(3, '0')}`,
    name,
    branch: branches[index % branches.length],
    year: years[index % years.length],
    dob: `200${2 + (index % 3)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    email: `${name.toLowerCase().replace(' ', '.')}@college.edu`,
    phone: `98765${String(43210 + index).slice(-5)}`,
    address: `${index + 1} Student Colony, College Road, City - 400${String(index + 1).padStart(3, '0')}`,
    attendance: String(75 + (index % 20) + Math.random() * 5).substring(0, 4),
    cgpa: String(6.5 + (index % 3) + Math.random() * 1.5).substring(0, 4),
    notes: index % 3 === 0 ? 'Active in extracurricular activities' : index % 3 === 1 ? 'Good academic performance' : ''
  }));
};