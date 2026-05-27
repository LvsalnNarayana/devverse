import React from 'react';

import { Divider, Stack, Typography } from '@mui/material';

export default function SectionHeader({
  eyebrow,
  title,
  description,
  level = 'h5',
  align = 'start',
  divider = false,
  sx,
}) {
  return (
    <Stack sx={{ gap: 0.75, textAlign: align, ...sx }}>
      {eyebrow ? (
        <Typography variant="overline" color="text.secondary">
          {eyebrow}
        </Typography>
      ) : null}
      {title ? (
        <Typography variant={level} fontWeight={600}>
          {title}
        </Typography>
      ) : null}
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
      {divider ? <Divider sx={{ mt: 1 }} /> : null}
    </Stack>
  );
}
