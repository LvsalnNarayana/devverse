// React
import React from 'react';

// External
import { Box } from '@mui/material';

// Relative
import Alert from './Alert';

export default function InfoAlert({ severity = 'info', title, content }) {
  if (!content) return null;

  return (
    <Alert severity={severity} title={title}>
      {content.type === 'list' && Array.isArray(content.items) ? (
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {content.items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </Box>
      ) : null}
      {content.type === 'paragraph' && typeof content.text === 'string' ? (
        <span dangerouslySetInnerHTML={{ __html: content.text }} />
      ) : null}
      {typeof content === 'string' ? content : null}
    </Alert>
  );
}
