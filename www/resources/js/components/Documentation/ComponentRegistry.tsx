import { LoadingButton } from '@/components/LoadingStates/FormLoadingStates';
import { PageSkeleton } from '@/components/LoadingStates/PageSkeleton';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { Textarea } from '@/components/ui/textarea';
import { ComponentDocProps } from './ComponentDoc';

/**
 * Component Registry - Central documentation for all UI components
 *
 * This registry provides comprehensive documentation for all components
 * in the iwlaravel12 template, including:
 * - shadcn/ui components with customizations
 * - Custom components for loading states
 * - SEO and optimization components
 * - Layout and navigation components
 */
export const componentRegistry: Record<string, ComponentDocProps> = {
    // UI Components (shadcn/ui based)
    Button: {
        name: 'Button',
        description: 'A versatile button component with multiple variants, sizes, and states',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'variant',
                type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
                defaultValue: 'default',
                description: 'The visual style variant of the button',
                examples: ['default', 'destructive', 'outline'],
            },
            {
                name: 'size',
                type: "'default' | 'sm' | 'lg' | 'icon'",
                defaultValue: 'default',
                description: 'The size of the button',
                examples: ['sm', 'default', 'lg'],
            },
            {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false',
                description: 'Whether the button is disabled',
            },
            {
                name: 'asChild',
                type: 'boolean',
                defaultValue: 'false',
                description: 'Change the component to the HTML tag or custom component of the root node',
            },
        ],
        examples: [
            {
                title: 'Basic Button',
                description: 'Default button with standard styling',
                code: `<Button>Click me</Button>`,
                component: <Button>Click me</Button>,
            },
            {
                title: 'Button Variants',
                description: 'Different visual styles for various contexts',
                code: `<div className="flex gap-2">
  <Button variant="default">Default</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>`,
                component: (
                    <div className="flex flex-wrap gap-2">
                        <Button variant="default">Default</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>
                ),
            },
            {
                title: 'Button Sizes',
                description: 'Different sizes for various layout needs',
                code: `<div className="flex gap-2 items-center">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
</div>`,
                component: (
                    <div className="flex items-center gap-2">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                    </div>
                ),
            },
        ],
        notes: [
            'Use destructive variant sparingly for actions like delete or cancel',
            'Ghost buttons work well in card headers or as secondary actions',
            'Link variant removes button styling while maintaining accessibility',
        ],
    },

    Card: {
        name: 'Card',
        description: 'A flexible card container component for grouping related content',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes to apply',
            },
        ],
        examples: [
            {
                title: 'Basic Card',
                description: 'A simple card with content',
                code: `<Card className="p-6">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-gray-600">Card content goes here.</p>
</Card>`,
                component: (
                    <Card className="w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold">Card Title</h3>
                        <p className="text-gray-600">Card content goes here.</p>
                    </Card>
                ),
            },
        ],
        notes: ['Cards provide consistent spacing and shadow for content grouping', 'Remember to add padding classes (p-4, p-6) for content spacing'],
    },

    Input: {
        name: 'Input',
        description: 'A text input component with consistent styling and validation support',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'type',
                type: "'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'",
                defaultValue: 'text',
                description: 'The input type',
            },
            {
                name: 'placeholder',
                type: 'string',
                description: 'Placeholder text',
            },
            {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false',
                description: 'Whether the input is disabled',
            },
        ],
        examples: [
            {
                title: 'Basic Input',
                description: 'Standard text input',
                code: `<Input placeholder="Enter your name" />`,
                component: <Input placeholder="Enter your name" />,
            },
            {
                title: 'Email Input',
                description: 'Email input with validation',
                code: `<Input type="email" placeholder="your@email.com" />`,
                component: <Input type="email" placeholder="your@email.com" />,
            },
        ],
    },

    Textarea: {
        name: 'Textarea',
        description: 'A multi-line text input component for longer text content',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'placeholder',
                type: 'string',
                description: 'Placeholder text',
            },
            {
                name: 'rows',
                type: 'number',
                defaultValue: '3',
                description: 'Number of visible text lines',
            },
            {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false',
                description: 'Whether the textarea is disabled',
            },
        ],
        examples: [
            {
                title: 'Basic Textarea',
                description: 'Multi-line text input',
                code: `<Textarea placeholder="Enter your message..." rows={4} />`,
                component: <Textarea placeholder="Enter your message..." rows={4} />,
            },
        ],
    },

    Alert: {
        name: 'Alert',
        description: 'An alert component for displaying important messages with different variants',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'variant',
                type: "'default' | 'destructive'",
                defaultValue: 'default',
                description: 'The visual variant of the alert',
            },
        ],
        examples: [
            {
                title: 'Info Alert',
                description: 'Default informational alert',
                code: `<Alert>
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>This is an informational message.</AlertDescription>
</Alert>`,
                component: (
                    <Alert className="w-full max-w-md">
                        <div className="font-medium">Info</div>
                        <div className="text-sm">This is an informational message.</div>
                    </Alert>
                ),
            },
        ],
    },

    // Loading Components
    LoadingButton: {
        name: 'LoadingButton',
        description: 'A button component with built-in loading state and spinner animation',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'loading',
                type: 'boolean',
                required: true,
                description: 'Whether the button is in loading state',
            },
            {
                name: 'loadingText',
                type: 'string',
                description: 'Text to display while loading',
            },
            {
                name: 'variant',
                type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
                defaultValue: 'default',
                description: 'Button variant',
            },
        ],
        examples: [
            {
                title: 'Loading Button',
                description: 'Button with loading state',
                code: `<LoadingButton isLoading={true} loadingText="Saving...">
  Save Changes
</LoadingButton>`,
                component: (
                    <LoadingButton isLoading={true} loadingText="Saving...">
                        Save Changes
                    </LoadingButton>
                ),
            },
        ],
        notes: [
            'Use for form submissions to provide clear feedback to users',
            'Loading state automatically disables the button to prevent multiple submissions',
        ],
    },

    ResponsiveImage: {
        name: 'ResponsiveImage',
        description: 'Advanced image component with lazy loading, WebP support, and responsive sizing',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'src',
                type: 'string',
                required: true,
                description: 'Image source URL',
            },
            {
                name: 'alt',
                type: 'string',
                required: true,
                description: 'Alternative text for accessibility',
            },
            {
                name: 'lazy',
                type: 'boolean',
                defaultValue: 'true',
                description: 'Enable lazy loading',
            },
            {
                name: 'aspectRatio',
                type: "'square' | 'video' | 'wide' | 'portrait' | number",
                description: 'Aspect ratio constraint',
            },
            {
                name: 'priority',
                type: 'boolean',
                defaultValue: 'false',
                description: 'High priority loading (disables lazy loading)',
            },
        ],
        examples: [
            {
                title: 'Lazy Loaded Image',
                description: 'Image with lazy loading and WebP support',
                code: `<ResponsiveImage
  src="/images/placeholders/hero-bg.svg"
  alt="Example image"
  aspectRatio="video"
  priority={false}
/>`,
                component: (
                    <div className="w-full max-w-md">
                        <ResponsiveImage src="/images/placeholders/hero-bg.svg" alt="Example image" aspectRatio="video" priority={false} />
                    </div>
                ),
            },
        ],
        notes: [
            'Automatically generates WebP versions when supported by browser',
            'Use priority={true} for above-the-fold images',
            'Supports responsive breakpoints with multiple image sizes',
        ],
    },

    PageSkeleton: {
        name: 'PageSkeleton',
        description: 'Loading skeleton component for page-level loading states',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'variant',
                type: "'hero' | 'content' | 'form' | 'card'",
                defaultValue: 'content',
                description: 'The skeleton layout variant',
            },
        ],
        examples: [
            {
                title: 'Hero Skeleton',
                description: 'Skeleton for hero section loading',
                code: `<PageSkeleton type="hero" />`,
                component: <PageSkeleton type="hero" />,
            },
        ],
    },

    SEOHead: {
        name: 'SEOHead',
        description: 'Component for managing SEO meta tags, Open Graph, and structured data',
        stability: 'stable',
        version: '1.0',
        props: [
            {
                name: 'title',
                type: 'string',
                description: 'Page title (will be appended with site name)',
            },
            {
                name: 'description',
                type: 'string',
                description: 'Page description for meta tags',
            },
            {
                name: 'keywords',
                type: 'string[]',
                description: 'Array of keywords for SEO',
            },
            {
                name: 'ogImage',
                type: 'string',
                description: 'Open Graph image URL',
            },
            {
                name: 'structuredData',
                type: 'object',
                description: 'Structured data object for Schema.org',
            },
        ],
        examples: [
            {
                title: 'Basic SEO Head',
                description: 'SEO meta tags for a page',
                code: `<SEOHead
  title="About Us"
  description="Learn about our company and team"
  keywords={['company', 'team', 'about']}
  ogImage="/images/og-about.jpg"
/>`,
                showComponent: false,
            },
        ],
        notes: [
            'Automatically generates Open Graph and Twitter Card meta tags',
            'Includes structured data for better search engine understanding',
            'Use in page components to set page-specific SEO data',
        ],
    },
};

/**
 * Get documentation for a specific component
 */
export const getComponentDoc = (componentName: string): ComponentDocProps | null => {
    return componentRegistry[componentName] || null;
};

/**
 * Get all component names
 */
export const getComponentNames = (): string[] => {
    return Object.keys(componentRegistry).sort();
};

/**
 * Search components by name or description
 */
export const searchComponents = (query: string): ComponentDocProps[] => {
    const lowerQuery = query.toLowerCase();
    return Object.values(componentRegistry).filter(
        (component) => component.name.toLowerCase().includes(lowerQuery) || component.description.toLowerCase().includes(lowerQuery),
    );
};

export default componentRegistry;
