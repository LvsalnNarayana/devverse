// React
import { useRef } from 'react';

// External
import { Link as RouterLink } from 'react-router-dom';

// External
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';

// React

// External

// Relative
import { applicationModules } from '../data/applicationModules';
import { APP_HEADER_HEIGHT_PX } from '../data/constants';

const floatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(8px); }
`;

const pulseRing = keyframes`
  0%   { transform: scale(0.9); opacity: 0.6; }
  80%  { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(1.6); opacity: 0; }
`;

const lineClamp = (lines) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

function ModuleCard({ icon: Icon, label, description, tags, href, colorKey }) {
  const theme = useTheme();
  const color = theme.palette[colorKey].main;

  return (
    <Card
      component={RouterLink}
      elevation={1}
      to={href}
      sx={{
        height: '100%',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 200ms ease',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(0px)',
          boxShadow: theme.shadows[2],
          borderColor: alpha(color, 0.6),
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          gap: 1,
          p: { xs: 2.5, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: { xs: 2.5, md: 3 } },
        }}
      >
        <Stack
          sx={{
            gap: 2,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              backgroundColor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.5,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ color, fontSize: 28 }} />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 1.5,
              lineHeight: 1.3,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              flexShrink: 0,
            }}
          >
            {label}
          </Typography>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.55,
            ...lineClamp(3),
            flexShrink: 0,
          }}
        >
          {description}
        </Typography>

        {/* Tags */}
        {/* <Stack
          direction="row"
          gap={0.75}
          flexWrap="wrap"
          sx={{ mb: 2, flexShrink: 0 }}
        >
          {tags.slice(0, 4).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                backgroundColor: alpha(color, 0.08),
                color,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          ))}
        </Stack> */}

        {/* Explore - Pushed to bottom */}
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 0.5,
            color,
            mt: 'auto',
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            Explore
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const theme = useTheme();
  const modulesRef = useRef(null);

  const scrollToModules = () => {
    modulesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box>
      {/* ==================== HERO SECTION ==================== */}
      <Box
        sx={{
          minHeight: `calc(100vh - ${APP_HEADER_HEIGHT_PX}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          px: 2,
          py: { xs: 6, md: 8 },
        }}
      >
        {/* Background glow */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: 400, md: 700 },
            height: { xs: 300, md: 450 },
            background: `radial-gradient(ellipse at center, ${alpha(
              theme.palette.primary.main,
              0.14,
            )}, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Chip
            label="6 Comprehensive Learning Modules"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mb: 3.5, fontWeight: 600 }}
          />

          <Typography
            variant="h1"
            sx={{
              mb: 2.5,
              lineHeight: 1.08,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            }}
          >
            Learn CS the{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              visual way
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 620,
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: { xs: '1rem', md: '1.125rem' },
            }}
          >
            From bubble sort to distributed systems — interactive visualizations, hands-on problems,
            system design deep-dives, developer tools, and production-ready code modules.
          </Typography>
        </Container>

        {/* Scroll Button */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 32, md: 48 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        >
          <Box sx={{ position: 'relative', animation: `${floatY} 2.4s ease-in-out infinite` }}>
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                animation: `${pulseRing} 2s ease-out infinite`,
              }}
            />
            <IconButton
              onClick={scrollToModules}
              aria-label="Scroll to modules"
              sx={{
                width: 56,
                height: 56,
                color: 'primary.main',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                },
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* ==================== MODULES SECTION ==================== */}
      <Box
        ref={modulesRef}
        sx={{
          minHeight: `calc(100vh - ${APP_HEADER_HEIGHT_PX}px)`,
          display: 'flex',
          flexDirection: 'column',
          scrollMarginTop: `${APP_HEADER_HEIGHT_PX}px`,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            py: { xs: 3, md: 3 },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, flexShrink: 0 }}>
            <Typography
              variant="overline"
              color="primary"
              sx={{
                fontWeight: 600,
                letterSpacing: '0.08em',
                fontSize: '0.75rem',
                display: 'block',
              }}
            >
              PLATFORM MODULES
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              fontWeight={700}
              sx={{ mt: 1, mb: 1.5, fontSize: { xs: '1.75rem', md: '2.1rem' } }}
            >
              Everything in one place
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 620, mx: 'auto', lineHeight: 1.6 }}
            >
              Six comprehensive modules covering algorithms, system design, projects, references,
              tools, and ready-to-use code.
            </Typography>
          </Box>

          {/* Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2.5, md: 3 },
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              alignItems: 'stretch',
              pb: { xs: 3, md: 4 },
            }}
          >
            {applicationModules.map((mod) => (
              <ModuleCard key={mod.label} {...mod} />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
