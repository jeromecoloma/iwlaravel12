<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class CacheService
{
    /**
     * Cache key prefix for the application.
     */
    private function getCachePrefix(): string
    {
        return Config::get('site.cache_prefix', 'iwlaravel12');
    }

    /**
     * Cache durations in seconds.
     */
    private const CACHE_DURATIONS = [
        'page_content' => 3600,       // 1 hour
        'static_content' => 86400,    // 24 hours
        'seo_data' => 3600,           // 1 hour
        'navigation' => 7200,         // 2 hours
        'configuration' => 43200,     // 12 hours
    ];

    /**
     * Get cached page content or generate and cache it.
     */
    public function getPageContent(string $page, Closure $generator): mixed
    {
        $key = $this->getCacheKey('page_content', $page);

        return Cache::remember(
            $key,
            self::CACHE_DURATIONS['page_content'],
            $generator
        );
    }

    /**
     * Get cached static content like navigation, footer data, etc.
     */
    public function getStaticContent(string $contentType, Closure $generator): mixed
    {
        $key = $this->getCacheKey('static_content', $contentType);

        return Cache::remember(
            $key,
            self::CACHE_DURATIONS['static_content'],
            $generator
        );
    }

    /**
     * Get cached SEO data for a page.
     */
    public function getSEOData(string $page, Closure $generator): mixed
    {
        $key = $this->getCacheKey('seo_data', $page);

        return Cache::remember(
            $key,
            self::CACHE_DURATIONS['seo_data'],
            $generator
        );
    }

    /**
     * Get cached navigation data.
     */
    public function getNavigationData(Closure $generator): mixed
    {
        $key = $this->getCacheKey('navigation', 'main');

        return Cache::remember(
            $key,
            self::CACHE_DURATIONS['navigation'],
            $generator
        );
    }

    /**
     * Get cached configuration data.
     */
    public function getConfigData(string $configKey, Closure $generator): mixed
    {
        $key = $this->getCacheKey('configuration', $configKey);

        return Cache::remember(
            $key,
            self::CACHE_DURATIONS['configuration'],
            $generator
        );
    }

    /**
     * Cache response with ETags for conditional requests.
     */
    public function cacheResponseWithETag(Request $request, string $content, int $duration = 3600): array
    {
        $etag = md5($content);
        $lastModified = now();

        // Check if client has current version
        if ($request->header('If-None-Match') === $etag) {
            return [
                'status' => 304,
                'headers' => [
                    'ETag' => $etag,
                    'Last-Modified' => $lastModified->toRfc7231String(),
                ],
                'content' => null,
            ];
        }

        return [
            'status' => 200,
            'headers' => [
                'ETag' => $etag,
                'Last-Modified' => $lastModified->toRfc7231String(),
                'Cache-Control' => "public, max-age={$duration}",
            ],
            'content' => $content,
        ];
    }

    /**
     * Clear specific cache patterns.
     */
    public function clearCache(?string $pattern = null): void
    {
        if ($pattern) {
            $this->clearCachePattern($pattern);
        } else {
            $this->clearAllAppCache();
        }
    }

    /**
     * Clear cache for a specific pattern.
     */
    private function clearCachePattern(string $pattern): void
    {
        $key = $this->getCacheKey($pattern, '*');
        Cache::forget($key);

        // Also clear specific patterns
        $patterns = [
            'page_content' => ['home', 'about', 'contact', 'documentation'],
            'static_content' => ['navigation', 'footer', 'meta'],
            'seo_data' => ['home', 'about', 'contact', 'documentation'],
        ];

        if (isset($patterns[$pattern])) {
            foreach ($patterns[$pattern] as $item) {
                Cache::forget($this->getCacheKey($pattern, $item));
            }
        }
    }

    /**
     * Clear all application-specific cache.
     */
    private function clearAllAppCache(): void
    {
        $patterns = array_keys(self::CACHE_DURATIONS);

        foreach ($patterns as $pattern) {
            $this->clearCachePattern($pattern);
        }
    }

    /**
     * Generate cache key with prefix.
     */
    private function getCacheKey(string $type, string $identifier): string
    {
        return $this->getCachePrefix().":{$type}:{$identifier}";
    }

    /**
     * Warm up critical caches.
     */
    public function warmUpCache(): void
    {
        // Warm up navigation data
        $this->getNavigationData(function () {
            return $this->generateNavigationData();
        });

        // Warm up SEO data for main pages
        $pages = ['home', 'about', 'contact', 'documentation'];
        foreach ($pages as $page) {
            $this->getSEOData($page, function () use ($page) {
                return $this->generateSEOData($page);
            });
        }

        // Warm up static content
        $this->getStaticContent('meta', function () {
            return $this->generateMetaData();
        });
    }

    /**
     * Generate navigation data.
     */
    private function generateNavigationData(): array
    {
        return [
            'main_menu' => [
                ['name' => 'Home', 'url' => '/', 'active' => false],
                ['name' => 'About', 'url' => '/about', 'active' => false],
                ['name' => 'Contact', 'url' => '/contact', 'active' => false],
                ['name' => 'Documentation', 'url' => '/documentation', 'active' => false],
            ],
            'footer_links' => [
                'company' => [
                    ['name' => 'About Us', 'url' => '/about'],
                    ['name' => 'Contact', 'url' => '/contact'],
                ],
                'resources' => [
                    ['name' => 'Documentation', 'url' => '/documentation'],
                    ['name' => 'GitHub', 'url' => 'https://github.com'],
                ],
            ],
        ];
    }

    /**
     * Generate SEO data for a page.
     */
    private function generateSEOData(string $page): array
    {
        $seoData = [
            'home' => [
                'title' => 'Laravel 12 + React + Inertia Starter Template',
                'description' => 'Complete Laravel 12 starter template with React, Inertia.js, and shadcn/ui components.',
                'keywords' => 'Laravel 12, React, Inertia.js, shadcn/ui, starter template',
            ],
            'about' => [
                'title' => 'About - Laravel Starter Template',
                'description' => 'Learn about our Laravel 12 + React + Inertia starter template and development approach.',
                'keywords' => 'Laravel, React, Inertia, about, team, development',
            ],
            'contact' => [
                'title' => 'Contact Us - Laravel Starter Template',
                'description' => 'Get in touch with us about the Laravel 12 + React + Inertia starter template.',
                'keywords' => 'contact, Laravel, React, Inertia, support',
            ],
            'documentation' => [
                'title' => 'Documentation - Component Reference',
                'description' => 'Complete component documentation for the Laravel 12 + React + Inertia starter template.',
                'keywords' => 'documentation, components, Laravel, React, reference',
            ],
        ];

        return $seoData[$page] ?? [
            'title' => 'Laravel Starter Template',
            'description' => 'Laravel 12 + React + Inertia starter template',
            'keywords' => 'Laravel, React, Inertia',
        ];
    }

    /**
     * Generate meta data.
     */
    private function generateMetaData(): array
    {
        return [
            'app_name' => Config::get('app.name'),
            'app_url' => Config::get('app.url'),
            'app_version' => '1.0.0',
            'last_updated' => now()->toIso8601String(),
        ];
    }
}
