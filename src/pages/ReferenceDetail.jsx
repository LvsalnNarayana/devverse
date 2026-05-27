import { useMemo } from 'react';
import { useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import ScrollToTopFab from '../components/ScrollToTopFab';
import PageContent from '../components/renderer/PageContent';
import { getReferenceById } from '../data/registries/referenceRegistry';
import { usePageStructureMarkdown } from '../hooks/usePageStructureMarkdown';

export default function ReferenceDetail() {
  const { id } = useParams();
  const reference = useMemo(() => getReferenceById(id), [id]);
  const { structureText, structureError } = usePageStructureMarkdown(reference?.pageStructure);

  if (!reference) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Reference not found for id: <strong>{id}</strong>
      </Alert>
    );
  }

  if (!reference.active) {
    return (
      <Stack sx={{ gap: 2 }}>
        <Button
          size="small"
          href="/references"
          startIcon={<ArrowBackIcon />}
          sx={{ width: 'fit-content', textTransform: 'none' }}
        >
          Back to references
        </Button>
        <Typography variant="h4">{reference.title}</Typography>
        <Alert severity="info">This reference page is not published yet.</Alert>
      </Stack>
    );
  }

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Button
        size="small"
        href="/references"
        startIcon={<ArrowBackIcon />}
        sx={{ width: 'fit-content', textTransform: 'none' }}
      >
        Back to references
      </Button>

      <Stack sx={{ gap: 1 }}>
        <Typography variant="h4">{reference.title}</Typography>
        <Typography color="text.secondary">{reference.description}</Typography>
        <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          <Chip size="small" label={`Type: ${reference.type}`} />
          <Chip size="small" variant="outlined" label={`Level: ${reference.level}`} />
          {reference.tags?.map((tag) => (
            <Chip key={tag} size="small" variant="outlined" label={tag} />
          ))}
        </Stack>
      </Stack>

      <Divider />

      <PageContent contentPath={reference.content} />

      {reference.pageStructure ? (
        <Stack sx={{ gap: 1, mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Page structure outline
          </Typography>
          {structureError ? (
            <Alert severity="info">{structureError}</Alert>
          ) : (
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                whiteSpace: 'pre-wrap',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: 13,
                lineHeight: 1.5,
                m: 0,
              }}
            >
              {structureText || 'Loading page structure...'}
            </Box>
          )}
        </Stack>
      ) : null}

      <ScrollToTopFab />
    </Stack>
  );
}
