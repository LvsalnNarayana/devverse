import React from 'react';
import EmptyState from '../components/EmptyState';
import { Stack, width } from '@mui/system';
import { Button, Typography } from '@mui/material';

const PageNotFound = () => {
  return (
    <Stack
      sx={{
        gap: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <EmptyState
        sx={{ width: '100%' }}
        action={{
          to: '/',
          label: 'Go Home',
        }}
      />
    </Stack>
  );
};

export default PageNotFound;
