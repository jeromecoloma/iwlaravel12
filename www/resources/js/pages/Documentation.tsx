import { ComponentBrowser, ComponentQuickReference } from '@/components/Documentation/ComponentBrowser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface DocumentationProps {
    /** Initial component to display */
    component?: string;
    /** View mode: 'browser' or 'reference' */
    view?: 'browser' | 'reference';
}

/**
 * Documentation Page - Interactive component documentation
 *
 * Provides comprehensive documentation for all components in the iwlaravel12 template.
 * Features live examples, property documentation, and usage guidelines.
 */
export default function Documentation({ component = 'Button', view = 'browser' }: DocumentationProps) {
    const [currentView, setCurrentView] = React.useState<'browser' | 'reference'>(view);

    const seoData = {
        title: 'Component Documentation',
        description: 'Comprehensive documentation for all UI components in the iwlaravel12 Laravel + React + Inertia template',
        keywords: ['components', 'documentation', 'ui', 'react', 'laravel', 'inertia', 'shadcn'],
    };

    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Component Documentation - iwlaravel12',
            description: 'Interactive documentation for React components built with shadcn/ui and Tailwind CSS',
            author: {
                '@type': 'Organization',
                name: 'iwlaravel12 Template',
            },
            datePublished: new Date().toISOString(),
            inLanguage: 'en',
            about: {
                '@type': 'SoftwareApplication',
                name: 'iwlaravel12 Component Library',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Web Browser',
            },
        },
    ];

    return (
        <>
            <Head title="Documentation" />

            <MainLayout seo={seoData} structuredData={structuredData}>
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8 space-y-6">
                        <div className="space-y-4 text-center">
                            <h1 className="text-4xl font-bold">Component Documentation</h1>
                            <p className="mx-auto max-w-3xl text-xl text-gray-600">
                                Comprehensive documentation for all UI components in the iwlaravel12 template. Built with React, shadcn/ui, and
                                Tailwind CSS.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <Card className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">5</div>
                                <div className="text-sm text-gray-600">Total Components</div>
                            </Card>
                            <Card className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">2</div>
                                <div className="text-sm text-gray-600">Core UI</div>
                            </Card>
                            <Card className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">1</div>
                                <div className="text-sm text-gray-600">Forms</div>
                            </Card>
                            <Card className="p-4 text-center">
                                <div className="text-2xl font-bold text-orange-600">2</div>
                                <div className="text-sm text-gray-600">Media & Feedback</div>
                            </Card>
                        </div>

                        {/* View Toggle */}
                        <div className="flex justify-center">
                            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                                <Button variant={currentView === 'browser' ? 'default' : 'ghost'} size="sm" onClick={() => setCurrentView('browser')}>
                                    Interactive Browser
                                </Button>
                                <Button
                                    variant={currentView === 'reference' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setCurrentView('reference')}
                                >
                                    Quick Reference
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Documentation Content */}
                    <div className="space-y-8">
                        {currentView === 'browser' ? (
                            <ComponentBrowser initialComponent={component} showSidebar={true} className="min-h-screen" />
                        ) : (
                            <ComponentQuickReference />
                        )}
                    </div>

                    {/* Footer Information */}
                    <div className="mt-16 border-t border-gray-200 pt-8">
                        <div className="space-y-4 text-center">
                            <h2 className="text-2xl font-bold">About This Documentation</h2>
                            <div className="mx-auto max-w-3xl space-y-4 text-gray-600">
                                <p>
                                    This documentation is generated from the component source code and provides comprehensive information about props,
                                    usage examples, and best practices.
                                </p>
                                <p>
                                    All components are built using <strong>shadcn/ui</strong> as the foundation, customized for the iwlaravel12
                                    template, and integrated with <strong>Tailwind CSS</strong> for styling.
                                </p>
                            </div>

                            <div className="flex justify-center space-x-4 pt-4">
                                <Card className="p-4">
                                    <div className="space-y-1 text-sm">
                                        <div className="font-semibold">Tech Stack</div>
                                        <div className="text-gray-600">React 19 • TypeScript • shadcn/ui • Tailwind CSS v4</div>
                                    </div>
                                </Card>
                                <Card className="p-4">
                                    <div className="space-y-1 text-sm">
                                        <div className="font-semibold">Component Categories</div>
                                        <div className="text-gray-600">UI • Loading States • Advanced Features • SEO</div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
