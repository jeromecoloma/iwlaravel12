import { toast } from 'sonner';

export interface ToastOptions {
    duration?: number;
    dismissible?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useToast = () => {
    const showToast = {
        success: (message: string, options?: ToastOptions) => {
            return toast.success(message, {
                duration: options?.duration || 5000,
                dismissible: options?.dismissible !== false,
                action: options?.action,
            });
        },

        error: (message: string, options?: ToastOptions) => {
            return toast.error(message, {
                duration: options?.duration || 6000, // Slightly longer for errors
                dismissible: options?.dismissible !== false,
                action: options?.action,
            });
        },

        info: (message: string, options?: ToastOptions) => {
            return toast.info(message, {
                duration: options?.duration || 4000,
                dismissible: options?.dismissible !== false,
                action: options?.action,
            });
        },

        warning: (message: string, options?: ToastOptions) => {
            return toast.warning(message, {
                duration: options?.duration || 5000,
                dismissible: options?.dismissible !== false,
                action: options?.action,
            });
        },

        promise: <T>(
            promise: Promise<T>,
            messages: {
                loading: string;
                success: string | ((data: T) => string);
                error: string | ((error: Error) => string);
            },
            options?: ToastOptions,
        ) => {
            return toast.promise(promise, {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
                duration: options?.duration,
                dismissible: options?.dismissible !== false,
                action: options?.action,
            });
        },

        custom: (message: string, description?: string, options?: ToastOptions) => {
            return toast(message, {
                description,
                duration: options?.duration || 5000,
                dismissible: options?.dismissible !== false,
                action: options?.action,
            });
        },

        dismiss: (toastId?: string | number) => {
            if (toastId) {
                toast.dismiss(toastId);
            } else {
                toast.dismiss();
            }
        },
    };

    return showToast;
};

// Export individual toast functions for convenience
export const showToast = {
    success: (message: string, options?: ToastOptions) => {
        return toast.success(message, {
            duration: options?.duration || 5000,
            dismissible: options?.dismissible !== false,
            action: options?.action,
        });
    },

    error: (message: string, options?: ToastOptions) => {
        return toast.error(message, {
            duration: options?.duration || 6000,
            dismissible: options?.dismissible !== false,
            action: options?.action,
        });
    },

    info: (message: string, options?: ToastOptions) => {
        return toast.info(message, {
            duration: options?.duration || 4000,
            dismissible: options?.dismissible !== false,
            action: options?.action,
        });
    },

    warning: (message: string, options?: ToastOptions) => {
        return toast.warning(message, {
            duration: options?.duration || 5000,
            dismissible: options?.dismissible !== false,
            action: options?.action,
        });
    },

    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error) => string);
        },
        options?: ToastOptions,
    ) => {
        return toast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
            duration: options?.duration,
            dismissible: options?.dismissible !== false,
            action: options?.action,
        });
    },

    custom: (message: string, description?: string, options?: ToastOptions) => {
        return toast(message, {
            description,
            duration: options?.duration || 5000,
            dismissible: options?.dismissible !== false,
            action: options?.action,
        });
    },

    dismiss: (toastId?: string | number) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },
};
