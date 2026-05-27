// React
import React, { useEffect, useMemo, useState } from 'react';

// External
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Box, Button, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const STEP_NUM_SIZE = 34;

export default function StepList({
  steps = [],
  activeStepId: controlledActiveId,
  onStepChange,
  showNavigation = true,
  sx,
}) {
  const firstId = steps[0]?.id;
  const [internalActiveId, setInternalActiveId] = useState(controlledActiveId ?? firstId);

  useEffect(() => {
    if (controlledActiveId != null) {
      setInternalActiveId(controlledActiveId);
    }
  }, [controlledActiveId]);

  const activeId = controlledActiveId ?? internalActiveId;
  const activeIndex = useMemo(() => steps.findIndex((s) => s.id === activeId), [steps, activeId]);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  const setActive = (id) => {
    if (controlledActiveId == null) setInternalActiveId(id);
    onStepChange?.(id);
  };

  const goPrev = () => {
    if (safeIndex > 0) setActive(steps[safeIndex - 1].id);
  };

  const goNext = () => {
    if (safeIndex < steps.length - 1) setActive(steps[safeIndex + 1].id);
  };

  if (!steps.length) return null;

  return (
    <Stack sx={{ gap: 1.25, ...sx }}>
      {showNavigation ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<ChevronLeftRoundedIcon fontSize="small" />}
            onClick={goPrev}
            disabled={safeIndex === 0}
            sx={{ textTransform: 'none', py: 0.5, minHeight: 32 }}
          >
            Previous
          </Button>
          <Button
            size="small"
            variant="outlined"
            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
            onClick={goNext}
            disabled={safeIndex >= steps.length - 1}
            sx={{ textTransform: 'none', py: 0.5, minHeight: 32 }}
          >
            Next
          </Button>
        </Box>
      ) : null}

      {showNavigation ? (
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Step {safeIndex + 1} of {steps.length}
        </Typography>
      ) : null}

      <Stack sx={{ gap: 0.75 }}>
        {steps.map((step, index) => {
          const isActive = step.id === activeId;
          return (
            <Box
              key={step.id ?? index}
              component="button"
              type="button"
              onClick={() => setActive(step.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                width: '100%',
                p: 1.25,
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                borderRadius: 1,
                bgcolor: isActive ? 'action.selected' : 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 150ms ease, background-color 150ms ease',
                '&:hover': {
                  borderColor: 'primary.light',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={(theme) => ({
                  width: STEP_NUM_SIZE,
                  height: STEP_NUM_SIZE,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: isActive
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
                  bgcolor: isActive
                    ? theme.palette.primary.main
                    : alpha(
                        theme.palette.text.primary,
                        theme.palette.mode === 'dark' ? 0.12 : 0.08,
                      ),
                })}
              >
                {index + 1}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
                  {step.title ?? step.label}
                </Typography>
                {isActive && step.description ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {step.description}
                  </Typography>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
