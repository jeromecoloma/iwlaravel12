import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useState } from 'react';

export interface ComponentDocProps {
    /** The name of the component being documented */
    name: string;
    /** Brief description of the component's purpose */
    description: string;
    /** Array of component properties with descriptions */
    props?: PropDocumentation[];
    /** Usage examples with code snippets */
    examples?: ExampleDocumentation[];
    /** Additional notes or warnings */
    notes?: string[];
    /** Version when component was added */
    version?: string;
    /** Whether component is stable or experimental */
    stability?: 'stable' | 'experimental' | 'deprecated';
    /** Component category for organization */
    category?: string;
    /** Tags for searchability */
    tags?: string[];
}

export interface PropDocumentation {
    /** Property name */
    name: string;
    /** TypeScript type */
    type: string;
    /** Whether the property is required */
    required?: boolean;
    /** Default value if optional */
    defaultValue?: string;
    /** Description of what this property does */
    description: string;
    /** Example values */
    examples?: string[];
}

export interface ExampleDocumentation {
    /** Title of the example */
    title: string;
    /** Description of what this example demonstrates */
    description: string;
    /** Code snippet as string */
    code: string;
    /** Live component to render (optional) */
    component?: React.ReactNode;
    /** Whether to show the rendered component */
    showComponent?: boolean;
}

/**
 * ComponentDoc - Documentation component for displaying component usage and examples
 *
 * This component provides a standardized way to document React components with:
 * - Property documentation with types and descriptions
 * - Live usage examples with code snippets
 * - Component stability indicators
 * - Interactive code examples
 *
 * @example
 * ```tsx
 * <ComponentDoc
 *   name="Button"
 *   description="A customizable button component with various styles and sizes"
 *   props={[
 *     {
 *       name: "variant",
 *       type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
 *       defaultValue: "default",
 *       description: "The visual style variant of the button"
 *     }
 *   ]}
 *   examples={[
 *     {
 *       title: "Basic Usage",
 *       description: "A simple button with default styling",
 *       code: `<Button>Click me</Button>`,
 *       component: <Button>Click me</Button>
 *     }
 *   ]}
 * />
 * ```
 */
export const ComponentDoc: React.FC<ComponentDocProps> = ({
    name,
    description,
    props = [],
    examples = [],
    notes = [],
    version,
    stability = 'stable',
}) => {
    const [activeTab, setActiveTab] = useState<'props' | 'examples' | 'notes'>('examples');

    const stabilityColors = {
        stable: 'bg-green-100 text-green-800 border-green-300',
        experimental: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        deprecated: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <span className={`rounded-md border px-2 py-1 text-xs font-medium ${stabilityColors[stability]}`}>{stability}</span>
                    {version && (
                        <span className="rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">v{version}</span>
                    )}
                </div>
                <p className="text-lg text-gray-600">{description}</p>
            </div>

            {/* Navigation */}
            <div className="flex space-x-1 border-b border-gray-200">
                {examples.length > 0 && (
                    <button
                        onClick={() => setActiveTab('examples')}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'examples' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Examples ({examples.length})
                    </button>
                )}
                {props.length > 0 && (
                    <button
                        onClick={() => setActiveTab('props')}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'props' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Props ({props.length})
                    </button>
                )}
                {notes.length > 0 && (
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'notes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Notes ({notes.length})
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'examples' && (
                    <div className="space-y-6">
                        {examples.map((example, index) => (
                            <ExampleRenderer key={index} example={example} />
                        ))}
                    </div>
                )}

                {activeTab === 'props' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Properties</h3>
                        <div className="space-y-3">
                            {props.map((prop, index) => (
                                <PropRenderer key={index} prop={prop} />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Notes & Guidelines</h3>
                        <div className="space-y-2">
                            {notes.map((note, index) => (
                                <div key={index} className="rounded-md border border-blue-200 bg-blue-50 p-3">
                                    <p className="text-sm text-blue-800">{note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ExampleRendererProps {
    example: ExampleDocumentation;
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

                {example.component && example.showComponent !== false && (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                        <div className="flex min-h-[60px] items-center justify-center">{example.component}</div>
                    </div>
                )}

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
    prop: PropDocumentation;
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

                {prop.examples && prop.examples.length > 0 && (
                    <div className="text-xs text-gray-500">
                        Examples:{' '}
                        {prop.examples.map((example, index) => (
                            <code key={index} className="font-mono">
                                {example}
                                {index < prop.examples!.length - 1 ? ', ' : ''}
                            </code>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ComponentDoc;
