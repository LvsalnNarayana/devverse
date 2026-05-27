import { useCallback, useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Tooltip, Zoom } from '@mui/material';

const SCROLL_THRESHOLD_PX = 300;

/**
 * Fixed floating action button — scrolls the window to top when clicked.
 * Visible after the user scrolls past {@link SCROLL_THRESHOLD_PX}.
 */
export default function ScrollToTopFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <Zoom in={visible}>
      <Tooltip title="Scroll to top" placement="left">
        <Fab
          color="primary"
          size="medium"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: (theme) => theme.zIndex.fab,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
