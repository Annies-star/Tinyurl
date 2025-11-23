'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Box,
    Stack
} from '@mui/material';

export function CreateLinkForm() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, code: customCode || undefined }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccess(true);
            setUrl('');
            setCustomCode('');
            router.refresh();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ width: '100%', maxWidth: 'sm', bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            fullWidth
                            type="url"
                            placeholder="Enter your long URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            variant="outlined"
                            size="medium"
                            InputProps={{
                                sx: { bgcolor: 'background.default' }
                            }}
                        />
                        <TextField
                            fullWidth
                            sx={{ maxWidth: { sm: 180 } }}
                            type="text"
                            placeholder="Alias (opt)"
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value)}
                            inputProps={{
                                pattern: "[a-zA-Z0-9-_]+",
                                title: "Only letters, numbers, hyphens, and underscores allowed"
                            }}
                            variant="outlined"
                            size="medium"
                            InputProps={{
                                sx: { bgcolor: 'background.default' }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ minWidth: 120, height: 56 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <>
                                    Shorten <ArrowRight size={20} style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </Button>
                    </Stack>
                </form>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Link created successfully!
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
