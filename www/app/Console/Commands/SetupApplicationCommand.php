<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SetupApplicationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:setup {--environment=local : Environment to setup for (local|production)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize application configuration for development or production';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $environment = $this->option('environment');

        $this->info('🚀 Setting up iwlaravel12 application...');
        $this->newLine();

        // Validate environment
        if (! in_array($environment, ['local', 'production'])) {
            $this->error('❌ Invalid environment. Use --environment=local or --environment=production');

            return Command::FAILURE;
        }

        try {
            // Step 1: Check .env file
            if (! File::exists('.env')) {
                $this->warn('⚠️ No .env file found. Copying from .env.example...');
                File::copy('.env.example', '.env');
                $this->info('✅ .env file created');
            } else {
                $this->info('✅ .env file exists');
            }

            // Step 2: Generate application key if not set
            if (empty(config('app.key'))) {
                $this->info('🔑 Generating application key...');
                Artisan::call('key:generate');
                $this->info('✅ Application key generated');
            } else {
                $this->info('✅ Application key exists');
            }

            // Step 3: Database setup
            $this->info('🗄️ Setting up database...');
            if ($environment === 'local') {
                // Create SQLite database if it doesn't exist
                if (! File::exists('database/database.sqlite')) {
                    File::put('database/database.sqlite', '');
                    $this->info('✅ SQLite database file created');
                }

                // Run migrations
                $this->info('📋 Running database migrations...');
                Artisan::call('migrate', ['--force' => true]);
                $this->info('✅ Database migrations completed');
            } else {
                $this->comment('💡 Production: Please ensure your database is configured and run migrations manually');
            }

            // Step 4: Storage link
            $this->info('🔗 Creating storage link...');
            if (! File::exists('public/storage')) {
                Artisan::call('storage:link');
                $this->info('✅ Storage link created');
            } else {
                $this->info('✅ Storage link already exists');
            }

            // Step 5: Clear and cache config
            $this->info('⚡ Optimizing application...');
            Artisan::call('config:cache');
            Artisan::call('route:cache');
            if ($environment === 'production') {
                Artisan::call('view:cache');
            }
            $this->info('✅ Application optimized');

            // Step 6: Environment-specific setup
            if ($environment === 'local') {
                $this->info('🛠️ Development environment setup...');
                $this->comment('💡 Remember to configure your .env file with:');
                $this->comment('   - Database credentials (if not using SQLite)');
                $this->comment('   - Mailgun settings for email functionality');
                $this->comment('   - Any other required environment variables');
                $this->newLine();
                $this->comment('💡 Run `composer run dev` to start the development server');
            } else {
                $this->info('🏭 Production environment setup...');
                $this->comment('💡 Additional production steps:');
                $this->comment('   - Configure your web server');
                $this->comment('   - Set up SSL certificates');
                $this->comment('   - Configure your database');
                $this->comment('   - Set up queue workers');
                $this->comment('   - Configure monitoring and logging');
            }

            $this->newLine();
            $this->info('✨ Application setup completed successfully!');

            return Command::SUCCESS;

        } catch (Exception $e) {
            $this->error('❌ Setup failed: '.$e->getMessage());

            return Command::FAILURE;
        }
    }
}
