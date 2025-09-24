import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOMetaData, getSiteInfo } from '@/types/seo';

interface SEOPreviewProps {
    seo: SEOMetaData;
}

export default function SEOPreview({ seo }: SEOPreviewProps) {
    const siteInfo = getSiteInfo();

    const googlePreview = (
        <Card className="w-full max-w-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-blue-600">{seo.canonical || siteInfo.url}</CardTitle>
                <CardDescription className="cursor-pointer text-lg font-medium text-blue-800 hover:underline">{seo.title}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <p className="line-clamp-2 text-sm text-gray-600">{seo.description}</p>
            </CardContent>
        </Card>
    );

    const facebookPreview = (
        <Card className="w-full max-w-md">
            <div className="flex aspect-video items-center justify-center bg-gray-100">
                {seo.ogImage ? (
                    <img src={seo.ogImage} alt={seo.ogImageAlt || seo.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="text-sm text-gray-400">No image</div>
                )}
            </div>
            <CardContent className="p-3">
                <p className="text-xs text-gray-500 uppercase">{new URL(seo.ogUrl || siteInfo.url).hostname}</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{seo.ogTitle || seo.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">{seo.ogDescription || seo.description}</p>
            </CardContent>
        </Card>
    );

    const twitterPreview = (
        <Card className="w-full max-w-md border border-gray-200">
            <div className="flex aspect-video items-center justify-center bg-gray-100">
                {seo.twitterImage ? (
                    <img src={seo.twitterImage} alt={seo.twitterImageAlt || seo.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="text-sm text-gray-400">No image</div>
                )}
            </div>
            <CardContent className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold">{seo.twitterTitle || seo.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">{seo.twitterDescription || seo.description}</p>
                <p className="mt-2 text-xs text-gray-400">{new URL(seo.ogUrl || siteInfo.url).hostname}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-lg font-semibold">Google Search Preview</h3>
                {googlePreview}
            </div>

            <div>
                <h3 className="mb-2 text-lg font-semibold">Facebook Share Preview</h3>
                {facebookPreview}
            </div>

            <div>
                <h3 className="mb-2 text-lg font-semibold">Twitter Card Preview</h3>
                {twitterPreview}
            </div>
        </div>
    );
}
