// React
import React, { useMemo } from 'react';

// Relative
import { useParams } from 'react-router';

// External
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';

// Relative
import ScrollToTopFab from '../components/ScrollToTopFab';
import PageContent from '../components/renderer/PageContent';
import { getBlogById } from '../data/registries/caseStudyRegistry';
import { usePageStructureMarkdown } from '../hooks/usePageStructureMarkdown';

export default function CaseStudyDetail() {
  const { id } = useParams();
  const caseStudy = useMemo(() => getBlogById(id), [id]);
  const { structureText, structureError } = usePageStructureMarkdown(caseStudy?.pageStructure);

  if (!caseStudy) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Case study not found for id: <strong>{id}</strong>
      </Alert>
    );
  }

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Button
        size="small"
        href="/case-studies"
        startIcon={<ArrowBackIcon />}
        sx={{ width: 'fit-content', textTransform: 'none' }}
      >
        Back to case studies
      </Button>

      <Stack sx={{ gap: 1 }}>
        <Typography variant="h4">{caseStudy.title}</Typography>
        <Typography color="text.secondary">{caseStudy.description}</Typography>
        <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          <Chip size="small" label={`Category: ${caseStudy.category}`} />
          {caseStudy.tags?.map((tag) => (
            <Chip key={tag} size="small" variant="outlined" label={tag} />
          ))}
        </Stack>
      </Stack>

      <Divider />

      <PageContent contentPath={caseStudy.content} />

      {caseStudy.pageStructure ? (
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
