import React, { useRef, useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useImageOptimization, useImageGallery, useProgressiveImage, useResponsiveImageServing, UseImageOptimizationOptions } from '@/hooks/useImageOptimization';
import { RESPONSIVE_SIZES, generateSizesAttribute } from '@/lib/image-utils';

interface ResponsiveImageProps extends Omit<UseImageOptimizationOptions, 'src'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    sizesConfig?: {
        mobile?: string;
        tablet?: string;
        desktop?: string;
        default: string;
    };
    aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | number;
    fit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    onLoad?: () => void;
    onError?: () => void;
    servingMode?: 'advanced' | 'standard';
}

const ASPECT_RATIOS = {
    square: 1,
    video: 16 / 9,
    wide: 21 / 9,
    portrait: 3 / 4,
} as const;

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
    src,
    alt,
    width,
    height,
    className,
    sizesConfig,
    priority = false,
    placeholder = 'empty',
    aspectRatio,
    fit = 'cover',
    sizes = RESPONSIVE_SIZES.card,
    enableWebP = true,
    fallbackFormat = 'jpg',
    blurColor,
    onLoad,
    onError,
    servingMode = 'standard',
}) => {
    // Use advanced serving for better responsive capabilities
    const responsiveServing = useResponsiveImageServing(src, {
        sizes,
        enableWebP,
        fallbackFormat,
        aspectRatio: typeof aspectRatio === 'number' ? aspectRatio : ASPECT_RATIOS[aspectRatio as keyof typeof ASPECT_RATIOS],
        priority,
    });

    const standardOptimization = useImageOptimization({
        src,
        priority,
        placeholder,
        blurColor,
        sizes,
        enableWebP,
        fallbackFormat,
    });

    // Choose serving mode
    const imageData = useMemo(() => servingMode === 'advanced' ? {
        srcSet: responsiveServing.srcSet,
        fallbackSrcSet: responsiveServing.srcSet, // Advanced mode uses same srcSet
        isLoaded: standardOptimization.isLoaded,
        isInView: standardOptimization.isInView,
        hasError: standardOptimization.hasError,
        blurDataURL: standardOptimization.blurDataURL,
        webpSupported: responsiveServing.webpSupported,
        handleLoad: standardOptimization.handleLoad,
        handleError: standardOptimization.handleError,
        setInView: standardOptimization.setInView,
        responsiveSizes: responsiveServing.sizes,
    } : standardOptimization, [servingMode, responsiveServing, standardOptimization]);

    // Generate responsive sizes attribute
    const responsiveSizes = sizesConfig
        ? generateSizesAttribute(sizesConfig)
        : imageData.responsiveSizes || '100vw';

    // Calculate aspect ratio
    const aspectRatioValue = typeof aspectRatio === 'number'
        ? aspectRatio
        : aspectRatio ? ASPECT_RATIOS[aspectRatio] : undefined;

    const containerStyle = {
        width,
        height: height || (width && aspectRatioValue ? width / aspectRatioValue : undefined),
    };

    const handleImageLoad = () => {
        imageData.handleLoad();
        onLoad?.();
    };

    const handleImageError = () => {
        imageData.handleError();
        onError?.();
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (priority) {
            imageData.setInView(true);
            return;
        }

        const element = containerRef.current;
        if (!element) return;

        // Cleanup existing observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        imageData.setInView(true);
                        // Unobserve only this specific target
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '100px', // Load images 100px before they come into view
            }
        );

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [priority, imageData]);

    const renderPlaceholder = () => {
        if (placeholder === 'blur' && imageData.blurDataURL) {
            return (
                <img
                    src={imageData.blurDataURL}
                    alt=""
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
                        imageData.isLoaded ? 'opacity-0' : 'opacity-100'
                    )}
                    aria-hidden="true"
                />
            );
        }

        return (
            <div
                className={cn(
                    'absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse transition-opacity duration-300',
                    imageData.isLoaded ? 'opacity-0' : 'opacity-100'
                )}
                aria-hidden="true"
            />
        );
    };

    const renderErrorFallback = () => (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        </div>
    );

    if (imageData.hasError) {
        return (
            <div className={cn('relative overflow-hidden', className)} style={containerStyle}>
                {renderErrorFallback()}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn('relative overflow-hidden', className)}
            style={containerStyle}
            data-src={src}
        >
            {!imageData.isLoaded && renderPlaceholder()}

            {(imageData.isInView || priority) && (
                // For SVG files, use simple img tag
                src.endsWith('.svg') ? (
                    <img
                        src={src}
                        alt={alt}
                        width={width}
                        height={containerStyle.height}
                        className={cn(
                            'w-full h-full transition-opacity duration-300',
                            `object-${fit}`,
                            imageData.isLoaded ? 'opacity-100' : 'opacity-0'
                        )}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={priority ? 'high' : 'auto'}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                ) : (
                    <picture>
                        {servingMode === 'advanced' && responsiveServing.comprehensiveSrcSet ? (
                            // Advanced serving with comprehensive fallback support
                            responsiveServing.comprehensiveSrcSet.map((srcSetInfo, index) => (
                                <source
                                    key={index}
                                    srcSet={srcSetInfo.srcSet}
                                    sizes={responsiveSizes}
                                    type={srcSetInfo.type}
                                />
                            ))
                        ) : (
                            // Standard serving with WebP fallback
                            <>
                                {enableWebP && imageData.webpSupported && (
                                    <source
                                        srcSet={imageData.srcSet}
                                        sizes={responsiveSizes}
                                        type="image/webp"
                                    />
                                )}
                                <source
                                    srcSet={imageData.fallbackSrcSet}
                                    sizes={responsiveSizes}
                                    type={`image/${fallbackFormat}`}
                                />
                            </>
                        )}
                        <img
                            src={src}
                            alt={alt}
                            width={width}
                            height={containerStyle.height}
                            className={cn(
                                'w-full h-full transition-opacity duration-300',
                                `object-${fit}`,
                                imageData.isLoaded ? 'opacity-100' : 'opacity-0'
                            )}
                            loading={priority ? 'eager' : 'lazy'}
                            decoding="async"
                            fetchPriority={priority ? 'high' : 'auto'}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    </picture>
                )
            )}
        </div>
    );
};

export const Avatar: React.FC<{
    src?: string;
    alt: string;
    size?: number;
    fallback?: string;
    className?: string;
    priority?: boolean;
}> = ({ src, alt, size = 40, fallback, className, priority = false }) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        const initials = fallback || alt.split(' ').map(n => n[0]).join('').toUpperCase();
        const isEven = initials.charCodeAt(0) % 2 === 0;

        return (
            <div
                className={cn(
                    'rounded-full bg-gradient-to-r flex items-center justify-center text-white font-semibold text-sm',
                    isEven ? 'from-indigo-500 to-purple-600' : 'from-purple-500 to-indigo-600',
                    className
                )}
                style={{ width: size, height: size, fontSize: Math.max(size * 0.3, 12) }}
                title={alt}
            >
                {initials}
            </div>
        );
    }

    // For SVG files, use a simple img tag
    if (src.endsWith('.svg')) {
        return (
            <img
                src={src}
                alt={alt}
                width={size}
                height={size}
                className={cn('rounded-full', className)}
                onError={() => setHasError(true)}
                loading={priority ? 'eager' : 'lazy'}
            />
        );
    }

    return (
        <ResponsiveImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            aspectRatio="square"
            sizes={RESPONSIVE_SIZES.avatar}
            className={cn('rounded-full', className)}
            priority={priority}
            onError={() => setHasError(true)}
        />
    );
};

/**
 * Progressive image component that loads low-quality first, then high-quality
 */
export const ProgressiveImage: React.FC<{
    lowQualitySrc: string;
    highQualitySrc: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    aspectRatio?: ResponsiveImageProps['aspectRatio'];
}> = ({ lowQualitySrc, highQualitySrc, alt, className, width, height, aspectRatio }) => {
    const { src, isHighQualityLoaded } = useProgressiveImage(lowQualitySrc, highQualitySrc);

    return (
        <div className={cn('relative', className)}>
            <ResponsiveImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                aspectRatio={aspectRatio}
                className={cn(
                    'transition-all duration-500',
                    !isHighQualityLoaded && 'filter blur-sm scale-105'
                )}
                priority
            />
            {!isHighQualityLoaded && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
            )}
        </div>
    );
};

/**
 * Image gallery component with optimized loading
 */
export const ImageGallery: React.FC<{
    images: Array<{ src: string; alt: string; caption?: string }>;
    className?: string;
    imageClassName?: string;
    columns?: 2 | 3 | 4;
}> = ({ images, className, imageClassName, columns = 3 }) => {
    const { handleImageLoad, handleImageError, loadingProgress, allLoaded } = useImageGallery(
        images.map(img => img.src)
    );

    return (
        <div className={cn('space-y-4', className)}>
            {!allLoaded && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${loadingProgress * 100}%` }}
                    />
                </div>
            )}
            <div className={cn(
                'grid gap-4',
                {
                    'grid-cols-2': columns === 2,
                    'grid-cols-3': columns === 3,
                    'grid-cols-4': columns === 4,
                }
            )}>
                {images.map((image) => (
                    <div key={image.src} className="space-y-2">
                        <ResponsiveImage
                            src={image.src}
                            alt={image.alt}
                            aspectRatio="square"
                            className={imageClassName}
                            onLoad={() => handleImageLoad(image.src)}
                            onError={() => handleImageError(image.src)}
                        />
                        {image.caption && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {image.caption}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};