'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SearchBar } from '@/components/search/SearchBar';
import { HeroSection } from '@/components/home/HeroSection';
import { Stats } from '@/components/home/Stats';
import { CollegeGrid } from '@/components/colleges/CollegeGrid';
import { LatestPapers } from '@/components/papers/LatestPapers';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="page-container">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Find Past Papers
          </h2>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Search by course code (e.g., CSC2101) or course name..."
          />
        </div>
      </section>

      {/* Statistics */}
      <Stats />

      {/* Colleges Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Browse by College
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Explore past papers organized by Makerere University colleges and faculties
          </p>
        </div>
        <CollegeGrid />
      </section>

      {/* Latest Papers */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-2">
              Recently Uploaded
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Check out the newest past papers added to our portal
            </p>
          </div>
          <LatestPapers />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-makerere-maroon to-makerere-gold">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Access thousands of past papers at just UGX 200 per paper. Study with real exam questions.
          </p>
          {session ? (
            <Link href="/papers">
              <Button size="lg" className="bg-white text-makerere-maroon hover:bg-slate-100">
                Browse All Papers
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <Button size="lg" className="bg-white text-makerere-maroon hover:bg-slate-100">
                Sign In to Get Started
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose UNIPAST?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '📚',
              title: 'Comprehensive Collection',
              description: 'Papers from 20 leading Ugandan universities across multiple disciplines'
            },
            {
              icon: '⚡',
              title: 'Instant Access',
              description: 'Download papers immediately after payment verification'
            },
            {
              icon: '🔒',
              title: 'Secure & Protected',
              description: 'Your data is encrypted and protected with industry-standard security'
            },
            {
              icon: '💰',
              title: 'Affordable Pricing',
              description: 'Just UGX 200 per paper - better than printing costs'
            },
            {
              icon: '📱',
              title: 'Mobile Friendly',
              description: 'Study anytime, anywhere on any device'
            },
            {
              icon: '🎯',
              title: 'Search & Filter',
              description: 'Find papers by college, school, course code, or year'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
