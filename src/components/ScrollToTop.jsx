// React
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

/**
 * Resets the scroll position to the top whenever the route changes.
 * Mount once near the router (inside <BrowserRouter />). Renders nothing.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}
