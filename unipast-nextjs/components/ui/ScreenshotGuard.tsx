'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'unipast_screenshot_count';
const MAX_SCREENSHOTS = 2;

export function useScreenshotLimit() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(STORAGE_KEY) ?? '0');
    setCount(Math.min(stored, MAX_SCREENSHOTS));
  }, []);

  useEffect(() => {
    const handleScreenshotKey = (event: KeyboardEvent) => {
      const isPrintScreen =
        event.key === 'PrintScreen' ||
        event.code === 'PrintScreen' ||
        event.keyCode === 44;

      if (!isPrintScreen) return;
      event.preventDefault();

      setCount((current) => {
        const next = Math.min(current + 1, MAX_SCREENSHOTS);
        window.localStorage.setItem(STORAGE_KEY, String(next));
        setMessage(
          next >= MAX_SCREENSHOTS
            ? 'Screenshot limit reached. You cannot take more screenshots on this browser.'
            : `Screenshot recorded (${next}/${MAX_SCREENSHOTS}).`
        );
        return next;
      });
    };

    window.addEventListener('keydown', handleScreenshotKey);
    return () => window.removeEventListener('keydown', handleScreenshotKey);
  }, []);

  return {
    count,
    limitReached: count >= MAX_SCREENSHOTS,
    message,
  };
}

export function ScreenshotGuardBanner({
  count,
  limitReached,
  message,
}: {
  count: number;
  limitReached: boolean;
  message: string | null;
}) {
  return (
    <div
      className={`rounded-3xl p-5 border ${
        limitReached
          ? 'bg-red-50 border-red-200 text-red-900'
          : 'bg-yellow-50 border-yellow-200 text-yellow-900'
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold">Screenshot protection</span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm">
            {count}/{MAX_SCREENSHOTS}
          </span>
        </div>
        <p className="text-sm leading-6">
          Your access is protected. If you press the Print Screen key, the system will count
          the attempt and block further screenshots after the second one.
        </p>
        <p className="text-sm opacity-90">{message ?? 'Use Print Screen only when needed.'}</p>
      </div>
    </div>
  );
}
