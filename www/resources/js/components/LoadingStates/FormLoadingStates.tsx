import { Button } from '@/components/ui/button';
import React from 'react';

interface FormLoadingStatesProps {
    isLoading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    className?: string;
}

export function LoadingButton({
    isLoading,
    children,
    loadingText = 'Processing...',
    className = '',
    ...props
}: FormLoadingStatesProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            {...props}
            disabled={isLoading || props.disabled}
            className={`relative focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${className}`}
            aria-busy={isLoading}
            aria-live="polite"
        >
            {isLoading ? (
                <>
                    <svg
                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span aria-label={`Button is loading: ${loadingText}`}>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </Button>
    );
}

interface InputLoadingProps {
    isLoading?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function InputLoading({ isLoading = false, children, className = '' }: InputLoadingProps) {
    return (
        <div className={`relative ${className}`}>
            {children}
            {isLoading && (
                <div className="bg-opacity-50 dark:bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-md bg-white dark:bg-gray-900">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                </div>
            )}
        </div>
    );
}

interface ProgressIndicatorProps {
    progress: number;
    className?: string;
    showPercentage?: boolean;
}

export function ProgressIndicator({ progress, className = '', showPercentage = false }: ProgressIndicatorProps) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            <div className="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Uploading...</span>
                {showPercentage && <span>{clampedProgress}%</span>}
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-indigo-600 transition-all duration-300 ease-out" style={{ width: `${clampedProgress}%` }} />
            </div>
        </div>
    );
}

interface PulseLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export function PulseLoader({ size = 'md', color = 'text-indigo-600', className = '' }: PulseLoaderProps) {
    const sizeClasses = {
        sm: 'h-2 w-2',
        md: 'h-3 w-3',
        lg: 'h-4 w-4',
    };

    return (
        <div className={`flex items-center justify-center space-x-1 ${className}`}>
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className={`${sizeClasses[size]} ${color} animate-pulse rounded-full bg-current`}
                    style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1s',
                    }}
                />
            ))}
        </div>
    );
}

interface DotsLoaderProps {
    className?: string;
}

export function DotsLoader({ className = '' }: DotsLoaderProps) {
    return (
        <div className={`flex items-center justify-center space-x-1 ${className}`}>
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-current"
                    style={{
                        animationDelay: `${i * 0.1}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default {
    LoadingButton,
    InputLoading,
    ProgressIndicator,
    PulseLoader,
    DotsLoader,
};
