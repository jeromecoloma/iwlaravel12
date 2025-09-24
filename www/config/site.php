<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Site Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration file centralizes all site-specific settings including
    | branding, contact information, social links, and SEO defaults. This
    | makes it easy to maintain and update your site's identity.
    |
    */

    'name' => env('SITE_NAME', 'iwlaravel12'),
    'display_name' => env('SITE_DISPLAY_NAME', 'iwlaravel12'),
    'tagline' => env('SITE_TAGLINE', 'Laravel 12 Starter Template'),
    'description' => env('SITE_DESCRIPTION', 'A modern Laravel 12 starter template with React, Inertia.js, and shadcn/ui'),

    /*
    |--------------------------------------------------------------------------
    | Contact Information
    |--------------------------------------------------------------------------
    */

    'contact' => [
        'email' => env('SITE_CONTACT_EMAIL', 'hello@iwlaravel12.com'),
        'support_email' => env('SITE_SUPPORT_EMAIL', 'support@iwlaravel12.com'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Social Media
    |--------------------------------------------------------------------------
    */

    'social' => [
        'twitter_handle' => env('SITE_TWITTER_HANDLE', '@iwlaravel12'),
        'github_url' => env('SITE_GITHUB_URL', 'https://github.com/iwlaravel12'),
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO Defaults
    |--------------------------------------------------------------------------
    */

    'seo' => [
        'title' => env('SITE_SEO_TITLE', 'iwlaravel12'),
        'title_separator' => env('SITE_SEO_TITLE_SEPARATOR', ' | '),
        'description' => env('SITE_SEO_DESCRIPTION', 'Modern Laravel 12 starter template with React, Inertia.js, and shadcn/ui'),
        'keywords' => env('SITE_SEO_KEYWORDS', 'Laravel, React, Inertia.js, shadcn/ui, TypeScript, Tailwind CSS'),
        'og_image' => env('SITE_OG_IMAGE', '/images/og-image.jpg'),
        'og_site_name' => env('SITE_OG_SITE_NAME', 'iwlaravel12'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Technical Settings
    |--------------------------------------------------------------------------
    */

    'cache_prefix' => env('SITE_CACHE_PREFIX', 'iwlaravel12'),
    'user_agent' => env('SITE_USER_AGENT', 'iwlaravel12'),

];
