import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000000',
            paper: '#121212',
        },
        primary: {
            main: '#FACC15', // Rich Yellow
            contrastText: '#000000',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#A1A1AA', // Zinc-400
        },
        divider: '#27272A', // Zinc-800
    },
    typography: {
        fontFamily: inter.style.fontFamily,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: 500,
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#EAB308', // Yellow-500
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#000000',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    borderBottom: '1px solid #27272A',
                },
            },
        },
    },
});

export default theme;
