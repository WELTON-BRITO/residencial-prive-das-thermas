import { Alert, Box, Button, Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@prive.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String((err as { message?: string }).message) || 'Erro ao autenticar.');
      } else {
        setError('Erro ao autenticar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 4 }, py: 4, bgcolor: 'background.default' }}>
      <Card sx={{ width: '100%', maxWidth: 460, p: 1, boxShadow: 6 }}>
        <CardHeader title="Entrar no painel" subheader="Acesso administrativo seguro" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <TextField label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth required />
              <TextField label="Senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} fullWidth required />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
