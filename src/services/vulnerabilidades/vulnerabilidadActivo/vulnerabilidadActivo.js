import axios from 'axios';
import { urlVulnerabilidadActivo } from '../../../config/apiURL';

//Crear una vulnerabilidad para un activo
export async function createVulnerabilidadActivo(data) {
  try {
    const response = await axios.post(urlVulnerabilidadActivo, data);
    return response.data;
  } catch (error) {
    console.error('Error creating vulnerabilidad activo:', error);
    throw error;
  }
}

export const getActivosByFechaInicio = async (fechaInicio, fechaFin, codigoEmpresa) => {
  const res = await axios.post(`${urlVulnerabilidadActivo}/filtrar-fecha`, {
    fechaInicio,
    fechaFin,
    codigoEmpresa
  });
  return res.data;
};