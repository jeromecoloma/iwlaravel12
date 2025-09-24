import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from './mocks/server';

describe('API Mocking with MSW', () => {
    it('should mock contact form submission successfully', async () => {
        const formData = new FormData();
        formData.append('name', 'John Doe');
        formData.append('email', 'john@example.com');
        formData.append('subject', 'Test Subject');
        formData.append('message', 'This is a test message with sufficient content.');

        const response = await fetch('/contact', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toContain('Thank you for your message');
    });

    it('should mock validation errors', async () => {
        const formData = new FormData();
        formData.append('name', '');
        formData.append('email', 'invalid-email');
        formData.append('subject', '');
        formData.append('message', 'Short');

        const response = await fetch('/contact', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        expect(response.status).toBe(422);
        expect(data.errors).toHaveProperty('name');
        expect(data.errors).toHaveProperty('email');
        expect(data.errors).toHaveProperty('subject');
        expect(data.errors).toHaveProperty('message');
    });

    it('should mock server errors', async () => {
        const response = await fetch('/contact-error', {
            method: 'POST',
        });

        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe(true);
        expect(data.message).toContain('temporarily unavailable');
    });

    it('should mock authentication endpoints', async () => {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password',
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.user).toHaveProperty('email', 'test@example.com');
        expect(data.token).toBe('mock-auth-token');
    });

    it('should mock rate limiting', async () => {
        const response = await fetch('/contact-rate-limited', {
            method: 'POST',
        });

        const data = await response.json();

        expect(response.status).toBe(429);
        expect(data.message).toContain('Too Many Attempts');
        expect(response.headers.get('Retry-After')).toBe('60');
    });

    it('should allow runtime handler overrides', async () => {
        // Override the contact endpoint for this specific test
        server.use(
            http.post('/contact', () => {
                return HttpResponse.json({ message: 'Custom test response' }, { status: 200 });
            }),
        );

        const formData = new FormData();
        formData.append('name', 'John Doe');
        formData.append('email', 'john@example.com');
        formData.append('subject', 'Test');
        formData.append('message', 'Test message');

        const response = await fetch('/contact', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        expect(data.message).toBe('Custom test response');
        // Handler will be reset after this test due to server.resetHandlers() in afterEach
    });

    it('should mock email service status', async () => {
        const response = await fetch('/api/email/status');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.primary).toHaveProperty('method', 'mailgun');
        expect(data.primary).toHaveProperty('available', true);
        expect(data.fallbacks).toHaveLength(3);
    });
});
