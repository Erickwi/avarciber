import React from 'react';
import TablaUni from '../componentes/PopUps/TablaGUni';
import TablaTDA from '../componentes/PopUps/TablaTA';
import TablaGTV from '../componentes/PopUps/TablaGTV';
import GridDosCajas from '../componentes/GridDosCajas';
import TablaTAm from '../componentes/TablasGestionar/TablaTAm';
import TablaPB from '../componentes/PopUps/TablaPB';
import TablaDV from '../componentes/TablasGestionar/TablaDV';
import { Box } from '@mui/material';
//import { Typography, Box, Icon } from '@mui/material';
//import DvrIcon from '@mui/icons-material/Dvr';
import { useState } from "react";
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HdrAutoOutlinedIcon from '@mui/icons-material/HdrAutoOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined';

export const Unidades = () => {

  const [hovered] = useState(false);

  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize: 40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  return (
    <Box mt={2} mr={2} ml={2}>
      <div className='overview'>
        <GridDosCajas>
          <div>
            <ChecklistRtlIcon style={iconStyles} />
            Gestión de Unidades
          </div>
          <div>
            <TablaUni />
          </div>
        </GridDosCajas>
      </div>
    </Box>
  );
};

export const TipoDeActivos = () => {

  const [hovered] = useState(false);

  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize: 40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  return (
    <Box mt={2} mr={2} ml={2}>
      <div className='general'>
        <GridDosCajas>
          <div>
            <HdrAutoOutlinedIcon style={iconStyles} />
            Gestión de Tipos de Activos
          </div>
          <div>
            <TablaTDA />
          </div>

        </GridDosCajas>
      </div>
    </Box>
  );
};


export const Probabilidades = () => {
  const [hovered] = useState(false);

  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize: 40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  return (
    <Box mt={2} mr={2} ml={2}>
      <div className='general'>
        <GridDosCajas>
          <div>
            <SyncProblemOutlinedIcon style={iconStyles} />
            Gestión de Probabilidades
          </div>
          <div>
            <TablaPB />
          </div>

        </GridDosCajas>
      </div>
    </Box>
  );
};
export const TipoDeVulnerabilidades = () => {

  const [hovered] = useState(false);

  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize: 40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  return (
    <Box mt={2} mr={2} ml={2}>
      <div className='general'>
        <GridDosCajas>
          <div>
            <ErrorOutlineOutlinedIcon style={iconStyles} />
            Gestión de los Tipos de Vulnerabilidades
          </div>

          <div>
            <TablaGTV />
          </div>
        </GridDosCajas>
      </div>
    </Box>
  );
};

export const TipoDeAmenazas = () => {
  const [hovered] = useState(false);

  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize: 40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  return (
    <Box mt={2} mr={2} ml={2}>
      <div className='general'>
        <GridDosCajas>
          <div>
            <WarningAmberIcon style={iconStyles} />
            Gestión de Tipos de Amenazas
          </div>

          <div>
            <TablaTAm />
          </div>
        </GridDosCajas>

      </div>
    </Box>
  );
};
export const DimensionValoracion = () => {
  const [hovered] = useState(false);

  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize: 30,
    verticalAlign: 'middle',
    marginRight: '5px'
  };

  return (
    <Box m="20px">
      <div className='general'>
        <GridDosCajas>
          <div>
            <AutoGraphOutlinedIcon style={iconStyles} />
            Gestión de Dimensiones de Valoración
          </div>

          <div>
            <TablaDV />
          </div>
        </GridDosCajas>

      </div>
    </Box>
  );
};


/*export const DimDeVal = () => {
  return (
    <Box m="20px">
    <div className='general'>
      <GridDosCajas>
        <div>
        </div>
        <div>
          <DimensionValoracion/>
        </div>
      </GridDosCajas>

    </div>
    </Box>
  );
};*/
