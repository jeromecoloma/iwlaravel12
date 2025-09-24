import SEOHead from '@/components/SEOHead';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import React from 'react';

interface RateLimitProps {
    status?: number;
    message?: string;
    retryAfter?: number;
}

export default function RateLimit({ status = 429, message = 'Too Many Requests', retryAfter }: RateLimitProps) {
    const [countdown, setCountdown] = React.useState(retryAfter || 60);

    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const seoData = {
        title: `${status} - ${message} | iwlaravel12`,
        description: 'Too many requests. Please wait a moment before trying again.',
        robots: 'noindex, nofollow',
        canonical: undefined, // Don't index error pages
    };

    return (
        <MainLayout>
            <SEOHead seo={seoData} />

            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader className="pb-4">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <svg
                                className="h-12 w-12 text-blue-600 dark:text-blue-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {status} - {message}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            You've made too many requests in a short period. Please wait a moment before trying again.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <AlertDescription>
                                {countdown > 0 ? (
                                    <>
                                        Please wait <strong>{countdown} seconds</strong> before making another request.
                                    </>
                                ) : (
                                    'You can now try making your request again.'
                                )}
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <div className="space-y-2 text-left">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Rate limiting helps us:</p>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                                        Ensure fair usage for all users
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                                        Prevent abuse and spam
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                                        Maintain optimal performance
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                <Button onClick={() => window.location.reload()} disabled={countdown > 0} variant="default">
                                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                    </svg>
                                    {countdown > 0 ? `Retry in ${countdown}s` : 'Retry Now'}
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
