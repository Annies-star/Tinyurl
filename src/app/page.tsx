import { prisma } from '@/lib/prisma';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinkTable } from '@/components/LinkTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link as LinkIcon, MousePointer2, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serializedLinks = links.map((link) => ({
    ...link,
    createdAt: link.createdAt.toISOString(),
    lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
  }));

  // Calculate stats
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const activeLinks = links.filter(link => link.clicks > 0).length;

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Shorten Your Links
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          TinyLink is a premium URL shortener that gives you full control over your links.
          Track clicks, manage redirects, and share with confidence.
        </p>
        <CreateLinkForm />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLinks}</div>
            <p className="text-xs text-muted-foreground">
              All shortened links
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Across all links
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLinks}</div>
            <p className="text-xs text-muted-foreground">
              Links with clicks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Links Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Links</h2>
          <div className="text-sm text-muted-foreground">
            {links.length} {links.length === 1 ? 'link' : 'links'} total
          </div>
        </div>
        <LinkTable links={serializedLinks} />
      </div>
    </div>
  );
}
