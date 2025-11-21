import { prisma } from '@/lib/prisma';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinkTable } from '@/components/LinkTable';

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

  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-8 pt-24">
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

      <div className="w-full max-w-5xl space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-semibold">Your Links</h2>
          <div className="text-sm text-muted-foreground">
            {links.length} {links.length === 1 ? 'link' : 'links'} total
          </div>
        </div>
        <LinkTable links={serializedLinks} />
      </div>
    </main>
  );
}
