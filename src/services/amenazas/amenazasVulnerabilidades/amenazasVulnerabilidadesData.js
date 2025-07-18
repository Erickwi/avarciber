import axios from 'axios';
import { urlAmenazasVulnerabilidades } from '../../../config/apiURL';

// Obtener todas las amenazas y vulnerabilidades
export async function getAmenazasVulnerabilidades() {
    try {
        const response = await axios.get(urlAmenazasVulnerabilidades);
        return response.data;
    } catch (error) {
        console.error('Error fetching amenazas vulnerabilidades:', error);
        throw error;
    }
}

export async function getAmenazasVulnerabilidadesTotal() {
    try {
        const response = await axios.get(`${urlAmenazasVulnerabilidades}/total`);
        return response.data;
    } catch (error) {
        console.error('Error fetching amenazas vulnerabilidades:', error);
        throw error;
    }
}

export async function getAmenazasVulnerabilidadesAgrupacion() {
    try {
        const response = await axios.get(`${urlAmenazasVulnerabilidades}/agrupacion/1`);
        return response.data;
    } catch (error) {
        console.error('Error fetching amenazas vulnerabilidades:', error);
        throw error;
    }
}

export async function getFechaAmenazaVulnerabilidad(vulnerabilidadCodigo) {
    try {
        const response = await axios.get(`${urlAmenazasVulnerabilidades}/fecha/${vulnerabilidadCodigo}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching fecha for vulnerabilidad ${vulnerabilidadCodigo}:`, error);
        throw error;
    }
}

export async function getAmenazasVulnerabilidadesRangos() {
    try {
        const response = await axios.get(`${urlAmenazasVulnerabilidades}/rangos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching amenazas vulnerabilidades:', error);
        throw error;
    }
}

export async function getTablaAmenazasVulnerabilidades(currentId, currentDate) {
    try {
        const response = await axios.get(`${urlAmenazasVulnerabilidades}/tabla/${currentId}/${currentDate}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tabla for id ${currentId} and date ${currentDate}:`, error);
        throw error;
    }
}

export async function createAmenazaVulnerabilidad(data) {
    try {
        const response = await axios.post(urlAmenazasVulnerabilidades, data);
        return response.data;
    } catch (error) {
        console.error('Error creating amenaza vulnerabilidad:', error);
        throw error;
    }
}