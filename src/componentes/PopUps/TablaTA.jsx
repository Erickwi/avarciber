import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField, Box, Typography, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTiposActivos, deleteTiposActivos, createTiposActivos, updateTiposActivo } from '../../services/activos/tiposActivos/tiposActivosData';
import { toast } from "react-toastify";

const TablaTA = () => {
  const [datos, setDatos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    // Function to fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const tiposActivosData = await getTiposActivos();
        // Assuming the response data is an array, you can set it to the 'datos' state
        setDatos(tiposActivosData);
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
    try {
      if (modificarIndex !== -1) {
        // Modificar el dato existente en la posición 'modificarIndex'
        await updateTiposActivo(modificarIndex, formulario);
        // Now update the 'datos' state with the updated data
        const tiposActivosData = await getTiposActivos();
        setDatos(tiposActivosData);
        toast.success("Tipo de activo modificado correctamente");
      } else {
        // Agregar un nuevo dato
        await createTiposActivos(formulario);
        // Now fetch the updated data and update the 'datos' state
        const tiposActivosData = await getTiposActivos();
        setDatos(tiposActivosData);
        toast.success("Tipo de activo creado correctamente");
      }

      setModalOpen(false);
      setFormulario({Descripcion: '',});
    } catch (error) {
      toast.error("Error al guardar el tipo de activo");
    }
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Descripcion: '',
    });
  };

  const handleModificar = (dato) => {
    setModificarIndex(dato.tac_codigo);
    setFormulario({
      Descripcion: dato.tac_descripcion,
    });
    setModalOpen(true);
  };


  const handleEliminar = (dato) => {
    setDeleteIndex(dato.tac_codigo);
    setConfirmOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    await deleteTiposActivos(deleteIndex);
    toast.success("Tipo de activo eliminado correctamente");
    const tiposActivosData = await getTiposActivos();
    setDatos(tiposActivosData);
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const datosFiltrados = datos.filter((dato) =>
    dato.tac_descripcion && dato.tac_descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ border: "none", p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '97%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <TableBody>

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
                    <TableCell colSpan={2} align="center">{dato.tac_codigo}</TableCell>
                    <TableCell colSpan={2} align="center">{dato.tac_descripcion}</TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button variant="contained" color="primary" onClick={() => handleModificar(dato)}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button variant="contained" color="secondary" style={{ backgroundColor: 'red' }} onClick={() => handleEliminar(dato)}>
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
            {modificarIndex !== -1 ? 'Modificar Tipo de Activo' : 'Nuevo Tipo de Activo'}
          </Typography>
          <Box paddingBottom={2}>
            <TextField
              label="Descripción"
              name="Descripcion"
              fullWidth
              value={formulario.Descripcion}
              onChange={handleFormChange}
              error={!formulario.Descripcion}
              helperText={!formulario.Descripcion ? "Campo obligatorio" : ""}
            />
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
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            ¿Está seguro que desea eliminar este tipo de activo?
          </Typography>
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
            <Button variant="contained" onClick={handleCancelDelete}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TablaTA;
