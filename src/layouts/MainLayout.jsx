// React
import { Outlet, useLocation } from 'react-router-dom';

// External
import { Box, Container } from '@mui/material';

// Relative
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1, py: isHome ? 0 : 6 }}>
        {isHome ? (
          <Outlet />
        ) : (
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
