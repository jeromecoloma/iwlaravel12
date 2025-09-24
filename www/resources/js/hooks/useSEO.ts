import { getDefaultSEO, getSiteInfo, SEOMetaData } from '@/types/seo';
import { usePage } from '@inertiajs/react';

interface PageProps {
    url: string;
    [key: string]: unknown;
}

export function useSEO(pageSEO?: Partial<SEOMetaData>): SEOMetaData {
    try {
        const page = usePage<PageProps>();
        const { url } = page?.props || {};

        const defaultSEO = getDefaultSEO();
        const siteInfo = getSiteInfo();

        // Ensure we have default SEO values as fallback
        const baseSEO = {
            ...defaultSEO,
            title: defaultSEO.title || siteInfo.name,
            description: defaultSEO.description || siteInfo.description,
        };

        // Merge default SEO with page-specific SEO, with additional safety checks
        const seo: SEOMetaData = {
            ...baseSEO,
            ...(pageSEO || {}),
        };

        // Ensure required fields are never undefined
        if (!seo.title) {
            seo.title = baseSEO.title;
        }
        if (!seo.description) {
            seo.description = baseSEO.description;
        }

        // Auto-generate canonical URL if not provided
        if (!seo.canonical && url) {
            seo.canonical = `${siteInfo.url}${url}`;
        } else if (!seo.canonical) {
            seo.canonical = siteInfo.url;
        }

        // Auto-populate Open Graph fields from main fields if not provided
        if (!seo.ogTitle && seo.title) {
            seo.ogTitle = seo.title;
        }
        if (!seo.ogDescription && seo.description) {
            seo.ogDescription = seo.description;
        }
        if (!seo.ogUrl) {
            seo.ogUrl = seo.canonical;
        }
        if (!seo.ogImage) {
            seo.ogImage = `${siteInfo.url}${siteInfo.defaultImage}`;
        }

        // Auto-populate Twitter Card fields from Open Graph if not provided
        if (!seo.twitterTitle && seo.ogTitle) {
            seo.twitterTitle = seo.ogTitle;
        }
        if (!seo.twitterDescription && seo.ogDescription) {
            seo.twitterDescription = seo.ogDescription;
        }
        if (!seo.twitterImage) {
            seo.twitterImage = seo.ogImage;
        }

        // Ensure title includes site name if it's not already there
        if (seo.title && !seo.title.includes(siteInfo.name) && seo.title !== siteInfo.name) {
            seo.title = `${seo.title} | ${siteInfo.name}`;
        }

        return seo;
    } catch (error) {
        console.error('Error in useSEO hook:', error);

        // Return a safe fallback SEO object using functions
        const fallbackSEO = getDefaultSEO();
        const fallbackSite = getSiteInfo();

        return {
            ...fallbackSEO,
            canonical: fallbackSite.url,
            ogTitle: fallbackSEO.title,
            ogDescription: fallbackSEO.description,
            ogUrl: fallbackSite.url,
            ogImage: `${fallbackSite.url}${fallbackSite.defaultImage}`,
            twitterTitle: fallbackSEO.title,
            twitterDescription: fallbackSEO.description,
            twitterImage: `${fallbackSite.url}${fallbackSite.defaultImage}`,
        };
    }
}

export function generateStructuredData(type: string, data: Record<string, unknown>) {
    const baseStructuredData = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    };

    return baseStructuredData;
}

export function generateWebsiteStructuredData() {
    const siteInfo = getSiteInfo();

    return generateStructuredData('WebSite', {
        name: siteInfo.name,
        description: siteInfo.description,
        url: siteInfo.url,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${siteInfo.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    });
}

export function generateOrganizationStructuredData() {
    const siteInfo = getSiteInfo();

    return generateStructuredData('Organization', {
        name: siteInfo.name,
        description: siteInfo.description,
        url: siteInfo.url,
        logo: `${siteInfo.url}${siteInfo.logo}`,
        sameAs: [
            // Add social media URLs here
        ],
    });
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
    return generateStructuredData('BreadcrumbList', {
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: breadcrumb.name,
            item: breadcrumb.url,
        })),
    });
}
