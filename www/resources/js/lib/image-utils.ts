/**
 * Image utility functions for responsive image handling
 */

export interface ImageSize {
    width: number;
    height?: number;
    quality?: number;
}

export interface ImageSrcSet {
    webp: string;
    fallback: string;
}

/**
 * Standard responsive image sizes for different use cases
 */
export const RESPONSIVE_SIZES = {
    hero: [
        { width: 640, quality: 85 },
        { width: 768, quality: 85 },
        { width: 1024, quality: 85 },
        { width: 1280, quality: 85 },
        { width: 1536, quality: 85 },
        { width: 1920, quality: 85 },
    ],
    card: [
        { width: 320, quality: 85 },
        { width: 480, quality: 85 },
        { width: 640, quality: 85 },
        { width: 768, quality: 85 },
    ],
    avatar: [
        { width: 48, quality: 90 },
        { width: 64, quality: 90 },
        { width: 96, quality: 90 },
        { width: 128, quality: 90 },
        { width: 192, quality: 90 },
    ],
    thumbnail: [
        { width: 150, quality: 85 },
        { width: 300, quality: 85 },
        { width: 450, quality: 85 },
    ],
} as const;

/**
 * Generate srcSet for responsive images
 * @param baseSrc Base image source URL (without extension)
 * @param sizes Array of sizes to generate
 * @param format Image format (webp, jpg, png)
 */
export function generateSrcSet(baseSrc: string, sizes: readonly ImageSize[], format: 'webp' | 'jpg' | 'png' = 'webp'): string {
    const extension = format === 'webp' ? 'webp' : format;
    const baseName = baseSrc.replace(/\.[^/.]+$/, '');

    return sizes.map((size) => `${baseName}-${size.width}w.${extension} ${size.width}w`).join(', ');
}

/**
 * Generate both WebP and fallback srcSet
 * @param baseSrc Base image source URL
 * @param sizes Array of sizes to generate
 * @param fallbackFormat Fallback format (jpg or png)
 */
export function generateResponsiveSrcSets(baseSrc: string, sizes: readonly ImageSize[], fallbackFormat: 'jpg' | 'png' = 'jpg'): ImageSrcSet {
    return {
        webp: generateSrcSet(baseSrc, sizes, 'webp'),
        fallback: generateSrcSet(baseSrc, sizes, fallbackFormat),
    };
}

/**
 * Generate responsive sizes attribute based on breakpoints
 * @param config Configuration for different screen sizes
 */
export function generateSizesAttribute(config: { mobile?: string; tablet?: string; desktop?: string; default: string }): string {
    const parts: string[] = [];

    if (config.mobile) {
        parts.push(`(max-width: 640px) ${config.mobile}`);
    }

    if (config.tablet) {
        parts.push(`(max-width: 1024px) ${config.tablet}`);
    }

    if (config.desktop) {
        parts.push(`(min-width: 1025px) ${config.desktop}`);
    }

    parts.push(config.default);

    return parts.join(', ');
}

/**
 * Get optimized image URL for a specific size
 * @param baseSrc Base image source URL
 * @param width Desired width
 * @param format Image format
 */
export function getOptimizedImageUrl(baseSrc: string, width: number, format: 'webp' | 'jpg' | 'png' = 'webp'): string {
    const extension = format === 'webp' ? 'webp' : format;
    const baseName = baseSrc.replace(/\.[^/.]+$/, '');
    return `${baseName}-${width}w.${extension}`;
}

/**
 * Generate blur data URL for placeholder (base64 encoded tiny image)
 * @param color Primary color for the blur
 * @param width Width of the blur image
 * @param height Height of the blur image
 */
export function generateBlurDataURL(color: string = '#e5e7eb', width: number = 10, height: number = 10): string {
    const svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="${color}"/>
        </svg>
    `;

    const base64 = btoa(svg);
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Modern image format support detection
 */
export interface ImageFormatSupport {
    webp: boolean;
    avif: boolean;
    webpLossless: boolean;
    webpAlpha: boolean;
}

/**
 * Check if WebP is supported by the browser
 */
export function isWebPSupported(): Promise<boolean> {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

/**
 * Check if AVIF is supported by the browser
 */
export function isAVIFSupported(): Promise<boolean> {
    return new Promise((resolve) => {
        const avif = new Image();
        avif.onload = () => resolve(true);
        avif.onerror = () => resolve(false);
        avif.src =
            'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
}

/**
 * Check if WebP with transparency/alpha channel is supported
 */
export function isWebPAlphaSupported(): Promise<boolean> {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src =
            'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';
    });
}

/**
 * Check if WebP lossless is supported
 */
export function isWebPLosslessSupported(): Promise<boolean> {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    });
}

/**
 * Comprehensive modern image format support detection
 */
export async function detectImageFormatSupport(): Promise<ImageFormatSupport> {
    const [webp, avif, webpLossless, webpAlpha] = await Promise.all([
        isWebPSupported(),
        isAVIFSupported(),
        isWebPLosslessSupported(),
        isWebPAlphaSupported(),
    ]);

    return {
        webp,
        avif,
        webpLossless,
        webpAlpha,
    };
}

/**
 * Get the best supported modern image format for a given scenario
 */
export async function getBestImageFormat(hasTransparency = false): Promise<'avif' | 'webp' | 'png' | 'jpg'> {
    const support = await detectImageFormatSupport();

    // AVIF has better compression than WebP
    if (support.avif) return 'avif';

    // WebP support with consideration for transparency
    if (support.webp) {
        if (hasTransparency && support.webpAlpha) return 'webp';
        if (!hasTransparency) return 'webp';
    }

    // Fallback to traditional formats
    return hasTransparency ? 'png' : 'jpg';
}

/**
 * Preload critical images with WebP support
 * @param images Array of image URLs to preload
 * @param enableWebP Whether to prefer WebP format
 */
export function preloadImages(images: string[], enableWebP: boolean = true): void {
    images.forEach((src) => {
        if (enableWebP) {
            // Try to preload WebP version first
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = webpSrc;
            document.head.appendChild(link);
        }

        // Always preload original format as fallback
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/**
 * Preload critical images above the fold
 * @param selector CSS selector for critical images
 */
export function preloadCriticalImages(selector: string = '.hero img, .above-fold img'): void {
    const images = document.querySelectorAll(selector);
    const urls: string[] = [];

    images.forEach((img) => {
        const element = img as HTMLImageElement;
        if (element.src) {
            urls.push(element.src);
        }
        if (element.dataset.src) {
            urls.push(element.dataset.src);
        }
    });

    if (urls.length > 0) {
        preloadImages(urls);
    }
}

/**
 * Enhanced lazy loading with performance optimizations
 * @param options Configuration options for lazy loading
 */
export interface LazyLoadOptions {
    rootMargin?: string;
    threshold?: number;
    enableWebP?: boolean;
    placeholderColor?: string;
    fadeDuration?: number;
}

export function setupEnhancedLazyLoading(options: LazyLoadOptions = {}): () => void {
    const { rootMargin = '100px', threshold = 0.1, enableWebP = true, fadeDuration = 300 } = options;

    if (!('IntersectionObserver' in window)) {
        // Fallback: Load all images immediately
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(loadImageFallback);
        return () => {};
    }

    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImageWithOptimizations(entry.target as HTMLImageElement, {
                        enableWebP,
                        fadeDuration,
                    });
                    imageObserver.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin,
            threshold,
        },
    );

    // Observe all images with data-src attribute
    const observeImages = () => {
        const images = document.querySelectorAll('img[data-src]:not([data-observed])');
        images.forEach((img) => {
            img.setAttribute('data-observed', 'true');
            imageObserver.observe(img);
        });
    };

    // Initial observation
    observeImages();

    // Re-observe on DOM changes (for dynamic content)
    const mutationObserver = new MutationObserver(() => {
        observeImages();
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    return () => {
        imageObserver.disconnect();
        mutationObserver.disconnect();
    };
}

/**
 * Load image with fallback for older browsers
 */
function loadImageFallback(img: Element): void {
    const element = img as HTMLImageElement;
    const src = element.dataset.src;
    if (src) {
        element.src = src;
        element.removeAttribute('data-src');
        element.classList.add('loaded');
    }
}

/**
 * Load image with modern optimizations
 */
function loadImageWithOptimizations(img: HTMLImageElement, options: { enableWebP: boolean; fadeDuration: number }): void {
    const src = img.dataset.src;
    if (!src) return;

    // Create a new image element to preload
    const imageLoader = new Image();

    imageLoader.onload = () => {
        // Apply smooth fade-in transition
        img.style.transition = `opacity ${options.fadeDuration}ms ease-in-out`;
        img.style.opacity = '0';

        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');

        // Trigger fade-in after a brief delay
        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });
    };

    imageLoader.onerror = () => {
        // Fallback to original src on error
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded', 'error');
    };

    // Start loading
    imageLoader.src = src;
}

/**
 * Initialize lazy loading when DOM is ready
 */
export function initializeLazyLoading(options?: LazyLoadOptions): (() => void) | void {
    if (document.readyState === 'loading') {
        let cleanup: (() => void) | undefined;
        const handler = () => {
            cleanup = setupEnhancedLazyLoading(options);
        };
        document.addEventListener('DOMContentLoaded', handler);
        return () => {
            document.removeEventListener('DOMContentLoaded', handler);
            cleanup?.();
        };
    } else {
        return setupEnhancedLazyLoading(options);
    }
}
