import React from 'react';

export interface ScreenReaderOnlyProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
}

export function ScreenReaderOnly({
    children,
    as: Component = 'span',
    className = ''
}: ScreenReaderOnlyProps) {
    return (
        <Component className={`sr-only ${className}`}>
            {children}
        </Component>
    );
}