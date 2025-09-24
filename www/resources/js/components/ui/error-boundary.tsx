import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showDetails?: boolean;
    level?: 'page' | 'section' | 'component';
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: '',
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🚨 React Error Boundary Caught an Error');
            console.error('Error:', error);
            console.error('Error Info:', errorInfo);
            console.groupEnd();
        }

        this.setState({
            error,
            errorInfo,
        });

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // In production, you might want to send this to an error reporting service
        // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: '',
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI based on error level
            const { level = 'component', showDetails = process.env.NODE_ENV === 'development' } = this.props;

            if (level === 'page') {
                return this.renderPageLevelError();
            }

            if (level === 'section') {
                return this.renderSectionLevelError();
            }

            return this.renderComponentLevelError(showDetails);
        }

        return this.props.children;
    }

    private renderPageLevelError() {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
                <Card className="max-w-lg w-full text-center">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-6 .75h12m-6 3.75h.007v.008H12v-.008zM12 21a9 9 0 110-18 9 9 0 010 18z"
                                />
                            </svg>
                        </div>
                        <CardTitle className="text-xl font-bold">Something went wrong</CardTitle>
                        <CardDescription>
                            An unexpected error occurred while loading this page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={this.handleReset} variant="default">
                                Try Again
                            </Button>
                            <Button onClick={() => window.location.href = '/'} variant="outline">
                                Go Home
                            </Button>
                        </div>
                        {this.renderErrorDetails()}
                    </CardContent>
                </Card>
            </div>
        );
    }

    private renderSectionLevelError() {
        return (
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg
                            className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-6 .75h12m-6 3.75h.007v.008H12v-.008zM12 21a9 9 0 110-18 9 9 0 010 18z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                        <div>
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Section Error
                            </h3>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                This section encountered an error and couldn't be displayed.
                            </p>
                        </div>
                        <Button onClick={this.handleReset} size="sm" variant="outline">
                            Retry Section
                        </Button>
                        {this.renderErrorDetails()}
                    </div>
                </div>
            </div>
        );
    }

    private renderComponentLevelError(showDetails: boolean) {
        return (
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                <svg
                    className="h-4 w-4 text-red-600 dark:text-red-400"
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
                <AlertDescription className="flex items-center justify-between">
                    <span className="text-red-800 dark:text-red-200">
                        Component failed to render
                    </span>
                    <Button
                        onClick={this.handleReset}
                        size="sm"
                        variant="outline"
                        className="ml-3 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                        Retry
                    </Button>
                </AlertDescription>
                {showDetails && this.renderErrorDetails()}
            </Alert>
        );
    }

    private renderErrorDetails() {
        if (!this.state.error || process.env.NODE_ENV !== 'development') {
            return null;
        }

        return (
            <details className="mt-4 text-left">
                <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    Error Details (Development Only)
                </summary>
                <div className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded border space-y-2">
                    <div>
                        <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-y-auto">
                            {this.state.error.stack}
                        </pre>
                    </div>
                    {this.state.errorInfo && (
                        <div>
                            <strong>Component Stack:</strong>
                            <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-y-auto">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </div>
                    )}
                    <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                        <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                </div>
            </details>
        );
    }
}

// Hook version for functional components that need error boundary functionality
export function useErrorHandler() {
    return (error: Error, errorInfo?: ErrorInfo) => {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Manual Error Handler:', error, errorInfo);
        }

        // In production, you might want to send this to an error reporting service
        // Example: Sentry.captureException(error);
    };
}

// Higher-order component wrapper
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
}