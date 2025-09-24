import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    {
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'], // Required for React 17+
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        files: ['**/__tests__/**/*', '**/*.{test,spec}.{js,jsx,ts,tsx}', '**/test/**/*'],
        plugins: {
            'testing-library': testingLibrary,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
            },
        },
        rules: {
            'testing-library/await-async-queries': 'error',
            'testing-library/no-await-sync-queries': 'error',
            'testing-library/no-debugging-utils': 'warn',
            'testing-library/no-dom-import': 'error',
            'testing-library/prefer-find-by': 'error',
            'testing-library/prefer-screen-queries': 'error',
            'testing-library/render-result-naming-convention': 'error',
        },
    },
    {
        ignores: ['vendor', 'node_modules', 'public', 'bootstrap/ssr', 'tailwind.config.js'],
    },
    prettier, // Turn off all rules that might conflict with Prettier
];
