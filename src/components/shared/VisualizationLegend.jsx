import React from 'react';

import { Box, Typography } from '@mui/material';

export default function VisualizationLegend({ items = [], sx }) {
  if (!items.length) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, ...sx }}>
      {items.map((item, index) => (
        <Box key={item.id ?? item.label ?? index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,
              bgcolor: item.color ?? 'primary.main',
            }}
          />
          <Typography variant="caption">{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}
