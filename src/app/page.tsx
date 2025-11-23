import { db, links as linksTable } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinkTable } from '@/components/LinkTable';
import { Link as LinkIcon, MousePointer2, TrendingUp } from 'lucide-react';
import { Container, Grid, Card, CardContent, Typography, Box, Stack } from '@mui/material';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const links = await db.select().from(linksTable).orderBy(desc(linksTable.createdAt));

  const serializedLinks = links.map((link) => ({
    ...link,
    createdAt: link.createdAt.toISOString(),
    lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
  }));

  // Calculate stats
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const activeLinks = links.filter(link => link.clicks > 0).length;

  return (
    <Container maxWidth="lg" sx={{ py: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Hero Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 3 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
          Shorten Your Links
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', fontWeight: 400 }}>
          TinyLink is a premium URL shortener that gives you full control over your links.
          Track clicks, manage redirects, and share with confidence.
        </Typography>
        <CreateLinkForm />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight="medium">Total Links</Typography>
                <LinkIcon size={16} color="gray" />
              </Stack>
              <Typography variant="h4" fontWeight="bold">{totalLinks}</Typography>
              <Typography variant="caption" color="text.secondary">All shortened links</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight="medium">Total Clicks</Typography>
                <MousePointer2 size={16} color="gray" />
              </Stack>
              <Typography variant="h4" fontWeight="bold">{totalClicks}</Typography>
              <Typography variant="caption" color="text.secondary">Across all links</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight="medium">Active Links</Typography>
                <TrendingUp size={16} color="gray" />
              </Stack>
              <Typography variant="h4" fontWeight="bold">{activeLinks}</Typography>
              <Typography variant="caption" color="text.secondary">Links with clicks</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Links Table */}
      <Box>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight="600">Your Links</Typography>
          <Typography variant="body2" color="text.secondary">
            {links.length} {links.length === 1 ? 'link' : 'links'} total
          </Typography>
        </Box>
        <LinkTable links={serializedLinks} />
      </Box>
    </Container>
  );
}
