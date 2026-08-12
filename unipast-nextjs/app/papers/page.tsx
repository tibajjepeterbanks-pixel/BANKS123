'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';

interface Paper {
  id: string;
  courseCode: string;
  courseName: string;
  academicYear: string;
  fileName: string;
  fileSize: number;
  pages: number;
  college: string;
  views: number;
  uploadedDate: string;
}

interface FilterOptions {
  college: string;
  year: string;
  semester: string;
  searchTerm: string;
}

const MOCK_PAPERS: Paper[] = [
  {
    id: '1',
    courseCode: 'CSC2101',
    courseName: 'Database Systems',
    academicYear: '2024/2025',
    fileName: 'Database_Systems_2024.pdf',
    fileSize: 2048000,
    pages: 45,
    college: 'CoCIS',
    views: 324,
    uploadedDate: '2024-08-15',
  },
  {
    id: '2',
    courseCode: 'CSC1101',
    courseName: 'Programming I',
    academicYear: '2024/2025',
    fileName: 'Programming_I_2024.pdf',
    fileSize: 1856000,
    pages: 38,
    college: 'CoCIS',
    views: 567,
    uploadedDate: '2024-08-10',
  },
  {
    id: '3',
    courseCode: 'BIT2202',
    courseName: 'Web Development',
    academicYear: '2024/2025',
    fileName: 'Web_Dev_2024.pdf',
    fileSize: 3256000,
    pages: 62,
    college: 'CoCIS',
    views: 412,
    uploadedDate: '2024-08-05',
  },
  {
    id: '4',
    courseCode: 'ECO1105',
    courseName: 'Microeconomics',
    academicYear: '2024/2025',
    fileName: 'Microeconomics_2024.pdf',
    fileSize: 1524000,
    pages: 35,
    college: 'COBAMS',
    views: 289,
    uploadedDate: '2024-07-28',
  },
  {
    id: '5',
    courseCode: 'ENG1101',
    courseName: 'English Composition',
    academicYear: '2024/2025',
    fileName: 'English_Composition_2024.pdf',
    fileSize: 892000,
    pages: 28,
    college: 'CHUSS',
    views: 198,
    uploadedDate: '2024-07-20',
  },
  {
    id: '6',
    courseCode: 'MAT1101',
    courseName: 'Calculus I',
    academicYear: '2024/2025',
    fileName: 'Calculus_I_2024.pdf',
    fileSize: 2156000,
    pages: 52,
    college: 'CoCIS',
    views: 645,
    uploadedDate: '2024-07-15',
  },
];

const COLLEGES = [
  'All Colleges',
  'CAES',
  'COBAMS',
  'CoCIS',
  'CEES',
  'CEDAT',
  'CHS',
  'CHUSS',
  'CONAS',
  'SOL',
  'COVAB',
];

const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS = ['All Semesters', '1st Semester', '2nd Semester'];

export default function PapersPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [papers, setPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'mostDownloaded' | 'mostViewed'>('newest');
  const [filters, setFilters] = useState<FilterOptions>({
    college: 'All Colleges',
    year: 'All Years',
    semester: 'All Semesters',
    searchTerm: initialSearch,
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPapers = filteredPapers.slice(startIndex, endIndex);

  useEffect(() => {
    let result = papers;

    // Apply college filter
    if (filters.college !== 'All Colleges') {
      result = result.filter((p) => p.college === filters.college);
    }

    // Apply search term filter
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.courseCode.toLowerCase().includes(search) ||
          p.courseName.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    const sortedResult = [...result];
    switch (sortBy) {
      case 'mostDownloaded':
        sortedResult.sort((a, b) => b.views - a.views);
        break;
      case 'mostViewed':
        sortedResult.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        sortedResult.sort(
          (a, b) => new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
        );
    }

    setFilteredPapers(sortedResult);
    setCurrentPage(1);
  }, [filters, sortBy, papers]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Browse Past Papers
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Search and download past papers from {papers.length}+ available papers
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Filter Papers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Course code or name"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* College Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                College
              </label>
              <select
                value={filters.college}
                onChange={(e) => handleFilterChange('college', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {COLLEGES.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Semester
              </label>
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'newest' | 'mostDownloaded' | 'mostViewed')
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="newest">Newest First</option>
                <option value="mostDownloaded">Most Downloaded</option>
                <option value="mostViewed">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredPapers.length} result{filteredPapers.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Papers Table */}
        {displayedPapers.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Course Code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Course Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Pages
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Views
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPapers.map((paper) => (
                    <tr
                      key={paper.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-yellow-600 dark:text-yellow-400">
                        {paper.courseCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {paper.courseName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded text-xs font-medium">
                          {paper.college}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {paper.academicYear}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {paper.pages}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatFileSize(paper.fileSize)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        👁️ {paper.views}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => (window.location.href = `/papers/${paper.courseCode}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">No papers found</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Try adjusting your filters or search term
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-yellow-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </Button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Pro Tip:</strong> Each paper costs UGX 200. Sign in to download papers and
            save your favorites.
          </p>
        </div>
      </div>
    </div>
  );
}
