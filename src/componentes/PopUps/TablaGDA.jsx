import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Modal,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TablaGA = () => {
  const [datos, setDatos] = useState([
    {
      Código: 'Valor1',
      Nombre: 'Valor2',
      Descripción: 'Descripción1',
      Unidad: 'Unidad1',
      Tipo: 'Tipo1',
      Valor: 'Valor1',
      Estado: 'Estado1',
    },
    {
      Código: 'Valor3',
      Nombre: 'Valor4',
      Descripción: 'Descripción2',
      Unidad: 'Unidad2',
      Tipo: 'Tipo2',
      Valor: 'Valor2',
      Estado: 'Estado2',
    },
    // Agrega más datos de ejemplo aquí
  ]);

  const [formulario, setFormulario] = useState({
    Código: '',
    Nombre: '',
    Descripción: '',
    Unidad: '',
    Tipo: '',
    Valor: '',
    Estado: '',
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
      Código: '',
      Nombre: '',
      Descripción: '',
      Unidad: '',
      Tipo: '',
      Valor: '',
      Estado: '',
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

    // Aquí reseteas el estado del formulario solo si estás insertando un nuevo elemento
    if (modificarIndex === -1) {
      setFormulario({
        Código: '',
        Nombre: '',
        Descripción: '',
        Unidad: '',
        Tipo: '',
        Valor: '',
        Estado: '',
      });
    }

    setModalOpen(false);
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Código: '',
      Nombre: '',
      Descripción: '',
      Unidad: '',
      Tipo: '',
      Valor: '',
      Estado: '',
    });
  };

  const handleModificar = (index) => {
    if (datos[index]?.Código && datos[index]?.Nombre && datos[index]?.Descripción) {
      setModificarIndex(index);
      setFormulario({
        Código: datos[index].Código,
        Nombre: datos[index].Nombre,
        Descripción: datos[index].Descripción,
        Unidad: datos[index].Unidad,
        Tipo: datos[index].Tipo,
        Valor: datos[index].Valor,
        Estado: datos[index].Estado,
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
      (dato.Código && dato.Código.includes(busqueda)) ||
      (dato.Nombre && dato.Nombre.includes(busqueda)) ||
      (dato.Descripción && dato.Descripción.includes(busqueda))
    );
  });

  return (
    <Box>
      <Box sx={{ border: 'none', p: 4 }}>
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
                  <TextField label="Buscar" variant="outlined" value={busqueda} onChange={handleBusquedaChange} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} align="center">
                  Código
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Nombre
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Descripción
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Unidad
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Tipo
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Valor
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Estado
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Modificar
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Eliminar
                </TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datosFiltrados.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={2} align="center">
                    {dato.Código}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.Nombre}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.Descripción}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.Unidad}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.Tipo}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.Valor}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.Estado}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <Button variant="contained" color="primary" onClick={() => handleModificar(index)}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <Button variant="contained" color="secondary" onClick={() => handleEliminar(index)} sx={{ backgroundColor: 'red' }}>
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
          <Box paddingBottom={2}>
            <TextField label="Descripción" name="Descripción" fullWidth value={formulario.Descripción} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Unidad" name="Unidad" fullWidth value={formulario.Unidad} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Tipo" name="Tipo" fullWidth value={formulario.Tipo} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Valor" name="Valor" fullWidth value={formulario.Valor} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Estado" name="Estado" fullWidth value={formulario.Estado} onChange={handleFormChange} />
          </Box>
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

export default TablaGA;
