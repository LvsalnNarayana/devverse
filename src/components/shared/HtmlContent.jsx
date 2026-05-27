import React from 'react';

import { Typography } from '@mui/material';

export default function HtmlContent({ html, variant = 'body1', color, sx }) {
  if (!html) return null;

  return (
    <Typography
      variant={variant}
      color={color}
      component="div"
      sx={sx}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
