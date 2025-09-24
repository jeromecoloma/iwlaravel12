<?php

namespace App\Jobs;

use App\Services\EmailService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendContactFormEmail implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 5;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 120;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     */
    public int $maxExceptions = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly string $recipientEmail,
        public readonly string $contactName,
        public readonly string $contactEmail,
        public readonly string $contactSubject,
        public readonly string $contactMessage,
        public readonly array $metadata = [],
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(EmailService $emailService): void
    {
        Log::info('Processing contact form email with enhanced error handling', [
            'attempt' => $this->attempts(),
            'max_attempts' => $this->tries,
            'recipient' => $this->recipientEmail,
            'from' => $this->contactEmail,
            'subject' => $this->contactSubject,
        ]);

        $result = $emailService->sendContactFormEmail(
            $this->recipientEmail,
            $this->contactName,
            $this->contactEmail,
            $this->contactSubject,
            $this->contactMessage,
            $this->metadata,
            $this->attempts()
        );

        if ($result['success']) {
            Log::info('Contact form email processed successfully', [
                'recipient' => $this->recipientEmail,
                'from' => $this->contactEmail,
                'method' => $result['method'],
                'fallback_used' => $result['fallback_used'],
                'attempt' => $this->attempts(),
                'details' => $result['details'] ?? [],
            ]);

            // If a fallback was used, notify administrators
            if ($result['fallback_used']) {
                Log::warning('Contact form email required fallback method', [
                    'recipient' => $this->recipientEmail,
                    'from' => $this->contactEmail,
                    'fallback_method' => $result['method'],
                    'primary_error' => $result['error'],
                    'recommendation' => 'Check primary email provider (Mailgun) configuration and status',
                ]);
            }

        } else {
            // All methods failed
            $errorMessage = 'All email delivery methods failed: '.($result['error'] ?? 'Unknown error');

            Log::error('Contact form email delivery completely failed', [
                'recipient' => $this->recipientEmail,
                'from' => $this->contactEmail,
                'attempt' => $this->attempts(),
                'max_attempts' => $this->tries,
                'primary_error' => $result['error'],
                'details' => $result['details'] ?? [],
                'action_required' => 'Manual intervention needed',
            ]);

            // Check if we should retry (for retryable errors)
            if (isset($result['should_retry']) && $result['should_retry'] && $this->attempts() < $this->tries) {
                throw new Exception($errorMessage);
            }

            // Don't throw exception if all retries are exhausted or error is not retryable
            // The failed() method will handle final cleanup
        }
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        // Exponential backoff: 30s, 60s, 120s, 240s, 300s
        return [
            30,  // First retry after 30 seconds
            60,  // Second retry after 60 seconds
            120, // Third retry after 2 minutes
            240, // Fourth retry after 4 minutes
            300, // Fifth retry after 5 minutes
        ];
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Log::critical('Contact form email job failed after all retries', [
            'recipient' => $this->recipientEmail,
            'contact_name' => $this->contactName,
            'contact_email' => $this->contactEmail,
            'subject' => $this->contactSubject,
            'error' => $exception->getMessage(),
            'total_attempts' => $this->tries,
            'metadata' => $this->metadata,
        ]);

        // Use EmailService for final fallback attempt
        try {
            $emailService = app(EmailService::class);

            // Force save to storage as absolute last resort
            $emailService->sendContactFormEmail(
                $this->recipientEmail,
                $this->contactName,
                $this->contactEmail,
                $this->contactSubject,
                $this->contactMessage,
                array_merge($this->metadata, [
                    'job_failed_at' => now()->toISOString(),
                    'job_failure_reason' => $exception->getMessage(),
                    'total_job_attempts' => $this->tries,
                ]),
                $this->tries + 1 // Mark as final attempt
            );

        } catch (Exception $e) {
            Log::emergency('CRITICAL: Contact form email fallback also failed', [
                'recipient' => $this->recipientEmail,
                'contact_name' => $this->contactName,
                'contact_email' => $this->contactEmail,
                'subject' => $this->contactSubject,
                'original_error' => $exception->getMessage(),
                'fallback_error' => $e->getMessage(),
                'message' => $this->contactMessage,
                'metadata' => $this->metadata,
                'urgent_action_required' => 'Manual intervention needed immediately',
            ]);
        }

        // Additional notifications could be added here:
        // - Send admin notification email (if different email service available)
        // - Webhook notification to external monitoring service
        // - SMS notification for critical contact forms
        // - Update application metrics/dashboard
    }
}
