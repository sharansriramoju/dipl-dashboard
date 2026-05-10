import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { store } from './store';
import theme from './theme';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import UploadPage from './pages/UploadPage';
import JobsPage from './pages/JobsPage';

function Layout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a0a14' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 4,
          overflowY: 'auto',
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/jobs" element={<JobsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
