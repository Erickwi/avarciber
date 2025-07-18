import axios from 'axios';
import { urlTipoAmenaza } from '../../../config/apiURL';

// Fetch all threat types
export async function getTipoAmenazas() {
  try {
    const response = await axios.get(urlTipoAmenaza);
    return response.data;
  } catch (error) {
    console.error('Error fetching tipo amenazas:', error);
    throw error;
  }
}

export async function createTipoAmenaza(formulario) {
  try {
    const response = await axios.post(urlTipoAmenaza, formulario);
    return response.data;
  } catch (error) {
    console.error('Error creating tipo amenaza:', error);
    throw error;
  }
}

export async function updateTipoAmenaza(id, formulario) {
  try {
    const response = await axios.put(`${urlTipoAmenaza}/${id}`, formulario);
    return response.data;
  } catch (error) {
    console.error(`Error updating tipo amenaza ${id}:`, error);
    throw error;
  }
}

export async function deleteTipoAmenaza(id) {
  try {
    const response = await axios.delete(`${urlTipoAmenaza}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting tipo amenaza ${id}:`, error);
    throw error;
  }
}