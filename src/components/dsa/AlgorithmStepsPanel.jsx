import { Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Sidebar list of algorithm steps; highlights the step id reported by the visualization.
 */
export default function AlgorithmStepsPanel({ steps = [], activeStepId }) {
  if (!steps.length) return null;

  return (
    <Stack sx={{ gap: 1.25 }}>
      {steps.map((step) => {
        const isActive = step.id === activeStepId;
        return (
          <Paper
            key={step.id}
            variant="outlined"
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: isActive
                ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08)
                : alpha(theme.palette.text.primary, 0.02),
              borderColor: isActive
                ? alpha(theme.palette.primary.main, 0.5)
                : theme.palette.divider,
              transition: 'all 200ms ease',
            })}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={(theme) => ({
                color: isActive ? theme.palette.primary.main : 'text.secondary',
                display: 'block',
                mb: 0.5,
              })}
            >
              {step.title}
            </Typography>
            <Typography variant="body2">{step.text}</Typography>
          </Paper>
        );
      })}
    </Stack>
  );
}
