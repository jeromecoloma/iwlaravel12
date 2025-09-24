# Creating New Pages

This guide walks you through creating new pages in your Laravel + Inertia + React application.

## Table of Contents

- [Overview](#overview)
- [Step-by-Step Guide](#step-by-step-guide)
  - [1. Add Route (Laravel Backend)](#1-add-route-laravel-backend)
  - [2. Create React Component (Frontend)](#2-create-react-component-frontend)
  - [3. Optional: Create Controller](#3-optional-create-controller)
  - [4. Optional: Add Form Handling](#4-optional-add-form-handling)
  - [5. Optional: Update Navigation](#5-optional-update-navigation)
  - [6. Test Your Page](#6-test-your-page)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Overview

In this Laravel + Inertia + React application, pages are created by:
1. **Laravel** - Handling routes, data fetching, and server-side logic
2. **Inertia.js** - Bridging Laravel and React seamlessly
3. **React** - Rendering the UI components and handling client-side interactions

## Step-by-Step Guide

### 1. Add Route (Laravel Backend)

Edit `routes/web.php` to add your new route:

```php
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Simple page with no data
Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

// Page with data
Route::get('/team', function () {
    return Inertia::render('Team', [
        'members' => [
            ['name' => 'John Doe', 'role' => 'Developer'],
            ['name' => 'Jane Smith', 'role' => 'Designer'],
        ]
    ]);
})->name('team');
```

**Key Points:**
- Use `Inertia::render()` to render React components
- First parameter is the component name (matches file in `resources/js/Pages/`)
- Second parameter (optional) is data to pass to the component
- Always name your routes using `->name()`

### 2. Create React Component (Frontend)

Create a new file in `resources/js/Pages/` (e.g., `Services.tsx`):

```tsx
import MainLayout from '@/Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateStructuredData } from '@/hooks/useSEO';
import { Link } from '@inertiajs/react';
import React from 'react';

// Define props interface if you're passing data from Laravel
interface ServicesProps {
    // Add your props here if needed
    // services?: Service[];
}

export default function Services({ }: ServicesProps) {
    // SEO configuration
    const servicesSEO = {
        title: 'Our Services',
        description: 'Discover the comprehensive services we offer to help your business grow.',
        keywords: ['Services', 'Business Solutions', 'Professional Services'],
        ogImage: '/images/og-services.jpg',
        ogImageAlt: 'Our Services Overview',
        ogType: 'website' as const,
    };

    // Optional: Add structured data for SEO
    const servicesStructuredData = generateStructuredData('Service', {
        name: 'Professional Services',
        description: 'Comprehensive business solutions',
        provider: {
            '@type': 'Organization',
            name: 'Your Company Name',
        },
    });

    return (
        <MainLayout seo={servicesSEO} structuredData={[servicesStructuredData]}>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-white to-gray-50 py-20 dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                            Our Services
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                            We provide comprehensive solutions to help your business succeed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Content */}
            <section className="bg-white py-24 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Web Development</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Modern web applications built with cutting-edge technology.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Consulting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Expert guidance to help you make the right technical decisions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Ongoing maintenance and support for your applications.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 text-center">
                        <Link href="/contact">
                            <Button size="lg">
                                Get in Touch
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
```

**Key Components to Import:**
- `MainLayout` - The main layout wrapper
- UI components from `@/components/ui/`
- `Link` from `@inertiajs/react` for navigation
- SEO utilities from `@/hooks/useSEO`

### 3. Optional: Create Controller

For complex pages with business logic, create a controller:

```bash
php artisan make:controller ServicesController
```

Update your controller:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Display the services page.
     */
    public function index(): Response
    {
        $services = [
            [
                'title' => 'Web Development',
                'description' => 'Modern web applications built with cutting-edge technology.',
                'icon' => 'code',
                'features' => ['React', 'Laravel', 'TypeScript'],
            ],
            [
                'title' => 'Consulting',
                'description' => 'Expert guidance to help you make the right technical decisions.',
                'icon' => 'lightbulb',
                'features' => ['Architecture', 'Best Practices', 'Code Review'],
            ],
        ];

        return Inertia::render('Services', [
            'services' => $services,
        ]);
    }

    /**
     * Display a specific service.
     */
    public function show(string $service): Response
    {
        // Logic to fetch specific service
        $serviceData = $this->getServiceData($service);

        return Inertia::render('ServiceDetail', [
            'service' => $serviceData,
        ]);
    }

    private function getServiceData(string $service): array
    {
        // Your service data logic here
        return [];
    }
}
```

Update your route to use the controller:

```php
Route::get('/services', [ServicesController::class, 'index'])->name('services');
Route::get('/services/{service}', [ServicesController::class, 'show'])->name('services.show');
```

### 4. Optional: Add Form Handling

If your page includes forms, create a Form Request for validation:

```bash
php artisan make:request ServiceInquiryRequest
```

Update the Form Request:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceInquiryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'service' => ['required', 'string', 'in:web-development,consulting,support'],
            'message' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'service.in' => 'Please select a valid service option.',
        ];
    }
}
```

Add form handling to your controller:

```php
public function store(ServiceInquiryRequest $request): RedirectResponse
{
    $validated = $request->validated();

    // Process the form submission
    // e.g., send email, save to database, etc.

    return redirect()->back()->with('success', 'Thank you for your inquiry!');
}
```

Add the POST route:

```php
Route::post('/services/inquiry', [ServicesController::class, 'store'])->name('services.inquiry');
```

### 5. Optional: Update Navigation

Add navigation links in your layout or components. The main navigation is typically in `MainLayout.tsx`:

```tsx
// In MainLayout.tsx or a navigation component
<NavigationMenuItem>
    <NavigationMenuLink href="/services" className={navigationMenuTriggerStyle()}>
        Services
    </NavigationMenuLink>
</NavigationMenuItem>
```

Or use Inertia's `Link` component:

```tsx
<Link href="/services" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
    Services
</Link>
```

### 6. Test Your Page

1. **Start the development server:**
   ```bash
   composer run dev
   ```

2. **Visit your new page:**
   - Navigate to `http://localhost:8000/services` (or your configured URL)

3. **Check for common issues:**
   - Ensure the React component file exists and exports a default function
   - Verify the route is correctly defined
   - Check browser console for JavaScript errors
   - Test responsive design on different screen sizes
   - Validate SEO metadata using browser dev tools

## Examples

### Simple Static Page

```php
// Route
Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');
```

```tsx
// Component: resources/js/Pages/Privacy.tsx
import MainLayout from '@/Layouts/MainLayout';

export default function Privacy() {
    const privacySEO = {
        title: 'Privacy Policy',
        description: 'Our privacy policy and data protection information.',
    };

    return (
        <MainLayout seo={privacySEO}>
            <div className="mx-auto max-w-4xl px-4 py-16">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose dark:prose-invert">
                    <p>Your privacy policy content here...</p>
                </div>
            </div>
        </MainLayout>
    );
}
```

### Dynamic Page with Data

```php
// Route
Route::get('/blog/{post}', [BlogController::class, 'show'])->name('blog.show');
```

```php
// Controller
public function show(Post $post): Response
{
    return Inertia::render('BlogPost', [
        'post' => $post->load('author', 'tags'),
        'relatedPosts' => $post->getRelatedPosts(3),
    ]);
}
```

```tsx
// Component: resources/js/Pages/BlogPost.tsx
interface BlogPostProps {
    post: {
        id: number;
        title: string;
        content: string;
        author: {
            name: string;
        };
        tags: Array<{
            name: string;
        }>;
    };
    relatedPosts: Array<{
        id: number;
        title: string;
        slug: string;
    }>;
}

export default function BlogPost({ post, relatedPosts }: BlogPostProps) {
    // Component implementation...
}
```

## Best Practices

### 1. **SEO Optimization**
- Always configure SEO metadata using the `useSEO` hook
- Include relevant structured data for search engines
- Use semantic HTML elements

### 2. **Performance**
- Use TypeScript interfaces for props
- Implement proper loading states
- Optimize images and assets

### 3. **Accessibility**
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain good color contrast
- Use semantic HTML

### 4. **Code Organization**
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Follow consistent naming conventions

### 5. **Security**
- Always validate form data using Form Requests
- Sanitize user input
- Use CSRF protection (automatically handled by Laravel)

## Common Patterns

### 1. **Loading States**
Use the built-in loading components:

```tsx
import LoadingContainer from '@/components/LoadingContainer';

<LoadingContainer isLoading={isLoading} placeholder="card">
    <YourContent />
</LoadingContainer>
```

### 2. **Form Handling**
Use Inertia's `useForm` hook:

```tsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    message: '',
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/contact');
};
```

### 3. **Shared Data**
Pass data to all pages using middleware or in `HandleInertiaRequests`:

```php
// In HandleInertiaRequests middleware
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'message' => fn () => $request->session()->get('message'),
        ],
    ]);
}
```

## Troubleshooting

### Common Issues

1. **"Component not found" error**
   - Check file name matches the route's render parameter
   - Ensure the component exports a default function
   - Verify the file is in `resources/js/Pages/`

2. **TypeScript errors**
   - Define proper interfaces for props
   - Check import paths use the correct aliases (@/)
   - Run `npm run type-check` to see all TypeScript issues

3. **Styling issues**
   - Ensure Tailwind classes are being applied
   - Check dark mode classes are included if needed
   - Run `npm run build` to compile CSS

4. **Inertia errors**
   - Check browser network tab for failed requests
   - Verify route names match between Laravel and frontend
   - Ensure CSRF token is valid

### Debugging Tips

1. **Use Laravel's debugging tools:**
   ```bash
   php artisan route:list  # View all routes
   php artisan tinker     # Test Laravel code interactively
   ```

2. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Use browser dev tools:**
   - Check console for JavaScript errors
   - Inspect network requests
   - Use React Developer Tools extension

4. **Inertia debugging:**
   - Install Inertia dev tools browser extension
   - Check Inertia requests in network tab
   - Use `dd()` in Laravel to dump data being passed to Inertia

---

Need help? Check the [main README](../README.md) for additional resources and testing information.