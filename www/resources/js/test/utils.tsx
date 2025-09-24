import { usePage } from '@inertiajs/react';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

// Mock Inertia
vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(),
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
    router: {
        visit: vi.fn(),
        get: vi.fn(),
        post: vi.fn(),
    },
}));

// Mock Inertia page props
interface MockPageProps {
    auth?: { user?: Record<string, unknown> };
    flash?: Record<string, string>;
    errors?: Record<string, string>;
    meta?: Record<string, unknown>;
    [key: string]: unknown;
}

// Test wrapper component that provides necessary context
interface TestWrapperProps {
    children: React.ReactNode;
    pageProps?: MockPageProps;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children, pageProps = {} }) => {
    React.useEffect(() => {
        vi.mocked(usePage).mockReturnValue({
            props: {
                auth: { user: null },
                flash: {},
                errors: {},
                ...pageProps,
            },
            url: '/',
            component: 'TestComponent',
            version: '1',
            clearHistory: vi.fn(),
            encryptHistory: false,
            rememberedState: {},
        } as unknown as ReturnType<typeof usePage>);
    }, [pageProps]);

    return <>{children}</>;
};

// Custom render function that includes test wrapper
const customRender = (ui: React.ReactElement, options?: RenderOptions & { pageProps?: MockPageProps }) => {
    const { pageProps, ...renderOptions } = options || {};

    return render(ui, {
        wrapper: ({ children }) => <TestWrapper pageProps={pageProps}>{children}</TestWrapper>,
        ...renderOptions,
    });
};

// Helper to create mock form data
export const createMockFormData = (overrides = {}) => ({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message with sufficient content.',
    ...overrides,
});

// Helper to create mock Inertia form
export const createMockInertiaForm = (initialData = {}, overrides = {}) => ({
    data: { ...createMockFormData(), ...initialData },
    setData: vi.fn(),
    post: vi.fn(),
    processing: false,
    errors: {},
    reset: vi.fn(),
    clearErrors: vi.fn(),
    ...overrides,
});

// Helper to mock window.matchMedia for responsive tests
export const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockImplementation((query) => ({
            matches,
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
};

// Re-export everything from testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };
