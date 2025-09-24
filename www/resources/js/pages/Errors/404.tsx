import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';

interface NotFoundProps {
    status?: number;
    message?: string;
}

export default function NotFound({ status = 404, message = 'Page Not Found' }: NotFoundProps) {
    const seoData = {
        title: `${status} - ${message} | iwlaravel12`,
        description: 'The page you are looking for could not be found.',
        robots: 'noindex, nofollow',
        canonical: undefined, // Don't index error pages
    };

    return (
        <MainLayout>
            <SEOHead seo={seoData} />

            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader className="pb-4">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <svg
                                className="h-12 w-12 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {status} - {message}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            {status === 404
                                ? "The page you're looking for doesn't exist or has been moved."
                                : 'Something went wrong while processing your request.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Here are some helpful links instead:</p>

                            <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                <Button asChild variant="default">
                                    <Link href="/">
                                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                            />
                                        </svg>
                                        Go Home
                                    </Link>
                                </Button>

                                <Button asChild variant="outline">
                                    <Link href="/contact">
                                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                            />
                                        </svg>
                                        Contact Support
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Error Code: {status} • Time: {new Date().toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
