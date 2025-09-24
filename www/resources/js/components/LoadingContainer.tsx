import {
    CardPlaceholder,
    DashboardPlaceholder,
    ImagePlaceholder,
    ListItemPlaceholder,
    SectionPlaceholder,
    TextPlaceholder,
} from '@/components/ui/content-placeholders';
import { useNavigationState } from '@/components/ui/navigation-progress';
import React from 'react';

interface LoadingContainerProps {
    children: React.ReactNode;
    isLoading?: boolean;
    placeholder?: 'text' | 'image' | 'card' | 'list' | 'section' | 'dashboard' | React.ReactNode;
    placeholderProps?: Record<string, unknown>;
    className?: string;
    showOnNavigation?: boolean;
}

/**
 * Container component that shows loading placeholders
 */
export default function LoadingContainer({
    children,
    isLoading = false,
    placeholder = 'text',
    placeholderProps = {},
    className = '',
    showOnNavigation = false,
}: LoadingContainerProps) {
    const isNavigating = useNavigationState();
    const shouldShowPlaceholder = isLoading || (showOnNavigation && isNavigating);

    if (shouldShowPlaceholder) {
        return <div className={className}>{renderPlaceholder(placeholder, placeholderProps)}</div>;
    }

    return <div className={className}>{children}</div>;
}

/**
 * Render the appropriate placeholder component
 */
function renderPlaceholder(placeholder: LoadingContainerProps['placeholder'], props: Record<string, unknown>): React.ReactNode {
    if (React.isValidElement(placeholder)) {
        return placeholder;
    }

    switch (placeholder) {
        case 'text':
            return <TextPlaceholder {...props} />;
        case 'image':
            return <ImagePlaceholder {...props} />;
        case 'card':
            return <CardPlaceholder {...props} />;
        case 'list':
            return <ListItemPlaceholder {...props} />;
        case 'section':
            return <SectionPlaceholder {...props} />;
        case 'dashboard':
            return <DashboardPlaceholder {...props} />;
        default:
            return <TextPlaceholder {...props} />;
    }
}

/**
 * Hook for managing loading states with automatic navigation detection
 */
export function useLoadingState(initialState = false) {
    const [isLoading, setIsLoading] = React.useState(initialState);
    const isNavigating = useNavigationState();

    return {
        isLoading: isLoading || isNavigating,
        setIsLoading,
        isNavigating,
    };
}

/**
 * Higher-order component for wrapping content with loading states
 */
export function withLoadingContainer<T extends object>(
    Component: React.ComponentType<T>,
    defaultPlaceholder: LoadingContainerProps['placeholder'] = 'text',
    defaultProps: Partial<LoadingContainerProps> = {},
) {
    return function WrappedComponent(props: T & { loading?: Partial<LoadingContainerProps> }) {
        const { loading = {}, ...componentProps } = props;

        return (
            <LoadingContainer placeholder={defaultPlaceholder} {...defaultProps} {...loading}>
                <Component {...(componentProps as T)} />
            </LoadingContainer>
        );
    };
}

/**
 * Async content wrapper that shows loading states
 */
export function AsyncContent({
    children,
    promise,
    placeholder = 'text',
    placeholderProps = {},
    className = '',
    onError,
    onSuccess,
}: {
    children: React.ReactNode;
    promise: Promise<unknown>;
    placeholder?: LoadingContainerProps['placeholder'];
    placeholderProps?: Record<string, unknown>;
    className?: string;
    onError?: (error: Error) => void;
    onSuccess?: (data: unknown) => void;
}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        let isMounted = true;

        promise
            .then((data) => {
                if (isMounted) {
                    setIsLoading(false);
                    setError(null);
                    onSuccess?.(data);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setIsLoading(false);
                    setError(err);
                    onError?.(err);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [promise, onError, onSuccess]);

    if (error) {
        return (
            <div className={`py-8 text-center ${className}`}>
                <p className="text-red-600 dark:text-red-400">Error loading content</p>
                <button
                    onClick={() => {
                        setError(null);
                        setIsLoading(true);
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <LoadingContainer isLoading={isLoading} placeholder={placeholder} placeholderProps={placeholderProps} className={className}>
            {children}
        </LoadingContainer>
    );
}
