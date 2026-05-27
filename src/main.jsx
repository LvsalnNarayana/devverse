// React
import React, { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

// External
import CssBaseline from '@mui/material/CssBaseline';

// Relative
import App from './App.jsx';
import { AppThemeProvider } from './theme/ThemeContext.jsx';

// Styles
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
