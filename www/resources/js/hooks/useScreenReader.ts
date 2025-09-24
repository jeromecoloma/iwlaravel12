import { useCallback, useEffect } from 'react';

interface ScreenReaderOptions {
    announceNavigationChanges?: boolean;
    announceDynamicContent?: boolean;
    announceErrors?: boolean;
    announceSuccessMessages?: boolean;
}

interface AnnouncementOptions {
    priority?: 'polite' | 'assertive';
    delay?: number;
    clear?: boolean;
}

export function useScreenReader(options: ScreenReaderOptions = {}) {
    const { announceNavigationChanges = true, announceDynamicContent = true, announceErrors = true, announceSuccessMessages = true } = options;

    // Create announcement containers if they don't exist
    useEffect(() => {
        // Create polite announcement container
        if (!document.getElementById('sr-announcements-polite')) {
            const politeContainer = document.createElement('div');
            politeContainer.id = 'sr-announcements-polite';
            politeContainer.setAttribute('aria-live', 'polite');
            politeContainer.setAttribute('aria-atomic', 'true');
            politeContainer.className = 'sr-only absolute -top-10 left-0 w-1 h-1 overflow-hidden';
            document.body.appendChild(politeContainer);
        }

        // Create assertive announcement container
        if (!document.getElementById('sr-announcements-assertive')) {
            const assertiveContainer = document.createElement('div');
            assertiveContainer.id = 'sr-announcements-assertive';
            assertiveContainer.setAttribute('aria-live', 'assertive');
            assertiveContainer.setAttribute('aria-atomic', 'true');
            assertiveContainer.className = 'sr-only absolute -top-10 left-0 w-1 h-1 overflow-hidden';
            document.body.appendChild(assertiveContainer);
        }
    }, []);

    // Announce text to screen readers
    const announce = useCallback((text: string, options: AnnouncementOptions = {}) => {
        const { priority = 'polite', delay = 0, clear = false } = options;

        const containerId = priority === 'assertive' ? 'sr-announcements-assertive' : 'sr-announcements-polite';
        const container = document.getElementById(containerId);

        if (!container) return;

        const makeAnnouncement = () => {
            if (clear) {
                container.textContent = '';
                // Small delay to ensure screen readers register the clear
                setTimeout(() => {
                    container.textContent = text;
                }, 10);
            } else {
                container.textContent = text;
            }
        };

        if (delay > 0) {
            setTimeout(makeAnnouncement, delay);
        } else {
            makeAnnouncement();
        }
    }, []);

    // Announce navigation changes
    const announceNavigation = useCallback(
        (pageName: string, description?: string) => {
            if (!announceNavigationChanges) return;

            const announcement = description ? `Navigated to ${pageName}. ${description}` : `Navigated to ${pageName}`;

            announce(announcement, { delay: 100 });
        },
        [announce, announceNavigationChanges],
    );

    // Announce form errors
    const announceError = useCallback(
        (errorMessage: string, fieldName?: string) => {
            if (!announceErrors) return;

            const announcement = fieldName ? `Error in ${fieldName}: ${errorMessage}` : `Error: ${errorMessage}`;

            announce(announcement, { priority: 'assertive' });
        },
        [announce, announceErrors],
    );

    // Announce success messages
    const announceSuccess = useCallback(
        (message: string) => {
            if (!announceSuccessMessages) return;
            announce(`Success: ${message}`, { priority: 'polite' });
        },
        [announce, announceSuccessMessages],
    );

    // Announce dynamic content changes
    const announceDynamic = useCallback(
        (message: string, assertive: boolean = false) => {
            if (!announceDynamicContent) return;
            announce(message, { priority: assertive ? 'assertive' : 'polite' });
        },
        [announce, announceDynamicContent],
    );

    // Announce loading states
    const announceLoading = useCallback(
        (isLoading: boolean, context?: string) => {
            const message = isLoading ? `Loading${context ? ` ${context}` : ''}` : `Loading complete${context ? ` for ${context}` : ''}`;
            announce(message, { priority: 'polite' });
        },
        [announce],
    );

    // Clear all announcements
    const clearAnnouncements = useCallback(() => {
        const politeContainer = document.getElementById('sr-announcements-polite');
        const assertiveContainer = document.getElementById('sr-announcements-assertive');

        if (politeContainer) politeContainer.textContent = '';
        if (assertiveContainer) assertiveContainer.textContent = '';
    }, []);

    return {
        announce,
        announceNavigation,
        announceError,
        announceSuccess,
        announceDynamic,
        announceLoading,
        clearAnnouncements,
    };
}

// Hook for managing focus announcements
export function useFocusAnnouncement() {
    const announce = useCallback((element: HTMLElement) => {
        // Get meaningful label for the focused element
        const getElementLabel = (el: HTMLElement): string => {
            // Check for aria-label
            const ariaLabel = el.getAttribute('aria-label');
            if (ariaLabel) return ariaLabel;

            // Check for aria-labelledby
            const labelledBy = el.getAttribute('aria-labelledby');
            if (labelledBy) {
                const labelElement = document.getElementById(labelledBy);
                if (labelElement) return labelElement.textContent || '';
            }

            // Check for associated label
            if (el.id) {
                const label = document.querySelector(`label[for="${el.id}"]`);
                if (label) return label.textContent || '';
            }

            // Check for placeholder
            const placeholder = el.getAttribute('placeholder');
            if (placeholder) return `Input field, ${placeholder}`;

            // Check for title
            const title = el.getAttribute('title');
            if (title) return title;

            // Check for text content
            if (el.textContent?.trim()) return el.textContent.trim();

            // Fallback to tag name and role
            const role = el.getAttribute('role') || el.tagName.toLowerCase();
            return `${role} element`;
        };

        const label = getElementLabel(element);

        // Create screen reader announcement
        const container = document.getElementById('sr-announcements-polite');
        if (container) {
            container.textContent = `Focused: ${label}`;
        }
    }, []);

    return { announceFocus: announce };
}

// Hook for managing page structure and landmarks
export function usePageStructure() {
    const announcePageStructure = useCallback(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const landmarks = Array.from(
            document.querySelectorAll(
                '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"], main, nav, header, footer, aside',
            ),
        );

        const headingCount = headings.length;
        const landmarkCount = landmarks.length;

        const announcement = `Page loaded. ${headingCount} headings, ${landmarkCount} landmarks available.`;

        const container = document.getElementById('sr-announcements-polite');
        if (container) {
            setTimeout(() => {
                container.textContent = announcement;
            }, 500); // Delay to let other page announcements finish
        }
    }, []);

    const validateHeadingStructure = useCallback(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const issues: string[] = [];

        let previousLevel = 0;
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));

            if (index === 0 && level !== 1) {
                issues.push('Page should start with an h1 heading');
            }

            if (level > previousLevel + 1) {
                issues.push(`Heading level ${level} skips levels (previous was ${previousLevel})`);
            }

            previousLevel = level;
        });

        return issues;
    }, []);

    return {
        announcePageStructure,
        validateHeadingStructure,
    };
}

// Hook for managing ARIA live regions
export function useLiveRegion() {
    const createLiveRegion = useCallback((id: string, politeness: 'polite' | 'assertive' | 'off' = 'polite', atomic: boolean = true) => {
        let region = document.getElementById(id);

        if (!region) {
            region = document.createElement('div');
            region.id = id;
            region.setAttribute('aria-live', politeness);
            region.setAttribute('aria-atomic', atomic.toString());
            region.className = 'sr-only absolute -top-10 left-0 w-1 h-1 overflow-hidden';
            document.body.appendChild(region);
        }

        return region;
    }, []);

    const updateLiveRegion = useCallback((id: string, content: string, delay: number = 0) => {
        const region = document.getElementById(id);
        if (!region) return;

        const updateContent = () => {
            region.textContent = content;
        };

        if (delay > 0) {
            setTimeout(updateContent, delay);
        } else {
            updateContent();
        }
    }, []);

    const clearLiveRegion = useCallback((id: string) => {
        const region = document.getElementById(id);
        if (region) {
            region.textContent = '';
        }
    }, []);

    return {
        createLiveRegion,
        updateLiveRegion,
        clearLiveRegion,
    };
}

// Utility function to check if screen reader is likely active
export function isScreenReaderActive(): boolean {
    // Check for high contrast mode (often used with screen readers)
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        return true;
    }

    // Check for reduced motion (often used with screen readers)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
    }

    // Check for forced colors mode
    if (window.matchMedia('(forced-colors: active)').matches) {
        return true;
    }

    // Check for specific screen reader user agents (limited detection)
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaderIndicators = ['nvda', 'jaws', 'sapi', 'guide', 'supernova', 'orca'];

    return screenReaderIndicators.some((indicator) => userAgent.includes(indicator));
}

// Component for screen reader only content
export interface ScreenReaderOnlyProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
}

// Note: This component should be imported from a separate .tsx file
// export function ScreenReaderOnly({
//     children,
//     as: Component = 'span',
//     className = ''
// }: ScreenReaderOnlyProps) {
//     return (
//         <Component className={`sr-only ${className}`}>
//             {children}
//         </Component>
//     );
// }
