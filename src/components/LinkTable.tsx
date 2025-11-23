'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, BarChart2, Trash2, Copy, Check, QrCode, MoreHorizontal } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Box,
    Typography,
    Button,
    Chip
} from '@mui/material';

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

    // Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedLink, setSelectedLink] = useState<LinkItem | null>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, link: LinkItem) => {
        setAnchorEl(event.currentTarget);
        setSelectedLink(link);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedLink(null);
    };

    const handleCopy = async (code: string) => {
        const url = `${window.location.origin}/${code}`;
        await navigator.clipboard.writeText(url);
        setCopying(code);
        setTimeout(() => setCopying(null), 2000);
        handleMenuClose();
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
            handleMenuClose();
        }
    };

    if (links.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Box sx={{ mb: 2, p: 2, borderRadius: '50%', bgcolor: 'action.hover' }}>
                    <ExternalLink size={32} color="gray" />
                </Box>
                <Typography variant="h6" gutterBottom>No links yet</Typography>
                <Typography variant="body2" color="text.secondary">Create your first short link above to get started.</Typography>
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ backgroundImage: 'none', backgroundColor: 'background.paper' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Short Link</TableCell>
                            <TableCell>Original URL</TableCell>
                            <TableCell align="center">Clicks</TableCell>
                            <TableCell>Last Clicked</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {links.map((link) => (
                            <TableRow
                                key={link.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            /{link.code}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleCopy(link.code)}
                                        >
                                            {copying === link.code ? (
                                                <Check size={14} color="#22c55e" />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Typography variant="body2" noWrap color="text.secondary" title={link.originalUrl}>
                                        {link.originalUrl}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={link.clicks} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(link.lastClicked)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(link.createdAt)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, link)}
                                    >
                                        <MoreHorizontal size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => selectedLink && handleCopy(selectedLink.code)}>
                    <ListItemIcon>
                        <Copy size={16} />
                    </ListItemIcon>
                    <ListItemText>Copy Link</ListItemText>
                </MenuItem>
                <MenuItem component={Link} href={selectedLink ? `/code/${selectedLink.code}` : '#'}>
                    <ListItemIcon>
                        <BarChart2 size={16} />
                    </ListItemIcon>
                    <ListItemText>View Stats</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedLink) setQrCodeLink(`${window.location.origin}/${selectedLink.code}`);
                    handleMenuClose();
                }}>
                    <ListItemIcon>
                        <QrCode size={16} />
                    </ListItemIcon>
                    <ListItemText>Show QR Code</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => selectedLink && handleDelete(selectedLink.code)} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Trash2 size={16} color="#ef4444" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog open={!!qrCodeLink} onClose={() => setQrCodeLink(null)}>
                <DialogTitle>QR Code</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Scan this code to visit the link.
                    </DialogContentText>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                        {qrCodeLink && (
                            <QRCodeSVG value={qrCodeLink} size={200} />
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
