import { NextRequest, NextResponse } from 'next/server';
import { db, links } from '@/lib/db';
import { eq } from 'drizzle-orm';

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

        return NextResponse.json(link);
    } catch (error) {
        console.error('Error fetching link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;
    try {
        // Check if link exists
        const [link] = await db.select().from(links).where(eq(links.code, code));

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // Delete the link
        await db.delete(links).where(eq(links.code, code));

        return NextResponse.json({ success: true, message: 'Link deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
