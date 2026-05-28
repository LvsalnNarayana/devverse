// React
import React from 'react';

// External
import { Alert, Box, CircularProgress, Divider } from '@mui/material';

// Relative
import { usePageContent } from '../../hooks/usePageContent';
import { APP_HEADER_HEIGHT_PX } from '../../data/constants';
import PageBlockRenderer from '../renderer/PageBlockRenderer';
import ReferencePageToc from './ReferencePageToc';

const STICKY_TOP = APP_HEADER_HEIGHT_PX + 24;

/**
 * Reference detail body: loads JSON from contentPath, side TOC from the same file.
 *
 * @param {object} props
 * @param {string} props.contentPath
 */
export default function ReferencePageContent({ contentPath }) {
  const { loading, error, blocks, tocItems, tocGroups } = usePageContent(contentPath);

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

  const showToc = tocItems.length > 0;

  if (!showToc) {
    return <PageBlockRenderer blocks={blocks} />;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '300px minmax(0, 1fr)' },
        gap: { xs: 0, lg: 4 },
        alignItems: 'start',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          position: 'sticky',
          top: STICKY_TOP,
          alignSelf: 'start',
          maxHeight: `calc(100vh - ${STICKY_TOP + 24}px)`,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <ReferencePageToc items={tocItems} groups={tocGroups} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Divider orientation="vertical" />
        <PageBlockRenderer blocks={blocks} />
      </Box>
    </Box>
  );
}
