import axios from 'axios';
import { urlUnidades } from '../../config/apiURL';

// Obtener todas las unidades
export async function getUnidades() {
    try {
        const response = await axios.get(urlUnidades);
        return response.data;
    } catch (error) {
        console.error('Error fetching unidades:', error);
        throw error;
    }
}

export async function getUnidadesPorEmpresa(emp_codigo) {
  try {
    const response = await axios.get(`${urlUnidades}/empresa/${emp_codigo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unidades by company:', error);
    throw error;
  }
}

export async function getUnidadId(id) {
  try {
    const response = await axios.get(`${urlUnidades}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching unidad with id ${id}:`, error);
    throw error;
  }
}

export async function getUnidadPorActivo(act_codigo) {
  const res = await axios.get(`${urlUnidades}/por-activo/${act_codigo}`);
  return res.data; 
}

export async function createUnidades(formulario) {
  try {
    const response = await axios.post(urlUnidades, formulario);
    return response.data;
  } catch (error) {
    console.error('Error creating unidad:', error);
    throw error;
  }
}

export async function updateUnidades(id, formulario) {
  try {
    const response = await axios.put(`${urlUnidades}/${id}`, formulario);
    return response.data;
  } catch (error) {
    console.error(`Error updating unidad ${id}:`, error);
    throw error;
  }
}

export async function deleteUnidades(id) {
  try {
    const response = await axios.delete(`${urlUnidades}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting unidad ${id}:`, error);
    throw error;
  }
}