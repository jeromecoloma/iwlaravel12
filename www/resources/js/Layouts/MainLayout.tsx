import SEODevTools from '@/components/SEODevTools';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import NavigationProgress, { useNavigationState } from '@/components/ui/navigation-progress';
import { NetworkStatus, NetworkStatusIndicator } from '@/components/ui/network-status';
import { SkipLink } from '@/components/ui/skip-link';
import { Toaster } from '@/components/ui/sonner';
import { useRovingTabIndex } from '@/hooks/useKeyboardNavigation';
import { usePageStructure, useScreenReader } from '@/hooks/useScreenReader';
import { generateOrganizationStructuredData, generateWebsiteStructuredData, useSEO } from '@/hooks/useSEO';
import { SEOMetaData } from '@/types/seo';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
    seo?: Partial<SEOMetaData>;
    structuredData?: Record<string, unknown>[];
}

export default function MainLayout({ children, seo, structuredData = [] }: MainLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const isNavigating = useNavigationState();
    const { url } = usePage();

    // Generate SEO metadata
    const seoData = useSEO(seo);

    // Keyboard navigation for desktop menu
    const desktopNavigation = useRovingTabIndex(true);
    const mobileNavigation = useRovingTabIndex(mobileMenuOpen);

    // Screen reader support
    useScreenReader({
        announceNavigationChanges: true,
        announceDynamicContent: true,
        announceErrors: true,
        announceSuccessMessages: true,
    });
    usePageStructure();

    // Default structured data for the site
    const defaultStructuredData = [generateWebsiteStructuredData(), generateOrganizationStructuredData(), ...structuredData];

    // Handle mobile menu keyboard navigation
    const handleMobileMenuKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setMobileMenuOpen(false);
            // Focus back to the menu button
            const menuButton = document.querySelector('[aria-controls="mobile-menu"]') as HTMLElement;
            menuButton?.focus();
        }
    };

    // Focus management when mobile menu opens/closes
    React.useEffect(() => {
        if (mobileMenuOpen) {
            // Focus the first item in the mobile menu
            const firstMenuItem = document.querySelector('#mobile-menu [role="menuitem"]') as HTMLElement;
            firstMenuItem?.focus();
        }
    }, [mobileMenuOpen]);

    const navigation = [
        { name: 'Home', href: '/', current: false },
        { name: 'About', href: '/about', current: false },
        { name: 'Contact', href: '/contact', current: false },
        { name: 'Documentation', href: '/documentation', current: false },
    ];

    return (
        <>
            <SEOHead seo={seoData} structuredData={defaultStructuredData} />

            {/* Skip Links for Keyboard Navigation */}
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <SkipLink href="#contact-form">Skip to contact form</SkipLink>

            <div className="min-h-screen bg-white dark:bg-gray-900">
                {/* Navigation Progress Indicator */}
                <NavigationProgress color="bg-blue-500" showSpinner={true} />

                {/* Network Status Banner */}
                <NetworkStatus position="top" showWhenOnline={false} showRetryButton={true} />

                {/* Header */}
                <header className="border-b bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900" role="banner" aria-label="Site header">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <Link href="/" className="transition-opacity hover:opacity-80" aria-label="iwlaravel12 home page">
                                    <img src="/iwl-12-logo.svg" alt="iwlaravel12" className="h-8 w-auto" />
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:block" role="navigation" aria-label="Main navigation" ref={desktopNavigation.containerRef}>
                                <NavigationMenu>
                                    <NavigationMenuList className="flex space-x-8" role="menubar">
                                        {navigation.map((item, index) => (
                                            <NavigationMenuItem key={item.name} role="none">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={item.href}
                                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-gray-300 dark:hover:text-white"
                                                        role="menuitem"
                                                        aria-label={`Navigate to ${item.name} page`}
                                                        aria-current={url === item.href ? 'page' : undefined}
                                                        tabIndex={index === 0 ? 0 : -1}
                                                        onFocus={() => desktopNavigation.setCurrentIndex(index)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </nav>

                            {/* Network status and mobile menu */}
                            <div className="flex items-center gap-4">
                                {/* Network Status Indicator */}
                                <NetworkStatusIndicator className="hidden sm:flex" />

                                {/* Mobile menu button */}
                                <div className="md:hidden">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="text-gray-700 dark:text-gray-300"
                                        aria-expanded={mobileMenuOpen}
                                        aria-controls="mobile-menu"
                                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                                    >
                                        <span className="sr-only">{mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}</span>
                                        {!mobileMenuOpen ? (
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {mobileMenuOpen && (
                            <nav
                                id="mobile-menu"
                                className="animate-in duration-300 slide-in-from-top-2 md:hidden"
                                role="navigation"
                                aria-label="Mobile navigation"
                                ref={mobileNavigation.containerRef}
                                onKeyDown={handleMobileMenuKeyDown}
                            >
                                <div className="space-y-1 border-t border-gray-200 px-2 pt-2 pb-3 sm:px-3 dark:border-gray-800">
                                    {navigation.map((item, index) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-gray-300 dark:hover:text-white"
                                            onClick={() => setMobileMenuOpen(false)}
                                            role="menuitem"
                                            aria-label={`Navigate to ${item.name} page`}
                                            aria-current={url === item.href ? 'page' : undefined}
                                            tabIndex={index === 0 ? 0 : -1}
                                            onFocus={() => mobileNavigation.setCurrentIndex(index)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow" role="main" aria-label="Main content" id="main-content">
                    <ErrorBoundary
                        level="page"
                        onError={(error, errorInfo) => {
                            // Log page-level errors for debugging
                            console.error('Page-level error caught by ErrorBoundary:', error, errorInfo);

                            // In production, you might want to send this to an error reporting service
                            // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
                        }}
                    >
                        <div className={`transition-all duration-300 ${isNavigating ? 'scale-[0.98] opacity-50' : 'scale-100 opacity-100'}`}>
                            {children}
                        </div>
                    </ErrorBoundary>
                </main>

                {/* Footer */}
                <footer
                    className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                    role="contentinfo"
                    aria-label="Site footer"
                >
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            {/* Company Info */}
                            <div className="col-span-1 md:col-span-2">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">iwlaravel12</h3>
                                <p className="mb-4 text-gray-600 dark:text-gray-400">
                                    A comprehensive Laravel 12 starter template with React, Inertia.js, and shadcn/ui. Built for rapid web application
                                    development with modern tools and best practices.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <nav aria-label="Footer navigation" role="navigation">
                                <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">Quick Links</h4>
                                <ul className="space-y-2" role="list">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                aria-label={`Navigate to ${item.name} page`}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Contact Info */}
                            <div>
                                <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">Contact</h4>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li>hello@iwlaravel12.com</li>
                                    <li>+1 (555) 123-4567</li>
                                    <li>
                                        123 Laravel Street
                                        <br />
                                        Framework City, FC 12345
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    © {new Date().getFullYear()} iwlaravel12. All rights reserved.
                                </p>
                                <div className="mt-4 md:mt-0">
                                    <div className="flex space-x-6">
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300"
                                            aria-label="Visit our GitHub repository"
                                        >
                                            <span className="sr-only">GitHub</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </a>
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300"
                                            aria-label="Follow us on Twitter"
                                        >
                                            <span className="sr-only">Twitter</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Toast Notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 5000,
                        style: {
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            border: '1px solid var(--border)',
                        },
                    }}
                    closeButton
                />

                {/* SEO Development Tools (only in development) */}
                {process.env.NODE_ENV === 'development' && <SEODevTools seo={seoData} structuredData={defaultStructuredData} />}
            </div>
        </>
    );
}
