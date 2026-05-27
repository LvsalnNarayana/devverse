// React
import React, {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// External
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

// Relative
import { createAppTheme } from './theme';

const ThemeContext = createContext();

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const pendingScrollRestoreRef = useRef(null);

  useLayoutEffect(() => {
    if (!pendingScrollRestoreRef.current || typeof window === 'undefined') return;

    const { x, y } = pendingScrollRestoreRef.current;
    pendingScrollRestoreRef.current = null;

    const root = document.documentElement;
    const { body } = document;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousBodyScrollBehavior = body.style.scrollBehavior;
    const previousRootOverflowAnchor = root.style.overflowAnchor;
    const previousBodyOverflowAnchor = body.style.overflowAnchor;

    // Ensure restore is instant even if global smooth scroll is enabled.
    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';
    // Prevent browser scroll anchoring from adjusting position during heavy reflow.
    root.style.overflowAnchor = 'none';
    body.style.overflowAnchor = 'none';
    window.scrollTo(x, y);

    window.requestAnimationFrame(() => {
      window.scrollTo(x, y);
      root.style.scrollBehavior = previousScrollBehavior;
      body.style.scrollBehavior = previousBodyScrollBehavior;
      root.style.overflowAnchor = previousRootOverflowAnchor;
      body.style.overflowAnchor = previousBodyOverflowAnchor;
    });
  }, [mode]);

  const toggleTheme = useCallback(() => {
    const currentX = typeof window !== 'undefined' ? window.scrollX : 0;
    const currentY = typeof window !== 'undefined' ? window.scrollY : 0;
    pendingScrollRestoreRef.current = { x: currentX, y: currentY };

    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  }, [mode]);

  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Optional: export the raw context if you ever need it directly
export { ThemeContext };
