import { createContext, useContext, useState, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../services/auth/authData";
import Cookies from "js-cookie";
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);

  //Esto limpia los errores de la interfaz luego de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      const token = res.data.token;
      Cookies.set("token", token, { sameSite: "lax"});
      const userData = normalizeUser(res.data.user);
      setUser(userData);
      setIsAuthenticated(true);
      setUserReady(true);
      console.log(res);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
    } catch (error) {
      setErrors(error.response.data);
    }
  };
  // Verifica si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        //console.log(res);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        const userData = normalizeUser(res.data);
        setUser(userData);
        setUserReady(true);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  function normalizeUser(userData) {
    return {
      usu_codigo: userData.usu_codigo || userData.id,
      usu_nombre: userData.usu_nombre || userData.nombre,
      usu_apellido: userData.usu_apellido || userData.apellido,
      usu_email: userData.usu_email || userData.email,
      usu_rol: userData.usu_rol || userData.rol,
      emp_codigo: userData.emp_codigo || userData.empresa,
    };
  }

  return (
    <AuthContext.Provider
      value={{
        signup,
        user,
        isAuthenticated,
        errors,
        signin,
        logout,
        loading,
        userReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
