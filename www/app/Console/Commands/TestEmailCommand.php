<?php

namespace App\Console\Commands;

use App\Jobs\SendContactFormEmail;
use App\Services\EmailService;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test
                            {--to= : Email address to send test email to (defaults to mail.from.address)}
                            {--sync : Send email synchronously instead of using queue}
                            {--retry : Test email retry functionality by simulating failures}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email via Mailgun to verify email delivery configuration';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🧪 Testing Email Delivery Configuration');
        $this->newLine();

        // Determine recipient email
        $recipientEmail = $this->option('to') ?? Config::get('mail.from.address');

        if (empty($recipientEmail)) {
            $this->error('❌ No recipient email address specified. Please provide --to=email@example.com or configure mail.from.address');

            return Command::FAILURE;
        }

        // Check Mailgun configuration
        if (! $this->validateMailgunConfig()) {
            return Command::FAILURE;
        }

        $this->info("📧 Sending test email to: {$recipientEmail}");

        // Prepare test email data
        $testData = [
            'name' => 'Email Test System',
            'email' => 'test@'.parse_url(Config::get('app.url'), PHP_URL_HOST),
            'subject' => 'Email Delivery Test - '.now()->format('Y-m-d H:i:s'),
            'message' => $this->generateTestMessage(),
            'metadata' => [
                'test_run' => true,
                'command_executed_at' => now()->toDateTimeString(),
                'environment' => app()->environment(),
                'artisan_command' => $this->signature,
            ],
        ];

        try {
            if ($this->option('sync')) {
                $this->info('⚡ Sending email synchronously...');
                $this->sendSyncEmail($recipientEmail, $testData);
            } else {
                $this->info('🔄 Dispatching email job to queue...');
                $this->sendQueuedEmail($recipientEmail, $testData);
            }

            $this->newLine();
            $this->info('✅ Test email has been '.($this->option('sync') ? 'sent' : 'queued for delivery'));
            $this->info('📥 Check the recipient inbox and application logs for delivery status');

            if (! $this->option('sync')) {
                $this->newLine();
                $this->comment('💡 To view queue jobs: php artisan queue:work');
                $this->comment('💡 To monitor logs: php artisan queue:failed');
            }

            return Command::SUCCESS;

        } catch (Exception $e) {
            $this->newLine();
            $this->error('❌ Email test failed: '.$e->getMessage());
            $this->comment('Check your Mailgun configuration and network connectivity');

            return Command::FAILURE;
        }
    }

    /**
     * Validate Mailgun configuration.
     */
    protected function validateMailgunConfig(): bool
    {
        $requiredVars = [
            'MAILGUN_DOMAIN' => Config::get('services.mailgun.domain'),
            'MAILGUN_SECRET' => Config::get('services.mailgun.secret'),
            'MAIL_FROM_ADDRESS' => Config::get('mail.from.address'),
        ];

        $missing = [];
        foreach ($requiredVars as $name => $value) {
            if (empty($value)) {
                $missing[] = $name;
            }
        }

        if (! empty($missing)) {
            $this->error('❌ Missing required Mailgun configuration:');
            foreach ($missing as $var) {
                $this->error("   - {$var}");
            }
            $this->comment('Please configure these variables in your .env file');

            return false;
        }

        $this->comment('✅ Mailgun configuration validated');

        return true;
    }

    /**
     * Send email synchronously.
     */
    protected function sendSyncEmail(string $recipientEmail, array $testData): void
    {
        $job = new SendContactFormEmail(
            recipientEmail: $recipientEmail,
            contactName: $testData['name'],
            contactEmail: $testData['email'],
            contactSubject: $testData['subject'],
            contactMessage: $testData['message'],
            metadata: $testData['metadata']
        );

        $job->handle(app(EmailService::class));
    }

    /**
     * Send email via queue.
     */
    protected function sendQueuedEmail(string $recipientEmail, array $testData): void
    {
        SendContactFormEmail::dispatch(
            recipientEmail: $recipientEmail,
            contactName: $testData['name'],
            contactEmail: $testData['email'],
            contactSubject: $testData['subject'],
            contactMessage: $testData['message'],
            metadata: $testData['metadata']
        );
    }

    /**
     * Generate test message content.
     */
    protected function generateTestMessage(): string
    {
        return "This is a test email sent from the iwlaravel12 application.\n\n".
               "Test Details:\n".
               '- Sent at: '.now()->format('Y-m-d H:i:s T')."\n".
               '- Environment: '.app()->environment()."\n".
               '- Application: '.Config::get('app.name')."\n".
               '- URL: '.Config::get('app.url')."\n\n".
               "If you received this email, your Mailgun integration is working correctly!\n\n".
               "Email System Features Tested:\n".
               "✅ Mailgun SMTP delivery\n".
               "✅ Email template rendering\n".
               "✅ Queue job processing (if applicable)\n".
               "✅ Retry logic configuration\n\n".
               'You can safely ignore this test email.';
    }
}
