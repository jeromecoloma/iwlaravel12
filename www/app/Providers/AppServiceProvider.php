<?php

namespace App\Providers;

use App\Services\SiteConfigService;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(SiteConfigService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'site' => fn () => app(SiteConfigService::class)->getConfig(),
        ]);
    }
}
