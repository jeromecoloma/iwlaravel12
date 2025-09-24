<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use App\Services\ContactService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Handle the contact form submission with performance optimizations.
     */
    public function store(ContactFormRequest $request, ContactService $contactService): RedirectResponse
    {
        try {
            $validated = $request->validated();

            // Check for potential duplicate submission
            if ($contactService->isDuplicateSubmission($validated['email'], $validated['subject'])) {
                return redirect()->back()
                    ->with('warning', 'It looks like you already submitted a similar message recently. Please wait before submitting again.');
            }

            // Process submission with performance optimizations
            $submission = $contactService->processSubmission($validated, $request);

            // Log the successful submission
            Log::info('Contact form submission processed', [
                'submission_id' => $submission->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'message_length' => strlen($validated['message']),
            ]);

            return redirect()->back()->with('success', 'Thank you for your message! We\'ll get back to you soon.');

        } catch (Exception $e) {
            Log::error('Contact form submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->only(['name', 'email', 'subject']),
            ]);

            // Handle rate limiting specifically
            if (str_contains($e->getMessage(), 'Too many submissions')) {
                return redirect()->back()
                    ->withErrors(['form' => $e->getMessage()])
                    ->withInput();
            }

            return redirect()->back()
                ->withErrors(['form' => 'Sorry, there was an error sending your message. Please try again.'])
                ->withInput();
        }
    }
}
