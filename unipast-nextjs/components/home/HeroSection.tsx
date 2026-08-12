'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-makerere-maroon via-purple-600 to-makerere-maroon text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 20%, transparent 20%),
                            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 20%, transparent 20%)`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="animate-slideInUp">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Ace Your Exams with Past Papers
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8">
                Access thousands of past exam papers from 20 leading Ugandan universities. Study smarter, not harder.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto bg-white text-makerere-maroon hover:bg-slate-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/papers">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-makerere-maroon">
                  Browse Papers
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-2xl">✓</span>
                <span>10,000+ Papers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-2xl">👥</span>
                <span>50,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-2xl">⭐</span>
                <span>4.8 Stars Rating</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden md:block animate-slideInDown">
            <div className="relative">
              <div className="w-64 h-96 mx-auto bg-white/10 backdrop-blur rounded-lg border border-white/20 p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3"></div>
                  <div className="mt-8 space-y-2">
                    <div className="h-12 bg-white/10 rounded"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
