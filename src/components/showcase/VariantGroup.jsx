// React
import React from 'react';

// External
import { Box, Paper, Typography } from '@mui/material';

/**
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.children
 */
export function VariantGroup({ label, children }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      {label ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mb: 1,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </Typography>
      ) : null}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function VariantGrid({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}
