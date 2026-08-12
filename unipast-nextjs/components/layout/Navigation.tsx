'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-makerere-maroon to-makerere-gold rounded-lg flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:inline">
              UNIPAST
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/papers" 
              className={`transition-colors ${isActive('/papers') ? 'text-makerere-maroon font-semibold' : 'text-slate-600 hover:text-makerere-maroon'}`}
            >
              Browse Papers
            </Link>
            <Link 
              href="/colleges" 
              className={`transition-colors ${isActive('/colleges') ? 'text-makerere-maroon font-semibold' : 'text-slate-600 hover:text-makerere-maroon'}`}
            >
              Colleges
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link 
                href="/admin" 
                className={`transition-colors ${isActive('/admin') ? 'text-makerere-maroon font-semibold' : 'text-slate-600 hover:text-makerere-maroon'}`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Auth */}
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-makerere-maroon">
                  {session.user?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded-lg bg-makerere-maroon text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/signin" className="px-3 py-2 text-sm font-semibold text-makerere-maroon hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 rounded-lg bg-gradient-to-r from-makerere-maroon to-makerere-gold text-white text-sm font-semibold hover:shadow-lg transition-shadow">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/papers" className="block px-4 py-2 text-slate-600 hover:text-makerere-maroon">
              Browse Papers
            </Link>
            <Link href="/colleges" className="block px-4 py-2 text-slate-600 hover:text-makerere-maroon">
              Colleges
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="block px-4 py-2 text-slate-600 hover:text-makerere-maroon">
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
