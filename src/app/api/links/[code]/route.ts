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
        await prisma.link.delete({
            where: { code },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error('Error deleting link:', error);
        // Check if error is "Record to delete does not exist"
        // Prisma throws P2025 for this
        if (error.code === 'P2025') {
            return new NextResponse(null, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
