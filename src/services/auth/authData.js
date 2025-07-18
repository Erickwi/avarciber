import axios from 'axios';
import { urlAuthentication } from '../../config/apiURL';

// Register a new user
export const registerRequest = (user) => axios.post(`${urlAuthentication}/register`, user, {
  withCredentials: true,
});

// Editar un usuario
export const editUserRequest = (id, user) => axios.put(`${urlAuthentication}/users/${id}`, user, {
  withCredentials: true,
});

// Login a user
export const loginRequest = (user) => axios.post(`${urlAuthentication}/login`, user, {
  withCredentials: true,
});

// Verify token
export const verifyTokenRequest = () => axios.get(`${urlAuthentication}/verify`, {
  withCredentials: true,
});

//Obtener usuarios
export const getUsuariosRequest = () => axios.get(`${urlAuthentication}/getAllUsers`, {
  withCredentials: true,
});

// Obtener usuarios por empresa
export const getUsuariosByEmpresaRequest = (emp_codigo) => axios.get(`${urlAuthentication}/users/empresa/${emp_codigo}`, {
  withCredentials: true,
});

// Eliminar un usuario
export const deleteUserRequest = (id) => axios.delete(`${urlAuthentication}/users/${id}`, {
  withCredentials: true,
});

// Habilitar un usuario
export const enableUserRequest = (id) => axios.put(`${urlAuthentication}/users/enable/${id}`, {}, {
  withCredentials: true,
});

// Deshabilitar un usuario
export const disableUserRequest = (id) => axios.put(`${urlAuthentication}/users/disable/${id}`, {}, {
  withCredentials: true,
});