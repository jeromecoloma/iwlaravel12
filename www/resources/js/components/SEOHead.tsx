import { SEOMetaData, getDefaultSEO } from '@/types/seo';
import { Head } from '@inertiajs/react';

interface SEOHeadProps {
    seo: SEOMetaData;
    structuredData?: Record<string, unknown>[];
}

export default function SEOHead({ seo, structuredData = [] }: SEOHeadProps) {
    // Defensive check to prevent crashes when seo is undefined/null
    const defaultSeo = getDefaultSEO();
    const safeSeo = seo || defaultSeo;

    return (
        <Head title={safeSeo.title}>
            {/* Basic Meta Tags */}
            <meta name="description" content={safeSeo.description} />
            {safeSeo.keywords && safeSeo.keywords.length > 0 && <meta name="keywords" content={safeSeo.keywords.join(', ')} />}
            {safeSeo.author && <meta name="author" content={safeSeo.author} />}
            {safeSeo.robots && <meta name="robots" content={safeSeo.robots} />}
            {safeSeo.canonical && <link rel="canonical" href={safeSeo.canonical} />}

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={safeSeo.ogTitle || safeSeo.title} />
            <meta property="og:description" content={safeSeo.ogDescription || safeSeo.description} />
            <meta property="og:type" content={safeSeo.ogType || 'website'} />
            {safeSeo.ogUrl && <meta property="og:url" content={safeSeo.ogUrl} />}
            {safeSeo.ogImage && <meta property="og:image" content={safeSeo.ogImage} />}
            {safeSeo.ogImageAlt && <meta property="og:image:alt" content={safeSeo.ogImageAlt} />}
            {safeSeo.ogSiteName && <meta property="og:site_name" content={safeSeo.ogSiteName} />}
            {safeSeo.ogLocale && <meta property="og:locale" content={safeSeo.ogLocale} />}

            {/* Article specific Open Graph tags */}
            {safeSeo.articleAuthor && <meta property="article:author" content={safeSeo.articleAuthor} />}
            {safeSeo.articlePublishedTime && <meta property="article:published_time" content={safeSeo.articlePublishedTime} />}
            {safeSeo.articleModifiedTime && <meta property="article:modified_time" content={safeSeo.articleModifiedTime} />}
            {safeSeo.articleSection && <meta property="article:section" content={safeSeo.articleSection} />}
            {safeSeo.articleTags && safeSeo.articleTags.map((tag, index) => <meta key={index} property="article:tag" content={tag} />)}

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content={safeSeo.twitterCard || 'summary_large_image'} />
            <meta name="twitter:title" content={safeSeo.twitterTitle || safeSeo.title} />
            <meta name="twitter:description" content={safeSeo.twitterDescription || safeSeo.description} />
            {safeSeo.twitterImage && <meta name="twitter:image" content={safeSeo.twitterImage} />}
            {safeSeo.twitterImageAlt && <meta name="twitter:image:alt" content={safeSeo.twitterImageAlt} />}
            {safeSeo.twitterSite && <meta name="twitter:site" content={safeSeo.twitterSite} />}
            {safeSeo.twitterCreator && <meta name="twitter:creator" content={safeSeo.twitterCreator} />}

            {/* Additional SEO tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="format-detection" content="telephone=no" />
            <meta httpEquiv="x-ua-compatible" content="ie=edge" />

            {/* Favicon and touch icons */}
            <link rel="icon" type="image/x-icon" href="/images/touch/favicon.ico" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/touch/favicon-32x32.png" />
            <link rel="icon" type="image/svg+xml" href="/logo.svg" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/touch/apple-touch-icon.png" />
            <link rel="manifest" href="/images/touch/site.webmanifest" />

            {/* Theme color for mobile browsers */}
            <meta name="theme-color" content="#ffffff" />
            <meta name="msapplication-TileColor" content="#da532c" />

            {/* Structured Data */}
            {structuredData.map((data, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(data, null, 2),
                    }}
                />
            ))}

            {/* Custom structured data */}
            {safeSeo.structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(safeSeo.structuredData, null, 2),
                    }}
                />
            )}
        </Head>
    );
}
