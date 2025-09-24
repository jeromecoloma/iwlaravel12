# Testing Framework Documentation

This project uses a comprehensive testing framework with multiple layers of testing to ensure code quality and reliability.

## Testing Stack

### Backend Testing (PHP/Laravel)

- **Framework**: Pest 4 with Laravel features
- **Location**: `tests/` directory
- **Features**:
    - Browser testing with Playwright integration
    - Laravel testing helpers and assertions
    - Database testing with RefreshDatabase
    - Custom expectations for email, URL, and slug validation

### Frontend Testing (JavaScript/TypeScript)

- **Framework**: Vitest + React Testing Library
- **Location**: `resources/js/**/*.{test,spec}.{ts,tsx}`
- **Features**:
    - React component testing
    - Custom testing utilities
    - Mocked Inertia.js integration
    - jsdom environment for DOM testing

### E2E Testing

- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Features**:
    - Cross-browser testing (Chrome, Firefox, Safari)
    - Mobile device testing
    - Visual regression testing
    - Performance testing

### API Mocking

- **Framework**: Mock Service Worker (MSW)
- **Location**: `resources/js/test/mocks/`
- **Features**:
    - Request/response interception
    - Realistic API simulation
    - Runtime handler overrides
    - Error scenario testing

## Running Tests

### Backend Tests

```bash
# Run all Pest tests
./vendor/bin/pest

# Run with parallel execution
./vendor/bin/pest --parallel

# Run specific test file
./vendor/bin/pest tests/Feature/ContactFormTest.php

# Run with coverage
./vendor/bin/pest --coverage
```

### Frontend Tests

```bash
# Run all Vitest tests
npm run test

# Run in watch mode
npm test

# Run once
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### E2E Tests

```bash
# Run all Playwright tests
npm run test:e2e

# Run with headed browser
npm run test:e2e:headed

# Run with UI mode
npm run test:e2e:ui
```

## Test Structure

### Backend Test Organization

```
tests/
├── Browser/           # Browser tests (Pest 4)
│   ├── Pest.php      # Browser-specific configuration
│   └── *.php         # Browser test files
├── Feature/          # Feature tests
├── Unit/             # Unit tests
└── Support/          # Shared test helpers
    └── Helpers.php   # Common test utilities
```

### Frontend Test Organization

```
resources/js/
├── Components/__tests__/  # Component tests
├── Pages/__tests__/       # Page component tests
├── Layouts/__tests__/     # Layout tests
└── test/                  # Test utilities
    ├── setup.ts          # Global test setup
    ├── utils.tsx         # Testing utilities
    └── mocks/            # MSW mock handlers
```

### E2E Test Organization

```
tests/e2e/
├── example.spec.ts        # Basic functionality
├── contact-form.spec.ts   # Contact form flows
└── *.spec.ts             # Other E2E test files
```

## Testing Patterns

### Backend Testing with Pest

```php
describe('Contact Form Tests', function () {
    it('validates required fields', function () {
        $response = $this->post('/contact', []);

        $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    });

    it('accepts valid submission', function () {
        Queue::fake();

        $response = $this->post('/contact', createContactFormData());

        $response->assertSessionHasNoErrors();
        Queue::assertPushed(SendContactFormEmail::class);
    });
});
```

### Frontend Testing with Vitest

```typescript
describe('Component Tests', () => {
  it('renders correctly', () => {
    render(<Component {...props} />);

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.click(screen.getByRole('button'));

    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### E2E Testing with Playwright

```typescript
test('contact form submission', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByRole('button', { name: /send/i }).click();

    await expect(page.getByText(/thank you/i)).toBeVisible();
});
```

### API Mocking with MSW

```typescript
// Define handlers
export const handlers = [
    http.post('/contact', async ({ request }) => {
        const formData = await request.formData();
        // Validate and return appropriate response
        return HttpResponse.json({ success: true });
    }),
];

// Use in tests
it('handles API responses', async () => {
    server.use(
        http.post('/contact', () => {
            return HttpResponse.json({ error: true }, { status: 500 });
        }),
    );

    // Test error handling
});
```

## Configuration Files

### Pest Configuration

- `tests/Pest.php` - Main Pest configuration
- `tests/Browser/Pest.php` - Browser testing configuration
- `phpunit.xml` - PHPUnit/Pest settings

### Vitest Configuration

- `vitest.config.ts` - Vitest configuration
- `resources/js/test/setup.ts` - Global test setup

### Playwright Configuration

- `playwright.config.ts` - E2E testing configuration

## Best Practices

### General

1. Write tests before or alongside implementation
2. Use descriptive test names that explain behavior
3. Keep tests focused and isolated
4. Use appropriate test types for different scenarios

### Backend Testing

1. Use factories and seeders for test data
2. Mock external services and APIs
3. Test both happy and error paths
4. Use database transactions for isolation

### Frontend Testing

1. Test user interactions, not implementation details
2. Use semantic queries (getByRole, getByLabelText)
3. Mock external dependencies
4. Test accessibility features

### E2E Testing

1. Focus on critical user journeys
2. Test across different browsers and devices
3. Use page object patterns for complex flows
4. Keep tests stable and maintainable

## Coverage Goals

- **Unit Tests**: 90%+ coverage for utilities and services
- **Feature Tests**: 80%+ coverage for critical paths
- **E2E Tests**: Cover main user journeys
- **Integration Tests**: Test component interactions

## Continuous Integration

Tests run automatically on:

- Pull request creation
- Push to main branch
- Scheduled nightly runs

All test types must pass before deployment to production.
