import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#2563eb' },
          secondary: { main: '#0f172a' },
          background: {
            default: mode === 'dark' ? '#020617' : '#f8fafc',
            paper: mode === 'dark' ? '#111827' : '#ffffff',
          },
        },
        shape: { borderRadius: 16 },
        typography: { fontFamily: 'Inter, Roboto, Arial, sans-serif' },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter mode={mode} onToggleMode={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
