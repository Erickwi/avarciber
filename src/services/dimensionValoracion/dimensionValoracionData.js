import axios from 'axios';
import { urlDimensionValoracion } from '../../config/apiURL';

export async function getDimensionValoracion() {
    try {
        const response = await axios.get(urlDimensionValoracion);
        return response.data;
    } catch (error) {
        console.error('Error fetching dimension valoracion:', error);
        throw error;
    }
}

export async function createDimensionValoracion(formulario) {
  try {
    const response = await axios.post(urlDimensionValoracion, formulario);
    return response.data;
  } catch (error) {
    console.error('Error creating tipo amenaza:', error);
    throw error;
  }
}

export async function updateDimensionValoracion(id, formulario) {
  try {
    const response = await axios.put(`${urlDimensionValoracion}/${id}`, formulario);
    return response.data;
  } catch (error) {
    console.error(`Error updating dimension valoracion ${id}:`, error);
    throw error;
  }
}

export async function deleteDimensionValoracion(id) {
  try {
    const response = await axios.delete(`${urlDimensionValoracion}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting dimension valoracion ${id}:`, error);
    throw error;
  }
}