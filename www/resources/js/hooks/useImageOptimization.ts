import ImagePreloader from '@/lib/image-preloader';
import {
    detectImageFormatSupport,
    generateBlurDataURL,
    getBestImageFormat,
    ImageFormatSupport,
    isWebPSupported,
    RESPONSIVE_SIZES,
} from '@/lib/image-utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseImageOptimizationOptions {
    src: string;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurColor?: string;
    sizes?: readonly { width: number; quality?: number }[];
    enableWebP?: boolean;
    fallbackFormat?: 'jpg' | 'png';
    preloadMargin?: string;
    threshold?: number;
    enablePreloader?: boolean;
    aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | number;
    responsiveSizes?: string;
}

export interface ImageOptimizationResult {
    src: string;
    srcSet: string;
    fallbackSrcSet: string;
    isLoaded: boolean;
    isInView: boolean;
    hasError: boolean;
    blurDataURL?: string;
    webpSupported: boolean;
    handleLoad: () => void;
    handleError: () => void;
    setInView: (inView: boolean) => void;
    responsiveSizes: string;
    optimizedSrc: string;
    dimensions?: { width: number; height: number };
}

export function useImageOptimization(options: UseImageOptimizationOptions): ImageOptimizationResult {
    const {
        src,
        priority = false,
        placeholder = 'empty',
        blurColor = '#e5e7eb',
        sizes = RESPONSIVE_SIZES.card,
        enableWebP = true,
        fallbackFormat = 'jpg',
        enablePreloader = true,
        responsiveSizes = '100vw',
    } = options;

    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const [webpSupported, setWebpSupported] = useState(false);
    const [blurDataURL, setBlurDataURL] = useState<string>();
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>();
    const preloaderRef = useRef<ImagePreloader | null>(null);

    // Initialize preloader and check WebP support on mount
    useEffect(() => {
        if (enablePreloader && !preloaderRef.current) {
            preloaderRef.current = ImagePreloader.getInstance();
        }

        if (enableWebP) {
            isWebPSupported().then(setWebpSupported);
        }

        return () => {
            if (preloaderRef.current) {
                preloaderRef.current.cleanup();
            }
        };
    }, [enableWebP, enablePreloader]);

    // Generate blur placeholder
    useEffect(() => {
        if (placeholder === 'blur') {
            const blurUrl = generateBlurDataURL(blurColor, 40, 24);
            setBlurDataURL(blurUrl);
        }
    }, [placeholder, blurColor]);

    // Generate optimized srcSet
    const generateOptimizedSrcSet = useCallback(
        (format: 'webp' | 'jpg' | 'png') => {
            // Don't modify SVG files - return original or sized versions
            if (src.endsWith('.svg')) {
                const baseName = src.replace(/\.[^/.]+$/, '');
                const sizesArray = Array.isArray(sizes) ? sizes : [];

                if (sizesArray.length === 0) {
                    return src;
                }

                return sizesArray.map((size) => `${baseName}-${size.width}w.svg ${size.width}w`).join(', ');
            }

            const baseName = src.replace(/\.[^/.]+$/, '');
            const extension = format === 'webp' ? 'webp' : format;

            // Ensure sizes is an array
            const sizesArray = Array.isArray(sizes) ? sizes : [];
            if (sizesArray.length === 0) {
                return `${baseName}.${extension}`;
            }

            return sizesArray.map((size) => `${baseName}-${size.width}w.${extension} ${size.width}w`).join(', ');
        },
        [src, sizes],
    );

    const srcSet = webpSupported && enableWebP ? generateOptimizedSrcSet('webp') : generateOptimizedSrcSet(fallbackFormat);

    const fallbackSrcSet = generateOptimizedSrcSet(fallbackFormat);

    // Calculate optimal source for current viewport
    const optimizedSrc = useCallback(() => {
        if (typeof window === 'undefined') return src;

        // Don't modify SVG files - return original or sized versions
        if (src.endsWith('.svg')) {
            const sizesArray = Array.isArray(sizes) ? sizes : [];
            if (sizesArray.length === 0) return src;

            const viewportWidth = window.innerWidth;
            const devicePixelRatio = window.devicePixelRatio || 1;
            const targetWidth = viewportWidth * devicePixelRatio;
            const bestSize = sizesArray.find((size) => size.width >= targetWidth) || sizesArray[sizesArray.length - 1];

            const baseName = src.replace(/\.[^/.]+$/, '');
            return `${baseName}-${bestSize.width}w.svg`;
        }

        const viewportWidth = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio || 1;

        // Find the best size based on viewport and device pixel ratio
        const sizesArray = Array.isArray(sizes) ? sizes : [];
        if (sizesArray.length === 0) return src;

        const targetWidth = viewportWidth * devicePixelRatio;
        const bestSize = sizesArray.find((size) => size.width >= targetWidth) || sizesArray[sizesArray.length - 1];

        const baseName = src.replace(/\.[^/.]+$/, '');
        const format = webpSupported && enableWebP ? 'webp' : fallbackFormat;

        return `${baseName}-${bestSize.width}w.${format}`;
    }, [src, sizes, webpSupported, enableWebP, fallbackFormat]);

    // Load image dimensions for responsive calculation
    useEffect(() => {
        if (!isInView || dimensions) return;

        const img = new Image();
        img.onload = () => {
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = src;
    }, [src, isInView, dimensions]);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        setHasError(false);

        // Track LCP for performance monitoring
        if (performance && 'measure' in performance) {
            try {
                performance.mark('image-load-complete');
            } catch {
                // Ignore performance marking errors
            }
        }
    }, []);

    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoaded(false);
    }, []);

    // Preload image when it comes into view
    const handleInViewChange = useCallback(
        (inView: boolean) => {
            setIsInView(inView);

            if (inView && enablePreloader && preloaderRef.current && !isLoaded) {
                // Don't try to convert SVG files to WebP
                let imageUrl = src;
                if (!src.endsWith('.svg') && webpSupported && enableWebP) {
                    imageUrl = src.replace(/\.[^/.]+$/, '.webp');
                }

                preloaderRef.current
                    .batchPreload([imageUrl], {
                        priority: priority ? 'high' : 'low',
                    })
                    .catch(() => {
                        // Silently handle preload failures for missing images
                        console.warn(`Failed to preload image: ${imageUrl}`);
                    });
            }
        },
        [src, webpSupported, enableWebP, enablePreloader, isLoaded, priority],
    );

    const setInView = useCallback(
        (inView: boolean) => {
            handleInViewChange(inView);
        },
        [handleInViewChange],
    );

    return {
        src,
        srcSet,
        fallbackSrcSet,
        isLoaded,
        isInView,
        hasError,
        blurDataURL,
        webpSupported,
        handleLoad,
        handleError,
        setInView,
        responsiveSizes,
        optimizedSrc: optimizedSrc(),
        dimensions,
    };
}

/**
 * Hook for managing multiple image loading states
 */
export function useImageGallery(images: string[]) {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const handleImageLoad = useCallback((src: string) => {
        setLoadedImages((prev) => new Set(prev).add(src));
        setFailedImages((prev) => {
            const next = new Set(prev);
            next.delete(src);
            return next;
        });
    }, []);

    const handleImageError = useCallback((src: string) => {
        setFailedImages((prev) => new Set(prev).add(src));
        setLoadedImages((prev) => {
            const next = new Set(prev);
            next.delete(src);
            return next;
        });
    }, []);

    const isLoaded = useCallback((src: string) => loadedImages.has(src), [loadedImages]);
    const hasFailed = useCallback((src: string) => failedImages.has(src), [failedImages]);

    const allLoaded = images.every(isLoaded);
    const anyFailed = images.some(hasFailed);
    const loadingProgress = loadedImages.size / images.length;

    return {
        handleImageLoad,
        handleImageError,
        isLoaded,
        hasFailed,
        allLoaded,
        anyFailed,
        loadingProgress,
        loadedCount: loadedImages.size,
        totalCount: images.length,
    };
}

/**
 * Hook for progressive image enhancement
 */
export function useProgressiveImage(lowQualitySrc: string, highQualitySrc: string) {
    const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
    const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setCurrentSrc(highQualitySrc);
            setIsHighQualityLoaded(true);
        };
        img.src = highQualitySrc;
    }, [highQualitySrc]);

    return {
        src: currentSrc,
        isHighQualityLoaded,
    };
}

/**
 * Advanced hook for responsive image serving with viewport detection
 */
export function useResponsiveImageServing(
    src: string,
    options: {
        sizes?: readonly { width: number; quality?: number; breakpoint?: number }[];
        enableWebP?: boolean;
        enableAVIF?: boolean;
        fallbackFormat?: 'jpg' | 'png';
        aspectRatio?: number;
        priority?: boolean;
        hasTransparency?: boolean;
    } = {},
) {
    const {
        sizes = RESPONSIVE_SIZES.card,
        enableWebP = true,
        enableAVIF = true,
        fallbackFormat = 'jpg',
        aspectRatio,
        hasTransparency = false,
    } = options;

    const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>(() =>
        typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : { width: 1200, height: 800 },
    );
    const [formatSupport, setFormatSupport] = useState<ImageFormatSupport>({
        webp: false,
        avif: false,
        webpLossless: false,
        webpAlpha: false,
    });
    const [bestFormat, setBestFormat] = useState<'avif' | 'webp' | 'png' | 'jpg'>(fallbackFormat as 'jpg' | 'png');
    const [devicePixelRatio, setDevicePixelRatio] = useState(() => (typeof window !== 'undefined' ? window.devicePixelRatio : 1));

    // Update viewport size on resize
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setViewportSize({ width: window.innerWidth, height: window.innerHeight });
            setDevicePixelRatio(window.devicePixelRatio || 1);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Detect format support
    useEffect(() => {
        const detectSupport = async () => {
            const support = await detectImageFormatSupport();
            setFormatSupport(support);

            const optimal = await getBestImageFormat(hasTransparency);
            setBestFormat(optimal);
        };

        detectSupport();
    }, [enableWebP, enableAVIF, hasTransparency]);

    // Calculate best image size for current viewport
    const getBestImageSize = useCallback(() => {
        const targetWidth = viewportSize.width * devicePixelRatio;
        const sizesArray = Array.isArray(sizes) ? sizes : [];

        if (sizesArray.length === 0) return { width: 800, quality: 85 };

        // Find size that matches breakpoint first, then by width
        const sizeWithBreakpoint = sizesArray.find((size) => size.breakpoint && viewportSize.width <= size.breakpoint);

        if (sizeWithBreakpoint) return sizeWithBreakpoint;

        // Fallback to width-based selection
        return sizesArray.find((size) => size.width >= targetWidth) || sizesArray[sizesArray.length - 1];
    }, [sizes, viewportSize, devicePixelRatio]);

    // Generate optimized image URL
    const getOptimizedImageUrl = useCallback(() => {
        if (src.endsWith('.svg')) return src; // SVGs are already scalable

        const bestSize = getBestImageSize();
        let format: 'jpg' | 'png' | 'webp' | 'avif' = fallbackFormat;

        // Choose best format based on support and settings
        if (enableAVIF && formatSupport.avif) {
            format = 'avif';
        } else if (enableWebP && formatSupport.webp) {
            if (hasTransparency && formatSupport.webpAlpha) {
                format = 'webp';
            } else if (!hasTransparency) {
                format = 'webp';
            }
        }

        const baseName = src.replace(/\.[^/.]+$/, '');
        return `${baseName}-${bestSize.width}w.${format}`;
    }, [src, getBestImageSize, formatSupport, enableWebP, enableAVIF, fallbackFormat, hasTransparency]);

    // Generate responsive srcSet with multiple format support
    const generateResponsiveSrcSet = useCallback(
        (format?: string) => {
            if (src.endsWith('.svg')) return '';

            const sizesArray = Array.isArray(sizes) ? sizes : [];
            const targetFormat = format || bestFormat;
            const baseName = src.replace(/\.[^/.]+$/, '');

            return sizesArray.map((size) => `${baseName}-${size.width}w.${targetFormat} ${size.width}w`).join(', ');
        },
        [src, sizes, bestFormat],
    );

    // Generate comprehensive srcSet with fallbacks
    const getComprehensiveSrcSet = useCallback(() => {
        const srcSets: { srcSet: string; type: string }[] = [];

        if (enableAVIF && formatSupport.avif) {
            srcSets.push({
                srcSet: generateResponsiveSrcSet('avif'),
                type: 'image/avif',
            });
        }

        if (enableWebP && formatSupport.webp) {
            srcSets.push({
                srcSet: generateResponsiveSrcSet('webp'),
                type: 'image/webp',
            });
        }

        // Always include fallback
        srcSets.push({
            srcSet: generateResponsiveSrcSet(fallbackFormat),
            type: `image/${fallbackFormat}`,
        });

        return srcSets;
    }, [generateResponsiveSrcSet, enableAVIF, enableWebP, formatSupport, fallbackFormat]);

    // Generate sizes attribute for responsive images
    const generateSizesAttribute = useCallback(() => {
        const sizesArray = Array.isArray(sizes) ? sizes : [];
        const parts: string[] = [];

        // Generate media queries based on breakpoints and sizes
        sizesArray.forEach((size, index) => {
            if (size.breakpoint) {
                parts.push(`(max-width: ${size.breakpoint}px) ${size.width}px`);
            } else if (index === sizesArray.length - 1) {
                parts.push(`${size.width}px`);
            }
        });

        return parts.length > 0 ? parts.join(', ') : '100vw';
    }, [sizes]);

    // Calculate dimensions with aspect ratio
    const calculateDimensions = useCallback(
        (width?: number) => {
            if (!width) {
                const bestSize = getBestImageSize();
                width = bestSize.width;
            }

            const height = aspectRatio && width ? width / aspectRatio : undefined;
            return { width, height };
        },
        [aspectRatio, getBestImageSize],
    );

    return {
        optimizedSrc: getOptimizedImageUrl(),
        srcSet: generateResponsiveSrcSet(),
        sizes: generateSizesAttribute(),
        dimensions: calculateDimensions(),
        viewportSize,
        devicePixelRatio,
        formatSupport,
        bestFormat,
        bestSize: getBestImageSize(),
        comprehensiveSrcSet: getComprehensiveSrcSet(),
        // Legacy support
        src: getOptimizedImageUrl(),
        responsiveSizes: generateSizesAttribute(),
        webpSupported: formatSupport.webp,
    };
}
