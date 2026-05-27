// React
import React from 'react';

// External
import { Alert, Box, CircularProgress } from '@mui/material';

// Relative
import { usePageContent } from '../../hooks/usePageContent';
import PageBlockRenderer from './PageBlockRenderer';

/**
 * Loads JSON page content from a path and renders blocks via PageBlockRenderer.
 *
 * @param {object} props
 * @param {string} [props.contentPath]
 */
export default function PageContent({ contentPath }) {
  const { loading, error, blocks } = usePageContent(contentPath);

  if (!contentPath) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="warning">{error}</Alert>;
  }

  return <PageBlockRenderer blocks={blocks} />;
}
