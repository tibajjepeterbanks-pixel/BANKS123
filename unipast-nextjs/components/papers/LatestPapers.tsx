'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock data - in production, fetch from API
const LATEST_PAPERS = [
  {
    id: 1,
    code: 'CSC2101',
    name: 'Database Systems',
    academicYear: '2024/2025',
    fileName: 'Database-Systems-Final-2024.pdf',
    pages: 42,
    fileSize: '2.4 MB',
    uploadedDate: '2024-11-15',
    college: 'CoCIS',
    views: 1240,
  },
  {
    id: 2,
    code: 'EMT1101',
    name: 'Engineering Mathematics I',
    academicYear: '2024/2025',
    fileName: 'EngMath-I-2024.pdf',
    pages: 38,
    fileSize: '1.9 MB',
    uploadedDate: '2024-11-14',
    college: 'CEDAT',
    views: 856,
  },
  {
    id: 3,
    code: 'BIO1102',
    name: 'Cell Biology',
    academicYear: '2024/2025',
    fileName: 'Cell-Biology-Exam-2024.pdf',
    pages: 35,
    fileSize: '2.1 MB',
    uploadedDate: '2024-11-13',
    college: 'CAES',
    views: 634,
  },
  {
    id: 4,
    code: 'CSC1101',
    name: 'Programming I',
    academicYear: '2024/2025',
    fileName: 'Prog-I-Midterm-2024.pdf',
    pages: 28,
    fileSize: '1.5 MB',
    uploadedDate: '2024-11-12',
    college: 'CoCIS',
    views: 2341,
  },
];

export function LatestPapers() {
  const [papers] = useState(LATEST_PAPERS);

  return (
    <div className="space-y-4">
      {papers.map((paper) => (
        <Link key={paper.id} href={`/papers/${paper.code}`}>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer border-l-4 border-makerere-maroon">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              {/* Paper Info */}
              <div className="md:col-span-2">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">📄</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {paper.code} - {paper.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {paper.fileName}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {paper.college}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                        {paper.academicYear}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p><span className="font-semibold">Pages:</span> {paper.pages}</p>
                <p><span className="font-semibold">Size:</span> {paper.fileSize}</p>
                <p><span className="font-semibold">Uploaded:</span> {new Date(paper.uploadedDate).toLocaleDateString()}</p>
              </div>

              {/* Action & Stats */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gradient">{paper.views}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">views</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-makerere-maroon to-makerere-gold text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                  Download
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}

      <div className="text-center pt-6">
        <Link href="/papers">
          <button className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-makerere-maroon text-makerere-maroon font-semibold rounded-lg hover:bg-makerere-maroon hover:text-white transition-all">
            View All Papers
          </button>
        </Link>
      </div>
    </div>
  );
}
