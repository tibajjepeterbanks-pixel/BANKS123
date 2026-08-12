'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UNIVERSITIES } from '@/lib/universities';
import { useScreenshotLimit, ScreenshotGuardBanner } from '@/components/ui/ScreenshotGuard';

export default function UniversityPage({ params }: { params: { university: string } }) {
  const university = UNIVERSITIES.find((item) => item.slug === params.university);
  if (!university) return notFound();

  const { count, limitReached, message } = useScreenshotLimit();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-makerere-maroon font-semibold mb-2">
              {university.acronym}
            </p>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              {university.name}
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-3xl">
              {university.description}
            </p>
          </div>

          <Link href="/colleges" className="inline-flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-800">
            Back to Universities
          </Link>
        </div>

        <div className="grid gap-6">
          <ScreenshotGuardBanner count={count} limitReached={limitReached} message={message} />

          <section className="grid gap-6 lg:grid-cols-2">
            {university.colleges.map((college) => (
              <article key={college.name} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{college.name}</h2>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    {college.schools.length} schools
                  </span>
                </div>
                <div className="space-y-4">
                  {college.schools.map((school) => (
                    <div key={school.name} className="rounded-3xl bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">{school.name}</h3>
                      <div className="grid gap-2">
                        {school.courseUnits.map((unit) => (
                          <div key={unit.code} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{unit.code}</p>
                              <p>{unit.title}</p>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-800">{unit.credits} cr</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
            <p className="text-lg font-semibold">Download Pricing</p>
            <p className="mt-2 text-sm leading-6">
              All papers on UNIPAST are priced at UGX 200 per download. After payment is verified, the download will be available immediately. Payments are tracked by your account, and you can view your downloads from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
