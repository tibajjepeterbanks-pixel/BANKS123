'use client';

import Link from 'next/link';

const COLLEGES = [
  {
    id: 'caes',
    name: 'College of Agricultural and Environmental Sciences',
    code: 'CAES',
    icon: '🌾',
    departments: 12,
    papers: 245
  },
  {
    id: 'cobams',
    name: 'College of Business and Management Sciences',
    code: 'COBAMS',
    icon: '💼',
    departments: 8,
    papers: 189
  },
  {
    id: 'cocis',
    name: 'College of Computing and Information Sciences',
    code: 'CoCIS',
    icon: '💻',
    departments: 5,
    papers: 456
  },
  {
    id: 'cees',
    name: 'College of Education and External Studies',
    code: 'CEES',
    icon: '📚',
    departments: 10,
    papers: 334
  },
  {
    id: 'cedat',
    name: 'College of Engineering, Design, Art and Technology',
    code: 'CEDAT',
    icon: '⚙️',
    departments: 15,
    papers: 567
  },
  {
    id: 'chs',
    name: 'College of Health Sciences',
    code: 'CHS',
    icon: '🏥',
    departments: 8,
    papers: 298
  },
  {
    id: 'chuss',
    name: 'College of Humanities and Social Sciences',
    code: 'CHUSS',
    icon: '🎭',
    departments: 12,
    papers: 412
  },
  {
    id: 'conas',
    name: 'College of Natural Sciences',
    code: 'CONAS',
    icon: '🔬',
    departments: 6,
    papers: 378
  },
  {
    id: 'sol',
    name: 'School of Law',
    code: 'SOL',
    icon: '⚖️',
    departments: 3,
    papers: 156
  },
  {
    id: 'covab',
    name: 'College of Veterinary Medicine, Animal Resources and Biosecurity',
    code: 'COVAB',
    icon: '🐾',
    departments: 4,
    papers: 189
  },
];

export function CollegeGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {COLLEGES.map((college) => (
        <Link key={college.id} href={`/colleges/${college.id}`}>
          <div className="h-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-card hover:shadow-hover card-hover cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{college.icon}</div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">
                {college.code}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-2 line-clamp-2">
              {college.name}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {college.departments} departments • {college.papers} papers
            </p>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="text-makerere-maroon font-semibold text-sm hover:text-makerere-gold transition-colors">
                Browse Papers →
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
