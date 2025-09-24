<?php

use App\Jobs\SendContactFormEmail;
use Illuminate\Support\Facades\Queue;

describe('Contact Form Basic Tests', function () {
    it('renders contact page correctly', function () {
        $response = $this->get('/contact');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Contact'));
    });

    it('requires all fields', function () {
        $response = $this->post('/contact', []);

        $response->assertRedirect()
            ->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    });

    it('validates email format', function () {
        $response = $this->post('/contact', createContactFormData([
            'email' => 'invalid-email',
        ]));

        $response->assertRedirect()
            ->assertSessionHasErrors(['email']);
    });

    it('validates message minimum length', function () {
        $response = $this->post('/contact', createContactFormData([
            'message' => 'Short',
        ]));

        $response->assertRedirect()
            ->assertSessionHasErrors(['message']);
    });

    it('accepts valid form submission', function () {
        Queue::fake();

        $response = $this->post('/contact', createContactFormData());

        $response->assertSessionHasNoErrors()
            ->assertRedirect();

        Queue::assertPushed(SendContactFormEmail::class);
    });
});
