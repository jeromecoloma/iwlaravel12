import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOMetaData } from '@/types/seo';
import React from 'react';
import SEOPreview from './SEOPreview';

interface SEODevToolsProps {
    seo: SEOMetaData;
    structuredData?: Record<string, unknown>[];
}

export default function SEODevTools({ seo, structuredData = [] }: SEODevToolsProps) {
    const [showDevTools, setShowDevTools] = React.useState(false);

    if (!showDevTools) {
        return (
            <div className="fixed right-4 bottom-4 z-50">
                <Button onClick={() => setShowDevTools(true)} variant="secondary" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                    SEO Debug
                </Button>
            </div>
        );
    }

    const metaTags = Object.entries(seo)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => ({ key, value }));

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 overflow-auto bg-black">
            <div className="min-h-screen p-4">
                <div className="mx-auto max-w-6xl rounded-lg bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-200 p-6">
                        <h2 className="text-2xl font-bold">SEO Development Tools</h2>
                        <Button onClick={() => setShowDevTools(false)} variant="outline" size="sm">
                            Close
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
                        {/* SEO Preview */}
                        <div>
                            <h3 className="mb-4 text-xl font-semibold">Social Media Previews</h3>
                            <SEOPreview seo={seo} />
                        </div>

                        {/* Meta Tags */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Meta Tags</CardTitle>
                                    <CardDescription>All SEO meta tags for this page</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="max-h-96 space-y-2 overflow-auto">
                                        {metaTags.map(({ key, value }) => (
                                            <div key={key} className="text-sm">
                                                <code className="block rounded bg-gray-100 px-2 py-1 text-xs">
                                                    <span className="text-blue-600">{key}:</span>{' '}
                                                    <span className="text-gray-800">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                                                </code>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Structured Data */}
                            {structuredData.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Structured Data</CardTitle>
                                        <CardDescription>JSON-LD structured data for search engines</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="max-h-96 space-y-4 overflow-auto">
                                            {structuredData.map((data, index) => (
                                                <div key={index}>
                                                    <h4 className="mb-2 text-sm font-medium">{String(data['@type'])} Schema</h4>
                                                    <pre className="overflow-auto rounded bg-gray-100 p-3 text-xs">
                                                        {JSON.stringify(data, null, 2)}
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* SEO Testing Tools */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Testing Tools</CardTitle>
                                    <CardDescription>External tools to test your SEO</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <a
                                            href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(seo.canonical || window.location.href)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full"
                                        >
                                            <Button variant="outline" size="sm" className="w-full justify-start">
                                                Facebook Sharing Debugger
                                            </Button>
                                        </a>
                                        <a
                                            href={`https://cards-dev.twitter.com/validator`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full"
                                        >
                                            <Button variant="outline" size="sm" className="w-full justify-start">
                                                Twitter Card Validator
                                            </Button>
                                        </a>
                                        <a
                                            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(seo.canonical || window.location.href)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full"
                                        >
                                            <Button variant="outline" size="sm" className="w-full justify-start">
                                                Google Rich Results Test
                                            </Button>
                                        </a>
                                        <a href={`https://validator.schema.org/`} target="_blank" rel="noopener noreferrer" className="block w-full">
                                            <Button variant="outline" size="sm" className="w-full justify-start">
                                                Schema.org Validator
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
