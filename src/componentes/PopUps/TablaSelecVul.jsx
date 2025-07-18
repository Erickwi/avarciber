import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createVulnerabilidades, deleteVulnerabilidades, getVulnerabilidades, getVulnerabilidadPorEmpresa, updateVulnerabilidades } from '../../services/vulnerabilidades/vulnerabilidadesData';
import { getTiposVulnerabilidad } from '../../services/vulnerabilidades/tiposVulnerabilidad/tiposVulnerabilidadData';
import { getUnidadesPorEmpresa } from '../../services/unidades/unidadesData';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const TablaGA = () => {
  const [datos, setDatos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposIds, setTiposIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);
  const { user } = useAuth();
  const [unidades, setUnidades] = useState([]);
  const emp_codigo = user?.emp_codigo; // Ajusta esto según tu contexto
  const datosFiltrados = datos.filter((dato) => {
    const texto = busqueda.toLowerCase();
    return dato.vul_nombre && dato.vul_nombre.toLowerCase().includes(texto);
  });

  useEffect(() => {
    const fetchUnidades = async () => {
      if (emp_codigo) {
        const unidadesData = await getUnidadesPorEmpresa(emp_codigo);
        setUnidades(unidadesData);
      }
    };
    fetchUnidades();
  }, [emp_codigo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (emp_codigo) {
          const vulnerabilidadesData = await getVulnerabilidadPorEmpresa(emp_codigo);
          setDatos(vulnerabilidadesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [emp_codigo]);

  useEffect(() => {
    // Function to fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const tiposVulnerabilidadData = await getTiposVulnerabilidad();
        // Assuming the response data is an array, you can set it to the 'datos' state
        setTipos(tiposVulnerabilidadData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  // Update tiposIds state after tipos has been updated
  useEffect(() => {
    const tiposIds1 = tipos.map((item) => item.tvu_codigo);
    setTiposIds(tiposIds1);
  }, [tipos]);


  const [formulario, setFormulario] = useState({
    Tipo: '',
    Unidad: '', 
    FechaInicio: '',
    Identificacion: '',
    Nombre: '',
    Descripción: '',
    Observacion: '',
    FechaInactividad: null,
  });


  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleDateChange = (newValue) => {
    // Format the date using dayjs before updating the state
    const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
    console.log(formattedDate);
    setFormulario({
      ...formulario,
      FechaInicio: formattedDate,
    });
  };
  const handleFechaInactividadChange = (newValue) => {
    // Format the date using dayjs before updating the state
    const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
    setFormulario({
      ...formulario,
      FechaInactividad: formattedDate,
    });
  };
  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      Tipo: '',
      FechaInicio: dayjs().format('YYYY-MM-DD'),
      Identificacion: generarIdentificacion(),
      Nombre: '',
      Descripción: '',
      Observacion: '',
      FechaInactividad: null,
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
    const camposFaltantes = [];
    if (!formulario.Tipo) camposFaltantes.push("Tipo");
    if (!formulario.Unidad) camposFaltantes.push("Unidad");
    if (!formulario.FechaInicio) camposFaltantes.push("Fecha de Inicio");
    if (!formulario.Identificacion) camposFaltantes.push("Identificación");
    if (!formulario.Nombre) camposFaltantes.push("Nombre");
    if (!formulario.Descripción) camposFaltantes.push("Descripción");
    if (!formulario.Observacion) camposFaltantes.push("Observación");

    if (camposFaltantes.length > 0) {
      toast.error(`Faltan campos obligatorios: ${camposFaltantes.join(", ")}`);
      return;
    }
    const dataToSend = {
      tvu_codigo: formulario.Tipo,
      uni_codigo: formulario.Unidad,
      vul_fecha_inicio: formulario.FechaInicio,
      vul_identificacion: formulario.Identificacion,
      vul_nombre: formulario.Nombre,
      vul_descripcion: formulario.Descripción,
      vul_observacion: formulario.Observacion,
      vul_fecha_inactividad: formulario.FechaInicio,
    };
    if (modificarIndex !== -1) {
      // Modificar el dato existente en la posición 'modificarIndex'
      await updateVulnerabilidades(modificarIndex, dataToSend);
      // Now update the 'datos' state with the updated data
      const vulnerabilidadesData = await getVulnerabilidadPorEmpresa(emp_codigo);
      setDatos(vulnerabilidadesData);
      toast.success("Vulnerabilidad modificada correctamente");
    } else {
      await createVulnerabilidades(dataToSend);
      // Now fetch the updated data and update the 'datos' state
      const vulnerabilidadesData = await getVulnerabilidadPorEmpresa(emp_codigo);
      setDatos(vulnerabilidadesData);
      toast.success("Vulnerabilidad creada correctamente");
    }

    setModalOpen(false);
    setFormulario({
      Tipo: '',
      Unidad: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Descripción: '',
      Observacion: '',
      FechaInactividad: null,
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Tipo: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Descripción: '',
      Observacion: '',
      FechaInactividad: null,
    });
  };

  const handleModificar = (index) => {
    
    const selectedTipo = tipos.find((tipo) => tipo.tvu_codigo === datos[index].tvu_codigo);
    console.log(selectedTipo);
    setModificarIndex(datos[index].vul_codigo);
    setFormulario({
      Tipo: selectedTipo ? selectedTipo.tvu_codigo : '',
      Unidad: datos[index].uni_codigo,
      FechaInicio: datos[index].vul_fecha_inicio?datos[index].vul_fecha_inicio.split('T')[0]:datos[index].vul_fecha_inicio,
      Identificacion: datos[index].vul_identificacion,
      Nombre: datos[index].vul_nombre,
      Descripción: datos[index].vul_descripcion,
      Observacion: datos[index].vul_observacion,
      FechaInactividad: datos[index].vul_fecha_inactividad?datos[index].vul_fecha_inactividad.split('T')[0]:datos[index].vul_fecha_inactividad,
    });
    setModalOpen(true);
  };

  const handleEliminar = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const codigoToDelete = datos[deleteIndex].vul_codigo;
    try {
      await deleteVulnerabilidades(codigoToDelete);
      toast.success("Vulnerabilidad eliminada correctamente");
      const vulnerabilidadesData = await getVulnerabilidadPorEmpresa(emp_codigo);
      setDatos(vulnerabilidadesData);
      setConfirmOpen(false);
      setDeleteIndex(null);
      setModalOpen(false);
      setFormulario({
        Tipo: '',
        FechaInicio: '',
        Identificacion: '',
        Nombre: '',
        Descripción: '',
        Observacion: '',
        FechaInactividad: null,
      });
    } catch (error) {
      // Si el error es por restricción de clave foránea
      if (
        error?.response?.data?.errno === 1451 || // MySQL: Cannot delete or update a parent row: a foreign key constraint fails
        (error?.response?.data?.code && error.response.data.code.includes("ER_ROW_IS_REFERENCED"))
      ) {
        toast.error("No se puede eliminar la vulnerabilidad porque está asociada a otra tabla.");
      } else {
        toast.error("Error al eliminar la vulnerabilidad.");
      }
      setConfirmOpen(false);
      setDeleteIndex(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  function generarIdentificacion() {
    const letras = Array(3)
      .fill(0)
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      .join('');
    const numeros = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${letras}-${numeros}`;
  }

  return (
    <Box>
      <Box sx={{ border: 'none', p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '97%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} align="left">
                  <Button variant="contained" color="primary" onClick={handleInsert} sx={{ width: 200 }}>
                    Insertar Nueva Vulnerabilidad
                  </Button>
                </TableCell>

                <TableCell colSpan={3} align="right">
                  <TextField label="Buscar" variant="outlined" value={busqueda} onChange={handleBusquedaChange} sx={{ width: 350 }}/>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} align="center">
                  Código
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Tipo
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Fecha de Inicio
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Identificacion
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Nombre
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Descripción
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Observacion
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Fecha de Inactividad
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={28} align="center">
                    No hay resultados para "{busqueda}"
                  </TableCell>
                </TableRow>
              ) : (
                datosFiltrados.map((dato, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={2} align="center">
                      {dato.vul_codigo}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.tvu_codigo}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.vul_fecha_inicio ? dato.vul_fecha_inicio.split('T')[0] : ''}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.vul_identificacion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.vul_nombre}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.vul_descripcion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.vul_observacion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.vul_fecha_inactividad ? dato.vul_fecha_inactividad.split('T')[0] : ''}
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
            {modificarIndex !== -1 ? 'Modificar Vulnerabilidad' : 'Nueva Vulnerabilidad'}
          </Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            name="Tipo"
            value={tipos
              .map((tipo) => ({ label: tipo.tvu_descripcion, value: tipo.tvu_codigo }))
              .find(opt => opt.value === formulario.Tipo) || null}
            options={tipos.map((tipo) => ({
              label: tipo.tvu_descripcion,
              value: tipo.tvu_codigo
            }))}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option?.label || ""}
            onChange={(event, newValue) => {
              setFormulario({
                ...formulario,
                Tipo: newValue ? newValue.value : '', // Guarda el código
              });
            }}
            renderInput={(params) => <TextField {...params} label="Tipos de Vulnerabilidad" />}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Inicio"
              name="FechaInicio"
              value={dayjs(formulario.FechaInicio)}
              onChange={handleDateChange} 
              minDate={dayjs()} 
              renderInput={(params) => <TextField {...params} />}
            />
             
          </LocalizationProvider>
          <Autocomplete
            disablePortal
            id="combo-box-unidad"
            name="Unidad"
            value={unidades
              .map((unidad) => ({ label: unidad.uni_nombre, value: unidad.uni_codigo }))
              .find(opt => opt.value === formulario.Unidad) || null}
            options={unidades.map((unidad) => ({
              label: unidad.uni_nombre,
              value: unidad.uni_codigo
            }))}
            sx={{ width: 300, mb: 2 }}
            getOptionLabel={(option) => option?.label || ""}
            onChange={(event, newValue) => {
              setFormulario({
                ...formulario,
                Unidad: newValue ? newValue.value : '',
              });
            }}
            renderInput={(params) => <TextField {...params} label="Unidad" />}
          />
          <Box paddingBottom={2}>
            <TextField label="Identificacion" name="Identificacion" fullWidth value={formulario.Identificacion} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Nombre" name="Nombre" fullWidth value={formulario.Nombre} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Descripción" name="Descripción" fullWidth value={formulario.Descripción} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Observación" name="Observacion" fullWidth value={formulario.Observacion} onChange={handleFormChange} />
          </Box>
          {modificarIndex !== -1 ?
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Inactividad"
                name="FechaInactividad"
                value={dayjs(formulario.FechaInactividad)}
                 onChange={handleFechaInactividadChange} // Use the new event handler // Use the updated event handler
                renderInput={(params) => <TextField {...params} />}
              />
               
            </LocalizationProvider>
            : ' '}
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
            ¿Está seguro que desea eliminar esta vulnerabilidad?
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

export default TablaGA;
