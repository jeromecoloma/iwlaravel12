/**
 * Site configuration shared between frontend and backend
 * This configuration is populated from Laravel's config/site.php
 */

export interface SiteConfig {
    name: string;
    displayName: string;
    tagline: string;
    description: string;
    contact: {
        email: string;
        supportEmail: string;
    };
    social: {
        twitterHandle: string;
        githubUrl: string;
    };
    seo: {
        title: string;
        titleSeparator: string;
        description: string;
        keywords: string;
        ogImage: string;
        ogSiteName: string;
    };
    cachePrefix: string;
    userAgent: string;
    url: string;
}

// This will be populated by Laravel via Inertia shared props
// Default values match config/site.php defaults
export const DEFAULT_SITE_CONFIG: SiteConfig = {
    name: 'iwlaravel12',
    displayName: 'iwlaravel12',
    tagline: 'Laravel 12 Starter Template',
    description: 'A modern Laravel 12 starter template with React, Inertia.js, and shadcn/ui',
    contact: {
        email: 'hello@iwlaravel12.com',
        supportEmail: 'support@iwlaravel12.com',
    },
    social: {
        twitterHandle: '@iwlaravel12',
        githubUrl: 'https://github.com/iwlaravel12',
    },
    seo: {
        title: 'iwlaravel12',
        titleSeparator: ' | ',
        description: 'Modern Laravel 12 starter template with React, Inertia.js, and shadcn/ui',
        keywords: 'Laravel, React, Inertia.js, shadcn/ui, TypeScript, Tailwind CSS',
        ogImage: '/images/og-image.jpg',
        ogSiteName: 'iwlaravel12',
    },
    cachePrefix: 'iwlaravel12',
    userAgent: 'iwlaravel12',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://iwlaravel12.com',
};

// Global site config cache
let cachedSiteConfig: SiteConfig | null = null;

// Function to get site config (will use shared props from Inertia if available)
export function getSiteConfig(): SiteConfig {
    // Return cached config if available
    if (cachedSiteConfig) {
        return cachedSiteConfig;
    }

    // Try to get config from Inertia shared props
    if (typeof window !== 'undefined' && window.Laravel?.page?.props?.site) {
        cachedSiteConfig = window.Laravel.page.props.site;
        return cachedSiteConfig;
    }

    // Fallback to default config
    return DEFAULT_SITE_CONFIG;
}

// Function to set site config (called by components that have access to Inertia page)
export function setSiteConfig(config: SiteConfig): void {
    cachedSiteConfig = config;
}

// Type declaration for window.Laravel
declare global {
    interface Window {
        Laravel?: {
            page?: {
                props?: {
                    site?: SiteConfig;
                };
            };
        };
    }
}
