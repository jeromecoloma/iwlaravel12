import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect, vi } from 'vitest';
import { server } from './mocks/server';

// Extend Vitest's expect with jest-dom matchers
expect.extend({});

// Start MSW server before all tests
beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

// Clean up DOM after each test
afterEach(() => {
    cleanup();
    // Reset any runtime request handlers between tests
    server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
    server.close();
});

// Mock Inertia.js for testing
const mockInertia = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
    remember: vi.fn(),
    restore: vi.fn(),
    on: vi.fn(),
    visit: vi.fn(),
    setError: vi.fn(),
    clearHistory: vi.fn(),
};

// Mock @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(() => ({
        props: {
            auth: { user: null },
            flash: {},
            errors: {},
        },
        url: '/',
        component: 'TestComponent',
    })),
    useForm: vi.fn(() => ({
        data: {},
        setData: vi.fn(),
        post: vi.fn(),
        processing: false,
        errors: {},
        reset: vi.fn(),
        clearErrors: vi.fn(),
    })),
    router: mockInertia,
    Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) =>
        React.createElement('a', { href, ...props }, children),
    Head: ({ children }: { children: React.ReactNode }) => React.createElement('head', {}, children),
}));

// Mock window.route helper if used
Object.defineProperty(window, 'route', {
    value: vi.fn((name: string) => {
        const routes: Record<string, string> = {
            home: '/',
            about: '/about',
            contact: '/contact',
            documentation: '/documentation',
        };
        return routes[name] || '/';
    }),
    writable: true,
});

// Mock ResizeObserver for responsive components
Object.defineProperty(window, 'ResizeObserver', {
    value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    })),
    writable: true,
});

// Mock IntersectionObserver for lazy loading components
Object.defineProperty(window, 'IntersectionObserver', {
    value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    })),
    writable: true,
});

// Mock matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
    writable: true,
});

// Global React import for JSX
import React from 'react';
