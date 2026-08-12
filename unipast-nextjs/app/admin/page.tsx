'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface AdminStats {
  totalStudents: number;
  totalPapers: number;
  totalDownloads: number;
  totalRevenue: number;
  recentActivity: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details: string;
  }>;
  downloadsPerDay: Array<{
    date: string;
    count: number;
  }>;
  topPapers: Array<{
    courseCode: string;
    courseName: string;
    downloads: number;
    revenue: number;
  }>;
}

// Mock data
const MOCK_STATS: AdminStats = {
  totalStudents: 1240,
  totalPapers: 3480,
  totalDownloads: 27560,
  totalRevenue: 5512000, // UGX
  recentActivity: [
    {
      id: '1',
      action: 'Paper Downloaded',
      user: 'student@example.com',
      timestamp: '2 minutes ago',
      details: 'CSC2101 - Database Systems (2024/2025)',
    },
    {
      id: '2',
      action: 'Payment Verified',
      user: 'john@makerere.ac.ug',
      timestamp: '5 minutes ago',
      details: 'Reference: UNIPAST-20240815-A7B9C2',
    },
    {
      id: '3',
      action: 'Paper Uploaded',
      user: 'admin@unipast.ac.ug',
      timestamp: '1 hour ago',
      details: 'BIT2202 - Web Development (2024/2025) - 45 pages',
    },
    {
      id: '4',
      action: 'User Registered',
      user: 'newstudent@gmail.com',
      timestamp: '3 hours ago',
      details: 'Year 2 - College of Computing and Information Sciences',
    },
    {
      id: '5',
      action: 'Payment Failed',
      user: 'student2@example.com',
      timestamp: '5 hours ago',
      details: 'Reference: UNIPAST-20240815-X2Y8Z1',
    },
  ],
  downloadsPerDay: [
    { date: 'Mon', count: 145 },
    { date: 'Tue', count: 287 },
    { date: 'Wed', count: 201 },
    { date: 'Thu', count: 356 },
    { date: 'Fri', count: 423 },
    { date: 'Sat', count: 189 },
    { date: 'Sun', count: 134 },
  ],
  topPapers: [
    { courseCode: 'CSC2101', courseName: 'Database Systems', downloads: 1240, revenue: 248000 },
    { courseCode: 'MAT1101', courseName: 'Calculus I', downloads: 987, revenue: 197400 },
    { courseCode: 'ENG1101', courseName: 'English Composition', downloads: 856, revenue: 171200 },
    { courseCode: 'ECO1105', courseName: 'Microeconomics', downloads: 723, revenue: 144600 },
    { courseCode: 'BIT2202', courseName: 'Web Development', downloads: 645, revenue: 129000 },
  ],
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      // In production, verify user role is ADMIN
      // For now, just load the mock data
      setLoading(false);
      setStats(MOCK_STATS);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-yellow-600 rounded-full"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Welcome back, {session?.user?.name || 'Admin'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Students</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.totalStudents.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              ↑ 12.5% from last month
            </p>
          </div>

          {/* Total Papers */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Papers</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.totalPapers.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              ↑ 8.3% from last month
            </p>
          </div>

          {/* Total Downloads */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Downloads</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.totalDownloads.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              ↑ 24.8% from last month
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              UGX {(stats.totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              ↑ 31.2% from last month
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button variant="primary" className="w-full">
            ➕ Upload Paper
          </Button>
          <Button variant="secondary" className="w-full">
            ✓ Verify Payments
          </Button>
          <Button variant="secondary" className="w-full">
            👥 Manage Users
          </Button>
          <Button variant="secondary" className="w-full">
            📊 View Analytics
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
          {(['overview', 'activity', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Downloads Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Downloads This Week
              </h3>

              <div className="flex items-end justify-between gap-2 h-48">
                {stats.downloadsPerDay.map((day) => {
                  const maxHeight = Math.max(...stats.downloadsPerDay.map((d) => d.count));
                  const height = (day.count / maxHeight) * 100;

                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t mb-2" 
                           style={{ height: `${height}%`, minHeight: '20px' }}></div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{day.date}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{day.count}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Papers */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Top 5 Papers
              </h3>

              <div className="space-y-3">
                {stats.topPapers.map((paper, idx) => (
                  <div key={paper.courseCode} className="flex items-start gap-3">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {paper.courseCode}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {paper.downloads} downloads
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        UGX {(paper.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivity.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {activity.user}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {activity.details}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {activity.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Revenue Metrics
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Daily Average</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      UGX {(stats.totalRevenue / 30).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Weekly Average
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      UGX {(stats.totalRevenue / 4).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Total</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      UGX {stats.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                User Metrics
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-slate-700 dark:text-slate-300">Active Students</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {Math.floor(stats.totalStudents * 0.75)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-slate-700 dark:text-slate-300">Total Downloads</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.totalDownloads.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-slate-700 dark:text-slate-300">Avg Downloads/Student</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(stats.totalDownloads / stats.totalStudents).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
