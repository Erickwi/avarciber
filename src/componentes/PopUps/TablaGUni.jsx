import React, { useEffect, useState } from 'react';
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
import { createUnidades, deleteUnidades, getUnidades, getUnidadesPorEmpresa, updateUnidades } from '../../services/unidades/unidadesData';
import { useAuth } from "../../context/AuthContext";

const TablaUnidades = () => {
  const [datos, setDatos] = useState([]);
  const [formulario, setFormulario] = useState({uni_nombre: '',});
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);
  const {user} = useAuth();
  const emp_codigo = user?.emp_codigo;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (emp_codigo) {
          const unidadesData = await getUnidadesPorEmpresa(emp_codigo);
          setDatos(unidadesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [emp_codigo]);

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      
      uni_nombre: '',
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
        // Modificar el dato existente en la posición 'modificarIndex'
        await updateUnidades(modificarIndex, {
          ...formulario,
          emp_codigo: emp_codigo
        });
        // Now update the 'datos' state with the updated data
        const unidadesData = await getUnidadesPorEmpresa(emp_codigo);
        setDatos(unidadesData);
      } else {
        // Agregar un nuevo dato
        await createUnidades({
          ...formulario,
          emp_codigo: emp_codigo
        });
        // Now fetch the updated data and update the 'datos' state
        const unidadesData = await getUnidadesPorEmpresa(emp_codigo);
        setDatos(unidadesData);
      }

    setModalOpen(false);
    setFormulario({
      uni_nombre: '',
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      
      uni_nombre: '',
    });
  };

  const handleModificar = (index) => {
    const unidad = datos[index];
    setModificarIndex(unidad.uni_codigo);
    setFormulario({
      
      uni_nombre: unidad.uni_nombre,
    });
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const codigoToDelete = datos[deleteIndex].uni_codigo;
    await deleteUnidades(codigoToDelete);
    const unidadesData = await getUnidadesPorEmpresa(emp_codigo);
    setDatos(unidadesData);
    setConfirmOpen(false);
    setDeleteIndex(null);
    setModalOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const datosFiltrados = datos.filter((dato) =>
    dato.uni_nombre && dato.uni_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ border: 'none', p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '97%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
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
                <TableCell colSpan={2} align="center">
                  Código
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Nombre
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {datos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay unidades registradas para esta empresa
                  </TableCell>
                </TableRow>
              ) : datosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay resultados para "{busqueda}"
                  </TableCell>
                </TableRow>
              ) : (
                datosFiltrados.map((dato, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={2} align="center">
                      {dato.uni_codigo}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.uni_nombre}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button variant="contained" color="primary" onClick={() => handleModificar(index)}>
                        <EditIcon />
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setDeleteIndex(index);
                          setConfirmOpen(true);
                        }}
                        sx={{ backgroundColor: 'red', ml: 1 }}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}

              <TableRow>
                <TableCell colSpan={3} align="left">
                  Total de unidades ingresadas: {datos.length}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
            {modificarIndex !== -1 ? 'Modificar Unidad' : 'Nueva Unidad'}
          </Typography>
          
          <TextField label="Nombre" name="uni_nombre" fullWidth value={formulario.uni_nombre} onChange={handleFormChange} />
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
            ¿Está seguro que desea eliminar esta unidad?
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

export default TablaUnidades;
