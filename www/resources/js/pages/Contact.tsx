import MainLayout from '@/Layouts/MainLayout';
import { LoadingButton } from '@/components/LoadingStates/FormLoadingStates';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AsyncErrorBoundary } from '@/components/ui/async-error-boundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { ValidatedInput, ValidatedTextarea, ValidationErrors } from '@/components/ui/validation-errors';
import { useNetworkError } from '@/hooks/useNetworkError';
import { generateStructuredData } from '@/hooks/useSEO';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@inertiajs/react';
import React from 'react';

export default function Contact() {
    const { data, setData, post, processing, errors, wasSuccessful, reset, setError, clearErrors } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const toast = useToast();
    const networkError = useNetworkError({
        maxRetries: 3,
        retryDelay: 2000,
        exponentialBackoff: true,
        showToastOnError: true,
        autoRetryOnReconnect: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation to prevent empty form submission
        const validationErrors: Record<string, string> = {};

        if (!data.name.trim()) {
            validationErrors.name = 'Name is required';
        }

        if (!data.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        if (!data.subject.trim()) {
            validationErrors.subject = 'Subject is required';
        } else if (data.subject.trim().length < 5) {
            validationErrors.subject = 'Subject must be at least 5 characters long';
        }

        if (!data.message.trim()) {
            validationErrors.message = 'Message is required';
        } else if (data.message.trim().length < 10) {
            validationErrors.message = 'Message must be at least 10 characters long';
        }

        // If there are validation errors, show them and prevent submission
        if (Object.keys(validationErrors).length > 0) {
            // Clear any existing errors first, then set the new ones
            clearErrors();
            setError(validationErrors);
            return;
        }

        post('/contact', {
            onSuccess: () => {
                reset();
                toast.success('Message sent successfully!', {
                    duration: 5000,
                    action: {
                        label: 'Close',
                        onClick: () => {},
                    },
                });
            },
            onError: (errors) => {
                const hasValidationErrors = Object.keys(errors).length > 0;
                if (hasValidationErrors) {
                    toast.error('Please fix the errors in the form', {
                        duration: 6000,
                    });
                } else {
                    // This might be a network error - add to retry queue
                    networkError.handleNetworkError(new Error('Failed to send contact form'), {
                        url: '/contact',
                        method: 'POST',
                        data: data,
                        options: {
                            onSuccess: () => {
                                reset();
                                toast.success('Message sent successfully!', {
                                    duration: 5000,
                                    action: {
                                        label: 'Close',
                                        onClick: () => {},
                                    },
                                });
                            },
                        },
                    });
                }
            },
        });
    };

    // Clear field-specific errors when user starts typing
    const handleFieldChange = (field: keyof typeof data, value: string) => {
        setData(field, value);
        // Clear the error for this specific field if it exists
        if (errors[field]) {
            clearErrors(field);
        }
    };

    const contactInfo = [
        {
            title: 'Email',
            value: 'hello@iwlaravel12.com',
            icon: (
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                </svg>
            ),
        },
        {
            title: 'Phone',
            value: '+1 (555) 123-4567',
            icon: (
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                </svg>
            ),
        },
        {
            title: 'Address',
            value: '123 Laravel Street\nFramework City, FC 12345',
            icon: (
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"
                    />
                </svg>
            ),
        },
        {
            title: 'Response Time',
            value: '24 hours on business days',
            icon: (
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const faqs = [
        {
            question: 'Can I use this template for commercial projects?',
            answer: 'Yes! iwlaravel12 is open source and can be used for both personal and commercial projects without restrictions.',
        },
        {
            question: 'Do you provide custom development services?',
            answer: 'While we focus on maintaining the template, we can discuss custom development needs. Please reach out with your project requirements.',
        },
        {
            question: 'How often is the template updated?',
            answer: 'We regularly update the template to keep up with the latest versions of Laravel, React, and other dependencies. Major updates are released quarterly.',
        },
        {
            question: 'Is there a community or support forum?',
            answer: 'Yes! Join our GitHub discussions for community support, feature requests, and to share your projects built with iwlaravel12.',
        },
    ];

    // SEO configuration for Contact page
    const contactSEO = {
        title: 'Contact Us',
        description: "Get in touch with the iwlaravel12 team. We'd love to hear about your project and how we can help.",
        keywords: ['Contact', 'Support', 'Help', 'Laravel Development', 'Technical Support'],
        ogImage: '/images/og-contact.jpg',
        ogImageAlt: 'Contact iwlaravel12 Team',
        ogType: 'website' as const,
    };

    // Structured data for contact information
    const contactStructuredData = generateStructuredData('ContactPage', {
        mainEntity: {
            '@type': 'Organization',
            name: 'iwlaravel12',
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'hello@iwlaravel12.com',
                telephone: '+1 (555) 123-4567',
                availableLanguage: 'English',
            },
            address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Laravel Street',
                addressLocality: 'Framework City',
                addressRegion: 'FC',
                postalCode: '12345',
                addressCountry: 'US',
            },
        },
    });

    return (
        <MainLayout seo={contactSEO} structuredData={[contactStructuredData]}>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20" role="banner" aria-labelledby="contact-hero-title">
                <div className="absolute inset-0">
                    <ResponsiveImage
                        src="/images/placeholders/contact-bg.svg"
                        alt="Contact background with subtle geometric pattern"
                        className="h-full w-full object-cover"
                        priority
                        sizesConfig={{ default: '100vw' }}
                    />
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80" aria-hidden="true" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="text-center">
                        <h1 id="contact-hero-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                            Get in Touch
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                            Have questions about iwlaravel12? Need help with your project? We'd love to hear from you. Send us a message and we'll get
                            back to you as soon as possible.
                        </p>
                    </header>
                </div>
            </section>

            {/* Contact Form and Info */}
            <section className="bg-white py-24 dark:bg-gray-900" aria-labelledby="contact-section-title">
                <h2 id="contact-section-title" className="sr-only">
                    Contact form and information
                </h2>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* Contact Form */}
                        <section aria-labelledby="contact-form-title">
                            <Card>
                                <CardHeader>
                                    <CardTitle id="contact-form-title" className="text-2xl">
                                        Send us a message
                                    </CardTitle>
                                    <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {wasSuccessful && (
                                        <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                                            <AlertDescription className="text-green-800 dark:text-green-200">
                                                Thank you for your message! We'll get back to you soon.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <AsyncErrorBoundary
                                        onRetry={async () => {
                                            // Reset form errors and try again
                                            reset();
                                        }}
                                        maxRetries={3}
                                        fallbackMessage="The contact form encountered an error. Please try again."
                                    >
                                        <form id="contact-form" onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form" noValidate>
                                            {/* Comprehensive validation error display */}
                                            {Object.keys(errors).length > 0 && (
                                                <ValidationErrors
                                                    errors={errors}
                                                    title="Please correct the following errors to submit your message"
                                                    showDismiss={false}
                                                />
                                            )}

                                            <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Personal information">
                                                <legend className="sr-only">Personal information fields</legend>
                                                <ValidatedInput
                                                    label="Name"
                                                    name="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                                    error={errors.name}
                                                    required
                                                    placeholder="Your full name"
                                                    helpText="Enter your first and last name (letters, spaces, dots, hyphens, and apostrophes only)"
                                                    aria-label="Enter your full name"
                                                />

                                                <ValidatedInput
                                                    label="Email"
                                                    name="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                                    error={errors.email}
                                                    required
                                                    placeholder="your.email@example.com"
                                                    helpText="We'll use this to respond to your message"
                                                    aria-label="Enter your email address"
                                                />
                                            </fieldset>

                                            <ValidatedInput
                                                label="Subject"
                                                name="subject"
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) => handleFieldChange('subject', e.target.value)}
                                                error={errors.subject}
                                                required
                                                placeholder="What's this about?"
                                                helpText="Please provide a descriptive subject (at least 5 characters)"
                                                aria-label="Enter the subject of your message"
                                            />

                                            <ValidatedTextarea
                                                label="Message"
                                                name="message"
                                                value={data.message}
                                                onChange={(e) => handleFieldChange('message', e.target.value)}
                                                error={errors.message}
                                                required
                                                placeholder="Tell us more about your project or question..."
                                                rows={6}
                                                maxLength={5000}
                                                showCharCount={true}
                                                helpText="Please provide details about your inquiry (minimum 10 characters)"
                                                aria-label="Enter your message details"
                                            />

                                            <LoadingButton
                                                type="submit"
                                                isLoading={processing}
                                                loadingText="Sending..."
                                                className="w-full px-8 py-3 text-lg"
                                                aria-label="Submit contact form"
                                                aria-describedby="submit-help"
                                            >
                                                Send Message
                                            </LoadingButton>
                                            <p id="submit-help" className="sr-only">
                                                Submit the contact form to send your message. The form will be processed and you will receive a
                                                confirmation.
                                            </p>
                                        </form>
                                    </AsyncErrorBoundary>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Contact Information */}
                        <section className="space-y-8" aria-labelledby="contact-info-title">
                            <div>
                                <h2 id="contact-info-title" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                                    Contact Information
                                </h2>
                                <div className="space-y-6" role="list" aria-label="Contact methods">
                                    {contactInfo.map((info, index) => (
                                        <div key={index} className="flex items-start space-x-4" role="listitem">
                                            <div className="flex-shrink-0" aria-hidden="true">
                                                {info.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{info.title}</h3>
                                                <p className="mt-1 whitespace-pre-line text-gray-600 dark:text-gray-400">{info.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <div className="text-center">
                                            <svg
                                                className="mx-auto mb-2 h-12 w-12 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"
                                                />
                                            </svg>
                                            <p className="text-gray-500 dark:text-gray-400">Interactive map placeholder</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-50 py-24 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Frequently Asked Questions</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Quick answers to common questions about iwlaravel12</p>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 py-24 dark:bg-indigo-700" aria-labelledby="cta-title" role="region">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Still have questions?
                        </h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
                            Our team is here to help. Don't hesitate to reach out if you need assistance with your Laravel project or have suggestions
                            for improving iwlaravel12.
                        </p>
                        <div className="mt-10">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="px-8 py-3 text-base"
                                aria-label="Join our GitHub discussions for community support"
                            >
                                Join Our GitHub Discussions
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
