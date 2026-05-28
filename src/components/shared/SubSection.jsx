import React from 'react';

import { Box, Stack, Typography } from '@mui/material';

export default function SubSection({ id, title, children }) {
  return (
    <Box
      id={id}
      component="section"
      sx={{ scrollMarginTop: 96 }}
    >
      <Stack sx={{ gap: 2 }}>
        {title ? <Typography variant="h6">{title}</Typography> : null}
        {children}
      </Stack>
    </Box>
  );
}
