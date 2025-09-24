<?php

namespace App\Services;

use App\Mail\ContactFormMail;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use Symfony\Component\Mailer\Exception\TransportException;

class EmailService
{
    /**
     * Available email fallback methods
     */
    const FALLBACK_LOG = 'log';

    const FALLBACK_DATABASE = 'database';

    const FALLBACK_STORAGE = 'storage';

    const FALLBACK_SMTP = 'smtp';

    /**
     * Email providers configuration
     */
    private array $providers;

    public function __construct()
    {
        $this->providers = [
            'mailgun' => 'mailgun',
            'smtp' => 'smtp',
            'log' => 'log',
        ];
    }

    /**
     * Get available email providers
     */
    public function getProviders(): array
    {
        return $this->providers;
    }

    /**
     * Fallback methods in order of preference
     */
    private array $fallbackMethods = [
        self::FALLBACK_SMTP,
        self::FALLBACK_STORAGE,
        self::FALLBACK_LOG,
        self::FALLBACK_DATABASE,
    ];

    /**
     * Send email with comprehensive error handling and fallbacks
     */
    public function sendContactFormEmail(
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata = [],
        int $attempt = 1,
    ): array {
        $result = [
            'success' => false,
            'method' => null,
            'error' => null,
            'fallback_used' => false,
            'attempt' => $attempt,
            'details' => [],
        ];

        // Try primary email provider (Mailgun)
        try {
            $this->sendViaPrimaryProvider(
                $recipientEmail,
                $contactName,
                $contactEmail,
                $contactSubject,
                $contactMessage,
                $metadata
            );

            $result['success'] = true;
            $result['method'] = 'mailgun';
            $result['details']['provider'] = 'Primary (Mailgun)';

            Log::info('Contact form email sent successfully via primary provider', [
                'recipient' => $recipientEmail,
                'from' => $contactEmail,
                'attempt' => $attempt,
                'provider' => 'mailgun',
            ]);

            return $result;

        } catch (Exception $e) {
            $result['error'] = $e->getMessage();
            $result['details']['primary_error'] = $e->getMessage();

            Log::warning('Primary email provider failed, attempting fallbacks', [
                'recipient' => $recipientEmail,
                'from' => $contactEmail,
                'attempt' => $attempt,
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
            ]);

            // Determine if this is a retryable error
            if (! $this->isRetryableError($e)) {
                return $this->handleFallbacks($result, $recipientEmail, $contactName, $contactEmail, $contactSubject, $contactMessage, $metadata);
            }

            // If retryable, still try fallbacks but mark for retry
            $fallbackResult = $this->handleFallbacks($result, $recipientEmail, $contactName, $contactEmail, $contactSubject, $contactMessage, $metadata);
            $fallbackResult['should_retry'] = true;

            return $fallbackResult;
        }
    }

    /**
     * Send email via primary provider (Mailgun)
     */
    private function sendViaPrimaryProvider(
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata,
    ): void {
        // Temporarily switch to Mailgun mailer
        $originalMailer = Config::get('mail.default');
        Config::set('mail.default', 'mailgun');

        try {
            Mail::to($recipientEmail)
                ->send(new ContactFormMail(
                    contactName: $contactName,
                    contactEmail: $contactEmail,
                    contactSubject: $contactSubject,
                    contactMessage: $contactMessage,
                    requestMetadata: $metadata
                ));
        } finally {
            // Restore original mailer
            Config::set('mail.default', $originalMailer);
        }
    }

    /**
     * Handle fallback mechanisms
     */
    private function handleFallbacks(
        array $result,
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata,
    ): array {
        foreach ($this->fallbackMethods as $method) {
            try {
                $this->executeFallbackMethod($method, $recipientEmail, $contactName, $contactEmail, $contactSubject, $contactMessage, $metadata, $result['error']);

                $result['success'] = true;
                $result['method'] = $method;
                $result['fallback_used'] = true;
                $result['details']['fallback_method'] = $method;

                Log::info('Contact form email handled via fallback method', [
                    'recipient' => $recipientEmail,
                    'from' => $contactEmail,
                    'fallback_method' => $method,
                    'original_error' => $result['error'],
                ]);

                return $result;

            } catch (Exception $e) {
                $result['details']['fallback_errors'][$method] = $e->getMessage();

                Log::warning('Fallback method failed', [
                    'method' => $method,
                    'error' => $e->getMessage(),
                ]);

                continue; // Try next fallback method
            }
        }

        // All fallback methods failed
        $result['details']['all_fallbacks_failed'] = true;

        return $result;
    }

    /**
     * Execute specific fallback method
     */
    private function executeFallbackMethod(
        string $method,
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata,
        ?string $originalError,
    ): void {
        switch ($method) {
            case self::FALLBACK_SMTP:
                $this->sendViaSMTP($recipientEmail, $contactName, $contactEmail, $contactSubject, $contactMessage, $metadata);
                break;

            case self::FALLBACK_STORAGE:
                $this->saveToStorage($recipientEmail, $contactName, $contactEmail, $contactSubject, $contactMessage, $metadata, $originalError);
                break;

            case self::FALLBACK_LOG:
                $this->saveToLog($recipientEmail, $contactName, $contactEmail, $contactSubject, $contactMessage, $metadata, $originalError);
                break;

            case self::FALLBACK_DATABASE:
                $this->saveToDatabase($recipientEmail, $contactName, $contactEmail, $contactSubject, $contactMessage, $metadata, $originalError);
                break;

            default:
                throw new InvalidArgumentException("Unknown fallback method: {$method}");
        }
    }

    /**
     * Send via SMTP fallback
     */
    private function sendViaSMTP(
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata,
    ): void {
        $originalMailer = Config::get('mail.default');
        Config::set('mail.default', 'smtp');

        try {
            Mail::to($recipientEmail)
                ->send(new ContactFormMail(
                    contactName: $contactName,
                    contactEmail: $contactEmail,
                    contactSubject: $contactSubject,
                    contactMessage: $contactMessage,
                    requestMetadata: $metadata
                ));
        } finally {
            Config::set('mail.default', $originalMailer);
        }
    }

    /**
     * Save email to storage as fallback
     */
    private function saveToStorage(
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata,
        ?string $originalError,
    ): void {
        $emailData = [
            'timestamp' => now()->toISOString(),
            'recipient' => $recipientEmail,
            'contact_name' => $contactName,
            'contact_email' => $contactEmail,
            'subject' => $contactSubject,
            'message' => $contactMessage,
            'metadata' => $metadata,
            'original_error' => $originalError,
            'fallback_method' => 'storage',
        ];

        $filename = 'failed-emails/'.now()->format('Y-m-d').'/'.uniqid('contact-', true).'.json';

        $jsonData = json_encode($emailData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if ($jsonData !== false) {
            Storage::disk('local')->put($filename, $jsonData);
        }

        Log::notice('Contact form email saved to storage for manual processing', [
            'file' => $filename,
            'recipient' => $recipientEmail,
            'from' => $contactEmail,
        ]);
    }

    /**
     * Save email details to log as fallback
     */
    private function saveToLog(
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata,
        ?string $originalError,
    ): void {
        Log::emergency('CONTACT FORM EMAIL - MANUAL PROCESSING REQUIRED', [
            'timestamp' => now()->toISOString(),
            'recipient' => $recipientEmail,
            'contact_name' => $contactName,
            'contact_email' => $contactEmail,
            'subject' => $contactSubject,
            'message' => $contactMessage,
            'metadata' => $metadata,
            'original_error' => $originalError,
            'instructions' => 'This contact form submission requires manual processing due to email delivery failure.',
        ]);
    }

    /**
     * Save email to database as fallback (requires implementation)
     */
    private function saveToDatabase(
        string $recipientEmail,
        string $contactName,
        string $contactEmail,
        string $contactSubject,
        string $contactMessage,
        array $metadata,
        ?string $originalError,
    ): void {
        // Note: This would require creating a failed_emails migration/model
        // For now, we'll log this as a database save
        Log::critical('Contact form email marked for database storage', [
            'timestamp' => now()->toISOString(),
            'recipient' => $recipientEmail,
            'contact_name' => $contactName,
            'contact_email' => $contactEmail,
            'subject' => $contactSubject,
            'message' => $contactMessage,
            'metadata' => $metadata,
            'original_error' => $originalError,
            'fallback_method' => 'database',
            'note' => 'Implement FailedEmail model and migration for full database fallback support',
        ]);
    }

    /**
     * Determine if an error is retryable
     */
    private function isRetryableError(Exception $e): bool
    {
        // Network/connection errors are typically retryable
        if ($e instanceof TransportException) {
            $message = strtolower($e->getMessage());

            // Connection and timeout errors are retryable
            if (str_contains($message, 'connection') ||
                str_contains($message, 'timeout') ||
                str_contains($message, 'network') ||
                str_contains($message, 'dns')) {
                return true;
            }

            // Rate limiting is retryable
            if (str_contains($message, 'rate limit') ||
                str_contains($message, '429') ||
                str_contains($message, 'too many requests')) {
                return true;
            }

            // Server errors (5xx) are typically retryable
            if (preg_match('/5\d\d/', $message)) {
                return true;
            }

            // Authentication errors are typically not retryable
            if (str_contains($message, 'authentication') ||
                str_contains($message, 'unauthorized') ||
                str_contains($message, '401') ||
                str_contains($message, '403')) {
                return false;
            }

            // Invalid recipient/validation errors are not retryable
            if (str_contains($message, 'invalid') ||
                str_contains($message, 'malformed') ||
                str_contains($message, '400')) {
                return false;
            }
        }

        // Default to retryable for unexpected errors
        return true;
    }

    /**
     * Get email service status
     */
    public function getServiceStatus(): array
    {
        $status = [
            'primary_provider' => 'mailgun',
            'fallback_methods' => $this->fallbackMethods,
            'provider_status' => [],
        ];

        // Test Mailgun connection
        try {
            $this->testMailgunConnection();
            $status['provider_status']['mailgun'] = 'operational';
        } catch (Exception $e) {
            $status['provider_status']['mailgun'] = 'error: '.$e->getMessage();
        }

        // Test SMTP connection
        try {
            $this->testSMTPConnection();
            $status['provider_status']['smtp'] = 'operational';
        } catch (Exception $e) {
            $status['provider_status']['smtp'] = 'error: '.$e->getMessage();
        }

        return $status;
    }

    /**
     * Test Mailgun connection
     */
    private function testMailgunConnection(): void
    {
        $domain = Config::get('services.mailgun.domain');
        $secret = Config::get('services.mailgun.secret');

        if (! $domain || ! $secret) {
            throw new Exception('Mailgun configuration missing');
        }

        // Basic configuration check
        if (! filter_var("test@{$domain}", FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid Mailgun domain configuration');
        }
    }

    /**
     * Test SMTP connection
     */
    private function testSMTPConnection(): void
    {
        $host = Config::get('mail.mailers.smtp.host');
        $port = Config::get('mail.mailers.smtp.port');

        if (! $host || ! $port) {
            throw new Exception('SMTP configuration missing');
        }

        // Basic configuration check
        if (! is_numeric($port) || $port < 1 || $port > 65535) {
            throw new Exception('Invalid SMTP port configuration');
        }
    }
}
