'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface UploadFormData {
  college: string;
  school: string;
  programme: string;
  courseCode: string;
  courseName: string;
  year: string;
  semester: string;
  academicYear: string;
  file: File | null;
}

interface UploadError {
  field: string;
  message: string;
}

// Mock data for dropdowns
const COLLEGES = [
  { id: '1', name: 'CAES', label: 'College of Agricultural and Environmental Sciences' },
  { id: '2', name: 'COBAMS', label: 'College of Business and Management Sciences' },
  { id: '3', name: 'CoCIS', label: 'College of Computing and Information Sciences' },
  { id: '4', name: 'CEES', label: 'College of Engineering, Design and Technology' },
  { id: '5', name: 'CEDAT', label: 'College of Education' },
  { id: '6', name: 'CHS', label: 'College of Health Sciences' },
  { id: '7', name: 'CHUSS', label: 'College of Humanities and Social Sciences' },
  { id: '8', name: 'CONAS', label: 'College of Natural Sciences' },
  { id: '9', name: 'SOL', label: 'School of Law' },
  { id: '10', name: 'COVAB', label: 'College of Veterinary, Animal and Biomedical Sciences' },
];

const SCHOOLS: Record<string, Array<{ id: string; name: string }>> = {
  CoCIS: [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Information Technology' },
    { id: '3', name: 'Software Engineering' },
  ],
  COBAMS: [
    { id: '1', name: 'Accounting' },
    { id: '2', name: 'Business Administration' },
    { id: '3', name: 'Economics' },
  ],
  CHUSS: [
    { id: '1', name: 'English' },
    { id: '2', name: 'History' },
    { id: '3', name: 'Languages' },
  ],
};

const YEARS = ['1', '2', '3', '4'];
const SEMESTERS = ['1', '2'];
const ACADEMIC_YEARS = ['2024/2025', '2025/2026', '2023/2024', '2022/2023'];

export default function PaperUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<UploadFormData>({
    college: '',
    school: '',
    programme: '',
    courseCode: '',
    courseName: '',
    year: '',
    semester: '',
    academicYear: '',
    file: null,
  });

  const [errors, setErrors] = useState<UploadError[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const selectedCollege = COLLEGES.find((c) => c.id === formData.college);
  const availableSchools = formData.college
    ? SCHOOLS[selectedCollege?.name as keyof typeof SCHOOLS] || []
    : [];

  const validateForm = (): boolean => {
    const newErrors: UploadError[] = [];

    if (!formData.college) newErrors.push({ field: 'college', message: 'College is required' });
    if (!formData.school) newErrors.push({ field: 'school', message: 'School is required' });
    if (!formData.courseCode) {
      newErrors.push({ field: 'courseCode', message: 'Course code is required' });
    }
    if (!formData.courseName) {
      newErrors.push({ field: 'courseName', message: 'Course name is required' });
    }
    if (!formData.year) newErrors.push({ field: 'year', message: 'Year is required' });
    if (!formData.semester) newErrors.push({ field: 'semester', message: 'Semester is required' });
    if (!formData.academicYear) {
      newErrors.push({ field: 'academicYear', message: 'Academic year is required' });
    }
    if (!formData.file) {
      newErrors.push({ field: 'file', message: 'File is required' });
    } else {
      if (!formData.file.name.endsWith('.pdf')) {
        newErrors.push({ field: 'file', message: 'Only PDF files are allowed' });
      }
      if (formData.file.size > 10 * 1024 * 1024) {
        newErrors.push({ field: 'file', message: 'File size must be less than 10MB' });
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      setErrors((prev) => prev.filter((err) => err.field !== 'file'));
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      setErrors((prev) => prev.filter((err) => err.field !== 'file'));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('college', formData.college);
      formDataToSend.append('school', formData.school);
      formDataToSend.append('courseCode', formData.courseCode);
      formDataToSend.append('courseName', formData.courseName);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('semester', formData.semester);
      formDataToSend.append('academicYear', formData.academicYear);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      // Simulate API call
      const response = await fetch('/api/papers/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          college: '',
          school: '',
          programme: '',
          courseCode: '',
          courseName: '',
          year: '',
          semester: '',
          academicYear: '',
          file: null,
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        const error = await response.json();
        setErrors([{ field: 'submit', message: error.message || 'Upload failed' }]);
      }
    } catch (error) {
      setErrors([{ field: 'submit', message: 'An error occurred. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors.find((err) => err.field === fieldName)?.message;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Upload Past Paper
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Add a new past paper to the UNIPAST database
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-900 dark:text-green-100">
              ✓ Paper uploaded successfully! Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* Error Message */}
        {errors.some((err) => err.field === 'submit') && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-900 dark:text-red-100">
              ✗ {errors.find((err) => err.field === 'submit')?.message}
            </p>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Information Section */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Course Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* College */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  College *
                </label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    getFieldError('college')
                      ? 'border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <option value="">Select College</option>
                  {COLLEGES.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name} - {college.label}
                    </option>
                  ))}
                </select>
                {getFieldError('college') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('college')}</p>
                )}
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  School/Department *
                </label>
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  disabled={!formData.college}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    getFieldError('school')
                      ? 'border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <option value="">Select School</option>
                  {availableSchools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                {getFieldError('school') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('school')}</p>
                )}
              </div>

              {/* Course Code */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  placeholder="e.g., CSC2101"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    getFieldError('courseCode')
                      ? 'border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {getFieldError('courseCode') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('courseCode')}</p>
                )}
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  placeholder="e.g., Database Systems"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    getFieldError('courseName')
                      ? 'border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {getFieldError('courseName') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('courseName')}</p>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    getFieldError('year')
                      ? 'border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <option value="">Select Year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
                {getFieldError('year') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('year')}</p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    getFieldError('semester')
                      ? 'border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <option value="">Select Semester</option>
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                {getFieldError('semester') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('semester')}</p>
                )}
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Academic Year *
                </label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    getFieldError('academicYear')
                      ? 'border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <option value="">Select Year</option>
                  {ACADEMIC_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {getFieldError('academicYear') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('academicYear')}</p>
                )}
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Upload PDF File
            </h2>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                  : 'border-slate-300 dark:border-slate-600 hover:border-yellow-400'
              } ${getFieldError('file') ? 'border-red-500' : ''}`}
            >
              <div className="mb-4 text-4xl">📄</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Drop your PDF here
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                or click to browse from your computer
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />

              <label
                htmlFor="fileInput"
                className="inline-block px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium cursor-pointer transition-colors"
              >
                Select File
              </label>

              <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                <p>Maximum file size: 10 MB</p>
                <p>Supported format: PDF only</p>
              </div>

              {formData.file && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    ✓ Selected: {formData.file.name} ({(formData.file.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              {getFieldError('file') && (
                <p className="text-red-500 text-sm mt-4">{getFieldError('file')}</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? 'Uploading...' : 'Upload Paper'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
            📋 Upload Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✓ Ensure the PDF file is clear and readable</li>
            <li>✓ Remove any sensitive information before uploading</li>
            <li>✓ Use the exact course code as per university records</li>
            <li>✓ Academic year format should be YYYY/YYYY (e.g., 2024/2025)</li>
            <li>✓ Maximum file size is 10 MB</li>
            <li>✓ Papers are moderated before appearing in the database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
