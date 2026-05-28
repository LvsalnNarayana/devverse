import React from 'react';

import { Typography } from '@mui/material';

import { RICH_HTML_SX } from '../../utils/richHtml';

export default function HtmlContent({ html, variant = 'body1', color, sx }) {
  if (!html) return null;

  return (
    <Typography
      variant={variant}
      color={color}
      component="div"
      sx={[RICH_HTML_SX, ...(Array.isArray(sx) ? sx : [sx].filter(Boolean))]}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
