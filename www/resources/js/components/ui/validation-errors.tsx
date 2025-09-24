import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ValidationErrorsProps {
    errors: Record<string, string | string[]>;
    title?: string;
    showDismiss?: boolean;
    onDismiss?: () => void;
    className?: string;
}

interface FieldErrorProps {
    error: string | string[];
    fieldName?: string;
    className?: string;
    showErrorIcon?: boolean;
}

export function ValidationErrors({
    errors,
    title = 'Please correct the following errors:',
    showDismiss = false,
    onDismiss,
    className = '',
}: ValidationErrorsProps) {
    const errorEntries = Object.entries(errors).filter(([, error]) =>
        Array.isArray(error) ? error.length > 0 : Boolean(error)
    );

    if (errorEntries.length === 0) {
        return null;
    }

    const totalErrors = errorEntries.reduce((count, [, error]) =>
        count + (Array.isArray(error) ? error.length : 1), 0
    );

    return (
        <Alert
            className={`border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 ${className}`}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            <svg
                className="h-4 w-4 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
            </svg>
            <AlertDescription>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div
                            className="font-medium text-red-800 dark:text-red-200 mb-2"
                            aria-label={`${totalErrors} form validation ${totalErrors === 1 ? 'error' : 'errors'}`}
                        >
                            {title} ({totalErrors} {totalErrors === 1 ? 'error' : 'errors'})
                        </div>
                        <ul
                            className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300"
                            role="list"
                            aria-label="Validation errors"
                        >
                            {errorEntries.map(([field, error]) => {
                                const errors = Array.isArray(error) ? error : [error];
                                return errors.map((errorMessage, index) => (
                                    <li
                                        key={`${field}-${index}`}
                                        className="flex items-start gap-2"
                                        role="listitem"
                                    >
                                        <span className="font-medium capitalize">
                                            {field.replace(/[_-]/g, ' ')}:
                                        </span>
                                        <span>{errorMessage}</span>
                                    </li>
                                ));
                            })}
                        </ul>
                    </div>
                    {showDismiss && onDismiss && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDismiss}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 -mr-2 -mt-1"
                            aria-label="Dismiss validation errors"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    )}
                </div>
            </AlertDescription>
        </Alert>
    );
}

export function FieldError({ error, fieldName, className = '' }: FieldErrorProps) {
    if (!error || (Array.isArray(error) && error.length === 0)) {
        return null;
    }

    const errors = Array.isArray(error) ? error : [error];

    return (
        <div className={`space-y-1 ${className}`}>
            {errors.map((errorMessage, index) => (
                <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                    aria-live="polite"
                >
                    <svg
                        className="h-4 w-4 mt-0.5 flex-shrink-0"
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
                    <span>
                        {fieldName && (
                            <span className="font-medium capitalize">
                                {fieldName.replace(/[_-]/g, ' ')}:
                            </span>
                        )} {errorMessage}
                    </span>
                </div>
            ))}
        </div>
    );
}

// Enhanced input component with validation error display
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | string[];
    required?: boolean;
    helpText?: string;
    showErrorIcon?: boolean;
}

export function ValidatedInput({
    label,
    error,
    required,
    helpText,
    showErrorIcon = true,
    className = '',
    ...props
}: ValidatedInputProps) {
    const hasError = Boolean(error && (Array.isArray(error) ? error.length > 0 : true));
    const inputId = props.id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={`text-sm font-medium ${
                        hasError
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    {...props}
                    id={inputId}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                        hasError
                            ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10'
                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800'
                    } ${className}`}
                    aria-invalid={hasError}
                    aria-required={required}
                    aria-describedby={
                        [
                            hasError ? `${inputId}-error` : '',
                            helpText ? `${inputId}-help` : ''
                        ].filter(Boolean).join(' ') || undefined
                    }
                />

                {hasError && showErrorIcon && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            className="h-5 w-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            role="img"
                            aria-label="Field has validation error"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {helpText && !hasError && (
                <p id={`${inputId}-help`} className="text-sm text-gray-500 dark:text-gray-400">
                    {helpText}
                </p>
            )}

            {hasError && error && (
                <div id={`${inputId}-error`}>
                    <FieldError error={error} showErrorIcon={false} />
                </div>
            )}
        </div>
    );
}

// Enhanced textarea component with validation error display
interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string | string[];
    required?: boolean;
    helpText?: string;
    showErrorIcon?: boolean;
    showCharCount?: boolean;
    maxLength?: number;
}

export function ValidatedTextarea({
    label,
    error,
    required,
    helpText,
    showErrorIcon = true,
    showCharCount = true,
    maxLength,
    className = '',
    value,
    ...props
}: ValidatedTextareaProps) {
    const hasError = Boolean(error && (Array.isArray(error) ? error.length > 0 : true));
    const textareaId = props.id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={textareaId}
                    className={`text-sm font-medium ${
                        hasError
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <textarea
                    {...props}
                    id={textareaId}
                    value={value}
                    maxLength={maxLength}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors resize-vertical ${
                        hasError
                            ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10'
                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800'
                    } ${className}`}
                    aria-invalid={hasError}
                    aria-required={required}
                    aria-describedby={
                        [
                            hasError ? `${textareaId}-error` : '',
                            helpText ? `${textareaId}-help` : ''
                        ].filter(Boolean).join(' ') || undefined
                    }
                />

                {hasError && showErrorIcon && (
                    <div className="absolute top-3 right-3">
                        <svg
                            className="h-5 w-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            role="img"
                            aria-label="Field has validation error"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start">
                <div className="flex-1">
                    {helpText && !hasError && (
                        <p id={`${textareaId}-help`} className="text-sm text-gray-500 dark:text-gray-400">
                            {helpText}
                        </p>
                    )}

                    {hasError && error && (
                        <div id={`${textareaId}-error`}>
                            <FieldError error={error} showErrorIcon={false} />
                        </div>
                    )}
                </div>

                {showCharCount && maxLength && (
                    <div className={`text-xs flex-shrink-0 ml-4 ${
                        currentLength > maxLength * 0.9
                            ? currentLength >= maxLength
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-500 dark:text-gray-400'
                    }`}>
                        {currentLength}/{maxLength}
                    </div>
                )}
            </div>
        </div>
    );
}