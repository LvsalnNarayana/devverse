// React
import React from 'react';

// External
import { Box, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function ContentCard({
  subheading,
  eyebrow,
  variant = 'outlined',
  accentColor,
  action,
  children,
  sx,
}) {
  const variantSx = (theme) => {
    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const accent = accentColor || primary;
    const surface = isDark
      ? theme.palette.background.paper
      : alpha(theme.palette.text.primary, 0.045);

    switch (variant) {
      case 'tinted':
        return {
          backgroundColor: isDark ? alpha(primary, 0.14) : alpha(primary, 0.08),
          border: '1px solid',
          borderColor: alpha(primary, isDark ? 0.35 : 0.28),
        };
      case 'callout':
        return {
          backgroundColor: surface,
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '4px solid',
          borderLeftColor: accent,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: surface,
          border: '1px solid',
          borderColor: isDark ? theme.palette.divider : alpha(theme.palette.text.primary, 0.12),
        };
    }
  };

  return (
    <Paper
      elevation={0}
      sx={[
        (theme) => ({
          borderRadius: 2,
          p: { xs: 2.5, md: 3 },
          my: 2.5,
          ...variantSx(theme),
        }),
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
    >
      {subheading || eyebrow || action ? (
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            mb: subheading || eyebrow ? 1 : 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {eyebrow ? (
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', letterSpacing: 1, lineHeight: 1.5 }}
              >
                {eyebrow}
              </Typography>
            ) : null}
            {subheading ? (
              <Typography variant="h6" component="h3" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                {subheading}
              </Typography>
            ) : null}
          </Box>
          {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
        </Stack>
      ) : null}

      <Box
        sx={{
          color: 'text.primary',
          fontSize: { xs: '0.9375rem', md: '1rem' },
          lineHeight: 1.7,
          '& > :first-of-type': { mt: 0 },
          '& > :last-child': { mb: 0 },
          '& p': { my: 1.25 },
          '& ul, & ol': { pl: 3, my: 1 },
          '& li': { mb: 0.5 },
          '& code': {
            px: 0.75,
            py: 0.25,
            borderRadius: 0.75,
            fontSize: '0.85em',
            bgcolor: 'action.hover',
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
