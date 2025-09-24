import SEOHead from '@/components/SEOHead';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';

interface CSRFErrorProps {
    status?: number;
    message?: string;
}

export default function CSRFError({ status = 419, message = 'Page Expired' }: CSRFErrorProps) {
    const seoData = {
        title: `${status} - ${message} | iwlaravel12`,
        description: 'Your session has expired. Please refresh the page and try again.',
        robots: 'noindex, nofollow',
        canonical: undefined, // Don't index error pages
    };

    return (
        <MainLayout>
            <SEOHead seo={seoData} />

            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader className="pb-4">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <svg
                                className="h-12 w-12 text-yellow-600 dark:text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {status} - {message}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Your session has expired for security reasons. Please refresh the page and try again.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                            </svg>
                            <AlertDescription>
                                This usually happens when you've been idle for too long or when your security token has expired.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">To resolve this issue:</p>

                            <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                <Button onClick={() => window.location.reload()} variant="default">
                                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                    </svg>
                                    Refresh Page
                                </Button>

                                <Button asChild variant="outline">
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
