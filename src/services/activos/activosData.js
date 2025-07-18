import axios from 'axios';
import { urlActivos } from '../../config/apiURL';

// Obtener todos los activos
export async function getActivos() {
    try {
        const response = await axios.get(urlActivos);
        return response.data;
    } catch (error) {
        console.error('Error fetching activos:', error);
        throw error;
    }
}

//Obtener activos por empresa
export async function getActivosPorEmpresa(emp_codigo) {
    try {
        const response = await axios.get(`${urlActivos}/empresa/${emp_codigo}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching activos by company:', error);
        throw error;
    }
}

// Obtener activo por nombre
export async function getActivoPorNombre(activo) {
    try {
        const response = await axios.get(`${urlActivos}/nombre/${activo}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching activo por nombre (${activo}):`, error);
        throw error;
    }
}

// Crear un nuevo activo
export async function createActivo(formulario) {
    try {
        const response = await axios.post(urlActivos, formulario);
        return response.data;
    } catch (error) {
        console.error('Error creating activo:', error);
        throw error;
    }
}

// Actualizar un activo existente
export async function updateActivo(id, formulario) {
    try {
        const response = await axios.put(`${urlActivos}/${id}`, formulario);
        return response.data;
    } catch (error) {
        console.error(`Error updating activo ${id}:`, error);
        throw error;
    }
}

// Eliminar un activo
export async function deleteActivo(id) {
    try {
        const response = await axios.delete(`${urlActivos}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting activo ${id}:`, error);
        throw error;
    }
}

export async function addActivoUnidad(Unidad, Activo) {
    try {
        const response = await axios.post(`${urlActivos}/unidad`, {
            Unidad,
            Activo
        });
        return response.data;
    } catch (error) {
        console.error(`Error adding unidad to activo ${Activo}:`, error);
        throw error;
    }
}

export async function actualizarUnidadDeActivo(act_codigo, uni_nombre, emp_codigo) {
  return axios.post(`${urlActivos}/actualizar-unidad-activo`, {
    act_codigo,
    uni_nombre,
    emp_codigo,
  });
}