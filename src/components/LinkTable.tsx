'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Trash2, Copy, Check, QrCode, ChevronDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate } from '@/lib/utils';
import {
    Box,
    Typography,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Grid,
    Divider,
    useMediaQuery,
    useTheme
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [copying, setCopying] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [qrCodeLink, setQrCodeLink] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

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
            <Stack spacing={2}>
                {links.map((link, index) => (
                    <Accordion
                        key={link.id}
                        expanded={expanded === link.id}
                        onChange={handleAccordionChange(link.id)}
                        sx={{
                            bgcolor: 'background.paper',
                            backgroundImage: 'none',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '0.75rem !important',
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': {
                                margin: '0 !important',
                                mb: 2
                            }
                        }}
                        disableGutters
                    >
                        <AccordionSummary
                            expandIcon={<ChevronDown size={20} />}
                            sx={{
                                px: { xs: 2, md: 3 },
                                py: 1.5,
                                '&.Mui-expanded': {
                                    minHeight: 'auto'
                                },
                                '& .MuiAccordionSummary-content': {
                                    my: 1,
                                    '&.Mui-expanded': {
                                        my: 1
                                    }
                                }
                            }}
                        >
                            <Grid container spacing={2} alignItems="center" sx={{ width: '100%', mr: 2 }}>
                                {/* Stepper Number */}
                                <Grid size={{ xs: 'auto' }}>
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                </Grid>

                                {/* Short Code */}
                                <Grid size={{ xs: 'auto', md: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        /{link.code}
                                    </Typography>
                                </Grid>

                                {/* Original URL - Hidden on mobile */}
                                {!isMobile && (
                                    <Grid size={{ md: 5 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {link.originalUrl}
                                        </Typography>
                                    </Grid>
                                )}

                                {/* Clicks */}
                                <Grid size={{ xs: 'auto', md: 2 }}>
                                    <Chip
                                        label={`${link.clicks} ${link.clicks === 1 ? 'click' : 'clicks'}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                                    />
                                </Grid>

                                {/* Created Date - Desktop only */}
                                {!isMobile && (
                                    <Grid size={{ md: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(link.createdAt)}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </AccordionSummary>

                        <AccordionDetails sx={{ px: { xs: 2, md: 3 }, py: 2, pt: 0 }}>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={3}>
                                {/* Full URL */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                                            Original URL
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                wordBreak: 'break-all',
                                                color: 'text.primary'
                                            }}
                                        >
                                            {link.originalUrl}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Short URL with Copy */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                                            Short URL
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: 'primary.main', fontWeight: 500, flex: 1 }}
                                            >
                                                {window.location.origin}/{link.code}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCopy(link.code)}
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:hover': { borderColor: 'primary.main' }
                                                }}
                                            >
                                                {copying === link.code ? (
                                                    <Check size={16} color="#22c55e" />
                                                ) : (
                                                    <Copy size={16} />
                                                )}
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Created Date */}
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                                            Created
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                            {formatDate(link.createdAt)}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Last Clicked */}
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                                            Last Clicked
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                            {formatDate(link.lastClicked)}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Total Clicks */}
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                                            Total Clicks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                            {link.clicks}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Actions */}
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                                            Actions
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => setQrCodeLink(`${window.location.origin}/${link.code}`)}
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:hover': { borderColor: 'primary.main' }
                                                }}
                                            >
                                                <QrCode size={16} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(link.code)}
                                                disabled={deleting === link.code}
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    color: 'error.main',
                                                    '&:hover': { borderColor: 'error.main' }
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Stack>

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
