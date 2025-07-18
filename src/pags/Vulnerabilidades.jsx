import React from 'react';
import GridComponent from '../componentes/structGrid';
import { GoAlertFill } from "react-icons/go";
//import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ComboBoxWithSearch from '../componentes/ComboBoxWithSearch';
import Tabla from '../componentes/TablaVulnerabilidad';
import Box from '@mui/material/Box';

export const AmenazasPVul = () => {

  const [activoSeleccionado, setActivoSeleccionado] = React.useState(null);
  const handleActivoChange = (selectedActivo) => {
    setActivoSeleccionado(selectedActivo);
  };
  return (
    <Box mt={2} mr={2} ml={2}>
    <div className='overview'>
      <GridComponent>
        <div>
          <GoAlertFill icon={GoAlertFill} size={38} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Visualizar amenazas por vulnerabilidad
        </div>
        {/* Contenido de la celda 2 */}
        <div>
          Activos y características
          <br></br>
          <br></br>
          <ComboBoxWithSearch label="Tipo de Vulnerabilidad" onChange={handleActivoChange}/>
          <br></br>
          <ComboBoxWithSearch label="Vulnerabilidad" onChange={handleActivoChange}/>
        </div>
        {/* Contenido de la celda 3 */}
        <div>
          <Tabla tableTitle="Amenazas por vulnerabilidad"></Tabla>
        </div>
      </GridComponent>
    </div>
    </Box>
  );
};