export interface SEOMetaData {
    title: string;
    description: string;
    keywords?: string[];
    author?: string;
    canonical?: string;
    robots?: string;

    // Open Graph
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogImageAlt?: string;
    ogUrl?: string;
    ogType?: 'website' | 'article' | 'product' | 'profile';
    ogSiteName?: string;
    ogLocale?: string;

    // Twitter Cards
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterImageAlt?: string;
    twitterSite?: string;
    twitterCreator?: string;

    // Article specific (for blog posts, news)
    articleAuthor?: string;
    articlePublishedTime?: string;
    articleModifiedTime?: string;
    articleSection?: string;
    articleTags?: string[];

    // Schema.org structured data
    structuredData?: Record<string, unknown>;
}

export interface PageSEOConfig {
    meta: SEOMetaData;
    priority?: number; // For sitemap generation
    changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

import { getSiteConfig } from '@/config/site';

// Function to get default SEO configuration
export function getDefaultSEO(): SEOMetaData {
    const site = getSiteConfig();

    return {
        title: site.seo.title,
        description: site.seo.description,
        keywords: site.seo.keywords.split(', '),
        author: `${site.displayName} Team`,
        robots: 'index, follow',
        ogType: 'website',
        ogSiteName: site.seo.ogSiteName,
        ogLocale: 'en_US',
        twitterCard: 'summary_large_image',
        twitterSite: site.social.twitterHandle,
    };
}

// Function to get site configuration
export function getSiteInfo() {
    const site = getSiteConfig();

    return {
        name: site.name,
        displayName: site.displayName,
        url: site.url,
        description: site.description,
        logo: '/images/logo.png',
        defaultImage: site.seo.ogImage,
        twitterHandle: site.social.twitterHandle,
        language: 'en',
        locale: 'en_US',
        charset: 'UTF-8',
    };
}
