# Testing Guide

This document outlines the simplified testing approach for this Laravel + React + Inertia project.

## Overview

The project uses a streamlined testing setup focused on essential tools:

- **Pest** - PHP/Laravel testing framework
- **Vitest** - React component testing
- **Laravel Pint** - PHP code formatting
- **PHPStan** - PHP static analysis
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting

## Running Tests

### Backend Tests (PHP/Laravel)
```bash
# Run all PHP tests
composer test

# Run tests with specific options
./vendor/bin/pest
./vendor/bin/pest --parallel
./vendor/bin/pest --filter=UserTest
```

### Frontend Tests (JavaScript/React)
```bash
# Run all frontend tests
npm run test

# Run tests interactively
npx vitest
```

### Code Quality Checks

```bash
# PHP code formatting
vendor/bin/pint

# PHP static analysis
vendor/bin/phpstan analyse

# JavaScript linting
npm run lint

# JavaScript formatting
npm run format
```

## Run All Tests & Quality Checks

```bash
# Complete test suite
composer test && npm run test && vendor/bin/pint && vendor/bin/phpstan analyse && npm run lint
```

## GitHub Actions

The project includes automated testing via GitHub Actions:

- **`.github/workflows/tests.yml`** - Runs backend (Pest) and frontend (Vitest) tests
- **`.github/workflows/lint.yml`** - Runs code quality checks (Pint, PHPStan, ESLint, Prettier)

## Test Structure

### Backend Tests
- **Location**: `tests/Feature/` and `tests/Unit/`
- **Framework**: Pest
- **Database**: SQLite for testing
- **Configuration**: `phpunit.xml`

### Frontend Tests
- **Location**: `resources/js/**/*.{test,spec}.{js,ts,jsx,tsx}`
- **Framework**: Vitest + Testing Library
- **Configuration**: `vitest.config.ts`
- **Setup**: `resources/js/test/setup.ts`

## Configuration Files

| File | Purpose |
|------|---------|
| `phpstan.neon` | PHPStan static analysis rules |
| `pint.json` | Laravel Pint formatting rules |
| `eslint.config.js` | ESLint linting configuration |
| `vitest.config.ts` | Vitest testing configuration |
| `package.json` | NPM scripts and formatting rules |

## Best Practices

1. **Run tests frequently** during development
2. **Write tests for new features** before implementation
3. **Keep tests simple and focused** on specific functionality
4. **Use meaningful test names** that describe what's being tested
5. **Follow the project's existing patterns** for consistency

## Troubleshooting

### PHPStan Memory Issues
```bash
# Increase memory limit
vendor/bin/phpstan analyse --memory-limit=1G
```

### Database Issues
```bash
# Refresh test database
php artisan migrate:fresh --database=testing
```

### Frontend Test Issues
```bash
# Clear Vitest cache
npx vitest run --reporter=verbose
```

## Writing Tests

### Backend Test Example (Pest)
```php
it('can create a user', function () {
    $user = User::factory()->create();

    expect($user)->toBeInstanceOf(User::class);
    expect($user->email)->not->toBeEmpty();
});
```

### Frontend Test Example (Vitest + Testing Library)
```javascript
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Button from '@/Components/Button'

test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

## Development Workflow

1. **Write/modify code**
2. **Run relevant tests** (`composer test` or `npm run test`)
3. **Check code quality** (`vendor/bin/pint`, `npm run lint`)
4. **Fix any issues**
5. **Commit changes**

The GitHub Actions will automatically run the full test suite on push/PR.