import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Mock Service Worker Browser Worker
 *
 * This creates a service worker that intercepts API requests during testing
 * in browser environments (Playwright, Cypress, manual testing).
 */
export const worker = setupWorker(...handlers);
