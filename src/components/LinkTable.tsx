'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, BarChart2, Trash2, Copy, Check } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface LinkItem {
    id: string;
    code: string;
    originalUrl: string;
    clicks: number;
    lastClicked: string | null;
    createdAt: string;
}

export function LinkTable({ links }: { links: LinkItem[] }) {
    const router = useRouter();
    const [copying, setCopying] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleCopy = async (code: string) => {
        const url = `${window.location.origin}/${code}`;
        await navigator.clipboard.writeText(url);
        setCopying(code);
        setTimeout(() => setCopying(null), 2000);
    };

    const handleDelete = async (code: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        setDeleting(code);
        try {
            const res = await fetch(`/api/links/${code}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to delete link', error);
        } finally {
            setDeleting(null);
        }
    };

    if (links.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-lg">
                <div className="mb-4 rounded-full bg-white/10 p-4">
                    <ExternalLink className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">No links yet</h3>
                <p className="mt-2 text-zinc-400">Create your first short link above to get started.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase text-zinc-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Short Link</th>
                            <th className="px-6 py-4 font-medium">Original URL</th>
                            <th className="px-6 py-4 font-medium text-center">Clicks</th>
                            <th className="px-6 py-4 font-medium">Last Clicked</th>
                            <th className="px-6 py-4 font-medium">Created</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {links.map((link) => (
                            <tr key={link.id} className="group transition-colors hover:bg-white/5">
                                <td className="px-6 py-4 font-medium text-white">
                                    <div className="flex items-center gap-2">
                                        <span className="text-indigo-400">/{link.code}</span>
                                        <button
                                            onClick={() => handleCopy(link.code)}
                                            className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white"
                                            title="Copy to clipboard"
                                        >
                                            {copying === link.code ? (
                                                <Check className="h-4 w-4 text-green-400" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                                <td className="max-w-[200px] px-6 py-4 text-zinc-400">
                                    <div className="truncate" title={link.originalUrl}>
                                        {link.originalUrl}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-zinc-300">
                                    <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium">
                                        {link.clicks}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {formatDate(link.lastClicked)}
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {formatDate(link.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/code/${link.code}`}
                                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                                            title="View Stats"
                                        >
                                            <BarChart2 className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(link.code)}
                                            disabled={deleting === link.code}
                                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                                            title="Delete Link"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
