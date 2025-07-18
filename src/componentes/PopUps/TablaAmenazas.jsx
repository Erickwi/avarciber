import { useEffect, useState } from "react";

import dayjs from "dayjs";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  createAmenaza,
  deleteAmenaza,
  getAmenazasPorEmpresa,
  updateAmenaza,
} from "../../services/amenazas/amenazasData";
import { getTipoAmenazas } from "../../services/amenazas/tipoamenaza/tipoAmenazasData";
import { useAuth } from "../../context/AuthContext";
import { getProbabilidad } from "../../services/probabilidad/probabilidadData";
import { toast } from "react-toastify";

const TablaGA = () => {
  const [datos, setDatos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposIds, setTiposIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { user } = useAuth();
  const [modificarIndex, setModificarIndex] = useState(-1);
  const emp_codigo = user?.emp_codigo;
  const [probabilidades, setProbabilidades] = useState([]);
  const [formulario, setFormulario] = useState({
    Tipo: "",
    FechaInicio: "",
    Probabilidad: "",
    ProbabilidadId: "",
    Identificacion: "",
    Nombre: "",
    Descripción: "",
    Observacion: "",
    FechaInactividad: null,
  });

  useEffect(() => {
    const fetchProbabilidades = async () => {
      if (emp_codigo) {
        const probData = await getProbabilidad(emp_codigo);
        setProbabilidades(probData);
      }
    };
    fetchProbabilidades();
  }, [emp_codigo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (emp_codigo) {
          const amenazasData = await getAmenazasPorEmpresa(emp_codigo);
          setDatos(amenazasData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [emp_codigo]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const tiposData = await getTipoAmenazas();
        setTipos(tiposData);
      } catch (error) {
        console.error('Error fetching tipos:', error);
      }
    };
    fetchTipos();
  }, []);

  // Update tiposIds state after tipos has been updated
  useEffect(() => {
    const tiposIds1 = tipos.map((item) => item.tia_codigo);
    setTiposIds(tiposIds1);
  }, [tipos]);

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleDateChange = (newValue) => {
    // Format the date using dayjs before updating the state
    const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
    console.log(formattedDate);
    setFormulario({
      ...formulario,
      FechaInicio: formattedDate,
    });
  };
  const handleFechaInactividadChange = (newValue) => {
    // Format the date using dayjs before updating the state
    const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
    setFormulario({
      ...formulario,
      FechaInactividad: formattedDate,
    });
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      Tipo: "",
      TipoId: "",
      FechaInicio: "",
      Probabilidad: "",
      ProbabilidadId: "",
      Identificacion: generarIdentificacion(),
      Nombre: "",
      Descripción: "",
      Observacion: "",
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
    if (!formulario.TipoId) camposFaltantes.push("Tipo de Amenaza");
    if (!formulario.ProbabilidadId) camposFaltantes.push("Probabilidad");
    if (!formulario.FechaInicio) camposFaltantes.push("Fecha de Inicio");
    if (!formulario.Nombre) camposFaltantes.push("Nombre");
    if (!formulario.Descripción) camposFaltantes.push("Descripción");
    if (!formulario.Observacion) camposFaltantes.push("Observación");

    if (camposFaltantes.length > 0) {
      toast.error(`Faltan campos obligatorios: ${camposFaltantes.join(", ")}`);
      return;
    }
    try {
      const hoy = dayjs().format("YYYY-MM-DD");
      const dataToSubmit = {
        tipo: formulario.TipoId,
        probabilidad: formulario.ProbabilidadId,
        fecha_inicio: formulario.FechaInicio || null,
        identificacion: formulario.Identificacion,
        nombre: formulario.Nombre,
        descripcion: formulario.Descripción,
        fecha_inactividad: formulario.FechaInactividad || hoy,
        observacion: formulario.Observacion,
        emp_codigo: emp_codigo
      };
      if (modificarIndex !== -1) {
        await updateAmenaza(modificarIndex, dataToSubmit);
        toast.success("Amenaza modificada correctamente");
      } else {
        await createAmenaza(dataToSubmit);
        toast.success("Amenaza creada correctamente");
      }
      const updatedData = await getAmenazasPorEmpresa(emp_codigo);
      setDatos(updatedData);
      setModalOpen(false);
      setFormulario({
        Tipo: '',
        TipoId: '',
        FechaInicio: '',
        Identificacion: '',
        Nombre: '',
        Descripción: '',
        Observacion: '',
        FechaInactividad: null,
      });
    } catch (error) {
      toast.error("Error al guardar la amenaza", error.message);
    }
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setModificarIndex(-1);
    setFormulario({
      Tipo: "",
      FechaInicio: "",
      Identificacion: "",
      Nombre: "",
      Descripción: "",
      Observacion: "",
      FechaInactividad: null,
    });
  };

  const handleModificar = (index) => {
    const amenaza = datos[index];
    const selectedTipo = tipos.find(
      (tipo) => tipo.tia_codigo === amenaza.tia_codigo
    );

    setModificarIndex(amenaza.ame_codigo);
    setFormulario({
      TipoId: selectedTipo ? selectedTipo.tia_codigo : "",
      Tipo: selectedTipo ? selectedTipo.tia_descripcion : "",
      FechaInicio: amenaza.ame_fecha_inicio
        ? amenaza.ame_fecha_inicio.split("T")[0]
        : "",
      ProbabilidadId: amenaza.pro_codigo || "",
      Probabilidad: amenaza.ame_probabilidad || "",
      Identificacion: amenaza.ame_identificacion,
      Nombre: amenaza.ame_nombre,
      Descripción: amenaza.ame_descripcion,
      Observacion: amenaza.ame_observacion,
      FechaInactividad: amenaza.ame_fecha_inactividad
        ? amenaza.ame_fecha_inactividad.split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  const handleEliminar = async (index) => {
    const codigoToDelete = datos[index].ame_codigo;
    try {
      await deleteAmenaza(codigoToDelete);
      const updatedData = await getAmenazasPorEmpresa(emp_codigo);
      setDatos(updatedData);
      toast.success("Amenaza eliminada correctamente");
      setModalOpen(false);
      setFormulario({
        Tipo: "",
        FechaInicio: "",
        Identificacion: "",
        Nombre: "",
        Descripción: "",
        Observacion: "",
        FechaInactividad: null,
      });
    } catch (error) {
      // Si el error es por restricción de clave foránea
      if (
        error?.response?.data?.errno === 1451 || // MySQL: Cannot delete or update a parent row: a foreign key constraint fails
        (error?.response?.data?.code && error.response.data.code.includes("ER_ROW_IS_REFERENCED"))
      ) {
        toast.error("No se puede eliminar la amenaza porque está asociada a una vulnerabilidad o ya se hizo una valoración");
      } else {
        toast.error("Error al eliminar la amenaza.");
      }
    }
  };

  const datosFiltrados = datos.filter((dato) =>
    dato.ame_nombre && dato.ame_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
      <Box sx={{ border: "none", p: 4 }}>
        <TableContainer component={Paper}>
          <Table
            sx={{
              width: "97%",
              margin: "20px 10px 10px 10px",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell colSpan={20}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleInsert}
                    >
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
                  Fecha de Inactividad
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} align="center">
                    No hay registros para esta empresa
                  </TableCell>
                </TableRow>
              ) : (
                datosFiltrados.map((dato, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={2} align="center">
                      {dato.ame_codigo}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.tia_codigo}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.ame_fecha_inicio.split("T")[0]}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.ame_identificacion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.ame_nombre}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.ame_descripcion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.ame_observacion}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      {dato.ame_fecha_inactividad
                        ? dato.ame_fecha_inactividad.split("T")[0]
                        : dato.ame_fecha_inactividad}
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleModificar(index)}
                      >
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEliminar(index)}
                        sx={{ backgroundColor: "red" }}
                      >
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" gutterBottom paddingBottom={1}>
            {modificarIndex !== -1 ? "Modificar Amenaza" : "Nueva Amenaza"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              name="Tipo"
              value={
                tipos
                  .map((tipo) => ({ label: tipo.tia_descripcion, value: tipo.tia_codigo }))
                  .find(opt => opt.value === formulario.TipoId) || null
              }
              options={tipos.map((tipo) => ({
                label: tipo.tia_descripcion,
                value: tipo.tia_codigo
              }))}
              sx={{ width: "100%" }}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              onChange={(event, newValue) => {
                setFormulario({
                  ...formulario,
                  TipoId: newValue ? newValue.value : "",
                  Tipo: newValue ? newValue.label : "",
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Tipos de Amenazas" />
              )}
            />
            <Autocomplete
              disablePortal
              id="combo-box-probabilidad"
              name="Probabilidad"
              value={
                probabilidades
                  .map((prob) => ({ label: prob.pro_probabilidad, value: prob.pro_codigo }))
                  .find(opt => opt.value === formulario.ProbabilidadId) || null
              }
              options={probabilidades.map((prob) => ({
                label: prob.pro_probabilidad,
                value: prob.pro_codigo
              }))}
              sx={{ width: "100%" }}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              onChange={(event, newValue) => {
                setFormulario({
                  ...formulario,
                  ProbabilidadId: newValue ? newValue.value : "",
                  Probabilidad: newValue ? newValue.label : "",
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Probabilidad" />
              )}
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
            <TextField
              label="Identificacion"
              name="Identificacion"
              fullWidth
              value={formulario.Identificacion}
              onChange={handleFormChange}
            />
            <TextField
              label="Nombre"
              name="Nombre"
              fullWidth
              value={formulario.Nombre}
              onChange={handleFormChange}
            />
            <TextField
              label="Descripción"
              name="Descripción"
              fullWidth
              value={formulario.Descripción}
              onChange={handleFormChange}
            />
            <TextField
              label="Observación"
              name="Observacion"
              fullWidth
              value={formulario.Observacion}
              onChange={handleFormChange}
            />
            {modificarIndex !== -1 ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de Inactividad"
                  name="FechaInactividad"
                  value={dayjs(formulario.FechaInactividad)}
                  onChange={handleFechaInactividadChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : (
              " "
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={handleGuardar}>
                Guardar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TablaGA;
