'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

type LoadingBarProps = {
  progress: number;
  variant?: 'default' | 'gradient' | 'pulse' | 'minimal';
  showPercentage?: boolean;
  label?: string;
  className?: string;
};

export function LoadingBar({
  progress,
  variant = 'default',
  showPercentage = true,
  label = 'Loading...',
  className = '',
}: LoadingBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(Math.max(0, Math.min(progress, 100)));
    }, 10);
    return () => clearTimeout(timer);
  }, [progress]);

  const getBarStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500';
      case 'pulse':
        return 'bg-blue-500 animate-pulse';
      case 'minimal':
        return 'bg-gray-900';
      default:
        return 'bg-blue-500';
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gray-200 dark:bg-gray-700';
      case 'pulse':
        return 'bg-gray-200 dark:bg-gray-700';
      case 'minimal':
        return 'bg-gray-100 dark:bg-gray-800';
      default:
        return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {(showPercentage || label) && (
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(displayProgress)}%</span>}
        </div>
      )}
      <div
        className={`h-2 rounded-full overflow-hidden ${getContainerStyles()}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getBarStyles()}`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}

export type LoadingOverlayProps = {
  progress: number;
  variant?: 'default' | 'blur' | 'dark' | 'minimal';
  showSpinner?: boolean;
  label?: string;
};

export function LoadingOverlay({
  progress,
  variant = 'default',
  showSpinner = true,
  label = 'Loading...',
}: LoadingOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setFadeOut(true);
      const timeout = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!visible) return null;

  const getOverlayStyles = () => {
    switch (variant) {
      case 'blur':
        return 'backdrop-blur-md bg-white/30 dark:bg-black/30';
      case 'dark':
        return 'bg-black/90';
      case 'minimal':
        return 'bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white';
      default:
        return 'bg-black/80 text-white';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      } ${getOverlayStyles()}`}
    >
      <div className="flex flex-col items-center space-y-6 w-full max-w-md px-6">
        {showSpinner && <Loader2 className="w-8 h-8 animate-spin" />}

        <div className="text-center space-y-2">
          <p className="text-lg font-medium">{label}</p>
          <p className="text-sm opacity-75">{Math.round(progress)}%</p>
        </div>

        <div className="w-full">
          <LoadingBar
            progress={progress}
            variant={variant === 'minimal' ? 'minimal' : 'default'}
            showPercentage={false}
            label=""
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

type CircularProgressProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
};

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  showPercentage = true,
}: CircularProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(Math.max(0, Math.min(progress, 100)));
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-500 transition-all duration-500 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(displayProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}
