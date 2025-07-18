import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import logo from "../images/logoAzul.svg";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import fondo from "../images/fondoAzul.jpg";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "../index.css";
import Alert from "@mui/material/Alert";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
`;

const LogoImg = styled.img`
  height: 20vh; /* Set the height of the logo as per your requirement */
`;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        AVARCIBER
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/inicio/general");
  }, [isAuthenticated]);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${fondo})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid item xs zeroMinWidth>
              <LogoImg src={logo} alt="Logo" />
            </Grid>
            {/* Mapeo de los errores */}
            {Array.isArray(registerErrors) && registerErrors.map((error, i) => (
              <Alert severity="error" key={i}>{typeof error === "string" ? error : JSON.stringify(error)}</Alert>
            ))}
            {!Array.isArray(registerErrors) && registerErrors && (
              <Alert severity="error">
                {typeof registerErrors === "string"
                  ? registerErrors
                  : registerErrors.sqlMessage || registerErrors.message || JSON.stringify(registerErrors)}
              </Alert>
            )}
            {/* Título "Login" */}
            <Typography
              component="h1"
              variant="h5"
              style={{ fontWeight: "bold", color: '#001f3f' }}
            >
              Iniciar Sesión
            </Typography>

            {/* Formulario de inicio de sesión */}
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              {/* Campo de correo electrónico */}
              <TextField
                {...register("usu_email", { required: true })}
                label="Correo electrónico"
                margin="normal"
                required
                fullWidth
                id="email"
                name="usu_email"
                autoComplete="email"
                autoFocus
              />
              {/* Mensaje de error para el campo de correo electrónico */}
              {errors.email && (
                <p className="error-text">El correo es requerido</p>
              )}

              {/* Campo de contraseña */}
              <FormControl
                variant="outlined"
                margin="normal"
                required
                fullWidth
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  {...register("usu_password", { required: true })}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña"
                  margin="normal"
                  required
                />
              </FormControl>
              {/* Mensaje de error para el campo de contraseña */}
              {errors.password && (
                <p className="error-text">La contraseña es requerida</p>
              )}

              {/* Botón de inicio de sesión */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>

              {/* Enlace para registrarse */}
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link to="/register" className="register-link">
                    ¿No tiene una cuenta? Regístrese
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
