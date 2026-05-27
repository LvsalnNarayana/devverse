// React
import { useContext } from 'react';

// Relative
import { ThemeContext } from './ThemeContext.jsx';

export const useThemeMode = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within an AppThemeProvider');
  }

  return context;
};
