import { Link } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinkTable } from '@/components/LinkTable';

// Force dynamic to ensure we get fresh data on every request
export const dynamic = 'force-dynamic';

export default async function Home() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Serializable dates
  const serializedLinks = links.map((link: Link) => ({
    ...link,
    lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
    createdAt: link.createdAt.toISOString(),
  }));

  return (
    <div className="container mx-auto flex flex-col gap-12 px-4 py-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
          Shorten Your Links
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          TinyLink is a premium URL shortener that gives you full control over your links.
          Track clicks, manage redirects, and share with confidence.
        </p>
        <CreateLinkForm />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Links</h2>
          <div className="rounded-full bg-white/5 px-4 py-1 text-sm font-medium text-zinc-400">
            {links.length} Total
          </div>
        </div>
        <LinkTable links={serializedLinks} />
      </div>
    </div>
  );
}
