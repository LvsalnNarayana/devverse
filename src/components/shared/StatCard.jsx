// React
import React from 'react';

// External
import { Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function StatCard({ label, value, color = 'primary', sx }) {
  return (
    <Paper
      variant="outlined"
      sx={[
        (theme) => ({
          p: 2,
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: alpha(theme.palette[color].main, theme.palette.mode === 'dark' ? 0.1 : 0.06),
          borderColor: alpha(theme.palette[color].main, 0.3),
        }),
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
    >
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={(theme) => ({
          fontWeight: 700,
          color: theme.palette[color].main,
          fontFamily: 'ui-monospace, monospace',
        })}
      >
        {value}
      </Typography>
    </Paper>
  );
}
