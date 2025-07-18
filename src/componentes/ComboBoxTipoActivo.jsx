import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox({ label, onChange }) {
  const [unidad, setUnidad] = React.useState([]); 

  React.useEffect(() => {
    fetch('http://localhost:8800/api/tiposactivos') 
      .then((response) => response.json())
      .then((data) => setUnidad(data))
      .catch((error) => console.error('Error fetching tipos activos:', error));
  }, []);

  const handleTiposActivosChange = (event, selectedTipoActivo) => {
    onChange(selectedTipoActivo); // Comunicar la selección al componente superior
  };

  

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={unidad} // Usar la lista de activos como opciones
      getOptionLabel={(option) => option.TAC_DESCRIPCION} // Obtener el valor para mostrar como etiqueta del campo
      sx={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={handleTiposActivosChange} // Escuchar cambios de selección
      noOptionsText="Resultados no encontrados"
    />
  );
}
