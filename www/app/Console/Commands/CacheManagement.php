<?php

namespace App\Console\Commands;

use App\Services\CacheService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class CacheManagement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:manage
                            {action : The action to perform (clear, warm, status)}
                            {--pattern= : Cache pattern to target (optional)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage application cache with performance optimizations';

    /**
     * Execute the console command.
     */
    public function handle(CacheService $cacheService): int
    {
        $action = $this->argument('action');
        $pattern = $this->option('pattern');

        switch ($action) {
            case 'clear':
                return $this->clearCache($cacheService, $pattern);

            case 'warm':
                return $this->warmCache($cacheService);

            case 'status':
                return $this->showCacheStatus();

            default:
                $this->error("Unknown action: {$action}");
                $this->info('Available actions: clear, warm, status');

                return 1;
        }
    }

    /**
     * Clear application cache.
     */
    private function clearCache(CacheService $cacheService, ?string $pattern): int
    {
        $this->info('Clearing application cache...');

        if ($pattern) {
            $this->info("Clearing cache pattern: {$pattern}");
            $cacheService->clearCache($pattern);
        } else {
            $this->info('Clearing all application cache...');
            $cacheService->clearCache();
        }

        $this->info('✓ Cache cleared successfully');

        return 0;
    }

    /**
     * Warm up application cache.
     */
    private function warmCache(CacheService $cacheService): int
    {
        $this->info('Warming up application cache...');

        $progressBar = $this->output->createProgressBar(4);
        $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %message%');

        $progressBar->setMessage('Warming navigation data...');
        $progressBar->advance();

        $progressBar->setMessage('Warming SEO data...');
        $progressBar->advance();

        $progressBar->setMessage('Warming static content...');
        $progressBar->advance();

        $cacheService->warmUpCache();

        $progressBar->setMessage('Cache warm-up completed');
        $progressBar->finish();

        $this->newLine();
        $this->info('✓ Cache warmed up successfully');

        return 0;
    }

    /**
     * Show cache status and statistics.
     */
    private function showCacheStatus(): int
    {
        $this->info('Application Cache Status');
        $this->line('========================');

        // Check cache store
        $defaultStore = config('cache.default');
        $this->info("Default Cache Store: {$defaultStore}");

        // Check if cache is working
        $testKey = 'cache_test_'.time();
        $testValue = 'test_value';

        Cache::put($testKey, $testValue, 60);
        $retrievedValue = Cache::get($testKey);
        Cache::forget($testKey);

        if ($retrievedValue === $testValue) {
            $this->info('✓ Cache is working correctly');
        } else {
            $this->error('✗ Cache is not working correctly');

            return 1;
        }

        // Show cache configuration
        $this->newLine();
        $this->info('Cache Configuration:');
        $this->table(
            ['Setting', 'Value'],
            [
                ['Default Store', config('cache.default')],
                ['Redis Host', config('cache.stores.redis.host') ?? 'N/A'],
                ['File Cache Path', config('cache.stores.file.path') ?? 'N/A'],
                ['Cache Prefix', config('cache.prefix') ?? 'No prefix'],
            ]
        );

        // Show application-specific cache keys
        $this->newLine();
        $this->info('Application Cache Patterns:');
        $this->table(
            ['Pattern', 'Description', 'Duration'],
            [
                ['page_content', 'Cached page content', '1 hour'],
                ['static_content', 'Static content like navigation', '24 hours'],
                ['seo_data', 'SEO meta data', '1 hour'],
                ['navigation', 'Navigation menu data', '2 hours'],
                ['configuration', 'Configuration data', '12 hours'],
            ]
        );

        return 0;
    }
}
