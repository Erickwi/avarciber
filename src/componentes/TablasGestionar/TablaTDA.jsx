import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField, Box, Typography, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const TablaTDA = () => {
  const [datos, setDatos] = useState([
    { filtro1: 'Valor1', filtro2: 'Valor2', descripcion: 'Descripción1' },
    { filtro1: 'Valor3', filtro2: 'Valor4', descripcion: 'Descripción2' },
    // Agrega más datos de ejemplo aquí
  ]);

  const [formulario, setFormulario] = useState({
    Codigo: '',
    Nombre: '',
    Opciones: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const [modificarIndex, setModificarIndex] = useState(-1);

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  const handleGuardar = () => {
    if (modificarIndex !== -1) {
      // Modificar el dato existente en la posición 'modificarIndex'
      const nuevosDatos = [...datos];
      nuevosDatos[modificarIndex] = formulario;
      setDatos(nuevosDatos);
    } else {
      // Agregar un nuevo dato
      setDatos([...datos, formulario]);
    }
    setModalOpen(false);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
  };

  const handleModificar = (index) => {
    if (datos[index]?.filtro1 && datos[index]?.filtro2 && datos[index]?.descripcion) {
      setModificarIndex(index);
      setFormulario({
        Codigo: datos[index].filtro1,
        Nombre: datos[index].filtro2,
        Opciones: datos[index].descripcion,
      });
      setModalOpen(true);
    }
  };
  

  const handleEliminar = (index) => {
    // Implementar lógica para eliminar el dato en la posición 'index' del arreglo 'datos'
    const nuevosDatos = [...datos];
    nuevosDatos.splice(index, 1);
    setDatos(nuevosDatos);
  };

  const datosFiltrados = datos.filter((dato) => {
    return (
      (dato.filtro1 && dato.filtro1.includes(busqueda)) ||
      (dato.filtro2 && dato.filtro2.includes(busqueda))
    );
  });
  

  return (    
    <Box>
      <Box sx={{ border: "none", p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '97%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
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
                <TableCell colSpan={2} align="center">Código</TableCell>
                <TableCell colSpan={2} align="center">Nombre</TableCell>
                <TableCell colSpan={2} align="center">Opciones</TableCell>
                <TableCell colSpan={2} align="center">Modificar</TableCell>
                <TableCell colSpan={2} align="center">Eliminar</TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datosFiltrados.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={2} align="center">{dato.filtro1}</TableCell>
                  <TableCell colSpan={2} align="center" >{dato.filtro2}</TableCell>
                  <TableCell colSpan={2} align="center">{dato.descripcion}</TableCell>
                  <TableCell colSpan={2} align="center">
                    <Button variant="contained" color="primary" onClick={() => handleModificar(index)}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <Button variant="contained" color="secondary" onClick={() => handleEliminar(index)}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
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
          }}
        >
          <Typography variant="h6" gutterBottom paddingBottom={1}>
            {modificarIndex !== -1 ? 'Modificar Elemento' : 'Nuevo Elemento'}
          </Typography>
          <Box paddingBottom={2}>
            <TextField label="Nombre" name="Nombre" fullWidth value={formulario.Nombre} onChange={handleFormChange} />
          </Box>
          {modificarIndex !== -1 && (
            <Box paddingBottom={2}>
              <TextField label="Opciones" name="Opciones" fullWidth value={formulario.Opciones} onChange={handleFormChange} />
            </Box>
          )}
          <Box>
            <Button variant="contained" color="primary" onClick={handleCancelar} sx={{ mr: 10 }}>
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

export default TablaTDA;
