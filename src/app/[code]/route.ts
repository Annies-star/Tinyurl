import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;
    try {
        const link = await prisma.link.findUnique({
            where: { code },
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // Async update clicks
        // Note: In serverless/Vercel, this might not complete if we return immediately.
        // But for this assignment, it's acceptable. Ideally use waitUntil or a queue.
        // Next.js App Router handlers can await this.
        await prisma.link.update({
            where: { id: link.id },
            data: {
                clicks: { increment: 1 },
                lastClicked: new Date(),
            },
        });

        return NextResponse.redirect(link.originalUrl, { status: 302 });
    } catch (error) {
        console.error('Error redirecting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
