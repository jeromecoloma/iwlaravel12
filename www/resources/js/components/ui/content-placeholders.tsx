import React from 'react';

/**
 * Text content loading placeholder with shimmer effect
 */
export function TextPlaceholder({
  lines = 3,
  className = '',
  animated = true
}: {
  lines?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded dark:bg-gray-700 ${
            animated ? 'animate-pulse' : ''
          } ${
            index === lines - 1 ? 'w-3/4' : 'w-full' // Last line is shorter
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Image loading placeholder
 */
export function ImagePlaceholder({
  width = 'w-full',
  height = 'h-48',
  className = '',
  animated = true,
  showIcon = true
}: {
  width?: string;
  height?: string;
  className?: string;
  animated?: boolean;
  showIcon?: boolean;
}) {
  return (
    <div
      className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center ${
        animated ? 'animate-pulse' : ''
      } ${className}`}
    >
      {showIcon && (
        <svg
          className="w-10 h-10 text-gray-400 dark:text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}

/**
 * Card content loading placeholder
 */
export function CardPlaceholder({
  showImage = true,
  showAvatar = false,
  className = '',
  animated = true
}: {
  showImage?: boolean;
  showAvatar?: boolean;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
      {showImage && (
        <ImagePlaceholder height="h-32" className="mb-4" animated={animated} />
      )}

      {showAvatar && (
        <div className="flex items-center mb-4">
          <div
            className={`w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full ${
              animated ? 'animate-pulse' : ''
            }`}
          />
          <div className="ml-3 space-y-1">
            <div
              className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ${
                animated ? 'animate-pulse' : ''
              }`}
            />
            <div
              className={`h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 ${
                animated ? 'animate-pulse' : ''
              }`}
            />
          </div>
        </div>
      )}

      <TextPlaceholder lines={3} animated={animated} />

      <div className="mt-4 flex space-x-2">
        <div
          className={`h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 ${
            animated ? 'animate-pulse' : ''
          }`}
        />
        <div
          className={`h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      </div>
    </div>
  );
}

/**
 * List item loading placeholder
 */
export function ListItemPlaceholder({
  showAvatar = false,
  showImage = false,
  className = '',
  animated = true
}: {
  showAvatar?: boolean;
  showImage?: boolean;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`flex items-center space-x-4 p-4 ${className}`}>
      {showAvatar && (
        <div
          className={`w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      )}

      {showImage && (
        <ImagePlaceholder width="w-16" height="h-12" animated={animated} />
      )}

      <div className="flex-1 space-y-2">
        <div
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 ${
            animated ? 'animate-pulse' : ''
          }`}
        />
        <div
          className={`h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      </div>

      <div
        className={`h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 ${
          animated ? 'animate-pulse' : ''
        }`}
      />
    </div>
  );
}

/**
 * Table loading placeholder
 */
export function TablePlaceholder({
  rows = 5,
  columns = 4,
  className = '',
  animated = true
}: {
  rows?: number;
  columns?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 ${
                animated ? 'animate-pulse' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
                    animated ? 'animate-pulse' : ''
                  } ${
                    colIndex === 0 ? 'w-24' : colIndex === columns - 1 ? 'w-16' : 'w-full'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Stats/Metrics loading placeholder
 */
export function StatsPlaceholder({
  count = 4,
  className = '',
  animated = true
}: {
  count?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center">
            <div
              className={`w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded ${
                animated ? 'animate-pulse' : ''
              }`}
            />
            <div className="ml-3 flex-1">
              <div
                className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2 ${
                  animated ? 'animate-pulse' : ''
                }`}
              />
              <div
                className={`h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 ${
                  animated ? 'animate-pulse' : ''
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Generic content section placeholder
 */
export function SectionPlaceholder({
  showTitle = true,
  showSubtitle = false,
  contentLines = 4,
  className = '',
  animated = true
}: {
  showTitle?: boolean;
  showSubtitle?: boolean;
  contentLines?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div
          className={`h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      )}

      {showSubtitle && (
        <div
          className={`h-5 bg-gray-200 dark:bg-gray-700 rounded w-96 ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      )}

      <TextPlaceholder lines={contentLines} animated={animated} />
    </div>
  );
}

/**
 * Dashboard/grid layout placeholder
 */
export function DashboardPlaceholder({
  className = '',
  animated = true
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Stats section */}
      <StatsPlaceholder animated={animated} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <SectionPlaceholder showTitle showSubtitle animated={animated} />
          <TablePlaceholder rows={6} animated={animated} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CardPlaceholder showImage={false} showAvatar animated={animated} />
          <CardPlaceholder showImage animated={animated} />
        </div>
      </div>
    </div>
  );
}