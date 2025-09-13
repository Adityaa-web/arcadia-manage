import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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

interface StudentTableProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onImportData: () => void;
  onExportData: () => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onImportData,
  onExportData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Get unique branches and years for filters
  const branches = [...new Set(students.map(s => s.branch))].filter(Boolean);
  const years = [...new Set(students.map(s => s.year))].filter(Boolean);

  // Filter and search students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBranch = filterBranch === 'all' || student.branch === filterBranch;
      const matchesYear = filterYear === 'all' || student.year === filterYear;
      
      return matchesSearch && matchesBranch && matchesYear;
    });
  }, [students, searchTerm, filterBranch, filterYear]);

  // Sort students
  const sortedStudents = useMemo(() => {
    if (!sortConfig) return filteredStudents;
    
    return [...filteredStudents].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortConfig]);

  // Paginate students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return sortedStudents.slice(startIndex, startIndex + studentsPerPage);
  }, [sortedStudents, currentPage]);

  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  const handleSort = (key: keyof Student) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getAttendanceBadge = (attendance: string) => {
    const percent = parseFloat(attendance);
    if (percent >= 85) return <Badge className="bg-success text-success-foreground">{attendance}%</Badge>;
    if (percent >= 75) return <Badge className="bg-warning text-warning-foreground">{attendance}%</Badge>;
    return <Badge variant="destructive">{attendance}%</Badge>;
  };

  const getCGPABadge = (cgpa: string) => {
    const score = parseFloat(cgpa);
    if (score >= 8.5) return <Badge className="bg-success text-success-foreground">{cgpa}</Badge>;
    if (score >= 7.0) return <Badge className="bg-primary text-primary-foreground">{cgpa}</Badge>;
    if (score >= 6.0) return <Badge className="bg-warning text-warning-foreground">{cgpa}</Badge>;
    return <Badge variant="destructive">{cgpa}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Management</h2>
          <p className="text-muted-foreground">
            Manage {filteredStudents.length} of {students.length} students
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={onImportData} variant="outline" className="academic-input">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={onExportData} variant="outline" className="academic-input">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onAddStudent} className="bg-gradient-to-r from-primary to-primary-glow">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll no, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 academic-input"
              />
            </div>
            
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="academic-input">
                <SelectValue placeholder="Filter by Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="academic-input">
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>Year {year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterBranch('all');
                setFilterYear('all');
                setSortConfig(null);
              }}
              className="academic-input"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="academic-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {[
                    { key: 'rollNo', label: 'Roll No' },
                    { key: 'name', label: 'Name' },
                    { key: 'branch', label: 'Branch' },
                    { key: 'year', label: 'Year' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'attendance', label: 'Attendance' },
                    { key: 'cgpa', label: 'CGPA' },
                  ].map(({ key, label }) => (
                    <TableHead 
                      key={key}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort(key as keyof Student)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student, index) => (
                  <TableRow 
                    key={student.id}
                    className="table-row-hover animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell className="text-sm">{student.email}</TableCell>
                    <TableCell className="text-sm">{student.phone}</TableCell>
                    <TableCell>{getAttendanceBadge(student.attendance)}</TableCell>
                    <TableCell>{getCGPABadge(student.cgpa)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditStudent(student)}
                          className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteStudent(student.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentTable;