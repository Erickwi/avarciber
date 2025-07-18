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
import LoadingComponent from './Loading.jsx';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const LogoImg = styled.img`
  height: 15vh; /* Set the height of the logo as per your requirement */
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
  const { signup, isAuthenticated, errors: registerErrors, signin } = useAuth();

  const navigate = useNavigate();
  const onSubmit = handleSubmit((data) => {
    signup(data);
    const data2 = {
      email: data.email,
      password: data.password,
    }
    signin(data2);
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

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 3,
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
            {registerErrors.map((error, i) => (
              <div key={i} className="error-message">
                {error}
              </div>
            ))}
            {/* Título "Login" */}
            {/* <Typography
              component="h1"
              variant="h5"
              style={{ fontWeight: "bold", color: '#001f3f' }}
            >
              Registro
            </Typography> */}

            {/* Formulario de inicio de sesión */}
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              {/* Campo de nombre */}
              <TextField
                {...register("nombre", { required: true })}
                label="Nombre"
                margin="normal"
                required
                fullWidth
                id="nombre"
                name="nombre"
                autoComplete="nombre"
                autoFocus
              />
              {/* Mensaje de error para el campo de nombre */}
              {errors.nombre && (
                <p className="error-text">El usuario es requerido</p>
              )}

              {/* Campo de apellido */}
              <TextField
                {...register("apellido", { required: true })}
                label="Apellido"
                margin="normal"
                required
                fullWidth
                id="apellido"
                name="apellido"
                autoComplete="apellido"
                autoFocus
              />
              {/* Mensaje de error para el campo de apellido */}
              {errors.apellido && (
                <p className="error-text">El usuario es requerido</p>
              )}
              {/*  */}
              {/* Campo de correo electrónico */}
              <TextField
                {...register("email", { required: true })}
                label="Correo electrónico"
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              {/* Mensaje de error para el campo de correo electrónico */}
              {errors.email && (
                <p className="error-text">El correo es requerido</p>
              )}
              {/*  */}
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
                  {...register("password", { required: true })}
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
                Registrarse
              </Button>

              {/* Enlace para registrarse */}
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link to="/login" className="register-link">
                    ¿Ya tiene una cuenta? Inicie Sesión
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
        <Grid
        //descomentar esto para poner el fondo
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
        {/* / <LoadingComponent /> */}
      </Grid>

    </ThemeProvider>
  );
}
