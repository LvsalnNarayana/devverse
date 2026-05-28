import React from 'react';

import { Box, Typography } from '@mui/material';

import RichText from './RichText';

export default function KeyValueList({
  items = [],
  monoValues = false,
  layout = 'stack',
  columnGap = 2,
  sx,
}) {
  if (!items.length) return null;

  if (layout === 'grid') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: columnGap,
          ...sx,
        }}
      >
        {items.map((item) => (
          <Box key={item.key ?? item.label}>
            <Typography variant="caption" color="text.secondary">
              {item.label ?? item.key}
            </Typography>
            <RichText
              content={item.value}
              variant="body2"
              component="div"
              sx={{ fontFamily: monoValues ? 'monospace' : 'inherit' }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}>
      {items.map((item) => (
        <Box key={item.key ?? item.label} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
            {item.label ?? item.key}:
          </Typography>
          <RichText
            content={item.value}
            variant="body2"
            component="span"
            sx={{ fontFamily: monoValues ? 'monospace' : 'inherit' }}
          />
        </Box>
      ))}
    </Box>
  );
}
