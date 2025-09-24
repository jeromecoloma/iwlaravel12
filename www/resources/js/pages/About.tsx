import MainLayout from '@/Layouts/MainLayout';
import LoadingContainer, { useLoadingState } from '@/components/LoadingContainer';
import ToastDemo from '@/components/ToastDemo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardPlaceholder, ListItemPlaceholder, StatsPlaceholder } from '@/components/ui/content-placeholders';
import { Avatar } from '@/components/ui/responsive-image';
import { generateStructuredData } from '@/hooks/useSEO';
import { Link } from '@inertiajs/react';
import React from 'react';

export default function About() {
    // Demonstration of loading states
    const [showLoadingDemo, setShowLoadingDemo] = React.useState(false);
    const { isLoading: statsLoading, setIsLoading: setStatsLoading } = useLoadingState(false);
    const { isLoading: teamLoading, setIsLoading: setTeamLoading } = useLoadingState(false);
    const team = [
        {
            name: 'Alex Thompson',
            role: 'Lead Developer',
            bio: 'Full-stack developer with 8+ years of experience in Laravel and React. Passionate about clean code and developer experience.',
            avatar: 'AT',
            image: '/images/team/alex-thompson.svg',
            skills: ['Laravel', 'React', 'TypeScript', 'DevOps'],
        },
        {
            name: 'Sarah Kim',
            role: 'Frontend Architect',
            bio: 'Frontend specialist focusing on modern React patterns and accessible UI components. Expert in performance optimization.',
            avatar: 'SK',
            image: '/images/team/sarah-kim.svg',
            skills: ['React', 'TypeScript', 'UI/UX', 'Performance'],
        },
        {
            name: 'Marcus Johnson',
            role: 'Backend Engineer',
            bio: 'Laravel expert with deep knowledge of database optimization and API design. Enjoys solving complex architectural challenges.',
            avatar: 'MJ',
            image: '/images/team/marcus-johnson.svg',
            skills: ['Laravel', 'PHP', 'Database', 'APIs'],
        },
    ];

    const values = [
        {
            title: 'Developer Experience First',
            description: 'We prioritize tools and patterns that make developers more productive and happy.',
            icon: (
                <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.311-.06m0 0a5.99 5.99 0 013.528-.17 8.376 8.376 0 01-.17-3.528m0 0a6.04 6.04 0 01-3.527.17 8.378 8.378 0 00.17 3.527m0 0c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.311-.06m0 0a5.99 5.99 0 013.528-.17 8.376 8.376 0 01-.17-3.528m0 0a6.04 6.04 0 01-3.527.17 8.378 8.378 0 00.17 3.527"
                    />
                </svg>
            ),
        },
        {
            title: 'Modern Standards',
            description: 'Built with the latest versions and best practices for long-term maintainability.',
            icon: (
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Production Ready',
            description: 'Not just a demo - this template is designed for real-world applications.',
            icon: (
                <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                </svg>
            ),
        },
        {
            title: 'Community Driven',
            description: 'Open source with contributions welcome from developers worldwide.',
            icon: (
                <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                </svg>
            ),
        },
    ];

    const technologies = [
        { name: 'Laravel 12', category: 'Backend Framework' },
        { name: 'React 19', category: 'Frontend Library' },
        { name: 'Inertia.js v2', category: 'Full-stack Framework' },
        { name: 'shadcn/ui', category: 'UI Components' },
        { name: 'Tailwind CSS v4', category: 'Styling' },
        { name: 'TypeScript', category: 'Type Safety' },
        { name: 'Vite', category: 'Build Tool' },
        { name: 'Pest 4', category: 'Testing Framework' },
    ];

    // SEO configuration for About page
    const aboutSEO = {
        title: 'About Us',
        description: 'Learn about the team behind iwlaravel12 starter template and our mission to provide the best Laravel development experience.',
        keywords: ['Team', 'Mission', 'Laravel Development', 'Modern Web Development', 'Open Source'],
        ogImage: '/images/og-about.jpg',
        ogImageAlt: 'About iwlaravel12 Team',
        ogType: 'website' as const,
    };

    // Structured data for team members
    const teamStructuredData = generateStructuredData('Organization', {
        name: 'iwlaravel12 Team',
        description: 'The team behind the iwlaravel12 starter template',
        employee: team.map((member) => ({
            '@type': 'Person',
            name: member.name,
            jobTitle: member.role,
            description: member.bio,
            worksFor: {
                '@type': 'Organization',
                name: 'iwlaravel12',
            },
        })),
    });

    return (
        <MainLayout seo={aboutSEO} structuredData={[teamStructuredData]}>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-white to-gray-50 py-20 dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">About iwlaravel12</h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                            We're a team of experienced developers passionate about creating tools that make web development faster, more enjoyable,
                            and more productive.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-white py-24 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Our Mission</h2>
                        </div>

                        <Card className="mb-12">
                            <CardContent className="pt-8">
                                <blockquote className="text-center text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                                    "To provide developers with a solid, modern foundation for Laravel applications that eliminates the repetitive
                                    setup work and lets you focus on building unique features that matter to your users."
                                </blockquote>
                            </CardContent>
                        </Card>

                        <div className="prose prose-lg dark:prose-invert mx-auto">
                            <p>
                                Every new Laravel project starts with the same fundamental decisions: How should we structure our frontend? Which UI
                                library should we use? How do we handle forms and validation? What's the best way to set up our development
                                environment?
                            </p>
                            <p>
                                Instead of making these decisions from scratch every time, iwlaravel12 provides opinionated answers based on industry
                                best practices and real-world experience. We've carefully selected and configured a modern stack that works
                                beautifully together.
                            </p>
                            <p>
                                This template isn't just about saving time—it's about starting your project with confidence, knowing that your
                                foundation is solid, scalable, and maintainable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-50 py-24 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Our Values</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">The principles that guide our development decisions</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {values.map((value, index) => (
                            <Card key={index} className="bg-white dark:bg-gray-900">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        {value.icon}
                                        <CardTitle className="text-xl">{value.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{value.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-white py-24 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Meet the Team</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">The developers behind iwlaravel12</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {team.map((member, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <div className="flex flex-col items-center">
                                        <div className="mb-4">
                                            <Avatar src={member.image} alt={member.name} size={96} fallback={member.avatar} className="shadow-lg" />
                                        </div>
                                        <CardTitle className="text-xl">{member.name}</CardTitle>
                                        <CardDescription className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                                            {member.role}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-gray-600 dark:text-gray-400">{member.bio}</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {member.skills.map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="bg-gray-50 py-24 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Technology Stack</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Carefully selected tools for modern web development</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {technologies.map((tech, index) => (
                            <Card key={index} className="p-4 text-center">
                                <CardContent className="pt-2">
                                    <div className="font-semibold text-gray-900 dark:text-white">{tech.name}</div>
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tech.category}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Loading States Demo Section */}
            <section className="border-t border-gray-200 bg-white py-24 dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Loading States Demo</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Experience our smooth loading placeholders and navigation transitions
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Demo Controls */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                onClick={() => {
                                    setStatsLoading(true);
                                    setTimeout(() => setStatsLoading(false), 3000);
                                }}
                                variant={statsLoading ? 'secondary' : 'outline'}
                                disabled={statsLoading}
                            >
                                {statsLoading ? 'Loading Stats...' : 'Demo Stats Loading'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setTeamLoading(true);
                                    setTimeout(() => setTeamLoading(false), 3000);
                                }}
                                variant={teamLoading ? 'secondary' : 'outline'}
                                disabled={teamLoading}
                            >
                                {teamLoading ? 'Loading Team...' : 'Demo Team Loading'}
                            </Button>
                            <Button onClick={() => setShowLoadingDemo(!showLoadingDemo)} variant={showLoadingDemo ? 'secondary' : 'outline'}>
                                {showLoadingDemo ? 'Hide' : 'Show'} Loading Examples
                            </Button>
                        </div>

                        {/* Stats Loading Demo */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Statistics Loading State</h3>
                            <LoadingContainer isLoading={statsLoading} placeholder="dashboard" className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div className="rounded-lg border bg-white p-6 text-center dark:bg-gray-900">
                                        <div className="text-3xl font-bold text-blue-600">150+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Components</div>
                                    </div>
                                    <div className="rounded-lg border bg-white p-6 text-center dark:bg-gray-900">
                                        <div className="text-3xl font-bold text-green-600">98%</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Test Coverage</div>
                                    </div>
                                    <div className="rounded-lg border bg-white p-6 text-center dark:bg-gray-900">
                                        <div className="text-3xl font-bold text-purple-600">5s</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Load Time</div>
                                    </div>
                                </div>
                            </LoadingContainer>
                        </div>

                        {/* Team Loading Demo */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Team Cards Loading State</h3>
                            <LoadingContainer
                                isLoading={teamLoading}
                                placeholder="card"
                                placeholderProps={{ showAvatar: true }}
                                className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800"
                            >
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    {team.slice(0, 3).map((member, index) => (
                                        <Card key={index} className="text-center">
                                            <CardContent className="pt-6">
                                                <Avatar
                                                    src={member.image}
                                                    alt={member.name}
                                                    size={64}
                                                    fallback={member.avatar}
                                                    className="mx-auto mb-4"
                                                />
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </LoadingContainer>
                        </div>

                        {/* Placeholder Examples */}
                        {showLoadingDemo && (
                            <div className="animate-in space-y-6 duration-500 fade-in">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Available Loading Placeholders</h3>
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    <div>
                                        <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Card Placeholder</h4>
                                        <CardPlaceholder showImage showAvatar />
                                    </div>
                                    <div>
                                        <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Stats Placeholder</h4>
                                        <StatsPlaceholder count={2} />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <h4 className="mb-3 font-medium text-gray-900 dark:text-white">List Items Placeholder</h4>
                                        <div className="space-y-2">
                                            <ListItemPlaceholder showAvatar />
                                            <ListItemPlaceholder showAvatar />
                                            <ListItemPlaceholder showAvatar />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="bg-gray-50 py-16 sm:py-24 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Interactive Component Demo</h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                            Experience our comprehensive component system in action. Try out the toast notification system and other interactive
                            features.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <ToastDemo />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 py-24 dark:bg-indigo-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Get Started?</h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
                            Join the community of developers using iwlaravel12 to build amazing applications.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/contact">
                                <Button variant="secondary" size="lg" className="px-8 py-3 text-base">
                                    Contact Us
                                </Button>
                            </Link>
                            <Link href="/#features">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white bg-transparent px-8 py-3 text-base text-white transition-colors hover:border-white hover:bg-white hover:text-indigo-600"
                                >
                                    View Features
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
