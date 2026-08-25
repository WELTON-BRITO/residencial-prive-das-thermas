import { Alert, Box, Button, Card, CardContent, CardHeader, Stack, TextField, IconButton, InputAdornment, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from '../../hooks/useAuth';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import bgImage from "../../assets/bg-login.jpg";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Usuário ou senha inválidos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        // No desktop joga para a direita e um pouco para baixo
        alignItems: { xs: "center", md: "flex-end" },
        justifyContent: { xs: "center", md: "flex-end" },
        px: { xs: 2, md: 6 },
        pb: { xs: 4, md: 6 },
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 35%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 1.5,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" component="h1" fontWeight="bold" color="primary.main">
              Privé das Thermas 1
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              Painel de Controle
            </Typography>
          }
          sx={{ pb: 1, textAlign: "center" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Senha"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          aria-label={
                            showPassword ? "Ocultar senha" : "Mostrar senha"
                          }
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? "Entrando..." : "Acessar Sistema"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
