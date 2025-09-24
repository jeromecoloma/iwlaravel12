import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * Lazy loading utility with error boundaries and loading states.
 */
export function createLazyComponent<T extends ComponentType<Record<string, unknown>>>(
    importFunc: () => Promise<{ default: T }>,
    displayName?: string,
): LazyExoticComponent<T> {
    const LazyComponent = lazy(importFunc);

    if (displayName) {
        (LazyComponent as LazyExoticComponent<T> & { displayName?: string }).displayName = `Lazy(${displayName})`;
    }

    return LazyComponent;
}

/**
 * Preload a lazy component for performance optimization.
 */
export function preloadComponent(importFunc: () => Promise<unknown>): void {
    // Start loading the component but don't wait for it
    importFunc().catch((error) => {
        console.error('Failed to preload component:', error);
    });
}

/**
 * Create a lazy component with preloading capabilities.
 */
export function createLazyComponentWithPreload<T extends ComponentType<Record<string, unknown>>>(
    importFunc: () => Promise<{ default: T }>,
    displayName?: string,
): {
    Component: LazyExoticComponent<T>;
    preload: () => void;
} {
    const Component = createLazyComponent(importFunc, displayName);

    const preload = () => {
        preloadComponent(importFunc);
    };

    return { Component, preload };
}

// Lazy load main page components
export const LazyHome = createLazyComponent(() => import('@/pages/Home'), 'Home');

export const LazyAbout = createLazyComponent(() => import('@/pages/About'), 'About');

export const LazyContact = createLazyComponent(() => import('@/pages/Contact'), 'Contact');

export const LazyDocumentation = createLazyComponent(() => import('@/pages/Documentation'), 'Documentation');

// Lazy load performance demo components
export const LazyPerformanceDemo = createLazyComponent(
    () =>
        import('@/components/optimized/MemoizedComponents').then((module) => ({
            default: module.PerformanceDemo,
        })),
    'PerformanceDemo',
);

// Lazy load heavy components that might not be immediately needed
// export const LazyImageGallery = createLazyComponent(() => import('@/components/ui/image-gallery'), 'ImageGallery');

// export const LazyToastDemo = createLazyComponent(() => import('@/components/ui/toast-demo'), 'ToastDemo');

// Create preloadable components for route prefetching
export const { Component: LazyHomeWithPreload, preload: preloadHome } = createLazyComponentWithPreload(() => import('@/pages/Home'), 'Home');

export const { Component: LazyAboutWithPreload, preload: preloadAbout } = createLazyComponentWithPreload(() => import('@/pages/About'), 'About');

export const { Component: LazyContactWithPreload, preload: preloadContact } = createLazyComponentWithPreload(
    () => import('@/pages/Contact'),
    'Contact',
);

export const { Component: LazyDocumentationWithPreload, preload: preloadDocumentation } = createLazyComponentWithPreload(
    () => import('@/pages/Documentation'),
    'Documentation',
);

/**
 * Preload all main page components for better performance.
 */
export function preloadAllPages(): void {
    preloadHome();
    preloadAbout();
    preloadContact();
    preloadDocumentation();
}

/**
 * Intelligent preloading based on user interaction patterns.
 */
export class SmartPreloader {
    private static preloadedComponents = new Set<string>();
    private static preloadTimeouts = new Map<string, NodeJS.Timeout>();

    /**
     * Preload a component with delay to avoid blocking initial load.
     */
    static preloadWithDelay(componentName: string, preloadFunc: () => void, delay: number = 2000): void {
        if (this.preloadedComponents.has(componentName)) {
            return;
        }

        // Clear any existing timeout for this component
        const existingTimeout = this.preloadTimeouts.get(componentName);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        // Set new timeout
        const timeout = setTimeout(() => {
            preloadFunc();
            this.preloadedComponents.add(componentName);
            this.preloadTimeouts.delete(componentName);
        }, delay);

        this.preloadTimeouts.set(componentName, timeout);
    }

    /**
     * Preload components on user interaction (hover, focus).
     */
    static preloadOnInteraction(
        componentName: string,
        preloadFunc: () => void,
    ): {
        onMouseEnter: () => void;
        onFocus: () => void;
    } {
        const handlePreload = () => {
            if (!this.preloadedComponents.has(componentName)) {
                preloadFunc();
                this.preloadedComponents.add(componentName);
            }
        };

        return {
            onMouseEnter: handlePreload,
            onFocus: handlePreload,
        };
    }

    /**
     * Preload components when they come into viewport.
     */
    static preloadOnVisible(componentName: string, preloadFunc: () => void, element: Element, threshold: number = 0.1): () => void {
        if (this.preloadedComponents.has(componentName)) {
            return () => {};
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        preloadFunc();
                        this.preloadedComponents.add(componentName);
                        observer.disconnect();
                    }
                });
            },
            { threshold },
        );

        observer.observe(element);

        // Return cleanup function
        return () => observer.disconnect();
    }

    /**
     * Clear all preload timeouts (useful for cleanup).
     */
    static clearAllTimeouts(): void {
        this.preloadTimeouts.forEach((timeout) => clearTimeout(timeout));
        this.preloadTimeouts.clear();
    }
}
