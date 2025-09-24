<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;

class SiteConfigService
{
    /**
     * Get site configuration for sharing with frontend.
     */
    public function getConfig(): array
    {
        return [
            'name' => Config::get('site.name'),
            'displayName' => Config::get('site.display_name'),
            'tagline' => Config::get('site.tagline'),
            'description' => Config::get('site.description'),
            'contact' => Config::get('site.contact'),
            'social' => Config::get('site.social'),
            'seo' => Config::get('site.seo'),
            'cachePrefix' => Config::get('site.cache_prefix'),
            'userAgent' => Config::get('site.user_agent'),
            'url' => Config::get('app.url'),
        ];
    }

    /**
     * Get contact email.
     */
    public function getContactEmail(): string
    {
        return Config::get('site.contact.email', 'hello@iwlaravel12.com');
    }

    /**
     * Get support email.
     */
    public function getSupportEmail(): string
    {
        return Config::get('site.contact.support_email', 'support@iwlaravel12.com');
    }

    /**
     * Get Twitter handle.
     */
    public function getTwitterHandle(): string
    {
        return Config::get('site.social.twitter_handle', '@iwlaravel12');
    }

    /**
     * Get site name.
     */
    public function getSiteName(): string
    {
        return Config::get('site.name', 'iwlaravel12');
    }

    /**
     * Get site display name.
     */
    public function getSiteDisplayName(): string
    {
        return Config::get('site.display_name', 'iwlaravel12');
    }

    /**
     * Get cache prefix.
     */
    public function getCachePrefix(): string
    {
        return Config::get('site.cache_prefix', 'iwlaravel12');
    }

    /**
     * Get user agent string.
     */
    public function getUserAgent(): string
    {
        return Config::get('site.user_agent', 'iwlaravel12');
    }
}
