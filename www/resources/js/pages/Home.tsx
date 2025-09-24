import MainLayout from '@/Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, ResponsiveImage } from '@/components/ui/responsive-image';
import { generateStructuredData } from '@/hooks/useSEO';
import { Link } from '@inertiajs/react';

export default function Home() {
    const features = [
        {
            title: 'Laravel 12',
            description: 'Built on the latest Laravel framework with modern PHP features and streamlined architecture.',
            icon: (
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V6a3 3 0 013-3h13.5a3 3 0 013 3v5.25a3 3 0 01-3 3m-13.5 0V9a1.5 1.5 0 011.5-1.5h12a1.5 1.5 0 011.5 1.5v5.25"
                    />
                </svg>
            ),
        },
        {
            title: 'React 19 + Inertia.js',
            description: 'Modern React with server-side routing through Inertia.js for the best of both worlds.',
            icon: (
                <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M9.75 3.104L19.8 14.5m0 0l-5.25 5.25a2.25 2.25 0 01-1.591.659H11.25M19.8 14.5l-5.25 5.25"
                    />
                </svg>
            ),
        },
        {
            title: 'shadcn/ui Components',
            description: 'Beautiful, accessible UI components built on Radix UI and styled with Tailwind CSS.',
            icon: (
                <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                </svg>
            ),
        },
        {
            title: 'Tailwind CSS v4',
            description: 'Next-generation utility-first CSS framework for rapid UI development.',
            icon: (
                <svg className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                    />
                </svg>
            ),
        },
        {
            title: 'Development Ready',
            description: 'Pre-configured development environment with hot reloading, debugging tools, and testing frameworks.',
            icon: (
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                    />
                </svg>
            ),
        },
        {
            title: 'Production Ready',
            description: 'Optimized for production with email integration, error handling, and performance best practices.',
            icon: (
                <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.311-.06m0 0a5.99 5.99 0 013.528-.17 8.376 8.376 0 01-.17-3.528m0 0a6.04 6.04 0 01-3.527.17 8.378 8.378 0 00.17 3.527m0 0c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.311-.06m0 0a5.99 5.99 0 013.528-.17 8.376 8.376 0 01-.17-3.528m0 0a6.04 6.04 0 01-3.527.17 8.378 8.378 0 00.17 3.527"
                    />
                </svg>
            ),
        },
    ];

    const testimonials = [
        {
            content: 'This starter template saved us weeks of setup time. The architecture is clean and the components are well-structured.',
            author: 'Sarah Chen',
            role: 'Senior Developer',
            company: 'TechStart Inc.',
        },
        {
            content: 'Perfect balance of modern tools and Laravel conventions. Our team was up and running in minutes.',
            author: 'Marcus Rodriguez',
            role: 'Tech Lead',
            company: 'DevFlow Solutions',
        },
        {
            content: 'The attention to detail in the component structure and development workflow is impressive.',
            author: 'Emily Johnson',
            role: 'Full Stack Developer',
            company: 'Innovation Labs',
        },
    ];

    // SEO configuration for Home page
    const homeSEO = {
        title: 'Home',
        description:
            'A comprehensive Laravel 12 starter template with React, Inertia.js, and shadcn/ui. Built for rapid web application development with modern tools and best practices.',
        keywords: ['Laravel 12', 'React 19', 'Inertia.js', 'shadcn/ui', 'Tailwind CSS', 'Starter Template', 'Web Development'],
        ogImage: '/images/og-home.jpg',
        ogImageAlt: 'iwlaravel12 - Laravel 12 Starter Template',
        twitterCard: 'summary_large_image' as const,
        structuredData: generateStructuredData('SoftwareApplication', {
            name: 'iwlaravel12',
            description: 'Laravel 12 starter template with React, Inertia.js, and shadcn/ui',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            programmingLanguage: ['PHP', 'TypeScript', 'JavaScript'],
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
            },
            author: {
                '@type': 'Organization',
                name: 'iwlaravel12 Team',
            },
        }),
    };

    // Structured data for features
    const featuresStructuredData = generateStructuredData('ItemList', {
        numberOfItems: features.length,
        itemListElement: features.map((feature, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'SoftwareFeature',
                name: feature.title,
                description: feature.description,
            },
        })),
    });

    return (
        <MainLayout seo={homeSEO} structuredData={[featuresStructuredData]}>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-32">
                <div className="absolute inset-0">
                    <ResponsiveImage
                        src="/images/placeholders/hero-bg.svg"
                        alt="Hero background with modern gradient and geometric shapes"
                        className="h-full w-full object-cover"
                        priority
                        sizesConfig={{ default: '100vw' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                            Laravel 12 Starter
                            <span className="block text-indigo-600 dark:text-indigo-400">Template</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                            Jumpstart your web development with a comprehensive Laravel 12 template featuring React, Inertia.js, and shadcn/ui. Built
                            with modern tools and best practices for rapid application development.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/contact">
                                <Button size="lg" className="px-8 py-3 text-base">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="px-8 py-3 text-base">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-white py-24 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                            Modern Stack, Battle-Tested Tools
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            Built with the latest versions of your favorite frameworks and libraries, configured for optimal developer experience and
                            production performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card key={index} className="transition-shadow duration-200 hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        {feature.icon}
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gray-50 py-24 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">What Developers Say</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Trusted by development teams worldwide</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-white dark:bg-gray-900">
                                <CardContent className="pt-6">
                                    <blockquote className="mb-4 text-gray-700 dark:text-gray-300">"{testimonial.content}"</blockquote>
                                    <div className="flex items-center">
                                        <Avatar alt={testimonial.author} size={40} className="shrink-0" />
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.author}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {testimonial.role} at {testimonial.company}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 py-24 dark:bg-indigo-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Build Something Amazing?</h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
                            Clone this template and start building your next project with a solid foundation that scales with your needs.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/contact">
                                <Button variant="secondary" size="lg" className="px-8 py-3 text-base">
                                    Get in Touch
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white bg-transparent px-8 py-3 text-base text-white hover:bg-white hover:text-indigo-600"
                                >
                                    View Documentation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
