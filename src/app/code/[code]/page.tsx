import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StatsPageClient from '@/components/StatsPageClient';

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

    // Serialize dates for client component
    const serializedLink = {
        ...link,
        createdAt: link.createdAt.toISOString(),
        lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
    };

    return <StatsPageClient link={serializedLink} />;
}
