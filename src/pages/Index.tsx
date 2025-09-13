import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import StudentTable from '@/components/StudentTable';
import StudentForm from '@/components/StudentForm';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV, exportToJSON, parseCSV, generateSampleData } from '@/utils/dataUtils';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  // Initialize with sample data if empty
  useEffect(() => {
    if (students.length === 0) {
      const sampleData = generateSampleData();
      setStudents(sampleData);
      toast({
        title: "Welcome to StudentFlow!",
        description: `Loaded ${sampleData.length} sample students to get you started.`,
      });
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: darkMode ? "Light Mode" : "Dark Mode",
      description: `Switched to ${darkMode ? 'light' : 'dark'} mode.`,
    });
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({
      title: "Student Deleted",
      description: "Student record has been deleted successfully.",
    });
  };

  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === student.id ? student : s));
      toast({
        title: "Student Updated",
        description: "Student record has been updated successfully.",
      });
    } else {
      setStudents([...students, student]);
      toast({
        title: "Student Added",
        description: "New student record has been added successfully.",
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          let importedStudents: Student[] = [];

          if (file.name.endsWith('.json')) {
            const data = JSON.parse(content);
            importedStudents = data.students || [];
          } else if (file.name.endsWith('.csv')) {
            importedStudents = parseCSV(content);
          }

          if (importedStudents.length > 0) {
            setStudents([...students, ...importedStudents]);
            toast({
              title: "Data Imported",
              description: `Successfully imported ${importedStudents.length} student records.`,
            });
          }
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Failed to import data. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportData = () => {
    exportToCSV(students);
    toast({
      title: "Data Exported",
      description: "Student data has been exported to CSV format.",
    });
  };

  const handleBackupData = () => {
    exportToJSON(students);
    toast({
      title: "Backup Created",
      description: "Complete backup has been downloaded as JSON file.",
    });
  };

  const handleRestoreData = (data: any) => {
    if (data.students && Array.isArray(data.students)) {
      setStudents(data.students);
    }
  };

  const handleClearData = () => {
    setStudents([]);
    localStorage.removeItem('students');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard students={students} />;
      case 'students':
        return (
          <StudentTable
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onImportData={handleImportData}
            onExportData={handleExportData}
          />
        );
      case 'reports':
        return <Reports students={students} />;
      case 'settings':
        return (
          <Settings
            onBackupData={handleBackupData}
            onRestoreData={handleRestoreData}
            onClearData={handleClearData}
            studentCount={students.length}
          />
        );
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  );
};

export default Index;
