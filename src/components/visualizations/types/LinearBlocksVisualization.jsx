import { Box, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * LinearBlocksVisualization — Stack and Queue renderer.
 *
 * Step shape:
 * - values: Array<string|number>      — elements in the structure
 * - highlightIndexes?: number[]       — indexes to highlight
 * - topIndex?: number                 — explicit top pointer (stack)
 * - frontIndex?: number               — explicit front pointer (queue)
 * - rearIndex?: number                — explicit rear pointer (queue)
 * - label?: string                    — override label shown
 * - mode?: 'stack' | 'queue'         — overrides component prop
 * - capacity?: number                 — show capacity if set
 *
 * Stack renders top-to-bottom (top of stack at top visually).
 * Queue renders left-to-right with FRONT/REAR labels.
 */
export default function LinearBlocksVisualization({ steps = [], stepIndex = 0, mode = 'stack' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const step = steps[stepIndex] ?? {};

  const resolvedMode = step.mode ?? mode;
  const values = Array.isArray(step.values)
    ? step.values
    : Array.isArray(step.array)
      ? step.array
      : [];

  const highlightIndexes = Array.isArray(step.highlightIndexes) ? step.highlightIndexes : [];
  const topIndex = step.topIndex ?? (resolvedMode === 'stack' ? values.length - 1 : undefined);
  const frontIndex = step.frontIndex ?? 0;
  const rearIndex = step.rearIndex ?? values.length - 1;
  const capacity = step.capacity ?? null;

  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

  if (!values.length) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 }}
        >
          {resolvedMode === 'stack' ? 'Stack' : 'Queue'} — Empty
        </Typography>
        <Box
          sx={{
            p: 2,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1.5,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.disabled">
            {resolvedMode === 'stack' ? '[ Empty stack ]' : '[ Empty queue ]'}
          </Typography>
        </Box>
      </Paper>
    );
  }

  // ── STACK ──────────────────────────────────────────────────────────────────
  if (resolvedMode === 'stack') {
    // Render top-to-bottom, index 0 = bottom, last = top
    const reversed = [...values].reverse();
    const reversedHighlight = highlightIndexes.map((i) => values.length - 1 - i);

    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            {step.label ?? 'Stack (LIFO)'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Size: <strong>{values.length}</strong>
            </Typography>
            {capacity != null && (
              <Typography variant="caption" color="text.secondary">
                Capacity: <strong>{capacity}</strong>
              </Typography>
            )}
          </Box>
        </Box>

        {/* Open top indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box sx={{ flex: 1, borderTop: '2px dashed', borderColor: 'divider', opacity: 0.5 }} />
          <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
            ↑ PUSH / POP
          </Typography>
          <Box sx={{ flex: 1, borderTop: '2px dashed', borderColor: 'divider', opacity: 0.5 }} />
        </Box>

        {/* Stack elements — top at top */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {reversed.map((val, revIdx) => {
            const origIdx = values.length - 1 - revIdx;
            const isTop = origIdx === topIndex;
            const isHighlighted = highlightIndexes.includes(origIdx);
            const displayReversedHighlight = reversedHighlight.includes(revIdx);

            return (
              <Box key={`stack-${origIdx}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* TOP label */}
                <Box sx={{ width: 36, textAlign: 'right' }}>
                  {isTop && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: warning,
                        fontSize: '0.65rem',
                      }}
                    >
                      TOP→
                    </Typography>
                  )}
                </Box>

                {/* Cell */}
                <Box
                  sx={(t) => ({
                    flex: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    border: '1.5px solid',
                    borderColor: isHighlighted ? primary : isTop ? warning : 'divider',
                    bgcolor: isHighlighted
                      ? alpha(primary, isDark ? 0.2 : 0.1)
                      : isTop
                        ? alpha(warning, isDark ? 0.15 : 0.08)
                        : alpha(t.palette.text.primary, 0.02),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 220ms ease',
                    boxShadow: isTop ? `0 0 0 2px ${alpha(warning, 0.2)}` : 'none',
                  })}
                >
                  <Typography
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: isHighlighted ? primary : 'text.primary',
                    }}
                  >
                    {String(val)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: 'monospace' }}
                  >
                    [{origIdx}]
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Closed bottom indicator */}
        <Box
          sx={{
            mt: 0.75,
            height: 4,
            borderRadius: 1,
            bgcolor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.08),
          }}
        />
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
        >
          ⊥ bottom
        </Typography>
      </Paper>
    );
  }

  // ── QUEUE ──────────────────────────────────────────────────────────────────
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {step.label ?? 'Queue (FIFO)'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Size: <strong>{values.length}</strong>
          </Typography>
          {capacity != null && (
            <Typography variant="caption" color="text.secondary">
              Capacity: <strong>{capacity}</strong>
            </Typography>
          )}
        </Box>
      </Box>

      {/* ENQUEUE label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
        >
          ENQUEUE →
        </Typography>
        <Box sx={{ flex: 1, borderTop: '1px dashed', borderColor: 'divider' }} />
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
        >
          → DEQUEUE
        </Typography>
      </Box>

      {/* Queue elements — left to right, front on left */}
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', minWidth: 'max-content' }}>
          {values.map((val, idx) => {
            const isFront = idx === frontIndex;
            const isRear = idx === rearIndex;
            const isHighlighted = highlightIndexes.includes(idx);

            return (
              <Box
                key={`queue-${idx}`}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
              >
                {/* FRONT/REAR label above */}
                <Box sx={{ height: 18, display: 'flex', gap: 0.5 }}>
                  {isFront && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: success,
                        fontSize: '0.6rem',
                        lineHeight: 1.3,
                      }}
                    >
                      FRONT
                    </Typography>
                  )}
                  {isRear && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: warning,
                        fontSize: '0.6rem',
                        lineHeight: 1.3,
                      }}
                    >
                      REAR
                    </Typography>
                  )}
                </Box>

                {/* Cell */}
                <Box
                  sx={(t) => ({
                    minWidth: 56,
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    border: '1.5px solid',
                    borderColor: isHighlighted
                      ? primary
                      : isFront
                        ? success
                        : isRear
                          ? warning
                          : 'divider',
                    bgcolor: isHighlighted
                      ? alpha(primary, isDark ? 0.2 : 0.1)
                      : isFront
                        ? alpha(success, isDark ? 0.15 : 0.08)
                        : isRear
                          ? alpha(warning, isDark ? 0.15 : 0.08)
                          : alpha(t.palette.text.primary, 0.02),
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    transition: 'all 220ms ease',
                    color: isHighlighted ? primary : 'text.primary',
                  })}
                >
                  {String(val)}
                </Box>

                {/* Index below */}
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                >
                  [{idx}]
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
