import { LoadingButton } from '@/components/LoadingStates/FormLoadingStates';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, ResponsiveImage } from '@/components/ui/responsive-image';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface ComponentBrowserProps {
    initialComponent?: string;
    showSidebar?: boolean;
    className?: string;
}

interface ComponentDoc {
    name: string;
    description: string;
    category: string;
    examples: Array<{
        title: string;
        description: string;
        code: string;
        component: React.ReactNode;
    }>;
    props: Array<{
        name: string;
        type: string;
        required?: boolean;
        defaultValue?: string;
        description: string;
    }>;
}

// Contact form demo component for documentation
const ContactFormDemo = () => {
    const { data, setData, processing } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Demo mode - just show alert instead of actual submission
        alert('Demo mode: Form would be submitted with:\n' + JSON.stringify(data, null, 2));
    };

    return (
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <h3 className="text-lg font-semibold">Contact Us</h3>
                <p className="text-sm text-gray-600">Send us a message and we'll get back to you.</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="demo-name">Name *</Label>
                            <Input id="demo-name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="demo-email">Email *</Label>
                            <Input
                                id="demo-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="demo-subject">Subject *</Label>
                        <Input
                            id="demo-subject"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            placeholder="What's this about?"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="demo-message">Message *</Label>
                        <Textarea
                            id="demo-message"
                            rows={4}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Tell us more about your project or question..."
                        />
                    </div>
                    <LoadingButton type="submit" isLoading={processing} loadingText="Sending..." className="w-full">
                        Send Message
                    </LoadingButton>
                </form>
            </CardContent>
        </Card>
    );
};

const componentDocs: Record<string, ComponentDoc> = {
    Button: {
        name: 'Button',
        description: 'Primary action button used throughout the app for CTAs, navigation, and forms',
        category: 'Core UI',
        examples: [
            {
                title: 'Hero Call-to-Action (Home Page)',
                description: 'Primary CTA button as used on the home page hero section',
                code: `<Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
  Get Started Today
</Button>`,
                component: (
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        Get Started Today
                    </Button>
                ),
            },
            {
                title: 'Navigation Link (About Page)',
                description: 'Ghost button used for secondary navigation',
                code: `<Button variant="ghost" asChild>
  <Link href="/contact">Contact Us</Link>
</Button>`,
                component: (
                    <Button variant="ghost" asChild>
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                ),
            },
        ],
        props: [
            {
                name: 'variant',
                type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
                defaultValue: 'default',
                description: 'Visual style - use default for primary actions, ghost for secondary',
            },
            {
                name: 'size',
                type: "'default' | 'sm' | 'lg' | 'icon'",
                defaultValue: 'default',
                description: 'Button size - lg for hero CTAs, default for forms',
            },
            {
                name: 'asChild',
                type: 'boolean',
                defaultValue: 'false',
                description: 'Use with Link components for navigation buttons',
            },
        ],
    },
    Card: {
        name: 'Card',
        description: 'Container component used for feature cards, team members, and content sections',
        category: 'Layout',
        examples: [
            {
                title: 'Feature Card (Home Page)',
                description: 'Card structure used for feature highlights on homepage',
                code: `<Card className="p-6 h-full transition-all duration-300 hover:shadow-lg border-gray-200">
  <CardHeader className="pb-4">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <CardTitle>Lightning Fast</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription>
      Built with Vite and optimized for performance. Pages load instantly with hot module replacement in development.
    </CardDescription>
  </CardContent>
</Card>`,
                component: (
                    <Card className="h-full max-w-sm border-gray-200 p-6 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="pb-4">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <CardTitle>Lightning Fast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Built with Vite and optimized for performance. Pages load instantly with hot module replacement in development.
                            </CardDescription>
                        </CardContent>
                    </Card>
                ),
            },
            {
                title: 'Team Member Card (About Page)',
                description: 'Card layout used for team member profiles',
                code: `<Card className="text-center">
  <CardContent className="pt-6">
    <Avatar
      src="/images/team/alex-thompson.svg"
      alt="Alex Thompson"
      className="w-24 h-24 mx-auto mb-4"
    />
    <CardTitle className="text-xl">Alex Thompson</CardTitle>
    <CardDescription className="text-gray-600 mb-2">Lead Developer</CardDescription>
    <p className="text-sm text-gray-500">10+ years of Laravel expertise</p>
  </CardContent>
</Card>`,
                component: (
                    <Card className="max-w-xs text-center">
                        <CardContent className="pt-6">
                            <Avatar src="/images/team/alex-thompson.svg" alt="Alex Thompson" className="mx-auto mb-4 h-24 w-24" />
                            <CardTitle className="text-xl">Alex Thompson</CardTitle>
                            <CardDescription className="mb-2 text-gray-600">Lead Developer</CardDescription>
                            <p className="text-sm text-gray-500">10+ years of Laravel expertise</p>
                        </CardContent>
                    </Card>
                ),
            },
        ],
        props: [
            {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes - use p-6 for content cards, add hover effects for interactive cards',
            },
        ],
    },
    ContactForm: {
        name: 'Contact Form',
        description: 'Complete contact form implementation with validation and loading states',
        category: 'Forms',
        examples: [
            {
                title: 'Full Contact Form (Contact Page)',
                description: 'Working contact form with validation as used on the contact page',
                code: `const ContactFormExample = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '', email: '', subject: '', message: ''
  });

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
        <CardDescription>We'll get back to you within 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={data.subject}
            onChange={(e) => setData('subject', e.target.value)}
            className={errors.subject ? 'border-red-500' : ''}
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            rows={4}
            value={data.message}
            onChange={(e) => setData('message', e.target.value)}
            className={errors.message ? 'border-red-500' : ''}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
        <LoadingButton
          loading={processing}
          loadingText="Sending..."
          onClick={() => post('/contact')}
          className="w-full"
        >
          Send Message
        </LoadingButton>
      </CardContent>
    </Card>
  );
};`,
                component: <ContactFormDemo />,
            },
        ],
        props: [
            {
                name: 'useForm',
                type: 'Inertia hook',
                description: 'Inertia.js form helper with validation and processing state',
            },
        ],
    },
    ResponsiveImage: {
        name: 'ResponsiveImage & Avatar',
        description: 'Optimized image components with lazy loading, WebP support, and responsive sizing',
        category: 'Media',
        examples: [
            {
                title: 'Hero Background (Home/Contact Pages)',
                description: 'Large background images with priority loading',
                code: `<ResponsiveImage
  src="/images/placeholders/hero-bg.svg"
  alt="Hero background"
  aspectRatio="video"
  priority={true}
  className="absolute inset-0 w-full h-full object-cover"
/>`,
                component: (
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                        <ResponsiveImage
                            src="/images/placeholders/hero-bg.svg"
                            alt="Hero background"
                            aspectRatio="video"
                            priority={true}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                ),
            },
            {
                title: 'Team Member Avatar (About Page)',
                description: 'Circular avatar images with fallback to initials',
                code: `<Avatar
  src="/images/team/sarah-kim.svg"
  alt="Sarah Chen"
  fallback="SC"
  className="w-16 h-16"
/>`,
                component: <Avatar src="/images/team/sarah-kim.svg" alt="Sarah Chen" fallback="SC" className="h-16 w-16" />,
            },
        ],
        props: [
            {
                name: 'src',
                type: 'string',
                required: true,
                description: 'Image source URL - use /images/ path for public images',
            },
            {
                name: 'alt',
                type: 'string',
                required: true,
                description: 'Alt text for accessibility - describe the image content',
            },
            {
                name: 'priority',
                type: 'boolean',
                defaultValue: 'false',
                description: 'Set true for above-the-fold images to disable lazy loading',
            },
            {
                name: 'aspectRatio',
                type: "'square' | 'video' | 'wide' | 'portrait'",
                description: 'Constrains image proportions - video (16:9) for heroes, square for avatars',
            },
        ],
    },
    Alert: {
        name: 'Alert',
        description: 'Feedback component for form validation errors and success messages',
        category: 'Feedback',
        examples: [
            {
                title: 'Form Error (Contact Page)',
                description: 'Error alert shown when form submission fails',
                code: `<Alert variant="destructive">
  <AlertDescription>
    Failed to send message. Please check your connection and try again.
  </AlertDescription>
</Alert>`,
                component: (
                    <Alert variant="destructive" className="max-w-md">
                        <AlertDescription>Failed to send message. Please check your connection and try again.</AlertDescription>
                    </Alert>
                ),
            },
            {
                title: 'Success Message',
                description: 'Success feedback after successful form submission',
                code: `<Alert className="border-green-200 bg-green-50">
  <AlertDescription className="text-green-800">
    Message sent successfully! We'll get back to you within 24 hours.
  </AlertDescription>
</Alert>`,
                component: (
                    <Alert className="max-w-md border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">
                            Message sent successfully! We'll get back to you within 24 hours.
                        </AlertDescription>
                    </Alert>
                ),
            },
        ],
        props: [
            {
                name: 'variant',
                type: "'default' | 'destructive'",
                defaultValue: 'default',
                description: 'Use destructive for errors, default with custom classes for success',
            },
        ],
    },
};

/**
 * ComponentBrowser - Interactive component documentation browser
 */
export const ComponentBrowser: React.FC<ComponentBrowserProps> = ({ initialComponent = 'Button', showSidebar = true, className = '' }) => {
    const [selectedComponent, setSelectedComponent] = useState(initialComponent);
    const [activeTab, setActiveTab] = useState<'examples' | 'props'>('examples');

    const componentNames = Object.keys(componentDocs);
    const selectedDoc = componentDocs[selectedComponent];

    return (
        <div className={`flex gap-6 ${className}`}>
            {/* Sidebar */}
            {showSidebar && (
                <div className="w-64 space-y-4">
                    <div>
                        <h3 className="mb-3 text-sm font-medium text-gray-700">Components</h3>
                        <div className="space-y-1">
                            {componentNames.map((componentName) => {
                                const doc = componentDocs[componentName];
                                return (
                                    <button
                                        key={componentName}
                                        onClick={() => setSelectedComponent(componentName)}
                                        className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                                            selectedComponent === componentName ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{componentName}</span>
                                            <span
                                                className={`rounded px-1.5 py-0.5 text-xs ${
                                                    selectedComponent === componentName ? 'bg-blue-500 text-blue-100' : 'bg-green-100 text-green-700'
                                                }`}
                                            >
                                                stable
                                            </span>
                                        </div>
                                        <div className={`mt-1 text-xs ${selectedComponent === componentName ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {doc.category}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="min-w-0 flex-1">
                {selectedDoc ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold">{selectedDoc.name}</h2>
                                <span className="rounded-md border border-green-300 bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                    stable
                                </span>
                                <span className="rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                    {selectedDoc.category}
                                </span>
                            </div>
                            <p className="text-lg text-gray-600">{selectedDoc.description}</p>
                        </div>

                        {/* Navigation */}
                        <div className="flex space-x-1 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('examples')}
                                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTab === 'examples'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Examples ({selectedDoc.examples.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('props')}
                                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTab === 'props' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Props ({selectedDoc.props.length})
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {activeTab === 'examples' && (
                                <div className="space-y-6">
                                    {selectedDoc.examples.map((example, index) => (
                                        <ExampleRenderer key={index} example={example} />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'props' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Properties</h3>
                                    <div className="space-y-3">
                                        {selectedDoc.props.map((prop, index) => (
                                            <PropRenderer key={index} prop={prop} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Component Not Found</h2>
                        <p className="mt-2 text-gray-600">The component "{selectedComponent}" could not be found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ExampleRendererProps {
    example: {
        title: string;
        description: string;
        code: string;
        component: React.ReactNode;
    };
}

const ExampleRenderer: React.FC<ExampleRendererProps> = ({ example }) => {
    const [showCode, setShowCode] = useState(false);

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div>
                    <h4 className="text-lg font-semibold">{example.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{example.description}</p>
                </div>

                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                    <div className="flex min-h-[60px] items-center justify-center">{example.component}</div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">Code</h5>
                        <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
                            {showCode ? 'Hide' : 'Show'} Code
                        </Button>
                    </div>

                    {showCode && (
                        <pre className="overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
                            <code>{example.code}</code>
                        </pre>
                    )}
                </div>
            </div>
        </Card>
    );
};

interface PropRendererProps {
    prop: {
        name: string;
        type: string;
        required?: boolean;
        defaultValue?: string;
        description: string;
    };
}

const PropRenderer: React.FC<PropRendererProps> = ({ prop }) => {
    return (
        <Card className="p-4">
            <div className="space-y-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <code className="font-mono text-sm font-semibold text-blue-600">{prop.name}</code>
                        {prop.required && <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">required</span>}
                    </div>
                    <code className="font-mono text-xs text-gray-500">{prop.type}</code>
                </div>

                <p className="text-sm text-gray-700">{prop.description}</p>

                {prop.defaultValue && (
                    <div className="text-xs text-gray-500">
                        Default: <code className="font-mono">{prop.defaultValue}</code>
                    </div>
                )}
            </div>
        </Card>
    );
};

/**
 * ComponentQuickReference - Quick reference overview with practical usage info
 */
export const ComponentQuickReference: React.FC = () => {
    const categories = {
        'Core UI': ['Button', 'Card'],
        Forms: ['ContactForm'],
        Media: ['ResponsiveImage'],
        Feedback: ['Alert'],
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold">Component Quick Reference</h2>
                <p className="mx-auto max-w-3xl text-lg text-gray-600">
                    Quick reference guide with essential props and usage patterns for all components used in iwlaravel12 pages
                </p>
            </div>

            {Object.entries(categories).map(([category, componentNames]) => (
                <div key={category} className="space-y-4">
                    <h3 className="border-b border-gray-200 pb-2 text-xl font-semibold">{category}</h3>
                    <div className="grid gap-4">
                        {componentNames.map((componentName) => {
                            const doc = componentDocs[componentName];
                            if (!doc) return null;

                            return (
                                <Card key={componentName} className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-lg font-semibold">{doc.name}</h4>
                                                <p className="text-gray-600">{doc.description}</p>
                                            </div>
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">{doc.category}</span>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            {/* Essential Props */}
                                            <div>
                                                <h5 className="mb-2 font-medium">Essential Props</h5>
                                                <div className="space-y-2">
                                                    {doc.props.slice(0, 3).map((prop) => (
                                                        <div key={prop.name} className="text-sm">
                                                            <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                                                                {prop.name}: {prop.type}
                                                            </code>
                                                            {prop.required && <span className="ml-1 text-xs text-red-500">*</span>}
                                                            <div className="mt-1 text-xs text-gray-600">{prop.description}</div>
                                                        </div>
                                                    ))}
                                                    {doc.props.length > 3 && (
                                                        <div className="text-xs text-gray-500">+{doc.props.length - 3} more props...</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quick Usage */}
                                            <div>
                                                <h5 className="mb-2 font-medium">Quick Usage</h5>
                                                <div className="rounded bg-gray-50 p-3 text-xs">
                                                    <pre className="whitespace-pre-wrap">
                                                        {doc.examples[0]?.code.split('\n').slice(0, 4).join('\n')}
                                                        {doc.examples[0]?.code.split('\n').length > 4 && '\n...'}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            Used in:{' '}
                                            {doc.examples.map((ex) => ex.title.split('(')[1]?.replace(')', '') || 'Multiple pages').join(', ')}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            ))}

            <Card className="border-blue-200 bg-blue-50 p-6">
                <div className="space-y-2 text-center">
                    <h4 className="font-semibold text-blue-900">Need More Details?</h4>
                    <p className="text-sm text-blue-700">
                        Switch to "Interactive Browser" mode above for live examples, complete prop lists, and detailed documentation.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ComponentBrowser;
