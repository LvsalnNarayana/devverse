// React
import { NavLink } from 'react-router-dom';

// External
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import HubIcon from '@mui/icons-material/Hub';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// Relative
import { APP_HEADER_HEIGHT_PX } from '../data/constants';
import { useThemeMode } from '../theme/UseThemeMode';

function ThemeToggle({ mode, onToggle }) {
  const theme = useTheme();
  const isDark = mode === 'dark';
  const nextLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={nextLabel} arrow>
      <IconButton
        onClick={onToggle}
        aria-label={nextLabel}
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
          transition: 'transform 220ms ease, background-color 220ms ease, border-color 220ms ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderColor: alpha(theme.palette.primary.main, 0.4),
            color: 'primary.main',
          },
          '& .icon': {
            position: 'absolute',
            transition: 'opacity 220ms ease, transform 320ms ease',
          },
          '& .icon-sun': {
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.6)',
          },
          '& .icon-moon': {
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'rotate(90deg) scale(0.6)' : 'rotate(0deg) scale(1)',
          },
        }}
      >
        <Box
          component="span"
          sx={{
            position: 'relative',
            width: 20,
            height: 20,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LightModeOutlinedIcon className="icon icon-sun" fontSize="small" />
          <DarkModeOutlinedIcon className="icon icon-moon" fontSize="small" />
        </Box>
      </IconButton>
    </Tooltip>
  );
}

export default function Header() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar sx={{ borderRadius: 0 }} position="sticky">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: APP_HEADER_HEIGHT_PX,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack
            component={NavLink}
            to="/"
            sx={{
              flexDirection: 'row',
              gap: 1,
              textDecoration: 'none',
              color: 'text.primary',
            }}
          >
            <HubIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Deverse
            </Typography>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              gap: 1.25,
              alignItems: 'center',
            }}
          >
            <Button
              component={NavLink}
              to="/components"
              size="small"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Components
            </Button>
            <ThemeToggle mode={mode} onToggle={toggleTheme} />
            <Box>
              <Button component={NavLink} to="/dsa" variant="contained" size="small">
                Start Learning
              </Button>
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
