import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField, Box, Typography, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createDimensionValoracion, deleteDimensionValoracion, getDimensionValoracion, updateDimensionValoracion } from '../../services/dimensionValoracion/dimensionValoracionData';

const TablaDV = () => {
  const [datos, setDatos] = useState([
  ]);
  useEffect(() => {
    // Function to fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const dimensarionValoracionData = await getDimensionValoracion();
        // Assuming the response data is an array, you can set it to the 'datos' state
        setDatos(dimensarionValoracionData);
        console.log(datos)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);
  const [formulario, setFormulario] = useState({
    Nombre: '',
    Descripcion: '',
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
      Nombre: '',
      Descripcion: '',
    });
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  const handleGuardar = async () => {
    if (modificarIndex !== -1) {
      console.log("update")
      // Modificar el dato existente en la posición 'modificarIndex'
      await updateDimensionValoracion(modificarIndex, formulario);
      // Now update the 'datos' state with the updated data
      const dimensarionValoracionData = await getDimensionValoracion();
      setDatos(dimensarionValoracionData);
    } else {
      // Agregar un nuevo dato
      console.log("nuevo")
      try {
        console.log("antes del await");
        await createDimensionValoracion(formulario);
        console.log("despues del await");
      }
      catch (error) { console.log(error) };


      const dimensarionValoracionData = await getDimensionValoracion();
      setDatos(dimensarionValoracionData);
    }

    setModalOpen(false);
    setFormulario({
      Nombre: '',
      Descripcion: '',
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Nombre: '',
      Descripcion: '',
    });
  };

  const handleModificar = (index) => {
    setModificarIndex(datos[index].DIV_CODIGO);
    setFormulario({
      Nombre: datos[index].DIV_NOMBRE,
      Descripcion: datos[index].DIV_DESCRIPCION,
    });
    setModalOpen(true);
  };


  const handleEliminar = async (index) => {
    const codigoToDelete = datos[index].DIV_CODIGO;

    // Make the DELETE request to delete the data
    await deleteDimensionValoracion(codigoToDelete);

    // Fetch the updated data after the deletion
    const dimensarionValoracionData = await getDimensionValoracion();
    setDatos(dimensarionValoracionData);

    // Close the modal and reset the form
    setModalOpen(false);
    setFormulario({
      Nombre: '',
      Descripcion: '',
    });
  };

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
                <TableCell colSpan={2} align="center">Descripción</TableCell>
                <TableCell colSpan={4} align="center">Opciones</TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datos.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={2} align="center">{dato.DIV_CODIGO}</TableCell>
                  <TableCell colSpan={2} align="center">{dato.DIV_NOMBRE}</TableCell>
                  <TableCell colSpan={2} align="center" >{dato.DIV_DESCRIPCION}</TableCell>
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
                  Total de datos ingresados: {datos.length}
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
            <TextField label="Descripción" name="Descripcion" fullWidth value={formulario.Descripcion} onChange={handleFormChange} />
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

export default TablaDV;
