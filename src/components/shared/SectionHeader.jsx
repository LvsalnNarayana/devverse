import React from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import RichText from './RichText';

export default function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  level = 'h5',
  align = 'start',
  divider = false,
  sx,
}) {
  return (
    <Stack
      id={id}
      component="section"
      sx={{ gap: 0.75, textAlign: align, scrollMarginTop: 96, ...sx }}
    >
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
        <RichText content={description} variant="body2" component="div" color="text.secondary" />
      ) : null}
      {divider ? <Divider sx={{ mt: 1 }} /> : null}
    </Stack>
  );
}
