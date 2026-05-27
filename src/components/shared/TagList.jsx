// React
import React from 'react';

// External
import { Box } from '@mui/material';

/**
 * Flex row wrapper so tags always have consistent spacing (Chip margin reset).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.gap=1]
 */
export default function TagList({ children, gap = 1, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap,
        rowGap: gap,
        columnGap: gap,
        '& > *': { m: '0 !important' },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
