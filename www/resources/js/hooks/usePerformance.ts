import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Hook for performance optimization utilities.
 */
export function usePerformance() {
    const [renderCount, setRenderCount] = useState(0);
    const renderStartTime = useRef<number | undefined>(undefined);
    const lastRenderTime = useRef<number | undefined>(undefined);

    useEffect(() => {
        renderStartTime.current = performance.now();
        setRenderCount((prev) => prev + 1);

        return () => {
            if (renderStartTime.current) {
                lastRenderTime.current = performance.now() - renderStartTime.current;
            }
        };
    }, []);

    const getRenderStats = useCallback(
        () => ({
            renderCount,
            lastRenderTime: lastRenderTime.current,
            averageRenderTime: lastRenderTime.current ? lastRenderTime.current / renderCount : 0,
        }),
        [renderCount],
    );

    return {
        renderCount,
        lastRenderTime: lastRenderTime.current,
        getRenderStats,
    };
}

/**
 * Hook for debouncing values to prevent excessive re-renders.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook for throttling function calls to improve performance.
 */
export function useThrottle<T extends (...args: never[]) => unknown>(callback: T, delay: number): T {
    const throttleRef = useRef<number | undefined>(undefined);
    const callbackRef = useRef(callback);

    // Update callback ref when callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useMemo(() => {
        const throttledFunction = (...args: Parameters<T>) => {
            if (throttleRef.current) {
                return;
            }

            callbackRef.current(...args);

            throttleRef.current = window.setTimeout(() => {
                throttleRef.current = undefined;
            }, delay);
        };

        return throttledFunction as T;
    }, [delay]);
}

/**
 * Hook for memoizing expensive calculations.
 */
export function useExpensiveCalculation<T>(calculation: () => T, dependencies: React.DependencyList): T {
    return useMemo(() => {
        const start = performance.now();
        const result = calculation();
        const end = performance.now();

        if (process.env.NODE_ENV === 'development') {
            console.log(`Expensive calculation took ${end - start}ms`);
        }

        return result;
    }, [calculation, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook for optimizing list rendering with virtualization support.
 */
export function useVirtualizedList<T>(items: T[], itemHeight: number, containerHeight: number) {
    const [scrollTop, setScrollTop] = useState(0);

    const visibleItems = useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);

        return {
            startIndex,
            endIndex,
            visibleItems: items.slice(startIndex, endIndex),
            totalHeight: items.length * itemHeight,
            offsetY: startIndex * itemHeight,
        };
    }, [items, itemHeight, containerHeight, scrollTop]);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
    }, []);

    return {
        ...visibleItems,
        handleScroll,
    };
}

/**
 * Hook for preventing unnecessary re-renders of child components.
 */
export function useStableCallback<T extends (...args: never[]) => unknown>(callback: T): T {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback((...args: Parameters<T>) => {
        return callbackRef.current(...args);
    }, []) as T;
}

/**
 * Hook for monitoring component performance in development.
 */
export function usePerformanceMonitor(componentName: string) {
    const renderCount = useRef(0);
    const mountTime = useRef<number | undefined>(undefined);
    const lastRenderTime = useRef<number | undefined>(undefined);

    useEffect(() => {
        mountTime.current = performance.now();

        return () => {
            if (process.env.NODE_ENV === 'development') {
                const totalTime = performance.now() - (mountTime.current || 0);
                console.log(`${componentName} lifecycle: ${totalTime}ms, ${renderCount.current} renders`);
            }
        };
    }, [componentName]);

    useEffect(() => {
        const renderStart = performance.now();
        renderCount.current += 1;

        return () => {
            lastRenderTime.current = performance.now() - renderStart;

            if (process.env.NODE_ENV === 'development' && lastRenderTime.current > 16) {
                console.warn(`${componentName} slow render: ${lastRenderTime.current}ms`);
            }
        };
    });

    return {
        renderCount: renderCount.current,
        lastRenderTime: lastRenderTime.current,
    };
}
