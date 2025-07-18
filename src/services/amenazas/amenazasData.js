import axios from 'axios';
import { urlAmenazas } from '../../config/apiURL';

// Obtener todas las amenazas
export async function getAmenazasPorEmpresa(emp_codigo) {
  try {
    const response = await axios.get(`${urlAmenazas}/empresa/${emp_codigo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching amenazas:', error);
    throw error;
  }
}

// Obtener una amenaza por ID
export async function getAmenazaPorId(id) {
  try {
    const response = await axios.get(`${urlAmenazas}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching amenaza:', error);
    throw error;
  }
}

// Create a new threat
export async function createAmenaza(data) {
  try {
    const response = await axios.post(urlAmenazas, data);
    return response.data;
  } catch (error) {
    console.error('Error creating amenaza:', error);
    throw error;
  }
}

// Update an existing threat
export async function updateAmenaza(id, data) {
  try {
    const response = await axios.put(`${urlAmenazas}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating amenaza ${id}:`, error);
    throw error;
  }
}

// Delete a threat
export async function deleteAmenaza(id) {
  try {
    const response = await axios.delete(`${urlAmenazas}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting amenaza ${id}:`, error);
    throw error;
  }
}