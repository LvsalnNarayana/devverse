import { Box, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Array cell visualization (boxed, indexed).
 * Step shape:
 * - array: number[] | string[]
 * - highlightIndexes?: number[]
 */
export default function ArrayBoxesVisualization({ steps = [], stepIndex = 0 }) {
  const step = steps[stepIndex] ?? {};
  const array = Array.isArray(step.array) ? step.array : [];
  const highlightIndexes = Array.isArray(step.highlightIndexes) ? step.highlightIndexes : [];

  if (!array.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">Array is empty.</Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {array.map((value, idx) => {
          const active = highlightIndexes.includes(idx);
          return (
            <Box key={`${value}-${idx}`} sx={{ display: 'grid', gap: 0.5, justifyItems: 'center' }}>
              <Box
                sx={(theme) => ({
                  minWidth: 54,
                  height: 46,
                  borderRadius: 1.2,
                  border: '1px solid',
                  borderColor: active ? 'primary.main' : 'divider',
                  bgcolor: active
                    ? alpha(theme.palette.primary.main, 0.16)
                    : alpha(theme.palette.text.primary, 0.03),
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                })}
              >
                {String(value)}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                [{idx}]
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
