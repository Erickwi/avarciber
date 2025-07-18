import axios from 'axios';
import { urlVulnerabilidades } from '../../config/apiURL';

export async function getVulnerabilidades() {
    try {
        const response = await axios.get(urlVulnerabilidades);
        return response.data;
    } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
        throw error;
    }
}   

export async function getVulnerabilidadPorEmpresa(emp_codigo) {
  try {
    const response = await axios.get(`${urlVulnerabilidades}/empresa/${emp_codigo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vulnerabilities by company:', error);
    throw error;
  }
}

export async function updateVulnerabilidades(id, formulario) {
  try {
    const response = await axios.put(`${urlVulnerabilidades}/${id}`, {
      ...formulario,
      Tipo: formulario.TipoId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating vulnerabilidad ${id}:`, error);
    throw error;
  }
}

export async function createVulnerabilidades(formulario) {
  try {
    const response = await axios.post(urlVulnerabilidades, {
      ...formulario,
      Tipo: formulario.TipoId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating vulnerabilidad:', error);
    throw error;
  }
}

export async function deleteVulnerabilidades(id) {
  try {
    const response = await axios.delete(`${urlVulnerabilidades}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting amenaza ${id}:`, error);
    throw error;
  }
}