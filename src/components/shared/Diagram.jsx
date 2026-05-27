import React from 'react';

import { Alert, Box, Typography } from '@mui/material';

export default function Diagram({
  title,
  description,
  caption,
  error,
  prompt,
  imageSrc,
  src,
  drawioXml,
  ariaLabel,
  maxXmlHeight = 280,
  sx,
}) {
  const resolvedSrc = imageSrc ?? src;

  return (
    <Box sx={sx}>
      {title ? <Typography variant="subtitle1" sx={{ mb: 1 }}>{title}</Typography> : null}
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {description}
        </Typography>
      ) : null}
      {error ? <Alert severity="warning">{error}</Alert> : null}
      {resolvedSrc ? (
        <Box
          component="img"
          src={resolvedSrc}
          alt={ariaLabel ?? title ?? 'diagram'}
          sx={{ width: '100%', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
        />
      ) : null}
      {drawioXml ? (
        <Box
          component="pre"
          sx={{
            mt: resolvedSrc ? 1.5 : 0,
            p: 1.5,
            maxHeight: maxXmlHeight,
            overflow: 'auto',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            fontSize: 12,
            bgcolor: 'action.hover',
          }}
        >
          {drawioXml}
        </Box>
      ) : null}
      {prompt ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {prompt}
        </Typography>
      ) : null}
      {caption ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {caption}
        </Typography>
      ) : null}
    </Box>
  );
}
