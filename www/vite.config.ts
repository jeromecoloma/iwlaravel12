import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';
import path from 'path';

// Check if PHP is available
function isPhpAvailable(): boolean {
    try {
        execSync('php --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

const basePlugins = [
    laravel({
        input: ['resources/css/app.css', 'resources/js/app.tsx'],
        ssr: 'resources/js/ssr.tsx',
        refresh: true,
    }),
    react(),
    tailwindcss(),
];

// Only add wayfinder plugin if PHP is available
const plugins = isPhpAvailable()
    ? [...basePlugins, wayfinder({ formVariants: true })]
    : basePlugins;

export default defineConfig({
    plugins,
    esbuild: {
        jsx: 'automatic',
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
