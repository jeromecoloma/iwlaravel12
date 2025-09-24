<?php

/*
|--------------------------------------------------------------------------
| Browser Testing Configuration
|--------------------------------------------------------------------------
|
| Configure Pest 4 browser testing with modern settings for optimal performance
| and reliability across different browsers and devices.
|
*/

pest()->browser()
    ->timeout(10000) // 10 seconds timeout for browser actions
    ->userAgent('PestBrowser/4.0 (iwlaravel12 Testing)');

/*
|--------------------------------------------------------------------------
| Browser Test Helpers
|--------------------------------------------------------------------------
|
| Helper functions specific to browser testing to reduce code duplication
| and provide consistent testing patterns across browser tests.
|
*/

function visitHomePage()
{
    return visit('/');
}

function visitAboutPage()
{
    return visit('/about');
}

function visitContactPage()
{
    return visit('/contact');
}

function fillContactForm(array $data = [])
{
    $formData = array_merge([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'subject' => 'Test Inquiry',
        'message' => 'This is a test message with sufficient content for validation.',
    ], $data);

    return visit('/contact')
        ->fill('name', $formData['name'])
        ->fill('email', $formData['email'])
        ->fill('subject', $formData['subject'])
        ->fill('message', $formData['message']);
}

function assertPageContainsNavigation($page)
{
    return $page->assertSee('Home')
        ->assertSee('About')
        ->assertSee('Contact')
        ->assertSee('Documentation');
}

function assertNoAccessibilityViolations($page)
{
    return $page->assertNoAccessibilityIssues();
}
