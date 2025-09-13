import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  student?: Student | null;
}

const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
}) => {
  const [formData, setFormData] = useState<Student>({
    id: '',
    rollNo: '',
    name: '',
    branch: '',
    year: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    attendance: '',
    cgpa: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Student>>({});

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        id: '',
        rollNo: '',
        name: '',
        branch: '',
        year: '',
        dob: '',
        email: '',
        phone: '',
        address: '',
        attendance: '',
        cgpa: '',
        notes: '',
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const branches = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics and Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
  ];

  const years = ['1', '2', '3', '4'];

  const validateForm = (): boolean => {
    const newErrors: Partial<Student> = {};

    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll number is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (formData.attendance && (isNaN(Number(formData.attendance)) || Number(formData.attendance) < 0 || Number(formData.attendance) > 100)) {
      newErrors.attendance = 'Attendance must be between 0-100';
    }
    if (formData.cgpa && (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10)) {
      newErrors.cgpa = 'CGPA must be between 0-10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const studentData: Student = {
      ...formData,
      id: formData.id || `student_${Date.now()}`,
    };

    onSave(studentData);
    onClose();
  };

  const handleInputChange = (field: keyof Student, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {student ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Roll Number */}
            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number *</Label>
              <Input
                id="rollNo"
                value={formData.rollNo}
                onChange={(e) => handleInputChange('rollNo', e.target.value)}
                className={`academic-input ${errors.rollNo ? 'border-destructive' : ''}`}
                placeholder="Enter roll number"
              />
              {errors.rollNo && <p className="text-sm text-destructive">{errors.rollNo}</p>}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`academic-input ${errors.name ? 'border-destructive' : ''}`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                <SelectTrigger className={`academic-input ${errors.branch ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && <p className="text-sm text-destructive">{errors.branch}</p>}
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                <SelectTrigger className={`academic-input ${errors.year ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>Year {year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="academic-input"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`academic-input ${errors.email ? 'border-destructive' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`academic-input ${errors.phone ? 'border-destructive' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            {/* Attendance */}
            <div className="space-y-2">
              <Label htmlFor="attendance">Attendance (%)</Label>
              <Input
                id="attendance"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.attendance}
                onChange={(e) => handleInputChange('attendance', e.target.value)}
                className={`academic-input ${errors.attendance ? 'border-destructive' : ''}`}
                placeholder="Enter attendance percentage"
              />
              {errors.attendance && <p className="text-sm text-destructive">{errors.attendance}</p>}
            </div>

            {/* CGPA */}
            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.cgpa}
                onChange={(e) => handleInputChange('cgpa', e.target.value)}
                className={`academic-input ${errors.cgpa ? 'border-destructive' : ''}`}
                placeholder="Enter CGPA"
              />
              {errors.cgpa && <p className="text-sm text-destructive">{errors.cgpa}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="academic-input"
              placeholder="Enter address"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="academic-input"
              placeholder="Additional notes"
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-primary-glow">
              <Save className="h-4 w-4 mr-2" />
              {student ? 'Update' : 'Save'} Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;