/**
 * Global image preloader and performance optimization
 */

import { initializeLazyLoading, isWebPSupported } from './image-utils';

interface ImagePreloaderConfig {
    enableWebP?: boolean;
    criticalImageSelector?: string;
    lazyLoadRootMargin?: string;
    lazyLoadThreshold?: number;
    maxConcurrentLoads?: number;
}

interface PerformanceTiming {
    averageLoadTime: number;
    slowestLoadTime: number;
    fastestLoadTime: number;
    totalImageRequests: number;
}

interface ImagePreloaderMetrics {
    totalImages: number;
    successRate: number;
    currentQueue: number;
    activeLoads: number;
    webpSupported: boolean;
    config: Required<ImagePreloaderConfig>;
    performanceTiming?: PerformanceTiming;
}

class ImagePreloader {
    private static instance: ImagePreloader;
    private config: Required<ImagePreloaderConfig>;
    private loadQueue: string[] = [];
    private loadingImages = new Set<string>();
    private loadedImages = new Set<string>();
    private failedImages = new Set<string>();
    private webpSupported = false;
    private cleanupFunctions: Array<() => void> = [];

    private constructor(config: ImagePreloaderConfig = {}) {
        this.config = {
            enableWebP: true,
            criticalImageSelector: '.hero img, .above-fold img, [data-priority="high"]',
            lazyLoadRootMargin: '100px',
            lazyLoadThreshold: 0.1,
            maxConcurrentLoads: 3,
            ...config,
        };
    }

    public static getInstance(config?: ImagePreloaderConfig): ImagePreloader {
        if (!ImagePreloader.instance) {
            ImagePreloader.instance = new ImagePreloader(config);
        }
        return ImagePreloader.instance;
    }

    public async initialize(): Promise<void> {
        try {
            // Check WebP support
            this.webpSupported = await isWebPSupported();

            // Preload critical images
            this.preloadCriticalImages();

            // Initialize lazy loading
            this.initializeLazyLoading();

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            console.log('Image preloader initialized', {
                webpSupported: this.webpSupported,
                config: this.config,
            });
        } catch (error) {
            console.warn('Failed to initialize image preloader:', error);
        }
    }

    private preloadCriticalImages(): void {
        const criticalImages = document.querySelectorAll(this.config.criticalImageSelector);
        const urls: string[] = [];

        criticalImages.forEach((img) => {
            const element = img as HTMLImageElement;
            if (element.src) {
                urls.push(element.src);
            }
            if (element.dataset.src) {
                urls.push(element.dataset.src);
            }
        });

        if (urls.length > 0) {
            this.batchPreload(urls, { priority: 'high' });
        }
    }

    private initializeLazyLoading(): void {
        const cleanup = initializeLazyLoading({
            rootMargin: this.config.lazyLoadRootMargin,
            threshold: this.config.lazyLoadThreshold,
            enableWebP: this.webpSupported && this.config.enableWebP,
        });

        if (cleanup) {
            this.cleanupFunctions.push(cleanup);
        }
    }

    private setupPerformanceMonitoring(): void {
        // Monitor Largest Contentful Paint (LCP) for images
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (entry.entryType === 'largest-contentful-paint') {
                            const lcpEntry = entry as PerformanceEntry & {
                                element?: { tagName: string };
                                url?: string;
                                size?: number;
                            };
                            if (lcpEntry.element?.tagName === 'IMG') {
                                console.log('LCP Image detected:', {
                                    url: lcpEntry.url,
                                    loadTime: lcpEntry.startTime,
                                    size: lcpEntry.size,
                                });
                            }
                        }
                    });
                });

                observer.observe({ entryTypes: ['largest-contentful-paint'] });
                this.cleanupFunctions.push(() => observer.disconnect());
            } catch (error) {
                console.warn('Failed to setup LCP monitoring:', error);
            }
        }

        // Monitor navigation timing for image loading insights
        if ('navigation' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                    console.log('Page load timing:', {
                        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                        loadComplete: timing.loadEventEnd - timing.loadEventStart,
                        totalLoadTime: timing.loadEventEnd - timing.fetchStart,
                    });
                }, 0);
            });
        }
    }

    public batchPreload(
        urls: string[],
        options: { priority?: 'high' | 'low'; format?: 'webp' | 'original'; useResourceHints?: boolean } = {},
    ): Promise<void[]> {
        const { priority = 'low', format = 'webp', useResourceHints = true } = options;
        const processedUrls = urls.map((url) => this.getOptimalImageUrl(url, format));

        // Add resource hints for critical images
        if (priority === 'high' && useResourceHints) {
            this.addResourceHints(processedUrls);
        }

        // Add to queue
        this.loadQueue.push(...processedUrls.filter((url) => !this.isLoadedOrLoading(url)));

        // Start processing queue and handle any rejections
        return this.processLoadQueue(priority === 'high').catch((error) => {
            console.warn('Some images failed to preload:', error);
            return []; // Return empty array instead of throwing
        });
    }

    private addResourceHints(urls: string[]): void {
        if (typeof document === 'undefined') return;

        urls.forEach((url) => {
            // Add preload hint for high-priority images
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = url;
            preloadLink.setAttribute('importance', 'high');

            // Set crossorigin for cross-domain images
            if (this.isCrossOrigin(url)) {
                preloadLink.crossOrigin = 'anonymous';
            }

            document.head.appendChild(preloadLink);

            // Add DNS prefetch for cross-domain images
            if (this.isCrossOrigin(url)) {
                const dnsPrefetchLink = document.createElement('link');
                dnsPrefetchLink.rel = 'dns-prefetch';
                dnsPrefetchLink.href = new URL(url).origin;
                document.head.appendChild(dnsPrefetchLink);
            }
        });
    }

    private async processLoadQueue(highPriority = false): Promise<void[]> {
        const promises: Promise<void>[] = [];
        const maxConcurrent = highPriority ? this.config.maxConcurrentLoads * 2 : this.config.maxConcurrentLoads;

        while (this.loadQueue.length > 0 && this.loadingImages.size < maxConcurrent) {
            const url = this.loadQueue.shift();
            if (url && !this.isLoadedOrLoading(url)) {
                promises.push(this.loadImage(url));
            }
        }

        return Promise.all(promises);
    }

    private loadImage(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.loadedImages.has(url)) {
                resolve();
                return;
            }

            if (this.failedImages.has(url)) {
                reject(new Error(`Image previously failed to load: ${url}`));
                return;
            }

            this.loadingImages.add(url);

            const img = new Image();
            const startTime = performance.now();

            img.onload = () => {
                const loadTime = performance.now() - startTime;
                this.loadingImages.delete(url);
                this.loadedImages.add(url);

                // Log performance metrics for optimization
                if (loadTime > 1000) {
                    // Log slow loading images
                    console.warn(`Slow image load detected: ${url} took ${loadTime.toFixed(2)}ms`);
                }

                // Mark performance milestone for LCP tracking
                if (performance && 'mark' in performance) {
                    try {
                        performance.mark(`image-loaded-${url.split('/').pop()}`);
                    } catch {
                        // Ignore performance marking errors
                    }
                }

                resolve();

                // Continue processing queue
                this.processLoadQueue();
            };

            img.onerror = () => {
                const loadTime = performance.now() - startTime;
                this.loadingImages.delete(url);
                this.failedImages.add(url);

                console.error(`Image failed to load: ${url} after ${loadTime.toFixed(2)}ms`);
                reject(new Error(`Failed to load image: ${url}`));

                // Continue processing queue
                this.processLoadQueue();
            };

            // Performance optimizations
            img.decoding = 'async'; // Non-blocking image decoding
            img.loading = 'eager'; // Since we're preloading, load immediately

            // Set crossorigin for CDN images
            if (this.isCrossOrigin(url)) {
                img.crossOrigin = 'anonymous';
            }

            // Set source last to trigger loading
            img.src = url;
        });
    }

    private getOptimalImageUrl(url: string, format: 'webp' | 'original'): string {
        // Don't modify SVG files
        if (url.endsWith('.svg')) {
            return url;
        }

        if (format === 'webp' && this.webpSupported && this.config.enableWebP) {
            return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return url;
    }

    private isLoadedOrLoading(url: string): boolean {
        return this.loadedImages.has(url) || this.loadingImages.has(url);
    }

    private isCrossOrigin(url: string): boolean {
        try {
            const urlObj = new URL(url, window.location.href);
            return urlObj.origin !== window.location.origin;
        } catch {
            return false;
        }
    }

    public getStats() {
        return {
            loaded: this.loadedImages.size,
            loading: this.loadingImages.size,
            failed: this.failedImages.size,
            queued: this.loadQueue.length,
            webpSupported: this.webpSupported,
        };
    }

    public getPerformanceMetrics(): ImagePreloaderMetrics {
        const metrics: ImagePreloaderMetrics = {
            totalImages: this.loadedImages.size + this.failedImages.size,
            successRate: this.loadedImages.size / (this.loadedImages.size + this.failedImages.size) || 0,
            currentQueue: this.loadQueue.length,
            activeLoads: this.loadingImages.size,
            webpSupported: this.webpSupported,
            config: this.config,
        };

        // Add performance timing if available
        if (typeof performance !== 'undefined' && 'getEntriesByType' in performance) {
            try {
                const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
                const imageEntries = resourceEntries.filter(
                    (entry) => entry.initiatorType === 'img' || entry.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i),
                );

                if (imageEntries.length > 0) {
                    const loadTimes = imageEntries.map((entry) => entry.duration);
                    metrics.performanceTiming = {
                        averageLoadTime: loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length,
                        slowestLoadTime: Math.max(...loadTimes),
                        fastestLoadTime: Math.min(...loadTimes),
                        totalImageRequests: imageEntries.length,
                    };
                }
            } catch (error) {
                console.warn('Failed to gather performance metrics:', error);
            }
        }

        return metrics;
    }

    public logPerformanceReport(): void {
        const metrics = this.getPerformanceMetrics();
        console.group('🖼️ Image Loading Performance Report');
        console.log('Load Statistics:', {
            'Total Loaded': metrics.totalImages,
            'Success Rate': `${(metrics.successRate * 100).toFixed(1)}%`,
            'Queue Status': `${metrics.activeLoads} loading, ${metrics.currentQueue} queued`,
            'WebP Supported': metrics.webpSupported ? '✅' : '❌',
        });

        if (metrics.performanceTiming) {
            console.log('Performance Timing:', {
                'Average Load Time': `${metrics.performanceTiming.averageLoadTime.toFixed(2)}ms`,
                'Slowest Load': `${metrics.performanceTiming.slowestLoadTime.toFixed(2)}ms`,
                'Fastest Load': `${metrics.performanceTiming.fastestLoadTime.toFixed(2)}ms`,
                'Total Requests': metrics.performanceTiming.totalImageRequests,
            });
        }

        console.log('Configuration:', metrics.config);
        console.groupEnd();
    }

    public cleanup(): void {
        this.cleanupFunctions.forEach((cleanup) => cleanup());
        this.cleanupFunctions = [];
        this.loadQueue = [];
        this.loadingImages.clear();
    }
}

// Global instance and initialization
export const imagePreloader = ImagePreloader.getInstance();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            imagePreloader.initialize();
        });
    } else {
        imagePreloader.initialize();
    }

    // Log performance report after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (process.env.NODE_ENV === 'development') {
                imagePreloader.logPerformanceReport();
            }
        }, 2000); // Wait 2 seconds after load to gather metrics
    });
}

export default ImagePreloader;
