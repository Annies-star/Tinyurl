
import { prisma } from '../src/lib/prisma';

async function main() {
    const code = 'test-delete-' + Math.random().toString(36).substring(7);
    console.log(`Creating link with code: ${code}`);

    try {
        await prisma.link.create({
            data: {
                code,
                originalUrl: 'https://example.com',
            },
        });
        console.log('Link created in DB');

        console.log(`Attempting to delete via API: http://127.0.0.1:3000/api/links/${code}`);
        const res = await fetch(`http://127.0.0.1:3000/api/links/${code}`, {
            method: 'DELETE',
        });

        console.log(`API Response Status: ${res.status}`);
        if (!res.ok) {
            const text = await res.text();
            console.log(`API Response Body: ${text}`);
        } else {
            console.log('Delete successful');
        }

        // Verify it's gone
        const check = await prisma.link.findUnique({
            where: { code },
        });
        console.log('Link in DB after delete:', check ? 'Exists' : 'Gone');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Cleanup if needed
        try {
            await prisma.link.delete({ where: { code } }).catch(() => { });
        } catch { }
    }
}

main();
