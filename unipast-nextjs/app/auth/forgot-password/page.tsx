'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send recovery email');
        return;
      }

      setMessage('Check your email for OTP code');
      setStep('otp');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-makerere-maroon to-makerere-gold rounded-lg flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              U
            </div>
            <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
            <p className="text-slate-600 dark:text-slate-400">
              We'll help you regain access to your account
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm">
              ✓ {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
              ✗ {error}
            </div>
          )}

          {/* Step 1: Email Entry */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Enter your email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  We'll send you an OTP code to verify your identity
                </p>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-6"
                size="lg"
              >
                Send Recovery Email
              </Button>
            </form>
          )}

          {/* Step 2: OTP Entry (placeholder) */}
          {step === 'otp' && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter the 6-digit code sent to {email}
              </p>
              <div className="flex gap-2 justify-center mt-4 mb-6">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="input-field w-10 h-10 text-center text-xl font-bold"
                  />
                ))}
              </div>
              <Button
                onClick={() => setStep('reset')}
                className="w-full"
                size="lg"
              >
                Verify OTP
              </Button>
            </div>
          )}

          {/* Step 3: Password Reset (placeholder) */}
          {step === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  className="input-field"
                />
              </div>
              <Button className="w-full" size="lg">
                Reset Password
              </Button>
            </div>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
            <span className="px-4 text-sm text-slate-500">or</span>
            <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
          </div>

          {/* Back to Sign In */}
          <div className="text-center">
            <Link href="/auth/signin" className="text-makerere-maroon hover:underline font-semibold text-sm">
              Back to Sign In
            </Link>
          </div>

          {/* Help */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
            <p className="text-blue-900 dark:text-blue-200">
              <strong>Need help?</strong> Contact support@unipast.ac.ug
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
