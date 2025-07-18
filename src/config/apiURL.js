const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8800';

export const urlAmenazas = `${baseURL}/api/amenazas`;
export const urlTipoAmenaza = `${baseURL}/api/tipoamenaza`;
export const urlDimensionValoracion = `${baseURL}/api/dimensionvaloracion`;
export const urlAuthentication = `${baseURL}/api`;
export const urlTipoVulnerabilidad = `${baseURL}/api/TVulnerabilidades`;
export const urlTiposActivos = `${baseURL}/api/tiposactivos`;
export const urlVulnerabilidades = `${baseURL}/api/vulnerabilidades`;
export const urlTiposVulnerabilidad = `${baseURL}/api/tiposvulnerabilidad`;
export const urlProbabilidad = `${baseURL}/api/probabilidad`;
export const urlUnidades = `${baseURL}/api/unidades`;
export const urlActivos = `${baseURL}/api/activos`;
export const urlValorImpacto = `${baseURL}/api/valorimpacto`;
export const urlAmenazasVulnerabilidades = `${baseURL}/api/amenazasvulnerabilidades`;
export const urlVulnerabilidadActivo = `${baseURL}/api/vulnerabilidadactivo`;
export const urlEmpresas = `${baseURL}/api/empresas`;