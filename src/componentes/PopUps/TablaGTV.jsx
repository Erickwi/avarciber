import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField, Box, Typography, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTiposVulnerabilidades, getTiposVulnerabilidad, updateTiposVulnerabilidades, deleteTiposVulnerabilidades } from '../../services/vulnerabilidades/tiposVulnerabilidad/tiposVulnerabilidadData';
import { toast } from "react-toastify";

const TablaTA = () => {
  const [datos, setDatos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);
  const datosFiltrados = datos.filter((dato) =>
    dato.tvu_descripcion && dato.tvu_descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    // Function to fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const tiposVulnerabilidadData = await getTiposVulnerabilidad();
        // Assuming the response data is an array, you can set it to the 'datos' state
        console.log(tiposVulnerabilidadData);
        setDatos(tiposVulnerabilidadData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);
  const [formulario, setFormulario] = useState({
    Descripcion: '',
  });


  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
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
    if (!formulario.Descripcion || formulario.Descripcion.trim() === "") {
      toast.error("La descripción es obligatoria");
      return;
    }
    const dataToSend = {
      tvu_descripcion: formulario.Descripcion, // <-- mapea aquí
    };
    if (modificarIndex !== -1) {
      // Modificar el dato existente en la posición 'modificarIndex'
      await updateTiposVulnerabilidades(modificarIndex, dataToSend);
      // Now update the 'datos' state with the updated data
      const tiposVulnerabilidadData = await getTiposVulnerabilidad();
      setDatos(tiposVulnerabilidadData);
      toast.success("Tipo de vulnerabilidad modificado correctamente");
    } else {
      // Agregar un nuevo dato
      await createTiposVulnerabilidades(dataToSend);
      // Now fetch the updated data and update the 'datos' state
      const tiposVulnerabilidadData = await getTiposVulnerabilidad();
      setDatos(tiposVulnerabilidadData);
      toast.success("Tipo de vulnerabilidad creado correctamente");
    }

    setModalOpen(false);
    setFormulario({
      Descripcion: '',
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Descripcion: '',
    });
  };

  const handleModificar = (index) => {
    setModificarIndex(datos[index].tvu_codigo);
    setFormulario({
      Descripcion: datos[index].tvu_descripcion,
    });
    setModalOpen(true);
  };


  const handleEliminar = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const codigoToDelete = datos[deleteIndex].tvu_codigo;
    await deleteTiposVulnerabilidades(codigoToDelete);
    toast.success("Tipo de vulnerabilidad eliminado correctamente");
    const tiposVulnerabilidadData = await getTiposVulnerabilidad();
    setDatos(tiposVulnerabilidadData);
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  return (
    <Box>
      <Box sx={{ border: "none", p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '97%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <TableBody>

              {/* Fila para los controles superiores */}
              <TableRow>
                <TableCell colSpan={8}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button variant="contained" color="primary" onClick={handleInsert}>
                      Insertar Nuevo
                    </Button>
                    <TextField
                      label="Buscar"
                      variant="outlined"
                      value={busqueda}
                      onChange={handleBusquedaChange}
                      sx={{ width: 350 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} align="center">Código</TableCell>
                <TableCell colSpan={2} align="center">Descripción</TableCell>
                <TableCell colSpan={4} align="center">Opciones</TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No hay resultados para "{busqueda}"
                  </TableCell>
                </TableRow>
              ) : (
                datosFiltrados.map((dato, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={2} align="center">{dato.tvu_codigo}</TableCell>
                    <TableCell colSpan={2} align="center">{dato.tvu_descripcion}</TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button variant="contained" color="primary" onClick={() => handleModificar(index)}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button variant="contained" color="secondary" style={{ backgroundColor: 'red' }} onClick={() => handleEliminar(index)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}

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
            {modificarIndex !== -1 ? 'Modificar Tipo de Vulnerabilidad' : 'Nuevo Tipo de Vulnerabilidad'}
          </Typography>
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
      <Modal open={confirmOpen} onClose={handleCancelDelete}>
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
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ¿Está seguro que desea eliminar este tipo de vulnerabilidad?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="contained" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TablaTA;
