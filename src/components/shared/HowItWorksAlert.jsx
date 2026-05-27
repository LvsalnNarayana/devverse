// React
import React from 'react';

// External
import { Box } from '@mui/material';

// Relative
import Alert from './Alert';

export default function HowItWorksAlert({ title = 'How it works', severity = 'info', items = [] }) {
  return (
    <Alert severity={severity} title={title}>
      <Box component="ol" sx={{ m: 0, pl: 3 }}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </Box>
    </Alert>
  );
}
