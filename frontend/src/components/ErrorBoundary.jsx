import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ocorreu um erro ao renderizar a página.</Typography>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Recarregar</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
