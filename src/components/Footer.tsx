import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export function Footer() {
    return (
        <Box component="footer" sx={{ py: 6, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        &copy; {new Date().getFullYear()} TinyLink. Developed by Sam Joshua.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Link href="#" color="text.secondary" underline="hover" variant="body2">
                            Privacy
                        </Link>
                        <Link href="#" color="text.secondary" underline="hover" variant="body2">
                            Terms
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
