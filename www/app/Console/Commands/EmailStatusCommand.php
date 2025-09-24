<?php

namespace App\Console\Commands;

use App\Services\EmailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;

class EmailStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:status {--test : Test email delivery with all methods}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check email service status and test delivery methods';

    /**
     * Execute the console command.
     */
    public function handle(EmailService $emailService): int
    {
        $this->info('🔍 Checking Email Service Status...');
        $this->newLine();

        // Get service status
        $status = $emailService->getServiceStatus();

        // Display primary provider
        $this->info("📧 Primary Provider: {$status['primary_provider']}");
        $this->newLine();

        // Display provider status
        $this->info('🔧 Provider Status:');
        foreach ($status['provider_status'] as $provider => $providerStatus) {
            $icon = str_contains($providerStatus, 'error') ? '❌' : '✅';
            $this->line("  {$icon} {$provider}: {$providerStatus}");
        }
        $this->newLine();

        // Display fallback methods
        $this->info('🔄 Available Fallback Methods:');
        foreach ($status['fallback_methods'] as $index => $method) {
            $this->line('  '.($index + 1).". {$method}");
        }
        $this->newLine();

        // Display configuration
        $this->info('⚙️  Configuration:');
        $this->displayConfiguration();
        $this->newLine();

        // Test delivery if requested
        if ($this->option('test')) {
            $this->testEmailDelivery($emailService);
        }

        return Command::SUCCESS;
    }

    /**
     * Display email configuration
     */
    private function displayConfiguration(): void
    {
        $defaultMailer = Config::get('mail.default');
        $fromAddress = Config::get('mail.from.address');
        $fromName = Config::get('mail.from.name');

        $this->line("  Default Mailer: {$defaultMailer}");
        $this->line("  From Address: {$fromAddress}");
        $this->line("  From Name: {$fromName}");

        // Mailgun configuration
        $mailgunDomain = Config::get('services.mailgun.domain');
        $mailgunSecret = Config::get('services.mailgun.secret') ? '***configured***' : 'not configured';
        $this->line("  Mailgun Domain: {$mailgunDomain}");
        $this->line("  Mailgun Secret: {$mailgunSecret}");

        // SMTP configuration
        $smtpHost = Config::get('mail.mailers.smtp.host');
        $smtpPort = Config::get('mail.mailers.smtp.port');
        $smtpUsername = Config::get('mail.mailers.smtp.username');
        $this->line("  SMTP Host: {$smtpHost}");
        $this->line("  SMTP Port: {$smtpPort}");
        $this->line("  SMTP Username: {$smtpUsername}");
    }

    /**
     * Test email delivery
     */
    private function testEmailDelivery(EmailService $emailService): void
    {
        $this->info('🧪 Testing Email Delivery...');
        $this->newLine();

        $testEmail = $this->ask('Enter test email address', 'test@example.com');

        if (! filter_var($testEmail, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email address provided.');

            return;
        }

        $this->info("Sending test email to: {$testEmail}");

        $result = $emailService->sendContactFormEmail(
            recipientEmail: $testEmail,
            contactName: 'Email Service Test',
            contactEmail: 'noreply@'.(Config::get('services.mailgun.domain') ?: 'example.com'),
            contactSubject: 'Email Service Test - '.now()->format('Y-m-d H:i:s'),
            contactMessage: 'This is a test message from the email service status command. If you receive this, the email service is working correctly.',
            metadata: [
                'test_run' => true,
                'command' => 'email:status',
                'timestamp' => now()->toISOString(),
            ]
        );

        if ($result['success']) {
            $icon = $result['fallback_used'] ? '⚠️ ' : '✅';
            $this->info("{$icon} Email sent successfully!");
            $this->line("   Method: {$result['method']}");

            if ($result['fallback_used']) {
                $this->warn('   ⚠️  Fallback method was used - check primary provider');
                $this->line("   Primary error: {$result['error']}");
            }
        } else {
            $this->error('❌ Email delivery failed completely');
            $this->line("   Error: {$result['error']}");

            if (! empty($result['details']['fallback_errors'])) {
                $this->line('   Fallback errors:');
                foreach ($result['details']['fallback_errors'] as $method => $error) {
                    $this->line("     {$method}: {$error}");
                }
            }
        }

        $this->newLine();
    }
}
