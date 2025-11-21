'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, BarChart2, Trash2, Copy, Check, QrCode, MoreHorizontal } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface LinkItem {
    id: string;
    code: string;
    originalUrl: string;
    clicks: number;
    lastClicked: string | null;
    createdAt: string;
}

export function LinkTable({ links }: { links: LinkItem[] }) {
    const router = useRouter();
    const [copying, setCopying] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [qrCodeLink, setQrCodeLink] = useState<string | null>(null);

    const handleCopy = async (code: string) => {
        const url = `${window.location.origin}/${code}`;
        await navigator.clipboard.writeText(url);
        setCopying(code);
        setTimeout(() => setCopying(null), 2000);
    };

    const handleDelete = async (code: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        setDeleting(code);
        try {
            const res = await fetch(`/api/links/${code}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to delete link', error);
        } finally {
            setDeleting(null);
        }
    };

    if (links.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                    <ExternalLink className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No links yet</h3>
                <p className="mt-2 text-muted-foreground">Create your first short link above to get started.</p>
            </div>
        );
    }

    return (
        <>
            <div className="glass-card overflow-hidden rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Short Link</TableHead>
                            <TableHead className="max-w-[300px]">Original URL</TableHead>
                            <TableHead className="text-center">Clicks</TableHead>
                            <TableHead>Last Clicked</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.map((link) => (
                            <TableRow key={link.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">/{link.code}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleCopy(link.code)}
                                        >
                                            {copying === link.code ? (
                                                <Check className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate text-muted-foreground" title={link.originalUrl}>
                                    {link.originalUrl}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center justify-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                                        {link.clicks}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDate(link.lastClicked)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDate(link.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleCopy(link.code)}>
                                                <Copy className="mr-2 h-4 w-4" /> Copy Link
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/code/${link.code}`}>
                                                    <BarChart2 className="mr-2 h-4 w-4" /> View Stats
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setQrCodeLink(`${window.location.origin}/${link.code}`)}>
                                                <QrCode className="mr-2 h-4 w-4" /> Show QR Code
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(link.code)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!qrCodeLink} onOpenChange={(open) => !open && setQrCodeLink(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>QR Code</DialogTitle>
                        <DialogDescription>
                            Scan this code to visit the link.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-6">
                        {qrCodeLink && (
                            <div className="rounded-lg bg-white p-4">
                                <QRCodeSVG value={qrCodeLink} size={200} />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
