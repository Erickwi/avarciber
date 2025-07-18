import axios from 'axios';
import { urlProbabilidad } from '../../config/apiURL';

// Obtener todas las probabilidades
export async function getProbabilidad(emp_codigo) {
    try {
        const response = await axios.get(`${urlProbabilidad}/empresa/${emp_codigo}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching probabilidad:', error);
        throw error;
    }
}

export async function updateProbabilidad(id, formulario) {
  try {
    const response = await axios.put(`${urlProbabilidad}/${id}`, formulario);
    return response.data;
  } catch (error) {
    console.error(`Error updating vulnerabilidad ${id}:`, error);
    throw error;
  }
}

export async function createProbabilidad(formulario) {
  try {
    const response = await axios.post(urlProbabilidad, formulario);
    return response.data;
  } catch (error) {
    console.error('Error creating vulnerabilidad:', error);
    throw error;
  }
}

export async function deleteProbabilidad(id) {
  try {
    const response = await axios.delete(`${urlProbabilidad}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting probabilidad ${id}:`, error);
    throw error;
  }
}