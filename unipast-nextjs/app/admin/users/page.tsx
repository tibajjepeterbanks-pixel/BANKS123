'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN' | 'SUPERADMIN';
  registrationNumber?: string;
  collegeName?: string;
  programme?: string;
  year?: number;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'John Doe',
    role: 'STUDENT',
    registrationNumber: '2021/U/1001',
    collegeName: 'CoCIS',
    programme: 'Computer Science',
    year: 2,
    createdAt: '2023-08-15',
    lastLogin: '2024-08-14',
    isActive: true,
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'STUDENT',
    registrationNumber: '2022/U/1245',
    collegeName: 'COBAMS',
    programme: 'Business Administration',
    year: 1,
    createdAt: '2023-09-20',
    lastLogin: '2024-08-13',
    isActive: true,
  },
  {
    id: '3',
    email: 'lecturer@example.com',
    name: 'Prof. Sarah Johnson',
    role: 'LECTURER',
    collegeName: 'CoCIS',
    programme: 'Computer Science',
    createdAt: '2023-01-10',
    lastLogin: '2024-08-14',
    isActive: true,
  },
  {
    id: '4',
    email: 'admin@unipast.ac.ug',
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: '2023-01-01',
    lastLogin: '2024-08-14',
    isActive: true,
  },
  {
    id: '5',
    email: 'inactive@example.com',
    name: 'Inactive User',
    role: 'STUDENT',
    registrationNumber: '2021/U/0555',
    collegeName: 'CHUSS',
    programme: 'English',
    year: 3,
    createdAt: '2023-08-15',
    lastLogin: '2024-01-15',
    isActive: false,
  },
];

const ROLES = ['STUDENT', 'LECTURER', 'ADMIN', 'SUPERADMIN'];

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState('');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  useEffect(() => {
    // Apply filters
    let result = users;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.registrationNumber?.toLowerCase().includes(search)
      );
    }

    // Role filter
    if (filterRole !== 'All') {
      result = result.filter((u) => u.role === filterRole);
    }

    // Status filter
    if (filterStatus === 'Active') {
      result = result.filter((u) => u.isActive);
    } else if (filterStatus === 'Inactive') {
      result = result.filter((u) => !u.isActive);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, users]);

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role: editRole as any } : u))
      );

      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      alert('Error updating user role');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (error) {
      alert('Error updating user status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'ADMIN':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'LECTURER':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'STUDENT':
      default:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              User Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage system users, roles, and permissions
            </p>
          </div>
          <Button variant="primary" onClick={() => router.push('/admin/users/invite')}>
            ➕ Invite User
          </Button>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search Users
              </label>
              <input
                type="text"
                placeholder="Name, email, or registration #"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="All">All Roles</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="All">All Users</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Users Table */}
        {displayedUsers.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </div>
                        {user.registrationNumber && (
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {user.registrationNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditRole(user)}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                          >
                            Edit Role
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`text-sm font-medium ${
                              user.isActive
                                ? 'text-red-600 dark:text-red-400 hover:underline'
                                : 'text-green-600 dark:text-green-400 hover:underline'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">No users found</p>
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
      </div>

      {/* Edit Role Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Edit User Role
            </h2>

            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">User</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {selectedUser.name}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                New Role
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleSaveRole}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
