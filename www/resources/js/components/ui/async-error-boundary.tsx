import React, { ReactNode, useState, useCallback } from 'react';
import { ErrorBoundary } from './error-boundary';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/useToast';

interface AsyncErrorBoundaryProps {
    children: ReactNode;
    onRetry?: () => void | Promise<void>;
    maxRetries?: number;
    showToast?: boolean;
    fallbackMessage?: string;
}

interface AsyncErrorState {
    retryCount: number;
    isRetrying: boolean;
    lastError: Error | null;
}

export function AsyncErrorBoundary({
    children,
    onRetry,
    maxRetries = 3,
    showToast = true,
    fallbackMessage = 'An error occurred while loading this content.'
}: AsyncErrorBoundaryProps) {
    const [state, setState] = useState<AsyncErrorState>({
        retryCount: 0,
        isRetrying: false,
        lastError: null,
    });
    const toast = useToast();

    const handleError = useCallback((error: Error) => {
        setState(prev => ({
            ...prev,
            lastError: error,
        }));

        if (showToast) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    }, [showToast, toast]);

    const handleRetry = useCallback(async () => {
        if (state.retryCount >= maxRetries) {
            toast.error('Maximum retries reached. Please refresh the page or contact support if the problem persists.');
            return;
        }

        setState(prev => ({
            ...prev,
            isRetrying: true,
            retryCount: prev.retryCount + 1,
        }));

        try {
            if (onRetry) {
                await onRetry();
            } else {
                // Default retry: reload the page
                window.location.reload();
            }

            // Reset state on successful retry
            setState({
                retryCount: 0,
                isRetrying: false,
                lastError: null,
            });

            if (showToast) {
                toast.success('The content has been reloaded successfully.');
            }
        } catch (retryError) {
            setState(prev => ({
                ...prev,
                isRetrying: false,
                lastError: retryError instanceof Error ? retryError : new Error('Retry failed'),
            }));

            if (showToast) {
                toast.error('The retry attempt was unsuccessful. Please try again.');
            }
        }
    }, [state.retryCount, maxRetries, onRetry, showToast, toast]);

    const renderFallback = useCallback(() => (
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6 bg-amber-50 dark:bg-amber-900/10">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <svg
                        className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                    </svg>
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            Content Loading Error
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            {fallbackMessage}
                        </p>
                        {state.lastError && process.env.NODE_ENV === 'development' && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-mono">
                                {state.lastError.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleRetry}
                            disabled={state.isRetrying || state.retryCount >= maxRetries}
                            size="sm"
                            variant="outline"
                            className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                        >
                            {state.isRetrying ? (
                                <>
                                    <svg className="w-3 h-3 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Retrying...
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                    Retry ({state.retryCount}/{maxRetries})
                                </>
                            )}
                        </Button>

                        {state.retryCount >= maxRetries && (
                            <Alert className="flex-1 py-2">
                                <AlertDescription className="text-xs">
                                    Maximum retries reached. Please refresh the page or contact support.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ), [handleRetry, state.isRetrying, state.retryCount, state.lastError, maxRetries, fallbackMessage]);

    return (
        <ErrorBoundary
            onError={handleError}
            fallback={renderFallback()}
            level="section"
        >
            {children}
        </ErrorBoundary>
    );
}

// Hook for manual async error handling
export function useAsyncError() {
    const [error, setError] = useState<Error | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const toast = useToast();

    const throwError = useCallback((error: Error) => {
        setError(error);
        throw error;
    }, []);

    const clearError = useCallback(() => {
        setError(null);
        setRetryCount(0);
        setIsRetrying(false);
    }, []);

    const retry = useCallback(async (operation: () => Promise<void>, maxRetries = 3) => {
        if (retryCount >= maxRetries) {
            toast.error('Maximum retries reached. Please try again later or contact support.');
            return false;
        }

        setIsRetrying(true);
        setRetryCount(prev => prev + 1);

        try {
            await operation();
            clearError();
            toast.success('The operation completed successfully.');
            return true;
        } catch (error) {
            const errorInstance = error instanceof Error ? error : new Error('Operation failed');
            setError(errorInstance);
            setIsRetrying(false);

            toast.error(errorInstance.message);
            return false;
        }
    }, [retryCount, clearError, toast]);

    return {
        error,
        isRetrying,
        retryCount,
        throwError,
        clearError,
        retry,
    };
}