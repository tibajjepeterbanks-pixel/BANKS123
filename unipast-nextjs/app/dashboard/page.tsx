'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface Download {
  id: string;
  paperCode: string;
  paperName: string;
  downloadedAt: string;
  pages: number;
  fileSize: number;
}

interface Bookmark {
  id: string;
  paperCode: string;
  paperName: string;
  college: string;
  year: number;
  addedAt: string;
}

interface DashboardStats {
  totalDownloads: number;
  totalSpent: number;
  totalBookmarks: number;
  downloads: Download[];
  bookmarks: Bookmark[];
}

// Mock data
const MOCK_STATS: DashboardStats = {
  totalDownloads: 24,
  totalSpent: 4800, // UGX
  totalBookmarks: 12,
  downloads: [
    {
      id: '1',
      paperCode: 'CSC2101',
      paperName: 'Database Systems - 2024/2025',
      downloadedAt: '2024-08-14',
      pages: 45,
      fileSize: 2048,
    },
    {
      id: '2',
      paperCode: 'MAT1101',
      paperName: 'Calculus I - 2024/2025',
      downloadedAt: '2024-08-12',
      pages: 52,
      fileSize: 2156,
    },
    {
      id: '3',
      paperCode: 'ENG1101',
      paperName: 'English Composition - 2024/2025',
      downloadedAt: '2024-08-10',
      pages: 28,
      fileSize: 892,
    },
  ],
  bookmarks: [
    {
      id: '1',
      paperCode: 'BIT2202',
      paperName: 'Web Development',
      college: 'CoCIS',
      year: 2,
      addedAt: '2024-08-13',
    },
    {
      id: '2',
      paperCode: 'ECO1105',
      paperName: 'Microeconomics',
      college: 'COBAMS',
      year: 1,
      addedAt: '2024-08-11',
    },
  ],
};

type TabType = 'overview' | 'downloads' | 'bookmarks' | 'settings';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
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

  if (status === 'unauthenticated') {
    return null;
  }

  const formatFileSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {session?.user?.name || 'Student'}! 👋
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Manage your downloads, bookmarks, and preferences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Downloads */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Downloads</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.totalDownloads}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              This month: {stats.totalDownloads}
            </p>
          </div>

          {/* Amount Spent */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Amount Spent</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              UGX {stats.totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              At UGX 200 per paper
            </p>
          </div>

          {/* Bookmarks */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Bookmarks</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.totalBookmarks}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Saved for later
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          {(['overview', 'downloads', 'bookmarks', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'downloads' && '⬇️ Downloads'}
              {tab === 'bookmarks' && '⭐ Bookmarks'}
              {tab === 'settings' && '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Downloads */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recent Downloads
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('downloads')}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {stats.downloads.map((download) => (
                  <div
                    key={download.id}
                    className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {download.paperCode}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {download.paperName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {formatDate(download.downloadedAt)} • {download.pages} pages • {formatFileSize(download.fileSize)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      📖
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push('/papers')}
                >
                  🔍 Browse Papers
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setActiveTab('bookmarks')}
                >
                  ⭐ My Bookmarks
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push('/colleges')}
                >
                  🏫 Browse Colleges
                </Button>

                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                  className="w-full px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm"
                >
                  🚪 Sign Out
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Tip:</strong> Download papers while you study for exams to prepare better.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              All Downloads ({stats.downloads.length})
            </h2>

            {stats.downloads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Course Code
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Paper Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Pages
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        File Size
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Downloaded
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.downloads.map((download) => (
                      <tr
                        key={download.id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-mono font-semibold text-yellow-600 dark:text-yellow-400">
                          {download.paperCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                          {download.paperName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {download.pages}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {formatFileSize(download.fileSize)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {formatDate(download.downloadedAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No downloads yet. Start downloading papers!
                </p>
                <Button variant="primary" onClick={() => router.push('/papers')}>
                  Browse Papers
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Bookmarked Papers ({stats.bookmarks.length})
            </h2>

            {stats.bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {bookmark.paperCode}
                      </h3>
                      <button className="text-yellow-400 text-xl">⭐</button>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {bookmark.paperName}
                    </p>

                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-500 mb-4">
                      <span>{bookmark.college}</span>
                      <span>Year {bookmark.year}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" className="flex-1">
                        Download
                      </Button>
                      <button className="px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm font-medium transition-colors">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No bookmarked papers yet. Save papers for later!
                </p>
                <Button variant="primary" onClick={() => router.push('/papers')}>
                  Browse Papers
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Account Settings
            </h2>

            {/* Profile Section */}
            <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Profile Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name || ''}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              <Button variant="secondary" className="mt-4">
                Edit Profile
              </Button>
            </div>

            {/* Preferences Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Preferences
              </h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  <span className="text-slate-900 dark:text-white">Email notifications for new papers</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  <span className="text-slate-900 dark:text-white">Newsletter updates</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-slate-900 dark:text-white">Marketing emails</span>
                </label>
              </div>

              <Button variant="secondary" className="mt-4">
                Save Preferences
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h3>

              <Button variant="outline" className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400">
                Change Password
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
