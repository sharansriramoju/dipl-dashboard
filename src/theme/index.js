import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#22d3ee' },
    background: { default: '#0a0a14', paper: '#12121f' },
    text: { primary: '#e2e8f0', secondary: '#94a3b8' },
    divider: 'rgba(99,102,241,0.15)',
    success: { main: '#34d399' },
    warning: { main: '#fbbf24' },
    error: { main: '#f87171' },
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle2: { color: '#94a3b8' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(99,102,241,0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
          '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.5)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.75rem' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6 },
        bar: { background: 'linear-gradient(90deg, #6366f1, #22d3ee)' },
      },
    },
  },
});

export default theme;
