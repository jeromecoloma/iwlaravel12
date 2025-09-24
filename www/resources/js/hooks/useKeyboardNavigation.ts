import { useCallback, useEffect, useRef } from 'react';

interface KeyboardNavigationOptions {
    enabled?: boolean;
    enableArrowKeys?: boolean;
    enableTabTrapping?: boolean;
    enableEscapeKey?: boolean;
    onEscape?: () => void;
    skipLinkTarget?: string;
}

interface FocusableElement extends Element {
    focus(): void;
    tabIndex?: number;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
    const { enabled = true, enableArrowKeys = true, enableTabTrapping = false, enableEscapeKey = true, onEscape, skipLinkTarget } = options;

    const containerRef = useRef<HTMLElement>(null);

    // Get all focusable elements within a container
    const getFocusableElements = useCallback((container: HTMLElement): FocusableElement[] => {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled]):not([type="hidden"])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'summary',
            '[contenteditable]:not([contenteditable="false"])',
            'audio[controls]',
            'video[controls]',
            'iframe',
            'embed',
            'object',
            'area[href]',
        ].join(', ');

        const elements = Array.from(container.querySelectorAll(focusableSelectors)) as FocusableElement[];

        return elements.filter((element) => {
            // Filter out elements that are not visible or have negative tabindex
            const computedStyle = window.getComputedStyle(element);
            const isVisible =
                computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden' && (element as HTMLElement).offsetParent !== null;

            const tabIndex = element.getAttribute('tabindex');
            const hasValidTabIndex = tabIndex === null || parseInt(tabIndex) >= 0;

            return isVisible && hasValidTabIndex;
        });
    }, []);

    // Handle arrow key navigation
    const handleArrowKeyNavigation = useCallback(
        (event: KeyboardEvent) => {
            if (!enableArrowKeys || !containerRef.current) return;

            const focusableElements = getFocusableElements(containerRef.current);
            const currentIndex = focusableElements.findIndex((el) => el === document.activeElement);

            let nextIndex = currentIndex;

            switch (event.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    event.preventDefault();
                    nextIndex = currentIndex + 1;
                    if (nextIndex >= focusableElements.length) {
                        nextIndex = 0; // Wrap to first element
                    }
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    event.preventDefault();
                    nextIndex = currentIndex - 1;
                    if (nextIndex < 0) {
                        nextIndex = focusableElements.length - 1; // Wrap to last element
                    }
                    break;
                case 'Home':
                    event.preventDefault();
                    nextIndex = 0;
                    break;
                case 'End':
                    event.preventDefault();
                    nextIndex = focusableElements.length - 1;
                    break;
            }

            if (nextIndex !== currentIndex && focusableElements[nextIndex]) {
                focusableElements[nextIndex].focus();
            }
        },
        [enableArrowKeys, getFocusableElements],
    );

    // Handle tab trapping (for modals, dropdowns, etc.)
    const handleTabTrapping = useCallback(
        (event: KeyboardEvent) => {
            if (!enableTabTrapping || !containerRef.current || event.key !== 'Tab') return;

            const focusableElements = getFocusableElements(containerRef.current);
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                // Shift + Tab (backward)
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab (forward)
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        },
        [enableTabTrapping, getFocusableElements],
    );

    // Handle escape key
    const handleEscapeKey = useCallback(
        (event: KeyboardEvent) => {
            if (!enableEscapeKey || event.key !== 'Escape') return;

            if (onEscape) {
                event.preventDefault();
                onEscape();
            }
        },
        [enableEscapeKey, onEscape],
    );

    // Handle skip link navigation
    const handleSkipLink = useCallback(
        (event: KeyboardEvent) => {
            if (!skipLinkTarget || event.key !== 'Enter') return;

            const targetElement = document.querySelector(skipLinkTarget) as FocusableElement;
            if (targetElement && document.activeElement?.classList.contains('skip-link')) {
                event.preventDefault();
                targetElement.focus();

                // Scroll to the target element
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },
        [skipLinkTarget],
    );

    // Main keyboard event handler
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            switch (event.key) {
                case 'ArrowDown':
                case 'ArrowUp':
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'Home':
                case 'End':
                    handleArrowKeyNavigation(event);
                    break;
                case 'Tab':
                    handleTabTrapping(event);
                    break;
                case 'Escape':
                    handleEscapeKey(event);
                    break;
                case 'Enter':
                    handleSkipLink(event);
                    break;
            }
        },
        [enabled, handleArrowKeyNavigation, handleTabTrapping, handleEscapeKey, handleSkipLink],
    );

    // Focus management utilities
    const focusFirst = useCallback(() => {
        if (!containerRef.current) return;
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }, [getFocusableElements]);

    const focusLast = useCallback(() => {
        if (!containerRef.current) return;
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length > 0) {
            focusableElements[focusableElements.length - 1].focus();
        }
    }, [getFocusableElements]);

    const focusNext = useCallback(() => {
        if (!containerRef.current) return;
        const focusableElements = getFocusableElements(containerRef.current);
        const currentIndex = focusableElements.findIndex((el) => el === document.activeElement);
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        if (focusableElements[nextIndex]) {
            focusableElements[nextIndex].focus();
        }
    }, [getFocusableElements]);

    const focusPrevious = useCallback(() => {
        if (!containerRef.current) return;
        const focusableElements = getFocusableElements(containerRef.current);
        const currentIndex = focusableElements.findIndex((el) => el === document.activeElement);
        const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        if (focusableElements[previousIndex]) {
            focusableElements[previousIndex].focus();
        }
    }, [getFocusableElements]);

    // Set up event listeners
    useEffect(() => {
        if (!enabled) return;

        const container = containerRef.current;
        if (container) {
            container.addEventListener('keydown', handleKeyDown);
        } else {
            // If no container ref, add to document
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (container) {
                container.removeEventListener('keydown', handleKeyDown);
            } else {
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [enabled, handleKeyDown]);

    return {
        containerRef,
        focusFirst,
        focusLast,
        focusNext,
        focusPrevious,
        getFocusableElements: () => (containerRef.current ? getFocusableElements(containerRef.current) : []),
    };
}

// Roving tabindex hook for component groups (like navigation menus)
export function useRovingTabIndex(enabled: boolean = true) {
    const containerRef = useRef<HTMLElement>(null);
    const currentIndexRef = useRef<number>(0);

    const updateTabIndices = useCallback(() => {
        if (!enabled || !containerRef.current) return;

        const focusableElements = Array.from(
            containerRef.current.querySelectorAll('[role="menuitem"], [role="option"], [role="tab"], button, a'),
        ) as HTMLElement[];

        focusableElements.forEach((element, index) => {
            if (index === currentIndexRef.current) {
                element.tabIndex = 0;
            } else {
                element.tabIndex = -1;
            }
        });
    }, [enabled]);

    const setCurrentIndex = useCallback(
        (index: number) => {
            currentIndexRef.current = index;
            updateTabIndices();
        },
        [updateTabIndices],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled || !containerRef.current) return;

            const focusableElements = Array.from(
                containerRef.current.querySelectorAll('[role="menuitem"], [role="option"], [role="tab"], button, a'),
            ) as HTMLElement[];

            if (focusableElements.length === 0) return;

            let newIndex = currentIndexRef.current;

            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    newIndex = (currentIndexRef.current + 1) % focusableElements.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    newIndex = currentIndexRef.current === 0 ? focusableElements.length - 1 : currentIndexRef.current - 1;
                    break;
                case 'Home':
                    event.preventDefault();
                    newIndex = 0;
                    break;
                case 'End':
                    event.preventDefault();
                    newIndex = focusableElements.length - 1;
                    break;
            }

            if (newIndex !== currentIndexRef.current) {
                setCurrentIndex(newIndex);
                focusableElements[newIndex].focus();
            }
        },
        [enabled, setCurrentIndex],
    );

    useEffect(() => {
        updateTabIndices();
    }, [updateTabIndices]);

    useEffect(() => {
        const container = containerRef.current;
        if (enabled && container) {
            container.addEventListener('keydown', handleKeyDown);
            return () => container.removeEventListener('keydown', handleKeyDown);
        }
    }, [enabled, handleKeyDown]);

    return {
        containerRef,
        setCurrentIndex,
        updateTabIndices,
        currentIndex: currentIndexRef.current,
    };
}
