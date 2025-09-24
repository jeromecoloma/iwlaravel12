<?php

namespace App\Services;

use App\Jobs\SendContactFormEmail;
use App\Models\ContactSubmission;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class ContactService
{
    /**
     * Process a contact form submission with performance optimizations.
     */
    public function processSubmission(array $data, Request $request): ContactSubmission
    {
        // Rate limiting per IP and email
        $ip = $request->ip() ?? '';
        $this->enforceRateLimit($ip, $data['email']);

        // Create submission with minimal database impact
        $submission = $this->createSubmission($data, $request);

        // Queue email processing asynchronously
        SendContactFormEmail::dispatch(
            recipientEmail: config('mail.from.address'),
            contactName: $submission->name,
            contactEmail: $submission->email,
            contactSubject: $submission->subject,
            contactMessage: $submission->message,
            metadata: [
                'ip_address' => $submission->ip_address,
                'user_agent' => $submission->user_agent,
                'submitted_at' => $submission->created_at?->toDateTimeString(),
                'submission_id' => $submission->id,
            ]
        );

        // Cache recent submission for duplicate detection
        $this->cacheRecentSubmission($submission);

        return $submission;
    }

    /**
     * Create contact submission with optimized data collection.
     */
    private function createSubmission(array $data, Request $request): ContactSubmission
    {
        return ContactSubmission::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'],
            'message' => $data['message'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => Auth::id(),
            'status' => 'pending',
        ]);
    }

    /**
     * Enforce rate limiting to prevent spam.
     */
    private function enforceRateLimit(string $ip, string $email): void
    {
        $ipKey = 'contact_form_ip:'.$ip;
        $emailKey = 'contact_form_email:'.$email;

        // 5 submissions per hour per IP
        if (RateLimiter::tooManyAttempts($ipKey, 5)) {
            $seconds = RateLimiter::availableIn($ipKey);
            throw new Exception("Too many submissions from this IP. Try again in {$seconds} seconds.");
        }

        // 3 submissions per hour per email
        if (RateLimiter::tooManyAttempts($emailKey, 3)) {
            $seconds = RateLimiter::availableIn($emailKey);
            throw new Exception("Too many submissions from this email. Try again in {$seconds} seconds.");
        }

        RateLimiter::hit($ipKey, 3600); // 1 hour
        RateLimiter::hit($emailKey, 3600); // 1 hour
    }

    /**
     * Cache recent submission for duplicate detection.
     */
    private function cacheRecentSubmission(ContactSubmission $submission): void
    {
        $key = 'recent_submission:'.md5($submission->email.$submission->subject);
        Cache::put($key, $submission->id, 300); // 5 minutes
    }

    /**
     * Get contact submission statistics with caching.
     */
    public function getStatistics(): array
    {
        return ContactSubmission::getStatistics();
    }

    /**
     * Get recent submissions with optimized queries.
     */
    public function getRecentSubmissions(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return Cache::remember(
            "recent_contact_submissions_{$limit}",
            300, // 5 minutes
            fn () => ContactSubmission::getWithUser()
                ->limit($limit)
                ->get()
        );
    }

    /**
     * Check if submission might be duplicate.
     */
    public function isDuplicateSubmission(string $email, string $subject): bool
    {
        $key = 'recent_submission:'.md5($email.$subject);

        return Cache::has($key);
    }

    /**
     * Mark submission as processed.
     */
    public function markAsProcessed(ContactSubmission $submission): void
    {
        $submission->update([
            'status' => 'processed',
            'processed_at' => now(),
        ]);

        // Clear related caches
        $this->clearSubmissionCaches();
    }

    /**
     * Clear submission-related caches.
     */
    private function clearSubmissionCaches(): void
    {
        Cache::forget('contact_submissions_stats');

        // Clear recent submissions caches
        for ($i = 5; $i <= 50; $i += 5) {
            Cache::forget("recent_contact_submissions_{$i}");
        }
    }
}
