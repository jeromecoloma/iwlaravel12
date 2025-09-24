import SEOHead from '@/components/SEOHead';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';

interface ServerErrorProps {
    status?: number;
    message?: string;
    debug?: boolean;
    exception?: {
        message: string;
        file: string;
        line: number;
        trace?: string[];
    };
}

export default function ServerError({ status = 500, message = 'Internal Server Error', debug = false, exception }: ServerErrorProps) {
    const seoData = {
        title: `${status} - Server Error | iwlaravel12`,
        description: 'A server error occurred while processing your request.',
        robots: 'noindex, nofollow',
        canonical: undefined, // Don't index error pages
    };

    return (
        <MainLayout>
            <SEOHead seo={seoData} />

            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="w-full max-w-2xl space-y-6">
                    <Card className="text-center">
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
                                        d="M12 9v3.75m-6 .75h12m-6 3.75h.007v.008H12v-.008zM12 21a9 9 0 110-18 9 9 0 010 18z"
                                    />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                {status} - {message}
                            </CardTitle>
                            <CardDescription className="text-lg">
                                We're experiencing some technical difficulties. Our team has been notified and is working to resolve the issue.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <Alert className="text-left">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                    />
                                </svg>
                                <AlertDescription>
                                    If this problem persists, please contact our support team with the error code and time stamp below.
                                </AlertDescription>
                            </Alert>

                            <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                <Button onClick={() => window.location.reload()} variant="default">
                                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                    </svg>
                                    Try Again
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

                            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Error Code: {status} • Time: {new Date().toLocaleString()} • Reference:{' '}
                                    {Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Debug Information (Development Only) */}
                    {debug && exception && (
                        <Card className="text-left">
                            <CardHeader>
                                <CardTitle className="text-lg text-red-600 dark:text-red-400">Debug Information</CardTitle>
                                <CardDescription>This information is only visible in development mode.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Exception Message:</h4>
                                    <p className="rounded border bg-gray-100 p-3 font-mono text-sm dark:bg-gray-800">{exception.message}</p>
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">File & Line:</h4>
                                    <p className="rounded border bg-gray-100 p-3 font-mono text-sm dark:bg-gray-800">
                                        {exception.file}:{exception.line}
                                    </p>
                                </div>
                                {exception.trace && exception.trace.length > 0 && (
                                    <div>
                                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Stack Trace (Top 5):</h4>
                                        <div className="max-h-48 overflow-y-auto rounded border bg-gray-100 p-3 font-mono text-xs dark:bg-gray-800">
                                            {exception.trace.slice(0, 5).map((trace, index) => (
                                                <div key={index} className="mb-1 border-l-2 border-red-300 pl-2">
                                                    {trace}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
