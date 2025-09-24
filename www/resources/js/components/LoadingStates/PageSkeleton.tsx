import { Skeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
    type?: 'hero' | 'content' | 'form' | 'card';
    className?: string;
}

export function PageSkeleton({ type = 'content', className = '' }: PageSkeletonProps) {
    const renderHeroSkeleton = () => (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-20 dark:from-gray-800 dark:to-gray-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Skeleton className="mx-auto mb-6 h-16 w-3/4" />
                        <Skeleton className="mx-auto mb-4 h-6 w-2/3" />
                        <Skeleton className="mx-auto mb-10 h-6 w-1/2" />
                        <div className="flex justify-center gap-4">
                            <Skeleton className="h-12 w-32" />
                            <Skeleton className="h-12 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContentSkeleton = () => (
        <div className={`animate-pulse ${className}`}>
            <div className="space-y-12 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <Skeleton className="mx-auto mb-4 h-12 w-1/2" />
                        <Skeleton className="mx-auto h-6 w-2/3" />
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-lg border bg-white p-6 dark:bg-gray-900">
                                <div className="mb-4 flex items-center space-x-3">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="mb-2 h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFormSkeleton = () => (
        <div className={`animate-pulse ${className}`}>
            <div className="rounded-lg border bg-white p-6 dark:bg-gray-900">
                <div className="space-y-6">
                    <div>
                        <Skeleton className="mb-2 h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Skeleton className="mb-2 h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="mb-2 h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    <div>
                        <Skeleton className="mb-2 h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div>
                        <Skeleton className="mb-2 h-4 w-16" />
                        <Skeleton className="h-32 w-full" />
                    </div>

                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    );

    const renderCardSkeleton = () => (
        <div className={`animate-pulse ${className}`}>
            <div className="rounded-lg border bg-white p-6 dark:bg-gray-900">
                <div className="mb-4 flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                </div>
            </div>
        </div>
    );

    switch (type) {
        case 'hero':
            return renderHeroSkeleton();
        case 'form':
            return renderFormSkeleton();
        case 'card':
            return renderCardSkeleton();
        default:
            return renderContentSkeleton();
    }
}

export default PageSkeleton;
