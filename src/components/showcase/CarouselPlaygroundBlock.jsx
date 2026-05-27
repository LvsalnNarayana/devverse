// React
import React, { useMemo, useState } from 'react';

// External
import { Box, Typography } from '@mui/material';

// Relative
import { Carousel, CarouselCard } from '../shared';
import CarouselPlaygroundControls, {
  DEFAULT_CAROUSEL_CARDS,
  DEFAULT_SLIDE_WIDTH,
  DEFAULT_SLIDES_PER_VIEW,
  MAX_CAROUSEL_CARDS,
  MIN_CAROUSEL_CARDS,
} from './CarouselPlaygroundControls';
import { CAROUSEL_DISPLAY_CARDS } from './showcaseData';

/**
 * Interactive carousel demo for the components showcase (JSON block type: carouselPlayground).
 *
 * @param {object} props
 * @param {Record<string, unknown>[]} [props.slides]
 * @param {boolean} [props.loop]
 * @param {boolean} [props.showArrows]
 * @param {boolean} [props.showDots]
 * @param {number} [props.gap]
 */
export default function CarouselPlaygroundBlock({
  slides: slidesProp,
  loop = true,
  showArrows = true,
  showDots = true,
  gap = 16,
}) {
  const sourceSlides = slidesProp?.length ? slidesProp : CAROUSEL_DISPLAY_CARDS;
  const maxCards = Math.min(MAX_CAROUSEL_CARDS, sourceSlides.length);

  const [cardCount, setCardCount] = useState(
    Math.min(DEFAULT_CAROUSEL_CARDS, maxCards),
  );
  const [slidesPerView, setSlidesPerView] = useState(DEFAULT_SLIDES_PER_VIEW);
  const [slideWidth, setSlideWidth] = useState(DEFAULT_SLIDE_WIDTH);

  const slides = useMemo(
    () => sourceSlides.slice(0, cardCount),
    [sourceSlides, cardCount],
  );

  const slidesPerViewConfig = useMemo(
    () => ({
      xs: 1,
      sm: Math.min(2, slidesPerView),
      md: slidesPerView,
      lg: slidesPerView,
    }),
    [slidesPerView],
  );

  return (
    <Box>
      <CarouselPlaygroundControls
        cardCount={cardCount}
        onCardCountChange={(n) =>
          setCardCount(Math.min(maxCards, Math.max(MIN_CAROUSEL_CARDS, n)))
        }
        slidesPerView={slidesPerView}
        onSlidesPerViewChange={setSlidesPerView}
        slideWidth={slideWidth}
        onSlideWidthChange={setSlideWidth}
      />
      <Carousel
        loop={loop}
        showArrows={showArrows}
        showDots={showDots}
        slidesPerView={slidesPerViewConfig}
        slideMinWidth={slideWidth}
        gap={gap}
      >
        {slides.map((slide) => (
          <Box
            key={slide.title ?? slide.id}
            sx={{ width: slideWidth, minHeight: 200 }}
          >
            <CarouselCard
              eyebrow={slide.eyebrow}
              title={slide.title}
              description={slide.description}
              tags={slide.tags}
              to={slide.to}
              href={slide.href}
              ctaLabel={slide.ctaLabel ?? 'Read more'}
            />
          </Box>
        ))}
      </Carousel>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
        Showing {slides.length} card(s) at {slideWidth}px width, {slidesPerView} visible on md+
        breakpoints.
      </Typography>
    </Box>
  );
}
