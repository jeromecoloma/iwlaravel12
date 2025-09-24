<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class DevSeedCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev:seed {--force : Force seeding without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed database with development data';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (app()->environment('production') && ! $this->option('force')) {
            $this->error('❌ Cannot seed in production environment without --force flag');

            return Command::FAILURE;
        }

        if (! $this->option('force') && ! $this->confirm('This will seed the database with development data. Continue?')) {
            $this->info('✋ Seeding cancelled');

            return Command::SUCCESS;
        }

        $this->info('🌱 Seeding database with development data...');
        $this->newLine();

        try {
            // Run the database seeders
            $this->info('📋 Running database seeders...');

            // Check if we have any seeders to run
            if (file_exists(database_path('seeders/DatabaseSeeder.php'))) {
                Artisan::call('db:seed', ['--force' => true]);
                $this->info('✅ Database seeded successfully');

                // Show seeder output if any
                $output = Artisan::output();
                if (! empty(trim($output))) {
                    $this->comment('Seeder output:');
                    $this->line($output);
                }
            } else {
                $this->comment('💡 No seeders found. Create seeders using:');
                $this->comment('   php artisan make:seeder YourSeederName');
                $this->newLine();
                $this->comment('💡 Then add them to DatabaseSeeder.php');
            }

            $this->newLine();
            $this->info('✨ Development seeding completed!');

            return Command::SUCCESS;

        } catch (Exception $e) {
            $this->error('❌ Seeding failed: '.$e->getMessage());

            return Command::FAILURE;
        }
    }
}
