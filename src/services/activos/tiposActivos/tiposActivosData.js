import axios from 'axios';
import { urlTiposActivos } from '../../../config/apiURL';

// Obtener todos los tipos de activos
export async function getTiposActivos() {
    try {
        const response = await axios.get(urlTiposActivos);
        return response.data;
    } catch (error) {
        console.error('Error fetching tipos activos:', error);
        throw error;
    }
}

export async function createTiposActivos(formulario) {
  try {
    const response = await axios.post(urlTiposActivos, formulario);
    return response.data;
  } catch (error) {
    console.error('Error creating amenaza:', error);
    throw error;
  }
}

export async function updateTiposActivo(id, formulario) {
  try {
    const response = await axios.put(`${urlTiposActivos}/${id}`, formulario);
    return response.data;
  } catch (error) {
    console.error(`Error updating amenaza ${id}:`, error);
    throw error;
  }
}


export async function deleteTiposActivos(id) {
  try {
    const response = await axios.delete(`${urlTiposActivos}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting amenaza ${id}:`, error);
    throw error;
  }
}