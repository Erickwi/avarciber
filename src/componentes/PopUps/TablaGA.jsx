import { useEffect, useState } from 'react';
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
import { actualizarUnidadDeActivo, addActivoUnidad, createActivo, deleteActivo, getActivoPorNombre, getActivos, getActivosPorEmpresa, updateActivo } from '../../services/activos/activosData';
import { getTiposActivos } from '../../services/activos/tiposActivos/tiposActivosData';
import { useAuth } from "../../context/AuthContext";
import { getUnidades, getUnidadId, getUnidadPorActivo } from '../../services/unidades/unidadesData';
import { toast } from "react-toastify";

const TablaGA = () => {
  const [datos, setDatos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposIds, setTiposIds] = useState([]);
  const [intentoGuardar, setIntentoGuardar] = useState(false);
  const [unidadesOptions, setUnidadesOptions] = useState([]);
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);
  const emp_codigo = user?.emp_codigo;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [codigoToDelete, setCodigoToDelete] = useState(null);
  const datosFiltrados = datos.filter((dato) =>
    dato.act_nombre && dato.act_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (emp_codigo) {
          const activosData = await getActivosPorEmpresa(emp_codigo);
          setDatos(activosData);
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
        const tiposActivosData = await getTiposActivos();
        // Assuming the response data is an array, you can set it to the 'datos' state
        setTipos(tiposActivosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  // Update tiposIds state after tipos has been updated
  useEffect(() => {
    const tiposIds1 = tipos.map((item) => ({
      label: item.tac_descripcion, 
      value: item.tac_codigo
    }));
    setTiposIds(tiposIds1);
  }, [tipos]);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const unidadesData = await getUnidades();
        const opciones = unidadesData
          .filter(u => u.emp_codigo === user.emp_codigo)
          .map(u => ({
            label: u.uni_nombre,
            value: u.uni_nombre // Solo el nombre, no el código
          }));
        setUnidadesOptions(opciones);
      } catch (error) {
        console.error('Error fetching unidades:', error);
      }
    };
    fetchUnidades();
  }, [user.emp_codigo]);

  const [formulario, setFormulario] = useState({
    Tipo: '',
    FechaInicio: '',
    Identificacion: '',
    Nombre: '',
    Unidad: '',
    Descripción: '',
    Observacion: '',
    Valor: '',
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

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      Tipo: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Descripción: '',
      Observacion: '',
      Valor: '',
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

  function generarIdentificador() {
    const letras = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    const numeros = String(Math.floor(100 + Math.random() * 900)); // 3 dígitos
    return `${letras}-${numeros}`;
  }

  const handleGuardar = async () => {
    setIntentoGuardar(true);
    const camposFaltantes = [];
    if (!formulario.Tipo) camposFaltantes.push("Tipo de Activo");
    if (!formulario.FechaInicio) camposFaltantes.push("Fecha de Inicio");
    if (!formulario.Nombre) camposFaltantes.push("Nombre");
    if (!formulario.Unidad) camposFaltantes.push("Unidad");
    if (!formulario.Descripción) camposFaltantes.push("Descripción");
    if (!formulario.Observacion) camposFaltantes.push("Observación");
    if (!formulario.Valor) camposFaltantes.push("Valor");
    if (Number(formulario.Valor) <= 0) {
      toast.error("El valor debe ser un número positivo mayor a cero.");
      return;
    }
    if (camposFaltantes.length > 0) {
      toast.error(`Faltan campos obligatorios: ${camposFaltantes.join(", ")}`);
      return;
    }
    try {
    if (modificarIndex !== -1) {
      // Modificar el dato existente en la posición 'modificarIndex'
      const normalizarActivo = (formulario) => ({
        Tipo: formulario.Tipo,
        FechaInicio: formulario.FechaInicio || null,
        Identificacion: formulario.Identificacion,
        Nombre: formulario.Nombre,
        Descripción: formulario.Descripción,
        FechaInactividad: formulario.FechaInactividad || null,
        Observacion: formulario.Observacion,
        Valor: formulario.Valor === '' ? null : Number(formulario.Valor),
      });
      await updateActivo(modificarIndex, normalizarActivo(formulario));
      toast.success("Activo modificado correctamente");
      if (formulario.Unidad) {
        await actualizarUnidadDeActivo(modificarIndex, formulario.Unidad, user.emp_codigo);
      }
      const activosData = await getActivosPorEmpresa(emp_codigo);
      setDatos(activosData);
    } else {
      const identificador = generarIdentificador();
      // 1. Crear el activo (solo los campos requeridos)
      await createActivo({
        Tipo: formulario.Tipo,
        FechaInicio: formulario.FechaInicio,
        Identificacion: identificador,
        Nombre: formulario.Nombre,
        Descripción: formulario.Descripción,
        Observacion: formulario.Observacion,
        Valor: formulario.Valor,
        FechaInactividad: formulario.FechaInactividad,
      });

      // 2. Obtener el código del activo recién creado
      const activoCreado = await getActivoPorNombre(formulario.Nombre);
      // 3. Relacionar el activo con la unidad seleccionada (usando el código de la unidad)
      if (activoCreado && activoCreado.act_codigo && formulario.Unidad) {
        // Buscar el objeto unidad para obtener el uni_codigo
        const unidadSeleccionada = unidadesOptions.find(opt => opt.value === formulario.Unidad);
        if (unidadSeleccionada) {
          const unidadesData = await getUnidades();
          const unidadObj = unidadesData.find(
            u => u.uni_nombre === unidadSeleccionada.label && u.emp_codigo === user.emp_codigo
          );
          if (unidadObj) {
            await addActivoUnidad(unidadObj.uni_codigo, activoCreado.act_codigo);
          }
        }
      }
      toast.success("Activo creado correctamente");
      const activosData = await getActivosPorEmpresa(emp_codigo);
      setDatos(activosData);
    }

    setModalOpen(false);
    setFormulario({
      Tipo: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Unidad: '',
      Descripción: '',
      Observacion: '',
      Valor: '',
      FechaInactividad: null,
    });
    setIntentoGuardar(false);
    } catch (error) {
      // Validación para error de duplicado en la relación unidad-activo
      if (
        error?.code === "ER_DUP_ENTRY" ||
        error?.errno === 1062 ||
        (error?.response?.data?.code === "ER_DUP_ENTRY") ||
        (error?.response?.data?.errno === 1062)
      ) {
        toast.error("Ya existe una relación entre este activo y la unidad seleccionada. No se permiten duplicados.");
      } else {
        toast.error("Error al guardar el activo");
      }
    }
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
      Valor: '',
      FechaInactividad: null,
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

  const handleModificar = async (codigo) => {
    const activo = datos.find(d => d.act_codigo === codigo);

    const formattedFechaInicio = activo?.act_fecha_inicio
      ? dayjs(activo.act_fecha_inicio).format('YYYY-MM-DD')
      : '';
    const formattedFechaInactividad = activo?.act_fecha_inactividad
      ? dayjs(activo.act_fecha_inactividad).format('YYYY-MM-DD')
      : '';

    let unidadNombre = '';
    try {
      const unidad = await getUnidadPorActivo(activo.act_codigo);
      unidadNombre = unidad?.uni_nombre || '';
    } catch (e) {
      unidadNombre = '';
    }

    setModificarIndex(activo.act_codigo);
    setFormulario({
      Tipo: activo.tac_codigo,
      FechaInicio: formattedFechaInicio,
      Identificacion: activo.act_identificacion,
      Nombre: activo.act_nombre,
      Unidad: unidadNombre,
      Descripción: activo.act_descripcion,
      Observacion: activo.act_observacion,
      Valor: activo.act_valor,
      FechaInactividad: formattedFechaInactividad,
    });
    setModalOpen(true);
  };
  

  const handleEliminar = (codigo) => {
    setCodigoToDelete(codigo);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteActivo(codigoToDelete);
      toast.success("Activo eliminado correctamente");
      const activosData = await getActivosPorEmpresa(emp_codigo);
      setDatos(activosData);
      setConfirmOpen(false);
      setCodigoToDelete(null);
    } catch (error) {
      if (error?.response?.status === 400 && error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (
        error?.response?.data?.errno === 1451 ||
        error?.response?.data?.code === "ER_ROW_IS_REFERENCED_2" ||
        error?.response?.data?.code === "ER_ROW_IS_REFERENCED"
      ) {
        toast.error("No se puede eliminar el activo porque está relacionado con otras tablas.");
      } else {
        toast.error("Error al eliminar el activo.");
      }
      setConfirmOpen(false);
      setCodigoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setCodigoToDelete(null);
  };
  return (
    <Box>
      <Box sx={{ border: 'none', p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '100%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <TableBody>
              <TableRow>
                <TableCell colSpan={20}>
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
                  Valor
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Fecha de Inactividad
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} align="center">
                    No hay activos registrados para esta empresa
                  </TableCell>
                </TableRow>
              ) : datosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} align="center">
                    No hay resultados para "{busqueda}"
                  </TableCell>
                </TableRow>
              ) : (
                datosFiltrados.map((dato) => (
                  <TableRow key={dato.act_codigo}>
                    <TableCell colSpan={2} align="center">
                      {dato.act_codigo}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.tac_codigo}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.act_fecha_inicio
                        ? (dato.act_fecha_inicio || '').split('T')[0]
                        : 'Sin fecha de inicio'}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.act_identificacion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.act_nombre}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.act_descripcion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.act_observacion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.act_valor}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.act_fecha_inactividad
                        ? (dato.act_fecha_inactividad || '').split('T')[0]
                        : 'Sin fecha de inactividad'}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button variant="contained" color="primary" onClick={() => handleModificar(dato.act_codigo)}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button variant="contained" color="secondary" onClick={() => handleEliminar(dato.act_codigo)} sx={{ backgroundColor: 'red' }}>
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
          <Typography variant="h6" gutterBottom paddingBottom={2}>
            {modificarIndex !== -1 ? 'Modificar Activo' : 'Nuevo Activo'}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              name="Tipo"
              value={tiposIds.find(opt => opt.value === formulario.Tipo) || null}
              options={tiposIds}
              sx={{ width: 300 }}
              getOptionLabel={(option) => option?.label || ""}
              onChange={(event, newValue) => {
                setFormulario({
                  ...formulario,
                  Tipo: newValue ? newValue.value : "",
                });
              }}
              renderInput={(params) => <TextField {...params} label="Tipo de Activo" />}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Inicio"
                name="FechaInicio"
                value={formulario.FechaInicio ? dayjs(formulario.FechaInicio) : null}
                onChange={handleDateChange}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    error: intentoGuardar && !formulario.FechaInicio,
                    helperText: intentoGuardar && !formulario.FechaInicio ? "La fecha es obligatoria" : "",
                  }
                }}
              />
            </LocalizationProvider>
            <TextField label="Nombre" name="Nombre" fullWidth value={formulario.Nombre} onChange={handleFormChange} />
            <Autocomplete
              disablePortal
              id="combo-box-unidad"
              name="Unidad"
              value={unidadesOptions.find(opt => opt.value === formulario.Unidad) || null}
              options={unidadesOptions.length > 0 ? unidadesOptions : [{ label: "No hay unidades por el momento", value: "" }]}
              sx={{ width: 300 }}
              getOptionLabel={(option) => option?.label || ""}
              onChange={(event, newValue) => {
                setFormulario({
                  ...formulario,
                  Unidad: newValue ? newValue.value : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Unidad"
                  inputProps={{ ...params.inputProps, readOnly: true }}
                />
              )}
              disabled={unidadesOptions.length === 0}
            />
            <TextField label="Descripción" name="Descripción" fullWidth value={formulario.Descripción} onChange={handleFormChange} />
            <TextField label="Observación" name="Observacion" fullWidth value={formulario.Observacion} onChange={handleFormChange} />
            <TextField label="Valor" type="number" name="Valor" inputProps={{min:2}} fullWidth value={formulario.Valor} onChange={(e) => {
              // Solo permite números (sin letras, sin punto decimal)
              let value = e.target.value.replace(/[^0-9]/g, "");
              // Evita ceros a la izquierda (excepto "0")
              if (value.length > 1 && value[0] === "0") {
                value = value.replace(/^0+/, "");
                if (value === "") value = "0";
              }
              setFormulario({
                ...formulario,
                Valor: value,
              });
            }}/>
            {modificarIndex !== -1 ?
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de Inactividad"
                  name="FechaInactividad"
                  value={dayjs(formulario.FechaInactividad)}
                  onChange={handleFechaInactividadChange}
                  // Use the updated event handler
                />
              </LocalizationProvider>
              : ' '}
            
            <Button variant="contained" fullWidth color="error" onClick={handleCancelar} sx={{ mr: 10 }}>
              Cancelar
            </Button>
            <Button variant="contained" fullWidth color="primary" onClick={handleGuardar}>
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
            ¿Está seguro que desea eliminar este activo?
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