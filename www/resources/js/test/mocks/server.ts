import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Mock Service Worker Server for Node.js Environment
 *
 * This creates a mock server that intercepts API requests during testing
 * in Node.js environments (Vitest, Jest, etc.).
 */
export const server = setupServer(...handlers);
