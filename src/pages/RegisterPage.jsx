import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { signup, isAutheticated, errors: registerErrors } = useAuth();
  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });

  useEffect(() => {
    if (isAutheticated) {
      navigate("/");
    }
  }, [isAutheticated]);

  return (
    <div className="flex-container">
      <div className="form-container">
        {/* Mapeo de los errores */}
        {registerErrors.map((error, i) => (
          <div key={i} className="error-message">
            {error}
          </div>
        ))}

        {/* Campo de nombre */}
        <div className="title">Registro</div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            {...register("nombre", { required: true })}
            className="input-field"
            placeholder="Nombre"
          />
          {/* Mensaje de error para el campo de nombre */}
          {errors.nombre && (
            <p className="error-text">El usuario es requerido</p>
          )}

          {/* Campo de apellido */}
          <input
            type="text"
            {...register("apellido", { required: true })}
            className="input-field"
            placeholder="Apellido"
          />
          {/* Mensaje de error para el campo de apellido */}
          {errors.apellido && (
            <p className="error-text">El usuario es requerido</p>
          )}

          {/* Campo de correo electrónico */}
          <input
            type="email"
            {...register("email", { required: true })}
            className="input-field"
            placeholder="Email"
          />
          {/* Mensaje de error para el campo de correo electrónico */}
          {errors.email && <p className="error-text">El correo es requerido</p>}

          {/* Campo de contraseña */}
          <input
            type="password"
            {...register("password", { required: true })}
            className="input-field"
            placeholder="Contraseña"
          />
          {/* Mensaje de error para el campo de contraseña */}
          {errors.password && (
            <p className="error-text">La contraseña es requerida</p>
          )}

          {/* Botón de registro */}
          <button type="submit" className="submit-button">
            Registrar
          </button>
        </form>
        <p className="f">
          Tienes una cuenta?
          <Link to="/login" className="register-link">
            Iniciar Sesion
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
