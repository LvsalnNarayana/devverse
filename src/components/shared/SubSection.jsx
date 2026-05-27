import React from 'react';

import { Stack, Typography } from '@mui/material';

export default function SubSection({ title, children }) {
  return (
    <Stack sx={{ gap: 2 }}>
      {title ? <Typography variant="h6">{title}</Typography> : null}
      {children}
    </Stack>
  );
}
