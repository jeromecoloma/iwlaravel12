import React from 'react';

export interface SkipLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
    return (
        <a
            href={href}
            className={`skip-link absolute -top-10 left-4 z-50 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-lg transform -translate-y-full transition-transform focus:translate-y-0 focus:top-4 ${className}`}
            onFocus={(e) => {
                // Ensure the skip link is visible when focused
                e.currentTarget.style.transform = 'translateY(0)';
            }}
            onBlur={(e) => {
                // Hide the skip link when focus is lost
                e.currentTarget.style.transform = 'translateY(-100%)';
            }}
        >
            {children}
        </a>
    );
}