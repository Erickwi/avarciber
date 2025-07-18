// filepath: c:\Users\Gigabyte\Documents\Construcción y evolucion del software\Proyecto avarcibe\Evaluacion_riesgos\Cliente\src\services\empresas\empresasData.js
import axios from 'axios';
import { urlEmpresas } from '../../config/apiURL';


// Obtener todas las empresas
export const getEmpresasRequest = () => axios.get(urlEmpresas, { withCredentials: true });

// Crear empresa (ya lo tienes)
export const createEmpresaRequest = (empresa) => axios.post(urlEmpresas, empresa, { withCredentials: true });

// Actualizar empresa
export const updateEmpresaRequest = (id, empresa) => axios.put(`${urlEmpresas}/${id}`, empresa, { withCredentials: true });

// Eliminar empresa
export const deleteEmpresaRequest = (id) => axios.delete(`${urlEmpresas}/${id}`, { withCredentials: true });

//Habilitar empresa
export const enableEmpresa = (id) => axios.patch(`${urlEmpresas}/${id}/habilitar`, {}, { withCredentials: true });

// Deshabilitar empresa
export const disableEmpresa = (id) => axios.patch(`${urlEmpresas}/${id}/deshabilitar`, {}, { withCredentials: true });

// Obtener logo de empresa por ID de usuario
export const getLogoEmpresaByUserId = (idUsuario) => axios.get(`${urlEmpresas}/logo/${idUsuario}`, { withCredentials: true });