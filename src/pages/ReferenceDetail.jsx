import { useMemo } from 'react';
import { useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import ScrollToTopFab from '../components/ScrollToTopFab';
import ReferencePageContent from '../components/references/ReferencePageContent';
import { getReferenceById } from '../data/registries/referenceRegistry';
import { usePageStructureMarkdown } from '../hooks/usePageStructureMarkdown';
import { ContentCard, Tag } from '../components/shared';

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
          <Tag variant="outlined" label={`Type: ${reference.type}`} size="sm" />
          <Tag variant="outlined" label={`Level: ${reference.level}`} size="sm" />
          {reference.tags?.map((tag) => (
            <Tag key={tag} label={tag} size="sm" />
          ))}
        </Stack>
      </Stack>

      <Divider />

      {reference?.content ? (
        <ReferencePageContent contentPath={reference.content} />
      ) : (
        <ContentCard variant="tinted">
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
            }}
          >
            Page Content not available yet
          </Typography>
        </ContentCard>
      )}

      {!reference?.content && reference?.pageStructure ? (
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
