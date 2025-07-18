import axios from 'axios';
import { urlValorImpacto } from '../../config/apiURL';

// Obtener todos los valores de impacto
export async function getValorImpacto() {
    try {
        const response = await axios.get(urlValorImpacto);
        return response.data;
    } catch (error) {
        console.error('Error fetching valor impacto:', error);
        throw error;
    }
}

// crear un nuevo valor de impacto
export async function createValorImpacto(data) {
    try {
        const response = await axios.post(urlValorImpacto, data);
        return response.data;
    } catch (error) {
        console.error('Error creating valor impacto:', error);
        throw error;
    }
}