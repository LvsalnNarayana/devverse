// External
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        borderTop: 1,
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} Deverse — built with React + MUI
      </Typography>
    </Box>
  );
}
