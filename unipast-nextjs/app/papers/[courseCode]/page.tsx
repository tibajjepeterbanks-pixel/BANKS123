'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface CourseDetail {
  courseCode: string;
  courseName: string;
  college: string;
  description: string;
  credits: number;
  year: number;
  semester: number;
  instructor: string;
  papers: Array<{
    id: string;
    academicYear: string;
    fileName: string;
    fileSize: number;
    pages: number;
    uploadedDate: string;
    views: number;
  }>;
}

// Mock data for course details
const COURSE_DETAILS: Record<string, CourseDetail> = {
  CSC2101: {
    courseCode: 'CSC2101',
    courseName: 'Database Systems',
    college: 'CoCIS',
    description:
      'This course covers fundamental concepts of database systems including data models, relational algebra, SQL, normalization, transaction processing, and concurrency control.',
    credits: 3,
    year: 2,
    semester: 1,
    instructor: 'Prof. Dr. John Ssebunya',
    papers: [
      {
        id: '1',
        academicYear: '2024/2025',
        fileName: 'Database_Systems_2024.pdf',
        fileSize: 2048000,
        pages: 45,
        uploadedDate: '2024-08-15',
        views: 324,
      },
      {
        id: '2',
        academicYear: '2023/2024',
        fileName: 'Database_Systems_2023.pdf',
        fileSize: 1856000,
        pages: 42,
        uploadedDate: '2023-08-10',
        views: 512,
      },
      {
        id: '3',
        academicYear: '2022/2023',
        fileName: 'Database_Systems_2022.pdf',
        fileSize: 1724000,
        pages: 40,
        uploadedDate: '2022-08-05',
        views: 687,
      },
    ],
  },
};

export default function CourseDetailPage({ params }: { params: { courseCode: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel'>('mtn');
  const [loading, setLoading] = useState(false);

  const courseCode = params.courseCode.toUpperCase();
  const course = COURSE_DETAILS[courseCode];

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Course Not Found
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            The course code you're looking for doesn't exist.
          </p>
          <Button variant="primary" onClick={() => router.push('/papers')}>
            Back to Papers
          </Button>
        </div>
      </div>
    );
  }

  const handleDownload = (paperId: string) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    setSelectedPaper(paperId);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPaper || !session) return;

    setLoading(true);
    try {
      // Simulate payment processing
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user?.email,
          paperId: selectedPaper,
          amount: 200,
          currency: 'UGX',
          paymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Payment successful! Reference: ${data.referenceCode}`);
        setShowPaymentModal(false);
        setSelectedPaper(null);
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      alert('Error processing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 mb-6 font-medium"
        >
          ← Back
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-8 text-white mb-8">
          <div className="mb-2 text-sm opacity-90">Course Code</div>
          <h1 className="text-4xl font-bold mb-3">{course.courseName}</h1>
          <p className="text-lg opacity-90">{course.courseCode}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Information */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Course Information
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">College</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {course.college}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Credits</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {course.credits}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Year</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    Year {course.year}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Semester</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    Semester {course.semester}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Instructor</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {course.instructor}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Description</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Available Papers */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Available Papers ({course.papers.length})
              </h2>

              <div className="space-y-4">
                {course.papers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📄</span>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {paper.fileName}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div>
                            <span className="text-xs uppercase tracking-wider">Year</span>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {paper.academicYear}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider">Pages</span>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {paper.pages}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider">Size</span>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {formatFileSize(paper.fileSize)}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider">Views</span>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {paper.views} 👁️
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                          Uploaded: {new Date(paper.uploadedDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDownload(paper.id)}
                        >
                          Download
                        </Button>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          👁️ Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Quick Stats
              </h3>

              <div className="space-y-4">
                <div className="text-center py-4 bg-white dark:bg-slate-800 rounded">
                  <p className="text-3xl font-bold text-yellow-600">
                    {course.papers.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Papers Available</p>
                </div>

                <div className="text-center py-4 bg-white dark:bg-slate-800 rounded">
                  <p className="text-3xl font-bold text-blue-600">
                    {course.papers.reduce((acc, p) => acc + p.views, 0)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Views</p>
                </div>

                <div className="text-center py-4 bg-white dark:bg-slate-800 rounded">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">UGX 200</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Per Paper</p>
                </div>
              </div>
            </div>

            {/* Help Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Having trouble downloading? Check out our FAQ or contact support.
              </p>
              <a
                href="/support"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Complete Payment
            </h2>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">UGX 200</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                Payment Method
              </label>

              <div className="space-y-2">
                <label className="flex items-center p-3 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                  <input
                    type="radio"
                    name="payment"
                    value="mtn"
                    checked={paymentMethod === 'mtn'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'mtn')}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-slate-900 dark:text-white">MTN Mobile Money</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Send UGX 200 to 0704 130 457
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                  <input
                    type="radio"
                    name="payment"
                    value="airtel"
                    checked={paymentMethod === 'airtel'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'airtel')}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-slate-900 dark:text-white">Airtel Money</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Send UGX 200 to 0704 130 457
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handlePayment}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Verify Payment'}
              </Button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-4">
              💡 Send payment first, then verify here with your reference number
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
