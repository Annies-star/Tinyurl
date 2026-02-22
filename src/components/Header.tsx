'use client';

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as LinkIcon } from 'lucide-react';

export function Header() {
    return (
        <AppBar position="sticky">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            background: 'linear-gradient(to bottom right, #374151, #4B5563)',
                            boxShadow: 3
                        }}>
                            <LinkIcon size={20} color="white" />
                        </Box>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '.05rem' }}>
                            TinyLink
                        </Typography>
                    </Link>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button component={Link} href="https://portfolio-three-nu-z10jbr8cru.vercel.app/" color="inherit" sx={{ textTransform: 'none' }}>
                            Portfolio
                        </Button>
                        <Button component={Link} href="https://github.com/Annies-star" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ textTransform: 'none' }}>
                            GitHub
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
