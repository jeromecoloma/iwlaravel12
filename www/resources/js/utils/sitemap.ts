import { getSiteInfo } from '@/types/seo';

export interface SitemapURL {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}

export function generateSitemapURLs(): SitemapURL[] {
    const now = new Date().toISOString().split('T')[0];
    const siteInfo = getSiteInfo();

    return [
        {
            loc: `${siteInfo.url}/`,
            lastmod: now,
            changefreq: 'weekly',
            priority: 1.0,
        },
        {
            loc: `${siteInfo.url}/about`,
            lastmod: now,
            changefreq: 'monthly',
            priority: 0.8,
        },
        {
            loc: `${siteInfo.url}/contact`,
            lastmod: now,
            changefreq: 'monthly',
            priority: 0.7,
        },
    ];
}

export function generateSitemapXML(urls: SitemapURL[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`,
    )
    .join('\n')}
</urlset>`;
}

export function generateRobotsTxt(): string {
    const siteInfo = getSiteInfo();

    return `User-agent: *
Allow: /

Sitemap: ${siteInfo.url}/sitemap.xml

# Disallow crawling of admin areas (if any)
Disallow: /admin/
Disallow: /api/

# Allow crawling of public assets
Allow: /images/
Allow: /css/
Allow: /js/`;
}
