import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox({ label, onChange }) {
  const [unidad, setUnidad] = React.useState([]); 

  React.useEffect(() => {
    fetch('http://localhost:8800/api/activos') 
      .then((response) => response.json())
      .then((data) => setUnidad(data))
      .catch((error) => console.error('Error fetching activos:', error));
  }, []);

  const handleActivosChange = (event, selectedActivo) => {
    onChange(selectedActivo); // Comunicar la selección al componente superior
  };
  

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={unidad} // Usar la lista de activos como opciones
      getOptionLabel={(option) => option.ACT_NOMBRE} // Obtener el valor para mostrar como etiqueta del campo
      sx={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={handleActivosChange} // Escuchar cambios de selección
      noOptionsText="Resultados no encontrados"
    />
  );
}
