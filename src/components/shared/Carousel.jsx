// React
import React, { Children, useCallback, useEffect, useState } from 'react';

// External
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Box, IconButton, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import useEmblaCarousel from 'embla-carousel-react';

const DEFAULT_SLIDES_PER_VIEW = { xs: 1, sm: 2, md: 3, lg: 3 };

const buildBasisRules = (slidesPerView) => {
  const result = {};
  Object.entries(slidesPerView).forEach(([bp, n]) => {
    const pct = 100 / Math.max(1, n);
    result[bp] = { flex: `0 0 ${pct}%`, maxWidth: `${pct}%` };
  });
  return result;
};

function ArrowButton({ direction, onClick, disabled }) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      sx={(theme) => ({
        width: 38,
        height: 38,
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.85)
            : theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        color: 'text.primary',
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
          borderColor: 'primary.main',
          color: 'primary.main',
        },
        '&.Mui-disabled': { opacity: 0.35 },
      })}
    >
      {direction === 'prev' ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
    </IconButton>
  );
}

export default function Carousel({
  children,
  slidesPerView = DEFAULT_SLIDES_PER_VIEW,
  loop = false,
  align = 'start',
  dragFree = false,
  showArrows = true,
  showDots = true,
  gap = 16,
  slideMinWidth,
  arrowsPosition = 'overlay',
  sx,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align,
    dragFree,
    containScroll: loop ? false : 'trimSnaps',
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const updateState = useCallback((api) => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const onSelect = () => updateState(emblaApi);
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      updateState(emblaApi);
    };
    onReInit();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onReInit);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onReInit);
    };
  }, [emblaApi, updateState]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

  const resolvedSlidesPerView =
    typeof slidesPerView === 'number'
      ? { xs: 1, sm: Math.min(2, slidesPerView), md: slidesPerView, lg: slidesPerView }
      : slidesPerView;

  const basisRules = buildBasisRules(resolvedSlidesPerView);
  const responsiveBasis = Object.fromEntries(
    Object.entries(basisRules).map(([bp, v]) => [bp, v.flex]),
  );
  const responsiveMax = Object.fromEntries(
    Object.entries(basisRules).map(([bp, v]) => [bp, v.maxWidth]),
  );

  const slides = Children.toArray(children);

  return (
    <Box
      sx={[
        { position: 'relative', width: '100%' },
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
    >
      <Box ref={emblaRef} sx={{ overflow: 'hidden', px: 0.25 }}>
        <Box sx={{ display: 'flex', ml: `${gap + gap}px`, mr: `${gap}px` }}>
          {slides.map((child, i) => (
            <Box
              key={i}
              sx={{
                flex: slideMinWidth ? `0 0 ${slideMinWidth}px` : responsiveBasis,
                maxWidth: slideMinWidth ? `${slideMinWidth}px` : responsiveMax,
                minWidth: slideMinWidth ? `${slideMinWidth}px` : 0,
                px: `${gap / 2}px`,
                boxSizing: 'border-box',
                display: 'flex',
              }}
            >
              <Box sx={{ width: '100%', display: 'flex' }}>{child}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      {showArrows && arrowsPosition === 'overlay' ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: 4, sm: -8 },
              transform: 'translateY(-50%)',
              zIndex: 2,
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            <ArrowButton direction="prev" onClick={scrollPrev} disabled={!canPrev} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: { xs: 4, sm: -8 },
              transform: 'translateY(-50%)',
              zIndex: 2,
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            <ArrowButton direction="next" onClick={scrollNext} disabled={!canNext} />
          </Box>
        </>
      ) : null}

      {showDots && scrollSnaps.length > 1 ? (
        <Stack sx={{ flexDirection: 'row', gap: 0.75, justifyContent: 'center', mt: 2 }}>
          {scrollSnaps.map((_, i) => (
            <Box
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') scrollTo(i);
              }}
              sx={(theme) => ({
                width: selectedIndex === i ? 20 : 8,
                height: 8,
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'width 220ms ease',
                backgroundColor:
                  selectedIndex === i
                    ? theme.palette.primary.main
                    : alpha(theme.palette.text.primary, 0.2),
              })}
            />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}
