<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SEOController extends Controller
{
    /**
     * Generate and serve the sitemap.xml file
     */
    public function sitemap(): Response
    {
        $urls = [
            [
                'loc' => url('/'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
            [
                'loc' => url('/about'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ],
            [
                'loc' => url('/contact'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ],
        ];

        $sitemap = $this->generateSitemapXML($urls);

        return response($sitemap, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Generate and serve the robots.txt file
     */
    public function robots(): Response
    {
        $robotsTxt = "User-agent: *\nAllow: /\n\n";
        $robotsTxt .= 'Sitemap: '.url('/sitemap.xml')."\n\n";
        $robotsTxt .= "# Disallow crawling of admin areas\n";
        $robotsTxt .= "Disallow: /admin/\n";
        $robotsTxt .= "Disallow: /api/\n\n";
        $robotsTxt .= "# Allow crawling of public assets\n";
        $robotsTxt .= "Allow: /images/\n";
        $robotsTxt .= "Allow: /css/\n";
        $robotsTxt .= "Allow: /js/\n";

        return response($robotsTxt, 200)
            ->header('Content-Type', 'text/plain');
    }

    /**
     * Generate sitemap XML from URLs array
     */
    private function generateSitemapXML(array $urls): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$url['loc']}</loc>\n";
            if (isset($url['lastmod'])) {
                $xml .= "    <lastmod>{$url['lastmod']}</lastmod>\n";
            }
            if (isset($url['changefreq'])) {
                $xml .= "    <changefreq>{$url['changefreq']}</changefreq>\n";
            }
            if (isset($url['priority'])) {
                $xml .= "    <priority>{$url['priority']}</priority>\n";
            }
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
