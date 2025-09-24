/**
 * Navigation Progress Component
 *
 * This component provides a global navigation progress indicator for the application.
 * It displays a progress bar at the top of the screen during Inertia.js page transitions.
 *
 * Design Decision: Individual navigation item spinners have been removed in favor of
 * a single, global progress indicator. This provides cleaner UX without visual clutter
 * while still giving users feedback that navigation is in progress.
 *
 * Usage:
 * - Place <NavigationProgress /> in your main layout component
 * - Use useNavigationState() hook to get current navigation state in components
 * - Avoid using EnhancedLink component (deprecated) - use regular Inertia Link instead
 */

import React, { useEffect, useState } from 'react';
import { router, Link } from '@inertiajs/react';

interface NavigationProgressProps {
  color?: string;
  height?: string;
  showSpinner?: boolean;
}

export default function NavigationProgress({
  color = 'bg-blue-500',
  height = 'h-1',
  showSpinner = false
}: NavigationProgressProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;

    const handleStart = () => {
      setIsNavigating(true);
      setProgress(0);

      // Simulate progress
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Don't go to 100% until navigation is complete
          return prev + Math.random() * 30;
        });
      }, 200);
    };

    const handleFinish = () => {
      setProgress(100);

      // Hide the progress bar after a short delay
      finishTimer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
    };

    // Listen to Inertia router events
    router.on('start', handleStart);
    router.on('finish', handleFinish);
    router.on('success', handleFinish);
    router.on('error', handleFinish);

    return () => {
      // Note: Inertia.js router events are automatically cleaned up
      // No manual cleanup needed for router events
      if (progressTimer) clearInterval(progressTimer);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Progress Bar */}
      <div className={`${height} bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
        <div
          className={`${height} ${color} transition-all duration-300 ease-out`}
          style={{
            width: `${Math.min(progress, 100)}%`,
            transform: progress === 100 ? 'translateX(0)' : undefined
          }}
        />
      </div>

      {/* Optional Loading Spinner */}
      {showSpinner && (
        <div className="absolute top-4 right-4 z-50">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}

/**
 * Hook for getting navigation loading state
 */
export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    const handleFinish = () => setIsNavigating(false);

    router.on('start', handleStart);
    router.on('finish', handleFinish);
    router.on('success', handleFinish);
    router.on('error', handleFinish);

    return () => {
      // Note: Inertia.js router events are automatically cleaned up
      // No manual cleanup needed for router events
    };
  }, []);

  return isNavigating;
}

/**
 * Enhanced Link component with navigation feedback
 *
 * @deprecated This component provides individual link-level loading indicators.
 * The application now uses a global progress bar only. Use regular Inertia Link components instead.
 */
export function EnhancedLink({
  children,
  className = '',
  showProgress = false,
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  showProgress?: boolean;
  disabled?: boolean;
} & React.ComponentProps<typeof Link>) {
  const isNavigating = useNavigationState();
  const isDisabled = disabled || isNavigating;

  return (
    <div className="relative inline-block">
      <Link
        {...props}
        className={`${className} ${isDisabled ? 'opacity-50 cursor-wait' : ''} transition-opacity duration-200`}
      >
        {children}
      </Link>

      {showProgress && isNavigating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}