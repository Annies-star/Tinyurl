'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, MousePointer2, Link as LinkIcon, ExternalLink, BarChart2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Mock data for the chart since we only track total clicks currently
const data = [
    { name: 'Mon', clicks: 0 },
    { name: 'Tue', clicks: 0 },
    { name: 'Wed', clicks: 0 },
    { name: 'Thu', clicks: 0 },
    { name: 'Fri', clicks: 0 },
    { name: 'Sat', clicks: 0 },
    { name: 'Sun', clicks: 0 },
];

// We need to make this a client component for Recharts, so we'll fetch data via props or context
// But for now, let's keep the server component structure and pass data to a client component wrapper
// Actually, let's make the whole page client-side for simplicity with Recharts, 
// or better: Server Component fetches data -> Client Component renders UI.

export default function StatsPageClient({ link }: { link: any }) {
    const shortUrl = `${window.location.origin}/${link.code}`;

    // Simple mock to show some activity if there are clicks
    const chartData = data.map(d => ({
        ...d,
        clicks: link.clicks > 0 ? Math.floor(Math.random() * link.clicks) : 0
    }));

    return (
        <div className="container mx-auto flex flex-col gap-8 px-4 py-12 pt-24">
            <div>
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Link Statistics</h1>
                <p className="text-muted-foreground">Detailed analytics for your short link.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Link Details</CardTitle>
                        <CardDescription>Information about your link</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-xs uppercase text-muted-foreground">Short Link</label>
                            <div className="mt-1 flex items-center gap-2 text-primary font-medium">
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

                <Card>
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

            <Card>
                <CardHeader>
                    <CardTitle>Click Activity</CardTitle>
                    <CardDescription>Weekly click distribution (Simulated)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--popover))',
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--popover-foreground))',
                                    borderRadius: 'var(--radius)'
                                }}
                            />
                            <Bar
                                dataKey="clicks"
                                fill="hsl(var(--foreground))"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
