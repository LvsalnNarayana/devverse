// React
import React from 'react';

// External
import { Box, Paper, Slider, TextField, Typography } from '@mui/material';

// Relative
import { CAROUSEL_DISPLAY_CARDS } from './showcaseData';

export const MIN_CAROUSEL_CARDS = 3;
export const MAX_CAROUSEL_CARDS = CAROUSEL_DISPLAY_CARDS.length;
export const DEFAULT_CAROUSEL_CARDS = 3;
export const DEFAULT_SLIDES_PER_VIEW = 3;
export const DEFAULT_SLIDE_WIDTH = 300;

/**
 * @param {object} props
 * @param {number} props.cardCount
 * @param {(n: number) => void} props.onCardCountChange
 * @param {number} props.slidesPerView
 * @param {(n: number) => void} props.onSlidesPerViewChange
 * @param {number} props.slideWidth
 * @param {(n: number) => void} props.onSlideWidthChange
 */
export default function CarouselPlaygroundControls({
  cardCount,
  onCardCountChange,
  slidesPerView,
  onSlidesPerViewChange,
  slideWidth,
  onSlideWidthChange,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 2.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
        Carousel settings
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Cards in carousel ({MIN_CAROUSEL_CARDS}–{MAX_CAROUSEL_CARDS})
          </Typography>
          <Slider
            value={cardCount}
            min={MIN_CAROUSEL_CARDS}
            max={MAX_CAROUSEL_CARDS}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={(_, v) => onCardCountChange(v)}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Visible slides (md+)
          </Typography>
          <Slider
            value={slidesPerView}
            min={1}
            max={4}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={(_, v) => onSlidesPerViewChange(v)}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Slide width (px)
          </Typography>
          <TextField
            type="number"
            size="small"
            fullWidth
            value={slideWidth}
            slotProps={{
              htmlInput: { min: 240, max: 400, step: 10 },
            }}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) onSlideWidthChange(Math.min(400, Math.max(240, n)));
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
