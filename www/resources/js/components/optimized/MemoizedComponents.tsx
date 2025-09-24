import { usePerformanceMonitor, useStableCallback } from '@/hooks/usePerformance';
import React, { memo, useCallback, useMemo } from 'react';

// Types for component props
interface ListItemProps {
    id: string;
    title: string;
    description: string;
    onClick: (id: string) => void;
    isSelected?: boolean;
}

interface OptimizedListProps {
    items: Array<{
        id: string;
        title: string;
        description: string;
    }>;
    onItemClick: (id: string) => void;
    selectedId?: string;
}

interface CounterDisplayProps {
    count: number;
    label: string;
    onIncrement: () => void;
    onDecrement: () => void;
}

interface FormFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

/**
 * Memoized list item component that only re-renders when props change.
 */
const MemoizedListItem = memo<ListItemProps>(function MemoizedListItem({ id, title, description, onClick, isSelected = false }) {
    usePerformanceMonitor(`MemoizedListItem-${id}`);

    // Memoize the click handler to prevent unnecessary re-renders
    const handleClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    // Memoize the styling based on selection state
    const itemClasses = useMemo(() => {
        const baseClasses = 'p-4 border rounded-lg cursor-pointer transition-colors';
        const selectedClasses = 'border-blue-500 bg-blue-50';
        const defaultClasses = 'border-gray-200 hover:border-gray-300';

        return `${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`;
    }, [isSelected]);

    return (
        <div className={itemClasses} onClick={handleClick}>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
    );
});

/**
 * Optimized list component with performance monitoring.
 */
const OptimizedList = memo<OptimizedListProps>(function OptimizedList({ items, onItemClick, selectedId }) {
    usePerformanceMonitor('OptimizedList');

    // Memoize the stable callback to prevent child re-renders
    const stableOnItemClick = useStableCallback(onItemClick);

    // Memoize the rendered items
    const renderedItems = useMemo(() => {
        return items.map((item) => (
            <MemoizedListItem
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                onClick={stableOnItemClick}
                isSelected={item.id === selectedId}
            />
        ));
    }, [items, stableOnItemClick, selectedId]);

    return <div className="space-y-2">{renderedItems}</div>;
});

/**
 * Memoized counter display component.
 */
const MemoizedCounterDisplay = memo<CounterDisplayProps>(function MemoizedCounterDisplay({ count, label, onIncrement, onDecrement }) {
    usePerformanceMonitor('MemoizedCounterDisplay');

    // Memoize expensive count formatting
    const formattedCount = useMemo(() => {
        return new Intl.NumberFormat().format(count);
    }, [count]);

    // Memoize button states
    const decrementDisabled = useMemo(() => count <= 0, [count]);

    return (
        <div className="flex items-center space-x-4 rounded-lg border p-4">
            <span className="font-medium">{label}:</span>
            <span className="text-xl font-bold text-blue-600">{formattedCount}</span>
            <div className="flex space-x-2">
                <button
                    onClick={onDecrement}
                    disabled={decrementDisabled}
                    className="rounded bg-red-500 px-3 py-1 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    -
                </button>
                <button onClick={onIncrement} className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600">
                    +
                </button>
            </div>
        </div>
    );
});

/**
 * Memoized form field component with optimized change handling.
 */
const MemoizedFormField = memo<FormFieldProps>(function MemoizedFormField({ label, value, onChange, placeholder, error }) {
    usePerformanceMonitor(`MemoizedFormField-${label}`);

    // Memoize the change handler
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        [onChange],
    );

    // Memoize error styling
    const inputClasses = useMemo(() => {
        const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2';
        const errorClasses = 'border-red-500 focus:ring-red-500';
        const normalClasses = 'border-gray-300 focus:ring-blue-500';

        return `${baseClasses} ${error ? errorClasses : normalClasses}`;
    }, [error]);

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input type="text" value={value} onChange={handleChange} placeholder={placeholder} className={inputClasses} />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
});

/**
 * Performance optimized card component.
 */
interface OptimizedCardProps {
    title: string;
    content: string;
    footer?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const OptimizedCard = memo<OptimizedCardProps>(function OptimizedCard({ title, content, footer, onClick, className = '' }) {
    usePerformanceMonitor(`OptimizedCard-${title}`);

    // Memoize card classes
    const cardClasses = useMemo(() => {
        const baseClasses = 'bg-white border border-gray-200 rounded-lg shadow-sm';
        const clickableClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';

        return `${baseClasses} ${clickableClasses} ${className}`.trim();
    }, [onClick, className]);

    return (
        <div className={cardClasses} onClick={onClick}>
            <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600">{content}</p>
            </div>
            {footer && <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-3">{footer}</div>}
        </div>
    );
});

// Export all memoized components
export { MemoizedCounterDisplay, MemoizedFormField, MemoizedListItem, OptimizedCard, OptimizedList };

// Export a demo component for testing performance optimizations
export function PerformanceDemo() {
    const [selectedId, setSelectedId] = React.useState<string>('');
    const [count, setCount] = React.useState(0);
    const [formValue, setFormValue] = React.useState('');

    const demoItems = useMemo(
        () => [
            { id: '1', title: 'Item 1', description: 'This is the first item' },
            { id: '2', title: 'Item 2', description: 'This is the second item' },
            { id: '3', title: 'Item 3', description: 'This is the third item' },
        ],
        [],
    );

    const handleItemClick = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    const handleIncrement = useCallback(() => {
        setCount((prev) => prev + 1);
    }, []);

    const handleDecrement = useCallback(() => {
        setCount((prev) => Math.max(0, prev - 1));
    }, []);

    const handleFormChange = useCallback((value: string) => {
        setFormValue(value);
    }, []);

    return (
        <div className="space-y-6 p-6">
            <h2 className="mb-4 text-2xl font-bold">Performance Optimization Demo</h2>

            <OptimizedCard title="Memoized List" content="This list uses memoization to prevent unnecessary re-renders" />

            <OptimizedList items={demoItems} onItemClick={handleItemClick} selectedId={selectedId} />

            <MemoizedCounterDisplay count={count} label="Counter" onIncrement={handleIncrement} onDecrement={handleDecrement} />

            <MemoizedFormField label="Test Input" value={formValue} onChange={handleFormChange} placeholder="Type something..." />
        </div>
    );
}
