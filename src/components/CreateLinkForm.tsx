'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export function CreateLinkForm() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, code: customCode || undefined }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccess(true);
            setUrl('');
            setCustomCode('');
            router.refresh();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass-card w-full max-w-2xl">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <Input
                            type="url"
                            placeholder="Enter your long URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="glass-strong h-12"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Input
                            type="text"
                            placeholder="Custom alias (opt)"
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value)}
                            pattern="[a-zA-Z0-9-_]+"
                            title="Only letters, numbers, hyphens, and underscores allowed"
                            className="glass-strong h-12"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 px-8 font-semibold"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Shorten <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                </form>

                {error && (
                    <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 rounded-md bg-green-100 p-3 text-sm text-green-700">
                        Link created successfully!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
