import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkError } from '@/hooks/useNetworkError';

interface NetworkStatusProps {
    showWhenOnline?: boolean;
    showRetryButton?: boolean;
    className?: string;
    position?: 'top' | 'bottom' | 'fixed-top' | 'fixed-bottom';
}

export function NetworkStatus({
    showWhenOnline = false,
    showRetryButton = true,
    className = '',
    position = 'top'
}: NetworkStatusProps) {
    const {
        isOnline,
        isRetrying,
        hasFailedRequests,
        failedRequests,
        retryFailedRequests,
        clearFailedRequests,
    } = useNetworkError();

    // Don't render if online and showWhenOnline is false
    if (isOnline && !showWhenOnline && !hasFailedRequests) {
        return null;
    }

    const positionClasses = {
        'top': '',
        'bottom': '',
        'fixed-top': 'fixed top-0 left-0 right-0 z-50',
        'fixed-bottom': 'fixed bottom-0 left-0 right-0 z-50',
    };

    const getStatusInfo = () => {
        if (!isOnline) {
            return {
                variant: 'destructive' as const,
                title: 'You are offline',
                description: 'Please check your internet connection. Some features may not work properly.',
                icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 1.5H13.5L14.25 7.5H9.75L10.5 1.5zM7.72 7.72a8.25 8.25 0 0110.56 0M5.66 5.66a11.25 11.25 0 0112.68 0" />
                    </svg>
                ),
            };
        }

        if (hasFailedRequests) {
            return {
                variant: 'destructive' as const,
                title: `${failedRequests.length} failed ${failedRequests.length === 1 ? 'request' : 'requests'}`,
                description: 'Some requests failed to complete. You can retry them or clear the queue.',
                icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                ),
            };
        }

        return {
            variant: 'default' as const,
            title: 'You are online',
            description: 'All systems are working normally.',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        };
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={`${positionClasses[position]} ${className}`}>
            <Alert className={`${statusInfo.variant === 'destructive' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'}`}>
                <div className={statusInfo.variant === 'destructive' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                    {statusInfo.icon}
                </div>
                <AlertDescription>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className={`font-medium ${statusInfo.variant === 'destructive' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                                {statusInfo.title}
                            </div>
                            <div className={`text-sm mt-1 ${statusInfo.variant === 'destructive' ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                                {statusInfo.description}
                            </div>
                        </div>

                        {showRetryButton && hasFailedRequests && (
                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={retryFailedRequests}
                                    disabled={isRetrying}
                                    className="text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                    {isRetrying ? (
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
                                            Retry All
                                        </>
                                    )}
                                </Button>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={clearFailedRequests}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Button>
                            </div>
                        )}
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
}

// Compact network status indicator for headers/footers
export function NetworkStatusIndicator({ className = '' }: { className?: string }) {
    const { isOnline, hasFailedRequests, isRetrying } = useNetworkError();

    const getStatusColor = () => {
        if (!isOnline) return 'bg-red-500';
        if (hasFailedRequests) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStatusText = () => {
        if (!isOnline) return 'Offline';
        if (isRetrying) return 'Retrying...';
        if (hasFailedRequests) return 'Issues detected';
        return 'Online';
    };

    return (
        <div className={`flex items-center gap-2 text-xs ${className}`}>
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-gray-600 dark:text-gray-400">
                {getStatusText()}
            </span>
        </div>
    );
}

// Connection quality indicator
export function ConnectionQualityIndicator({ className = '' }: { className?: string }) {
    const [quality, setQuality] = React.useState<'excellent' | 'good' | 'poor' | 'offline'>('excellent');
    const { isOnline, checkNetworkStatus } = useNetworkError();

    React.useEffect(() => {
        const measureQuality = async () => {
            if (!isOnline) {
                setQuality('offline');
                return;
            }

            const start = performance.now();
            try {
                const isConnected = await checkNetworkStatus();
                if (!isConnected) {
                    setQuality('offline');
                    return;
                }

                const latency = performance.now() - start;

                if (latency < 100) {
                    setQuality('excellent');
                } else if (latency < 300) {
                    setQuality('good');
                } else {
                    setQuality('poor');
                }
            } catch {
                setQuality('offline');
            }
        };

        measureQuality();
        const interval = setInterval(measureQuality, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [isOnline, checkNetworkStatus]);

    const getQualityInfo = () => {
        switch (quality) {
            case 'excellent':
                return { bars: 4, color: 'text-green-500', label: 'Excellent' };
            case 'good':
                return { bars: 3, color: 'text-yellow-500', label: 'Good' };
            case 'poor':
                return { bars: 2, color: 'text-orange-500', label: 'Poor' };
            case 'offline':
                return { bars: 0, color: 'text-red-500', label: 'Offline' };
            default:
                return { bars: 1, color: 'text-gray-500', label: 'Unknown' };
        }
    };

    const qualityInfo = getQualityInfo();

    return (
        <div className={`flex items-center gap-2 ${className}`} title={`Connection: ${qualityInfo.label}`}>
            <div className={`flex items-end gap-1 ${qualityInfo.color}`}>
                {[1, 2, 3, 4].map((bar) => (
                    <div
                        key={bar}
                        className={`w-1 bg-current transition-opacity ${
                            bar <= qualityInfo.bars ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{ height: `${bar * 3 + 4}px` }}
                    />
                ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
                {qualityInfo.label}
            </span>
        </div>
    );
}