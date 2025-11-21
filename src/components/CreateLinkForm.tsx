'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Link as LinkIcon, ArrowRight } from 'lucide-react';

export function CreateLinkForm() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccess(`Link created! ${window.location.origin}/${data.code}`);
            setUrl('');
            setCode('');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Create a new link</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
                    <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium text-zinc-400">
                            Destination URL
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                            <input
                                id="url"
                                type="url"
                                placeholder="https://example.com/long-url"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-medium text-zinc-400">
                            Custom Code (Optional)
                        </label>
                        <input
                            id="code"
                            type="text"
                            placeholder="custom-alias"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 px-4 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            Shorten URL <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
