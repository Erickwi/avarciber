import React from 'react';
import TablaSeleccionar from '../componentes/TablaActivo';
import { Typography, Box, IconButton } from '@mui/material';
import DvrIcon from '@mui/icons-material/Dvr';
import { AiOutlineForm } from "react-icons/ai";
import TablaSelecVul from '../componentes/PopUps/TablaSelecVul';
import TablaSelecAmenazas from '../componentes/PopUps/TablaAmenazas';
import TablaGA from '../componentes/PopUps/TablaGA';
import GridDosCajas from '../componentes/GridDosCajas';
import{useState} from "react";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


export const Activos = () => {
  const [hovered] = useState(false);
  
  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize:40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  return (
    <Box  mt={2} mr={2} ml={2}>
    <div className='activos'>
    
    <GridDosCajas>
        <div>
          <AiOutlineForm
          size={38} 
          style={{ marginRight: '10px', verticalAlign: 'middle' }} /> 
          Gestión de Activos
        </div>
        <div>
          <TablaGA />
        </div>
      </GridDosCajas>
    </div>
    </Box>
  );
};

export const Vulnerabilidades = () => {
  const [hovered] = useState(false);
  
  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize:40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };
  
  return (
    <Box mt={2} mr={2} ml={2}>
      <div className='vulnerabilidades'>
        <GridDosCajas>
          <div>
            <ErrorOutlineOutlinedIcon style={iconStyles} />
            Gestión de vulnerabilidades
          </div>

          <div>
            <TablaSelecVul />
          </div>
        </GridDosCajas>
      </div>
    </Box>
  );
};

export const Amenazas = () => {
  const [hovered] = useState(false);
  
  const iconStyles = {
    transform: hovered ? 'scale(1.2)' : 'none',
    fontSize:40,
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  return (
    <Box mt={2} mr={2} ml={2}>
      <div className='amenazas'>
        <GridDosCajas>
          <div>
            <WarningAmberIcon style={iconStyles} />
            Gestión de Amenazas
          </div>
          <div>
            <TablaSelecAmenazas />
          </div>
        </GridDosCajas>
      </div>
    </Box>
  );
};

