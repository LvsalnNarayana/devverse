// React
import React from 'react';

// External
import { Box } from '@mui/material';

// Relative
import { COMPONENTS_SHOWCASE_CONTENT_PATH } from '../components/componentsCatalog';
import PageContent from '../components/renderer/PageContent';
import ShowcaseToc from '../components/showcase/ShowcaseToc';
import { APP_HEADER_HEIGHT_PX } from '../data/constants';

const STICKY_TOP = APP_HEADER_HEIGHT_PX + 24;

export default function ComponentsShowcase() {
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
        <ShowcaseToc />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <PageContent contentPath={COMPONENTS_SHOWCASE_CONTENT_PATH} />
      </Box>
    </Box>
  );
}
