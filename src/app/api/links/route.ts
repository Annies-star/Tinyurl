import { NextRequest, NextResponse } from 'next/server';
import { db, links } from '@/lib/db';
import { nanoid } from 'nanoid';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
    try {
        const allLinks = await db.select().from(links).orderBy(desc(links.createdAt));
        return NextResponse.json(allLinks);
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, code } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        let shortCode = code;

        if (shortCode) {
            // Check if custom code exists
            const [existing] = await db.select().from(links).where(eq(links.code, shortCode));
            if (existing) {
                return NextResponse.json({ error: 'Code already in use' }, { status: 409 });
            }
        } else {
            // Generate unique code
            shortCode = nanoid(6);
            // Ensure uniqueness (simple retry logic could be added, but collision is rare with 6 chars)
            // For robustness, we could check, but for this scope, nanoid(6) is usually fine.
            // Let's do a quick check just in case.
            let attempts = 0;
            while (attempts < 5) {
                const [existing] = await db.select().from(links).where(eq(links.code, shortCode));
                if (!existing) break;
                shortCode = nanoid(6);
                attempts++;
            }
        }

        const [link] = await db.insert(links).values({
            originalUrl: url,
            code: shortCode,
        }).returning();

        return NextResponse.json(link, { status: 201 });
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
