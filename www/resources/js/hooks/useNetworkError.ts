import { useToast } from '@/hooks/useToast';
import { router } from '@inertiajs/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface NetworkErrorState {
    isOnline: boolean;
    isRetrying: boolean;
    retryCount: number;
    lastError: Error | null;
    failedRequests: FailedRequest[];
}

interface FailedRequest {
    id: string;
    url: string;
    method: string;
    data?: Record<string, unknown>;
    options?: Record<string, unknown>;
    timestamp: number;
    retryCount: number;
}

interface NetworkErrorHookOptions {
    maxRetries?: number;
    retryDelay?: number;
    exponentialBackoff?: boolean;
    showToastOnError?: boolean;
    autoRetryOnReconnect?: boolean;
}

const DEFAULT_OPTIONS: Required<NetworkErrorHookOptions> = {
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
    showToastOnError: true,
    autoRetryOnReconnect: true,
};

export function useNetworkError(options: NetworkErrorHookOptions = {}) {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const toast = useToast();

    const [state, setState] = useState<NetworkErrorState>({
        isOnline: navigator.onLine,
        isRetrying: false,
        retryCount: 0,
        lastError: null,
        failedRequests: [],
    });

    const retryFailedRequestsRef = useRef<(() => Promise<void>) | null>(null);

    // Network connectivity monitoring
    useEffect(() => {
        const handleOnline = () => {
            setState((prev) => ({ ...prev, isOnline: true }));

            if (config.showToastOnError) {
                toast.success('Connection restored. You are now back online.');
            }

            // Auto-retry failed requests when back online
            if (config.autoRetryOnReconnect && state.failedRequests.length > 0) {
                retryFailedRequestsRef.current?.();
            }
        };

        const handleOffline = () => {
            setState((prev) => ({ ...prev, isOnline: false }));

            if (config.showToastOnError) {
                toast.error('Connection lost. You appear to be offline. Some features may not work properly.');
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [config.showToastOnError, config.autoRetryOnReconnect, state.failedRequests.length, toast]);

    // Calculate retry delay with exponential backoff
    const calculateRetryDelay = useCallback(
        (retryCount: number): number => {
            if (!config.exponentialBackoff) {
                return config.retryDelay;
            }
            return Math.min(config.retryDelay * Math.pow(2, retryCount), 30000); // Max 30 seconds
        },
        [config.retryDelay, config.exponentialBackoff],
    );

    // Add failed request to queue
    const addFailedRequest = useCallback((request: Omit<FailedRequest, 'id' | 'timestamp' | 'retryCount'>) => {
        const failedRequest: FailedRequest = {
            ...request,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            retryCount: 0,
        };

        setState((prev) => ({
            ...prev,
            failedRequests: [...prev.failedRequests, failedRequest],
        }));

        return failedRequest.id;
    }, []);

    // Remove failed request from queue
    const removeFailedRequest = useCallback((id: string) => {
        setState((prev) => ({
            ...prev,
            failedRequests: prev.failedRequests.filter((req) => req.id !== id),
        }));
    }, []);

    // Retry a specific failed request
    const retryRequest = useCallback(
        async (requestId: string): Promise<boolean> => {
            const request = state.failedRequests.find((req) => req.id === requestId);
            if (!request) {
                return false;
            }

            if (request.retryCount >= config.maxRetries) {
                if (config.showToastOnError) {
                    toast.error(`Maximum retries (${config.maxRetries}) reached for ${request.url}`);
                }
                removeFailedRequest(requestId);
                return false;
            }

            setState((prev) => ({
                ...prev,
                isRetrying: true,
                retryCount: prev.retryCount + 1,
            }));

            try {
                // Wait for retry delay
                const delay = calculateRetryDelay(request.retryCount);
                await new Promise((resolve) => setTimeout(resolve, delay));

                // Retry the request using Inertia router
                await new Promise<void>((resolve, reject) => {
                    const options = {
                        ...request.options,
                        onSuccess: () => {
                            resolve();
                        },
                        onError: (errors: unknown) => {
                            reject(new Error(`Request failed: ${JSON.stringify(errors)}`));
                        },
                        onException: (exception: Error) => {
                            reject(new Error(`Request exception: ${exception.message}`));
                        },
                    };

                    if (request.method.toLowerCase() === 'get') {
                        router.get(request.url, {}, options);
                    } else if (request.method.toLowerCase() === 'post') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        router.post(request.url, request.data as any, options);
                    } else if (request.method.toLowerCase() === 'put') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        router.put(request.url, request.data as any, options);
                    } else if (request.method.toLowerCase() === 'patch') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        router.patch(request.url, request.data as any, options);
                    } else if (request.method.toLowerCase() === 'delete') {
                        router.delete(request.url, options);
                    }
                });

                // Success - remove from failed requests
                removeFailedRequest(requestId);

                setState((prev) => ({
                    ...prev,
                    isRetrying: false,
                    lastError: null,
                }));

                if (config.showToastOnError) {
                    toast.success('The failed request has been completed successfully.');
                }

                return true;
            } catch (error) {
                // Update retry count for the failed request
                setState((prev) => ({
                    ...prev,
                    isRetrying: false,
                    lastError: error instanceof Error ? error : new Error('Request failed'),
                    failedRequests: prev.failedRequests.map((req) => (req.id === requestId ? { ...req, retryCount: req.retryCount + 1 } : req)),
                }));

                if (config.showToastOnError) {
                    toast.error(error instanceof Error ? error.message : 'The retry attempt was unsuccessful.');
                }

                return false;
            }
        },
        [state.failedRequests, config.maxRetries, config.showToastOnError, calculateRetryDelay, removeFailedRequest, toast],
    );

    // Retry all failed requests
    const retryFailedRequests = useCallback(async () => {
        const requests = [...state.failedRequests];

        for (const request of requests) {
            if (request.retryCount < config.maxRetries) {
                await retryRequest(request.id);
            }
        }
    }, [state.failedRequests, config.maxRetries, retryRequest]);

    // Update ref with current function
    useEffect(() => {
        retryFailedRequestsRef.current = retryFailedRequests;
    }, [retryFailedRequests]);

    // Clear all failed requests
    const clearFailedRequests = useCallback(() => {
        setState((prev) => ({
            ...prev,
            failedRequests: [],
            retryCount: 0,
            lastError: null,
        }));
    }, []);

    // Handle network error manually
    const handleNetworkError = useCallback(
        (
            error: Error,
            requestDetails?: {
                url: string;
                method: string;
                data?: Record<string, unknown>;
                options?: Record<string, unknown>;
            },
        ) => {
            setState((prev) => ({
                ...prev,
                lastError: error,
            }));

            if (requestDetails) {
                addFailedRequest(requestDetails);
            }

            if (config.showToastOnError) {
                const isConnectionError = error.message.includes('Network Error') || error.message.includes('fetch') || !navigator.onLine;

                const message = isConnectionError
                    ? 'Connection error. Please check your internet connection and try again.'
                    : error.message || 'An unexpected error occurred.';

                const action = requestDetails
                    ? {
                          label: 'Retry',
                          onClick: () => {
                              const requestId = addFailedRequest(requestDetails);
                              retryRequest(requestId);
                          },
                      }
                    : undefined;

                toast.error(message, { action });
            }
        },
        [addFailedRequest, retryRequest, config.showToastOnError, toast],
    );

    // Check if network is available
    const checkNetworkStatus = useCallback(async (): Promise<boolean> => {
        if (!navigator.onLine) {
            return false;
        }

        try {
            // Try to fetch a small resource to verify actual connectivity
            const response = await fetch('/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache',
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });
            return response.ok;
        } catch {
            return false;
        }
    }, []);

    return {
        // State
        isOnline: state.isOnline,
        isRetrying: state.isRetrying,
        retryCount: state.retryCount,
        lastError: state.lastError,
        failedRequests: state.failedRequests,
        hasFailedRequests: state.failedRequests.length > 0,

        // Actions
        handleNetworkError,
        retryRequest,
        retryFailedRequests,
        clearFailedRequests,
        checkNetworkStatus,
        addFailedRequest,
        removeFailedRequest,
    };
}

// Higher-order component for automatic network error handling
export function withNetworkErrorHandling<T extends Record<string, unknown>>(
    WrappedComponent: React.ComponentType<T>,
    options?: NetworkErrorHookOptions,
) {
    const NetworkErrorHandlingComponent = (props: T) => {
        const networkError = useNetworkError(options);

        // Add network error handling to component props
        const enhancedProps = {
            ...props,
            networkError,
        } as T & { networkError: ReturnType<typeof useNetworkError> };

        return React.createElement(WrappedComponent, enhancedProps);
    };

    NetworkErrorHandlingComponent.displayName = `withNetworkErrorHandling(${WrappedComponent.displayName || WrappedComponent.name})`;

    return NetworkErrorHandlingComponent;
}
