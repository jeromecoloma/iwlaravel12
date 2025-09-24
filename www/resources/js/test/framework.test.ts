import { describe, expect, it, vi } from 'vitest';

describe('Testing Framework Verification', () => {
    it('should have vitest working correctly', () => {
        expect(1 + 1).toBe(2);
    });

    it('should support mocking with vi', () => {
        const mockFn = vi.fn();
        mockFn('test');
        expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should support async tests', async () => {
        const result = await Promise.resolve('success');
        expect(result).toBe('success');
    });

    it('should have proper environment setup', () => {
        expect(typeof window).toBe('object');
        expect(typeof document).toBe('object');
    });
});
