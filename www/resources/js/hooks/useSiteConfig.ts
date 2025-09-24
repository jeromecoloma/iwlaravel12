import { getSiteConfig, setSiteConfig, type SiteConfig } from '@/config/site';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface PageProps {
    site?: SiteConfig;
    [key: string]: unknown;
}

/**
 * Hook to get site configuration from Inertia shared props
 * This hook ensures the site config is properly initialized from Laravel
 */
export function useSiteConfig(): SiteConfig {
    const { props } = usePage<PageProps>();

    // Initialize site config from Inertia props
    useEffect(() => {
        if (props.site) {
            setSiteConfig(props.site);
        }
    }, [props.site]);

    return getSiteConfig();
}

/**
 * Get site config without React hook (for use in utilities)
 * This should be used in non-React contexts
 */
export { getSiteConfig } from '@/config/site';
