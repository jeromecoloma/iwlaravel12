/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./resources/js/test/setup.ts'],
        include: ['resources/js/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/public/**',
            '**/storage/**',
            '**/vendor/**',
        ],
        // Enable parallel execution
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@/Components': path.resolve(__dirname, 'resources/js/components'),
            '@/Pages': path.resolve(__dirname, 'resources/js/pages'),
            '@/Layouts': path.resolve(__dirname, 'resources/js/Layouts'),
            '@/types': path.resolve(__dirname, 'resources/js/types'),
            '@/utils': path.resolve(__dirname, 'resources/js/utils'),
        },
    },
});
