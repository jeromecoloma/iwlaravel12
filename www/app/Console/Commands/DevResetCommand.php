<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class DevResetCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev:reset {--force : Force reset without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset database and reseed with development data';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (app()->environment('production') && ! $this->option('force')) {
            $this->error('❌ Cannot reset database in production environment without --force flag');

            return Command::FAILURE;
        }

        if (! $this->option('force') && ! $this->confirm('This will completely reset your database and all data will be lost. Continue?')) {
            $this->info('✋ Database reset cancelled');

            return Command::SUCCESS;
        }

        $this->warn('🔄 Resetting database and reseeding...');
        $this->newLine();

        try {
            // Step 1: Drop all tables and re-run migrations
            $this->info('🗄️ Resetting database schema...');
            Artisan::call('migrate:fresh', ['--force' => true]);
            $this->info('✅ Database schema reset');

            // Show migration output
            $output = Artisan::output();
            if (! empty(trim($output))) {
                $this->comment('Migration output:');
                $this->line($output);
            }

            // Step 2: Run seeders if they exist
            $this->info('🌱 Seeding database with fresh development data...');
            if (file_exists(database_path('seeders/DatabaseSeeder.php'))) {
                Artisan::call('db:seed', ['--force' => true]);
                $this->info('✅ Database seeded successfully');

                // Show seeder output
                $seederOutput = Artisan::output();
                if (! empty(trim($seederOutput))) {
                    $this->comment('Seeder output:');
                    $this->line($seederOutput);
                }
            } else {
                $this->comment('💡 No seeders found to run');
            }

            // Step 3: Clear application caches
            $this->info('🧹 Clearing application caches...');
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            $this->info('✅ Application caches cleared');

            $this->newLine();
            $this->info('✨ Database reset completed successfully!');
            $this->comment('💡 Your application is now in a fresh state with clean development data');

            return Command::SUCCESS;

        } catch (Exception $e) {
            $this->error('❌ Database reset failed: '.$e->getMessage());

            return Command::FAILURE;
        }
    }
}
