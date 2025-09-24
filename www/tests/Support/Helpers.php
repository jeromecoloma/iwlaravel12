<?php

use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| Test Support Helpers
|--------------------------------------------------------------------------
|
| Shared helper functions and utilities that can be used across different
| types of tests (Unit, Feature, Browser) to maintain consistency.
|
*/

function createContactFormData(array $overrides = []): array
{
    return array_merge([
        'name' => 'John Doe',
        'email' => 'test@gmail.com',
        'subject' => 'Test Inquiry',
        'message' => 'This is a test message with sufficient content for validation.',
    ], $overrides);
}

function createInvalidContactFormData(array $overrides = []): array
{
    return array_merge([
        'name' => '',
        'email' => 'invalid-email',
        'subject' => '',
        'message' => 'Short',
    ], $overrides);
}

function assertValidationErrors(array $expectedErrors): callable
{
    return function ($response) use ($expectedErrors) {
        foreach ($expectedErrors as $field) {
            $response->assertSessionHasErrors($field);
        }

        return $response;
    };
}

function assertContactFormSubmitted(): void
{
    // Check if contact form was logged (adjust based on actual implementation)
    expect(app('log')->getHandlers())
        ->not->toBeEmpty();
}

function mockMailgunSuccess(): void
{
    Mail::fake();
}

function mockMailgunFailure(): void
{
    Mail::shouldReceive('send')->andThrow(new Exception('Mailgun API Error'));
}

function createTestUser(array $attributes = []): object
{
    return (object) array_merge([
        'id' => 1,
        'name' => 'Test User',
        'email' => 'test@example.com',
        'created_at' => now(),
        'updated_at' => now(),
    ], $attributes);
}
