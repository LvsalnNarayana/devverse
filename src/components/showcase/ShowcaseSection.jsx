// React
import React from 'react';

// External
import { Box, Typography } from '@mui/material';

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} props.children
 */
export default function ShowcaseSection({ id, title, description, children }) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        scrollMarginTop: 96,
        py: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{ mb: description ? 0.75 : 2 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 720 }}>
          {description}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}
