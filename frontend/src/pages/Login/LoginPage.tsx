import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "../../types";
import axios from "../../api/axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao autenticar.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
        py: 4,
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 460, p: 1, boxShadow: 6 }}>
        <CardHeader
          title="Entrar"
          subheader="Acesso administrativo seguro"
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
