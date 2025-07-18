import React, { useState } from 'react';
import { Table, TableBody, 
        TableCell, TableContainer, 
        TableHead, TableRow, Paper, 
        Button, TextField, Box, Typography, 
        Modal, IconButton } from '@mui/material';
import DvrIcon from '@mui/icons-material/Dvr';
import { createTiposActivos } from '../services/activos/tiposActivos/tiposActivosData';


const TablaSeleccionar = () => {
  // Estado para almacenar los datos de la tabla (aquí puedes usar tu propio estado o integrar Redux si es necesario)
  const [datos, setDatos] = useState([]);

  // Estado para almacenar los valores del formulario de la ventana emergente
  const [formulario, setFormulario] = useState({
    Descripcion: '',
  });

  // Estado para controlar la apertura/cierre de la ventana emergente
  const [modalOpen, setModalOpen] = useState(false);

  // Estado para la búsqueda
  const [busqueda, setBusqueda] = useState('');

  // Función para manejar la búsqueda
  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const[setOpen]=useState(false);

  // Función para manejar el ingreso de datos nuevos
  const handleInsert = () => {
    setModalOpen(true);
  };

  // Función para manejar el cambio de valores en el formulario
  const handleFormChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  // Función para guardar los datos ingresados en el formulario
  const handleGuardar = () => {
   // setDatos([...datos, formulario]);
    setModalOpen(false);
    createTiposActivos(formulario);
    setFormulario({
      Descripcion: '',
    });
  };

  // Función para cancelar y cerrar la ventana emergente
  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Descripcion: '',
    });
  };

  // Filtrar los datos en base a la búsqueda
  const datosFiltrados = datos.filter((dato) => {
    return dato.columna1.includes(busqueda) || dato.columna2.includes(busqueda);
  });

  return (    
    <Box>
      
      <Box sx={{border:"none", p:4}}>
        {/*<Typography 
          variant="h6"
          color="black"
          align='left'
          bgcolor={'#f0f0f0'}
          sx={{flexGrow:1}}
        >
        <IconButton 
          color="black" 
          size="large" 
          oneclick={()=>setOpen(true)}
          edge="start"
          >
          <DvrIcon/>
        </IconButton>
          Gestión de Unidades 
  </Typography>*/}
        <TableContainer component={Paper}>

          <Table 
            sx={{
              width: '97%', // Hacer que la tabla ocupe el 100% del ancho disponible
              margin: '20px 10px 10px 10px',
              borderCollapse: 'collapse',
              border: '1px solid #ddd',
            }}>

            <TableBody>
              <TableRow>

                <TableCell colSpan={3} align="left">
                  <Button variant="contained" color="primary" onClick={handleInsert}>
                    Insertar Nuevo
                  </Button>
                </TableCell>

                <TableCell colSpan={3} align="right">
                  <TextField
                    label="Buscar"
                    variant="outlined"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={1} align="center">Código</TableCell>
                <TableCell colSpan={1} align="center">Nombre</TableCell>
                <TableCell colSpan={1} align="center">Descripción</TableCell>
                <TableCell colSpan={1} align="center">Unidad</TableCell>
                <TableCell colSpan={1} align="center">Tipo</TableCell>
                <TableCell colSpan={1} align="center">Valor</TableCell>
                <TableCell colSpan={1} align="center">Estado</TableCell>
                <TableCell colSpan={1} align="center">Modificar</TableCell>





              </TableRow>

              <TableRow>
                Datos
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datosFiltrados.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell>{dato.filtro1}</TableCell>
                  <TableCell>{dato.filtro2}</TableCell>
                  <TableCell>{dato.descripcion}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} align="left">
                  Total de datos ingresados: {datosFiltrados.length}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Ventana emergente */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            maxWidth: 500,
          }}>

          <Typography variant="h6" gutterBottom paddingBottom={1}>
              Nuevo Elemento
          </Typography>

          <Box paddingBottom={2}>
            <TextField
              label="Descripción"
              name="Descripcion"
              fullWidth
              value={formulario.Descripcion}
              onChange={handleFormChange}
              />
          </Box>

          <Box >
            <Button variant="contained" color="primary" onClick={handleCancelar} sx={{mr:10}}>
              Cancelar
            </Button>

            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );

};

export default TablaSeleccionar;