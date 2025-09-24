import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';

export default function ToastDemo() {
    const toast = useToast();

    const handleSuccessToast = () => {
        toast.success('Operation completed successfully!', {
            duration: 5000,
            action: {
                label: 'View',
                onClick: () => console.log('View clicked'),
            },
        });
    };

    const handleErrorToast = () => {
        toast.error('Something went wrong', {
            duration: 6000,
            action: {
                label: 'Retry',
                onClick: () => console.log('Retry clicked'),
            },
        });
    };

    const handleInfoToast = () => {
        toast.info("Here's some helpful information", {
            duration: 4000,
        });
    };

    const handleWarningToast = () => {
        toast.warning('Please be aware of this action', {
            duration: 5000,
        });
    };

    const handlePromiseToast = () => {
        const mockPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                // Randomly resolve or reject for demo
                if (Math.random() > 0.5) {
                    resolve('Data loaded successfully');
                } else {
                    reject(new Error('Failed to load data'));
                }
            }, 3000);
        });

        toast.promise(mockPromise, {
            loading: 'Loading data...',
            success: (data) => `Success: ${data}`,
            error: (error) => `Error: ${error.message}`,
        });
    };

    const handleCustomToast = () => {
        toast.custom('Custom notification', 'This is a custom toast with a description that demonstrates the flexibility of our toast system.', {
            duration: 7000,
            action: {
                label: 'Learn More',
                onClick: () => console.log('Learn More clicked'),
            },
        });
    };

    const handleMultipleToasts = () => {
        toast.info('First toast notification');
        setTimeout(() => toast.success('Second toast notification'), 500);
        setTimeout(() => toast.warning('Third toast notification'), 1000);
    };

    const handleDismissAll = () => {
        toast.dismiss();
    };

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Toast Notifications Demo</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                    Try out our comprehensive toast notification system with different variants and features.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button onClick={handleSuccessToast} variant="default" className="bg-green-600 text-white hover:bg-green-700">
                        Success Toast
                    </Button>

                    <Button onClick={handleErrorToast} variant="default" className="bg-red-600 text-white hover:bg-red-700">
                        Error Toast
                    </Button>

                    <Button onClick={handleInfoToast} variant="default" className="bg-blue-600 text-white hover:bg-blue-700">
                        Info Toast
                    </Button>

                    <Button onClick={handleWarningToast} variant="default" className="bg-yellow-600 text-white hover:bg-yellow-700">
                        Warning Toast
                    </Button>

                    <Button onClick={handlePromiseToast} variant="default" className="bg-purple-600 text-white hover:bg-purple-700">
                        Promise Toast
                    </Button>

                    <Button onClick={handleCustomToast} variant="default" className="bg-indigo-600 text-white hover:bg-indigo-700">
                        Custom Toast
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-2 dark:border-gray-700">
                    <Button
                        onClick={handleMultipleToasts}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Multiple Toasts
                    </Button>

                    <Button
                        onClick={handleDismissAll}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900"
                    >
                        Dismiss All
                    </Button>
                </div>

                <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Toast Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Auto-dismiss after 4-6 seconds (configurable)</li>
                        <li>• Action buttons for user interaction</li>
                        <li>• Multiple toast queuing system</li>
                        <li>• Promise-based loading states</li>
                        <li>• Dark/light theme support</li>
                        <li>• Customizable positioning and styling</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
