'use client';

import Link from 'next/link';
import { UNIVERSITIES } from '@/lib/universities';
import { useScreenshotLimit, ScreenshotGuardBanner } from '@/components/ui/ScreenshotGuard';

export default function CollegesPage() {
  const { count, limitReached, message } = useScreenshotLimit();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-700 dark:text-yellow-300 mb-3">
            University Directory
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Explore the First 30 Universities in Uganda
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Browse colleges, faculties, schools, and course units. All papers cost UGX 200 per download.
          </p>
        </header>

        <div className="grid gap-6">
          <ScreenshotGuardBanner count={count} limitReached={limitReached} message={message} />

          <div className="grid gap-6 lg:grid-cols-2">
            {UNIVERSITIES.map((university) => (
              <Link key={university.slug} href={`/colleges/${university.slug}`}>
                <article className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-makerere-maroon font-semibold">
                        {university.acronym}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                        {university.name}
                      </h2>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      {university.location}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 mb-5">
                    {university.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {university.colleges.slice(0, 3).map((college) => (
                      <span
                        key={college.name}
                        className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs text-slate-700 dark:text-slate-200"
                      >
                        {college.name}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
