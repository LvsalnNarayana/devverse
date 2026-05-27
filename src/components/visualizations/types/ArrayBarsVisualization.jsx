import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { blue, purple } from '@mui/material/colors';

/**
 * Generic array-bars visualization that consumes step JSON.
 * Expected step shape (minimum): { array: number[], target?: number }
 * Optional fields: left, right, mid, searchRange, eliminated, comparing
 */
export default function ArrayBarsVisualization({ steps = [], stepIndex = 0 }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const step = steps[stepIndex] ?? {};
  const array = Array.isArray(step.array) ? step.array : [];
  const target = step.target;
  const left = step.left ?? -1;
  const right = step.right ?? -1;
  const mid = step.mid ?? -1;
  const searchRange = Array.isArray(step.searchRange) ? step.searchRange : [];
  const eliminated = Array.isArray(step.eliminated) ? step.eliminated : [];
  const comparing = Array.isArray(step.comparing) ? step.comparing : [];
  const found = Boolean(step.found ?? (step.highlight === 4));

  if (!array.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">No step data to visualize.</Typography>
      </Box>
    );
  }

  const gradient = (a, b) => `linear-gradient(to top, ${a} 0%, ${b} 100%)`;
  const palette = {
    default: gradient(theme.palette.grey[400], theme.palette.grey[300]),
    searchRange: gradient(blue[400], blue[300]),
    eliminated: gradient(theme.palette.grey[600], theme.palette.grey[500]),
    comparing: gradient(theme.palette.warning.main, theme.palette.warning.light),
    found: gradient(theme.palette.success.main, theme.palette.success.light),
    leftPointer: theme.palette.info.main,
    rightPointer: theme.palette.secondary.main,
    midPointer: purple[600],
  };
  const maxValue = Math.max(...array, 1);

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: alpha(theme.palette.text.primary, isDark ? 0.04 : 0.03),
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: 2,
        px: 2,
        pt: 6,
        pb: 8,
        height: { xs: 320, sm: 360, md: 400 },
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 0.75,
        overflow: 'hidden',
      }}
    >
      {Number.isFinite(target) && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: alpha(purple[600], isDark ? 0.2 : 0.15),
            border: '2px solid',
            borderColor: purple[600],
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SearchRoundedIcon sx={{ fontSize: 18, color: purple[600] }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: purple[600], fontFamily: 'monospace' }}>
            Target: {target}
          </Typography>
        </Box>
      )}

      {array.map((value, idx) => {
        const isInSearchRange = searchRange.includes(idx);
        const isEliminated = eliminated.includes(idx);
        const isComparing = comparing.includes(idx);
        const isFound = found && idx === mid;
        const isLeft = idx === left;
        const isRight = idx === right;
        const isMid = idx === mid;

        let background = palette.default;
        let glow = null;
        let translate = 0;
        let borderWidth = 0;
        let opacity = 1;

        if (isFound) {
          background = palette.found;
          glow = `0 0 20px ${alpha(theme.palette.success.main, 0.6)}`;
          translate = -12;
        } else if (isComparing) {
          background = palette.comparing;
          glow = `0 0 16px ${alpha(theme.palette.warning.main, 0.5)}`;
          translate = -8;
        } else if (isInSearchRange) {
          background = palette.searchRange;
          borderWidth = 2;
        } else if (isEliminated) {
          background = palette.eliminated;
          opacity = 0.5;
        }

        const heightPct = maxValue > 0 ? (value / maxValue) * 100 : 0;

        return (
          <Box
            key={idx}
            sx={{
              position: 'relative',
              flex: 1,
              maxWidth: 60,
              minWidth: 14,
              height: `${heightPct}%`,
              minHeight: 16,
              background,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              boxShadow: glow ?? 'none',
              border: borderWidth > 0 ? `${borderWidth}px solid` : 'none',
              borderColor: isDark ? alpha('#fff', 0.3) : alpha('#000', 0.2),
              transform: `translateY(${translate}px)`,
              opacity,
              transition:
                'transform 220ms ease, background 220ms ease, box-shadow 220ms ease, height 280ms ease, opacity 220ms ease',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: -22,
                left: '50%',
                transform: 'translateX(-50%)',
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: '0.72rem',
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -24,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'text.secondary',
                fontFamily: 'monospace',
                fontSize: '0.65rem',
              }}
            >
              [{idx}]
            </Typography>
            {(isLeft || isRight || isMid) && !isEliminated && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -55,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.75,
                  backgroundColor: isLeft
                    ? palette.leftPointer
                    : isRight
                      ? palette.rightPointer
                      : palette.midPointer,
                  fontFamily: 'monospace',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {isMid ? 'MID' : isLeft ? 'L' : 'R'}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
