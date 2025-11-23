import { NextRequest, NextResponse } from 'next/server';
import { db, links } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;
    try {
        const [link] = await db.select().from(links).where(eq(links.code, code));

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // Async update clicks
        // Note: In serverless/Vercel, this might not complete if we return immediately.
        // But for this assignment, it's acceptable. Ideally use waitUntil or a queue.
        // Next.js App Router handlers can await this.
        await db.update(links)
            .set({
                clicks: sql`${links.clicks} + 1`,
                lastClicked: new Date(),
            })
            .where(eq(links.id, link.id));

        return NextResponse.redirect(link.originalUrl, { status: 302 });
    } catch (error) {
        console.error('Error redirecting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
