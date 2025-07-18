import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import TablaValorImpacto from './TablaValorImpacto'; // Nombre del componente de la tabla

export default function ComboBox({ label, onChange}) {
  const [unidad, setUnidad] = React.useState([]); 

  React.useEffect(() => {
    fetch('http://localhost:8800/api/unidades') 
      .then((response) => response.json())
      .then((data) => setUnidad(data))
      .catch((error) => console.error('Error fetching unidades:', error));
  }, []);

  const handleUnidadChange = (event, selectedUnidad) => {
    onChange(selectedUnidad); // Comunicar la selección al componente superior
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={unidad}
      getOptionLabel={(option) => option.UNI_NOMBRE}
      sx={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={handleUnidadChange} // Escuchar cambios de selección
      noOptionsText="Resultados no encontrados"
    />
  );
}
