import React, { useState, useEffect} from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import SecurityIcon from "@mui/icons-material/Security";
import "react-datepicker/dist/react-datepicker.css";
import { styled } from "@stitches/react";
import Column from "../../componentes/Column";
import { useAuth } from "../../context/AuthContext";
import { getActivosByFechaInicio } from "../../services/vulnerabilidades/vulnerabilidadActivo/vulnerabilidadActivo";
import { DayPicker } from "react-day-picker";
import { default as defaultStyles } from "react-day-picker/dist/style.module.css";
import { es } from "react-day-picker/locale";

const StyledColumns = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  margin: "2vh auto",
  width: "90%",
  gap: "16px",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
    gap: "24px",
  },
});

const LegendContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  padding: "12px",
  backgroundColor: "#0000000",
  borderRadius: 6,
  border: "1px solid #e2e8f0",
};

const ChipStyle = {
  fontWeight: 500,
  fontSize: "0.85rem",
  padding: "6px 12px",
};

const SeleccionarActivo = ({
  onRowsUpdate,
  setSelectedIds,
  setSelectedDates,
  lista2,
  setLista2,
}) => {
  const [activosFiltrados, setActivosFiltrados] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [columns, setColumns] = useState({
    Activos: { id: "Activos", list: [] },
    Escoger: { id: "Escoger", list: [] },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useAuth();
  const emp_codigo = user?.emp_codigo;
  const [range, setRange] = useState({ from: undefined, to: undefined });

  const areDatesEqual = (date1, date2) => {
    const withoutTime1 = new Date(date1);
    const withoutTime2 = new Date(date2);
    withoutTime1.setHours(0, 0, 0, 0);
    withoutTime2.setHours(0, 0, 0, 0);
    return withoutTime1.getTime() === withoutTime2.getTime();
  };

  const groupActivosByCodigo = (data) => {
    const grouped = data.reduce((acc, item) => {
      const key = item.act_codigo;
      if (!acc[key]) {
        acc[key] = {
          id: `${item.act_codigo}`,
          nombre: item.act_nombre,
          instancias: [],
        };
      }
      acc[key].instancias.push({
        act_codigo: item.act_codigo,
        vul_codigo: item.vul_codigo,
        vac_fecha_inicio: item.vac_fecha_inicio,
        vac_costo: item.vac_costo,
        ame_nombre: item.ame_nombre || "Sin amenaza definida",
        vul_nombre: item.vul_nombre || "Sin vulnerabilidad definida",
      });
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const handleRangeChange = async (selectedRange) => {
    setRange(selectedRange);
    setError(null);
    setLoading(true);

    try {
      if (!selectedRange?.from || !selectedRange?.to) {
        setActivosFiltrados([]);
        setColumns((prevColumns) => ({
          ...prevColumns,
          Activos: { ...prevColumns.Activos, list: [] },
        }));
        setLoading(false);
        return;
      }

      const fechaInicio = selectedRange.from.toISOString().split("T")[0];
      const fechaFin = selectedRange.to.toISOString().split("T")[0];

      const activosPorFecha = await getActivosByFechaInicio(fechaInicio, fechaFin, emp_codigo);
      
      const activosFiltradosSinDuplicados = activosPorFecha.filter(
        (activo) => !lista2.some((sel) => sel.act_codigo === activo.act_codigo)
      );

      setColumns((prevColumns) => ({
        ...prevColumns,
        Activos: {
          ...prevColumns.Activos,
          list: groupActivosByCodigo(activosFiltradosSinDuplicados),
        },
      }));
    } catch (error) {
      setError("Error al cargar los activos. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getLista() {
      setLoading(true);
      try {
        // Usa la fecha actual como fecha por defecto
        const fecha = new Date().toISOString().split("T")[0];
        const activos = await getActivosByFechaInicio(fecha, fecha, emp_codigo);

        const activosFiltradosSinDuplicados = activos.filter(
          (activo) => !lista2.some((sel) => sel.act_codigo === activo.act_codigo)
        );

        console.log("Activos obtenidos:", activos);
        const agrupados = groupActivosByCodigo(activosFiltradosSinDuplicados);
        console.log("Columnas agrupadas:", agrupados);

        setActivosFiltrados(activos);
        setColumns({
          Activos: {
            id: "Activos",
            list: agrupados,
          },
          Escoger: {
            id: "Escoger",
            list: [],
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los activos iniciales.");
      } finally {
        setLoading(false);
      }
    }
    getLista();
  }, [emp_codigo]);

  const guardarSeleccion = (nuevaLista2) => {
    if (!nuevaLista2 || nuevaLista2.length === 0) {
      setSelectedIds([]);
      setSelectedDates([]);
      setError("No se han seleccionado activos.");
      return;
    }
    const tempSelectedIds = nuevaLista2.map((item) => item.act_codigo);
    const tempSelectedDates = nuevaLista2.map((item) => item.vac_fecha_inicio);

    setSelectedIds(tempSelectedIds);
    setSelectedDates(tempSelectedDates);

    // Si quieres mostrar el snackbar automático:
    setOpenSnackbar(true);
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];
    const transferredItem = start.list[source.index];

    let nuevaLista2 = lista2;

    if (end.id === "Escoger") {
      nuevaLista2 = [...lista2, ...transferredItem.instancias];
      setLista2(nuevaLista2);
    } else if (end.id === "Activos") {
      const codigosAEliminar = transferredItem.instancias.map(i => i.act_codigo + "_" + i.vac_fecha_inicio);
      nuevaLista2 = lista2.filter(
        (item) => !codigosAEliminar.includes(item.act_codigo + "_" + item.vac_fecha_inicio)
      );
      setLista2(nuevaLista2);
    }

    if (start === end) {
      const newList = start.list.filter((_, idx) => idx !== source.index);
      newList.splice(destination.index, 0, transferredItem);
      setColumns((state) => ({
        ...state,
        [start.id]: { ...start, list: newList },
      }));
    } else {
      const newStartList = start.list.filter((_, idx) => idx !== source.index);
      const newEndList = [...end.list];
      newEndList.splice(destination.index, 0, transferredItem);
      setColumns((state) => ({
        ...state,
        [start.id]: { ...start, list: newStartList },
        [end.id]: { ...end, list: newEndList },
      }));
    }
    guardarSeleccion(nuevaLista2);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="flex-start"
        gap={4}
        mb={2}
      >
        {/* Columna izquierda: Fecha */}
        <Box sx={{ width: { xs: "100%", md: 320 }, minWidth: 260 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Selección de Activos
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
            Seleccione un rango de fecha para filtrar los activos.
          </Typography>
          <Box sx={{ maxWidth: 280, mx: "auto", mb: 2 }}>
            <DayPicker
              locale={es}
              fixedWeeks
              showOutsideDays
              navLayout="around"
              mode="range"
              selected={range}
              onSelect={handleRangeChange}
              classNames={defaultStyles}
            />
          </Box>
        </Box>
        {/* Columna derecha: Leyenda centrada arriba y Drag and Drop abajo */}
        <Box sx={{ flex: 1, width: "100%" }}>
          {/* Leyenda centrada */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                ...LegendContainer,
                minWidth: { xs: "90%", md: 400 },
                maxWidth: 500,
                background: "#fff",
                boxShadow: "0 2px 8px #e2e8f0",
                border: "1px solid #e2e8f0",
              }}
            >
              <TableContainer sx={{ border: "none", boxShadow: "none" }}>
                <Table
                  sx={{
                    minWidth: "100%",
                    "& .MuiTableCell-root": { borderBottom: "1px solid #e2e8f0" },
                  }}
                >
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ padding: "8px", verticalAlign: "middle" }}>
                        <Chip
                          icon={<WarningIcon style={{ color: "#60a5fa" }} />}
                          label="Amenazas"
                          sx={{
                            ...ChipStyle,
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                          }}
                          aria-label="Indicador de amenazas"
                        />
                      </TableCell>
                      <TableCell sx={{ padding: "8px", verticalAlign: "middle" }}>
                        <Typography variant="caption" color="text.secondary">
                          Indica el número de amenazas asociadas al activo.
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ padding: "8px", verticalAlign: "middle" }}>
                        <Chip
                          icon={<SecurityIcon style={{ color: "#f9a8d4" }} />}
                          label="Vulnerabilidades"
                          sx={{
                            ...ChipStyle,
                            backgroundColor: "#fce7f3",
                            color: "#be185d",
                          }}
                          aria-label="Indicador de vulnerabilidades"
                        />
                      </TableCell>
                      <TableCell sx={{ padding: "8px", verticalAlign: "middle" }}>
                        <Typography variant="caption" color="text.secondary">
                          Indica el número de vulnerabilidades asociadas.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          {/* Drag and Drop */}
          <DragDropContext onDragEnd={onDragEnd}>
            {columns.Activos.list.length > 0 || columns.Escoger.list.length > 0 ? (
              <StyledColumns>
                <Column col={columns.Activos} />
                <Column col={columns.Escoger} />
              </StyledColumns>
            ) : (
              <Typography sx={{ mt: 2, color: "text.secondary" }}>
                No hay activos disponibles para la fecha seleccionada.
              </Typography>
            )}
          </DragDropContext>
        </Box>
      </Box>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Activos guardados correctamente.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SeleccionarActivo;
