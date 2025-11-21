import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, MousePointer2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function StatsPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link) {
        notFound();
    }

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${link.code}`;

    return (
        <div className="container mx-auto flex flex-col gap-8 px-4 py-12">
            <div>
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    Link Statistics
                </h1>
                <p className="mt-2 text-muted-foreground">Detailed analytics for your short link.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Link Details</CardTitle>
                        <CardDescription>Information about your link</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-xs uppercase text-muted-foreground">Short Link</label>
                            <div className="mt-1 flex items-center gap-2 font-medium">
                                <LinkIcon className="h-4 w-4" />
                                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {shortUrl}
                                </a>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase text-muted-foreground">Original URL</label>
                            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                <ExternalLink className="h-4 w-4" />
                                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                    {link.originalUrl}
                                </a>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase text-muted-foreground">Created At</label>
                            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(link.createdAt)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                        <CardDescription>Click tracking metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-full flex-col justify-center gap-8">
                            <div className="text-center">
                                <div className="text-5xl font-bold">{link.clicks}</div>
                                <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
                                    <MousePointer2 className="h-4 w-4" /> Total Clicks
                                </div>
                            </div>
                            <div className="border-t pt-6 text-center">
                                <div className="text-sm text-muted-foreground">Last Clicked</div>
                                <div className="mt-1 text-lg font-medium">
                                    {formatDateTime(link.lastClicked)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
