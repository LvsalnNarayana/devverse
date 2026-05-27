// External
import Color from 'color';

import { createTheme, alpha } from '@mui/material/styles';

// ─── Base Brand Colors (only these are hardcoded) ─────────────────────
const BRAND_PRIMARY = '#6F00FF'; // Deep vibrant purple
const BRAND_SECONDARY = '#FF4F00'; // Bright orange

const N = {
  0: '#FFFFFF',
  1: '#F8F9FA',
  2: '#F1F3F5',
  3: '#E9ECEF',
  4: '#DEE2E6',
  5: '#ADB5BD',
  6: '#868E96',
  7: '#495057',
  8: '#343A40',
  9: '#212529',
  10: '#121212',
};

const getDesignTokens = (mode) => {
  const isDark = mode === 'dark';

  // Dynamic color generation using 'color' library
  const primaryBase = Color(BRAND_PRIMARY);
  const secondaryBase = Color(BRAND_SECONDARY);

  const primaryMain = isDark
    ? primaryBase.lighten(0.35).saturate(0.1).hex() // Brighter & visible in dark mode
    : BRAND_PRIMARY;

  const primaryLight = primaryBase.lighten(isDark ? 0.55 : 0.25).hex();
  const primaryDark = primaryBase.darken(isDark ? 0.15 : 0.25).hex();

  const secondaryMain = isDark ? secondaryBase.lighten(0.15).hex() : BRAND_SECONDARY;

  const secondaryLight = secondaryBase.lighten(0.25).hex();
  const secondaryDark = secondaryBase.darken(0.25).hex();

  // Semantic colors – automatically adjusted for better visibility in dark mode
  const successMain = isDark ? Color('#22C55E').lighten(0.12).hex() : '#22C55E';

  const errorMain = isDark ? Color('#EF4444').lighten(0.1).hex() : '#EF4444';

  const warningMain = isDark ? Color('#F59E0B').lighten(0.15).hex() : '#F59E0B';

  const infoMain = isDark ? Color('#3B82F6').lighten(0.12).hex() : '#3B82F6';

  return {
    palette: {
      mode,

      primary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
        contrastText: '#FFFFFF',
      },

      secondary: {
        main: secondaryMain,
        light: secondaryLight,
        dark: secondaryDark,
        contrastText: '#FFFFFF',
      },

      success: { main: successMain },
      error: { main: errorMain },
      warning: { main: warningMain },
      info: { main: infoMain },

      neutral: {
        main: N[6],
        light: N[4],
        dark: N[8],
      },

      ...(isDark
        ? {
            background: {
              default: N[10],
              paper: N[9],
              subtle: alpha('#FFFFFF', 0.04),
            },
            text: {
              primary: N[1],
              secondary: N[5],
              disabled: N[6],
            },
            divider: alpha('#FFFFFF', 0.08),
          }
        : {
            background: {
              default: N[1],
              paper: N[0],
              subtle: alpha(N[9], 0.03),
            },
            text: {
              primary: N[9],
              secondary: N[7],
              disabled: N[5],
            },
            divider: alpha(N[9], 0.08),
          }),
    },

    spacing: 8,

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        '2xl': 1920,
      },
    },

    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',

      h1: { fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em' },
      h2: { fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em' },
      h3: { fontSize: '2.125rem', fontWeight: 600, lineHeight: 1.2 },
      h4: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.25 },
      h5: { fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.3 },
      h6: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.35 },

      subtitle1: { fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.5 },
      subtitle2: { fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 },

      body1: { fontSize: '1.0625rem', lineHeight: 1.75 },
      body2: { fontSize: '0.9375rem', lineHeight: 1.7 },

      caption: { fontSize: '0.8125rem', lineHeight: 1.5 },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      button: {
        fontSize: '0.9375rem',
        fontWeight: 500,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => `
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { font-feature-settings: "kern" 1, "liga" 1, "tnum" 1; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb {
            background: ${theme.palette.mode === 'dark' ? N[7] : N[4]};
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover { 
            background: ${theme.palette.mode === 'dark' ? N[6] : N[5]}; 
          }
          ::selection { 
            background: ${alpha(theme.palette.primary.main, 0.3)}; 
          }
        `,
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            padding: '10px 24px',
            transition: 'all 0.2s ease',
            '&:hover': { filter: 'brightness(1.1)' },
            '&:active': { transform: 'scale(0.98)' },
          },
          sizeSmall: { padding: '6px 12px', borderRadius: 8, fontSize: '0.875rem' },
          sizeLarge: { padding: '12px 20px', borderRadius: 8, fontSize: '1.0625rem' },
          outlined: { borderWidth: '1.5px' },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 20,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
            backgroundImage: 'none',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            },
          }),
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', borderRadius: 16 },
          elevation1: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
          }),
        },
      },

      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1.5px',
              borderColor: theme.palette.divider,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.text.secondary,
            },
          }),
        },
      },

      MuiChip: {
        styleOverrides: {
          // borderRadius: 1 matches the `sx` shorthand (1 * theme.shape.borderRadius = 4px).
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            fontWeight: 500,
            height: 32,
          }),
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.08),
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          }),
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 20 },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: 8, fontSize: '0.8rem' },
        },
      },
    },
  };
};

export const createAppTheme = (mode = 'dark') => createTheme(getDesignTokens(mode));
