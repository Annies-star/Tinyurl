import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, MousePointer2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

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
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-white">Link Statistics</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
                    <h2 className="mb-4 text-lg font-semibold text-white">Link Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase text-zinc-500">Short Link</label>
                            <div className="mt-1 flex items-center gap-2 text-indigo-400">
                                <LinkIcon className="h-4 w-4" />
                                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {shortUrl}
                                </a>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase text-zinc-500">Original URL</label>
                            <div className="mt-1 flex items-center gap-2 text-zinc-300">
                                <ExternalLink className="h-4 w-4" />
                                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                    {link.originalUrl}
                                </a>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase text-zinc-500">Created At</label>
                            <div className="mt-1 flex items-center gap-2 text-zinc-300">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(link.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
                    <h2 className="mb-4 text-lg font-semibold text-white">Performance</h2>
                    <div className="flex h-full flex-col justify-center gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white">{link.clicks}</div>
                            <div className="mt-2 flex items-center justify-center gap-2 text-zinc-400">
                                <MousePointer2 className="h-4 w-4" /> Total Clicks
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-6 text-center">
                            <div className="text-sm text-zinc-400">Last Clicked</div>
                            <div className="mt-1 text-lg font-medium text-white">
                                {formatDateTime(link.lastClicked)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
