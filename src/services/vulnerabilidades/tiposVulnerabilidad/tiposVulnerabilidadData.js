import axios from 'axios';
import { urlTiposVulnerabilidad } from '../../../config/apiURL';

// Obtener todos los tipos de vulnerabilidad
export async function getTiposVulnerabilidad() {
    try {
        const response = await axios.get(urlTiposVulnerabilidad);
        return response.data;
    } catch (error) {
        console.error('Error fetching tipos de vulnerabilidad:', error);
        throw error;
    }
}

export async function updateTiposVulnerabilidades(id, formulario) {
  try {
    const response = await axios.put(`${urlTiposVulnerabilidad}/${id}`, formulario);
    return response.data;
  } catch (error) {
    console.error(`Error updating vulnerabilidad ${id}:`, error);
    throw error;
  }
}

export async function createTiposVulnerabilidades(formulario) {
  try {
    const response = await axios.post(urlTiposVulnerabilidad, formulario);
    return response.data;
  } catch (error) {
    console.error('Error creating vulnerabilidad:', error);
    throw error;
  }
}

export async function deleteTiposVulnerabilidades(id) {
  try {
    const response = await axios.delete(`${urlTiposVulnerabilidad}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting amenaza ${id}:`, error);
    throw error;
  }
}