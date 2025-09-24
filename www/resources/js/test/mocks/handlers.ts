import { http, HttpResponse } from 'msw';

/**
 * MSW Request Handlers for API Mocking
 *
 * These handlers mock the Laravel API endpoints for testing purposes.
 * They simulate the behavior of the actual API responses.
 */

export const handlers = [
    // Contact form submission
    http.post('/contact', async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        // Simulate validation errors
        const errors: Record<string, string[]> = {};

        if (!name) {
            errors.name = ['The name field is required.'];
        }

        if (!email) {
            errors.email = ['The email field is required.'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = ['Please enter a valid email address.'];
        }

        if (!subject) {
            errors.subject = ['The subject field is required.'];
        }

        if (!message) {
            errors.message = ['The message field is required.'];
        } else if (message.length < 10) {
            errors.message = ['Message must be at least 10 characters.'];
        }

        // Return validation errors if any
        if (Object.keys(errors).length > 0) {
            return HttpResponse.json(
                {
                    message: 'The given data was invalid.',
                    errors,
                },
                { status: 422 },
            );
        }

        // Simulate successful submission
        return HttpResponse.json(
            {
                message: 'Thank you for your message! We will get back to you soon.',
                success: true,
            },
            { status: 200 },
        );
    }),

    // Contact form submission with server error simulation
    http.post('/contact-error', () => {
        return HttpResponse.json(
            {
                message: 'Service temporarily unavailable. Please try again later.',
                error: true,
            },
            { status: 500 },
        );
    }),

    // Get CSRF token (for SPA-style apps)
    http.get('/sanctum/csrf-cookie', () => {
        return new HttpResponse(null, {
            status: 204,
            headers: {
                'Set-Cookie': 'XSRF-TOKEN=mock-csrf-token; Path=/',
            },
        });
    }),

    // User authentication endpoints
    http.post('/login', async ({ request }) => {
        const body = await request.json();
        const { email, password } = body as { email: string; password: string };

        if (email === 'test@example.com' && password === 'password') {
            return HttpResponse.json({
                user: {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                },
                token: 'mock-auth-token',
            });
        }

        return HttpResponse.json(
            {
                message: 'Invalid credentials.',
                errors: {
                    email: ['The provided credentials are incorrect.'],
                },
            },
            { status: 422 },
        );
    }),

    http.post('/logout', () => {
        return HttpResponse.json({ message: 'Logged out successfully.' });
    }),

    // Get current user
    http.get('/api/user', ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.includes('Bearer')) {
            return HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
        }

        return HttpResponse.json({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
        });
    }),

    // Email service status endpoint
    http.get('/api/email/status', () => {
        return HttpResponse.json({
            primary: {
                method: 'mailgun',
                available: true,
                last_check: new Date().toISOString(),
            },
            fallbacks: [
                {
                    method: 'smtp',
                    available: true,
                    last_check: new Date().toISOString(),
                },
                {
                    method: 'storage',
                    available: true,
                    last_check: new Date().toISOString(),
                },
                {
                    method: 'log',
                    available: true,
                    last_check: new Date().toISOString(),
                },
            ],
        });
    }),

    // Rate limiting simulation
    http.post('/contact-rate-limited', () => {
        return HttpResponse.json(
            {
                message: 'Too Many Attempts.',
                retry_after: 60,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': '60',
                },
            },
        );
    }),
];
