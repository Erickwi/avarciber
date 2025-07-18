import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Slider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getActivosPorEmpresa } from "../services/activos/activosData";
import { getVulnerabilidadPorEmpresa } from "../services/vulnerabilidades/vulnerabilidadesData";
import {
  getAmenazasVulnerabilidades,
  getFechaAmenazaVulnerabilidad,
} from "../services/amenazas/amenazasVulnerabilidades/amenazasVulnerabilidadesData";
import { createVulnerabilidadActivo } from "../services/vulnerabilidades/vulnerabilidadActivo/vulnerabilidadActivo";
import { createValorImpacto } from "../services/valorImpacto/valorImpactoData";
import { useAuth } from "../context/AuthContext";

export const Gestionar = () => {
  const [rowData, setRowData] = useState({
    activo: null,
    vulnerabilidades: [],
  });
  const [activos, setActivos] = useState([]);
  const [vulnerabilidades, setVulnerabilidades] = useState([]);
  const [amenazasVulnerabilidades, setAmenazasVulnerabilidades] = useState([]);
  const [showFechaBox, setShowFechaBox] = useState({});
  const [frecuenciaOptions] = useState([
    { label: "Muy Baja", value: "Muy Baja" },
    { label: "Baja", value: "Baja" },
    { label: "Media", value: "Media" },
    { label: "Alta", value: "Alta" },
    { label: "Muy Alta", value: "Muy Alta" },
  ]);
  const { user } = useAuth();
  const emp_codigo = user?.emp_codigo;

  const marcasDeslizador = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  useEffect(() => {
    async function fetchData() {
      try {
        const activosData = await getActivosPorEmpresa(emp_codigo);
        setActivos(
          Array.isArray(activosData)
            ? activosData.map((item) => ({
                value: item.act_codigo,
                label: item.act_nombre,
              }))
            : []
        );

        const vulnerabilidadesData = await getVulnerabilidadPorEmpresa(
          emp_codigo
        );
        setVulnerabilidades(
          vulnerabilidadesData.map((item) => ({
            value: item.vul_codigo,
            label: item.vul_nombre,
          }))
        );

        const amenazasVulnerabilidadesData =
          await getAmenazasVulnerabilidades();
        setAmenazasVulnerabilidades(
          amenazasVulnerabilidadesData.map((item) => ({
            value: item.vul_codigo,
            label: item.vul_nombre,
            amv_fecha_inicio: item.amv_fecha_inicio,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos.");
      }
    }
    fetchData();
  }, [emp_codigo]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    const opcionesDeFormato = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString(undefined, opcionesDeFormato);
  };

  const handleActivoSelect = (selected) => {
    setRowData((prev) => ({
      ...prev,
      activo: selected,
      vulnerabilidades: [],
    }));
  };

  const handleAddVulnerabilidad = () => {
    if (!rowData.activo) {
      toast.warn(
        "Debe seleccionar un activo antes de agregar una vulnerabilidad."
      );
      return;
    }
    setRowData((prev) => ({
      ...prev,
      vulnerabilidades: [
        ...prev.vulnerabilidades,
        {
          vulnerabilidad: null,
          fechaVulnerabilidad: null,
          dimension1: 1,
          dimension2: 1,
          dimension3: 1,
          costo: "",
        },
      ],
    }));
    setShowFechaBox((prev) => ({
      ...prev,
      [rowData.vulnerabilidades.length]: false,
    }));
  };

  const handleVulnerabilidadSelect = async (vulIndex, selected) => {
    try {
      const fechaVulnerabilidad = await getFechaAmenazaVulnerabilidad(
        selected.value
      );
      const formattedFecha = fechaVulnerabilidad?.[0]?.amv_fecha_inicion
        ? formatearFecha(fechaVulnerabilidad[0].amv_fecha_inicion)
        : "";

      setRowData((prev) => {
        const newVulnerabilidades = [...prev.vulnerabilidades];
        newVulnerabilidades[vulIndex] = {
          ...newVulnerabilidades[vulIndex],
          vulnerabilidad: selected,
          fechaVulnerabilidad: formattedFecha,
        };
        return { ...prev, vulnerabilidades: newVulnerabilidades };
      });

      setShowFechaBox((prev) => ({
        ...prev,
        [vulIndex]: !!formattedFecha,
      }));
    } catch (error) {
      console.error("Error obteniendo la fecha de la vulnerabilidad:", error);
      toast.warn(
        "Primero debe asociar amenazas a esta vulnerabilidad para continuar."
      );
    }
  };

  const handleInputChange = (vulIndex, field, value) => {
    setRowData((prev) => {
      const newVulnerabilidades = [...prev.vulnerabilidades];
      newVulnerabilidades[vulIndex][field] = value;
      return { ...prev, vulnerabilidades: newVulnerabilidades };
    });
  };

  const handleEliminarVulnerabilidad = (vulIndex) => {
    if (rowData.vulnerabilidades.length <= 1) {
      toast.warn(
        "No puede eliminar la única vulnerabilidad. Debe haber al menos una vulnerabilidad."
      );
      return;
    }
    setRowData((prev) => {
      const newVulnerabilidades = [...prev.vulnerabilidades];
      newVulnerabilidades.splice(vulIndex, 1);
      return { ...prev, vulnerabilidades: newVulnerabilidades };
    });
    setShowFechaBox((prev) => {
      const newShowFechaBox = { ...prev };
      delete newShowFechaBox[vulIndex];
      return newShowFechaBox;
    });
  };

  const handleGuardarClick = async () => {
    if (!rowData.activo) {
      toast.error("Debe seleccionar un activo antes de guardar.");
      return;
    }
    for (const vul of rowData.vulnerabilidades) {
      if (
        !vul.vulnerabilidad ||
        !vul.dimension1 ||
        !vul.dimension2 ||
        !vul.dimension3 ||
        !vul.costo
      ) {
        toast.error("Debe completar todos los campos antes de guardar.");
        return;
      }
    }

    try {
      await saveDataToApi();
      await saveData2();
      toast.success("Información guardada con éxito.");
      setRowData({ activo: null, vulnerabilidades: [] });
      setShowFechaBox({});
    } catch (error) {
      // Validación para error de duplicado
      if (
        error?.code === "ER_DUP_ENTRY" ||
        error?.errno === 1062 ||
        (error?.response?.data?.code === "ER_DUP_ENTRY")
      ) {
        toast.error("Ya hay una asociación entre ese activo y esa vulnerabilidad. No se permiten duplicados.");
      } else {
        toast.error("Error al guardar los datos.");
      }
    }
  };

  const formatearFechaLocal = () => {
    const date = new Date();
    const offset = -5; // Zona horaria -05:00
    const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    const seconds = String(localDate.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const saveDataToApi = async () => {
    const dataToSend = rowData.vulnerabilidades
      .filter((vul) => vul.vulnerabilidad && rowData.activo && vul.costo !== "")
      .map((vul) => ({
        vul_codigo: vul.vulnerabilidad.value,
        act_codigo: rowData.activo.value,
        vac_costo: vul.costo,
        vac_fecha_inicio: formatearFechaLocal(),
        vac_fecha_inactividad: null,
      }));

    if (dataToSend.length === 0) {
      throw new Error("No valid data to send.");
    }

    for (const data of dataToSend) {
      await createVulnerabilidadActivo(data);
    }
  };

  const saveData2 = async () => {
    const dataToSend = [];
    for (const vul of rowData.vulnerabilidades) {
      if (
        !vul.vulnerabilidad ||
        !rowData.activo ||
        !vul.dimension1 ||
        !vul.dimension2 ||
        !vul.dimension3
      ) {
        continue;
      }
      const dimensions = [
        { divCodigo: 1, value: vul.dimension1 },
        { divCodigo: 2, value: vul.dimension2 },
        { divCodigo: 3, value: vul.dimension3 },
      ];
      for (const dimension of dimensions) {
        if (dimension.value) {
          const data = {
            div_codigo: dimension.divCodigo,
            vul_codigo: vul.vulnerabilidad.value,
            act_codigo: rowData.activo.value,
            vai_fecha: formatearFechaLocal(),
            vai_valor: dimension.value,
          };
          dataToSend.push(data);
        }
      }
    }
    if (dataToSend.length === 0) {
      throw new Error("No valid data to send.");
    }
    for (const data of dataToSend) {
      await createValorImpacto(data);
    }
  };

  const handleCancelarProceso = () => {
    setRowData({ activo: null, vulnerabilidades: [] });
    setShowFechaBox({});
  };

  return (
    <Box sx={{ p: { xs: 4, md: 9 } }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Seleccionar Activo por Vulnerabilidad
      </Typography>

      <Box
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          p: 3,
          backgroundColor: "#f9fafb",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Activo
            </Typography>
            <Select
              value={rowData.activo}
              options={activos}
              onChange={handleActivoSelect}
              placeholder="Seleccione un Activo"
              isDisabled={rowData.vulnerabilidades.length > 0}
              className="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: 8,
                  borderColor: "#cbd5e1",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#3b82f6" },
                }),
              }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Vulnerabilidades
            </Typography>

            {rowData.vulnerabilidades.map((vul, index) => (
              <Box
                key={index}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 2,
                  p: 5,
                  mb: 2,
                  backgroundColor: "#ffffff",
                  borderRadius: 2,
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Select
                  value={vul.vulnerabilidad}
                  options={vulnerabilidades}
                  onChange={(selected) =>
                    handleVulnerabilidadSelect(index, selected)
                  }
                  placeholder="Seleccione una Vulnerabilidad"
                  isSearchable
                  isDisabled={!rowData.activo}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 8,
                      borderColor: "#cbd5e1",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                  }}
                />
                {showFechaBox[index] && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "gray",
                      mt: 1,
                      mb: 2,
                    }}
                  >
                    Fecha de creación:{" "}
                    {formatearFecha(vul.fechaVulnerabilidad || "")}
                  </Typography>
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2 }}>
                  Dimensiones de Seguridad
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", color: "gray", mb: 1 }}
                >
                  Estime con un valor de 1-10 para cada caso, donde 1 es el
                  menor impacto.
                </Typography>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Disponibilidad
                  </Typography>
                  <Slider
                    value={vul.dimension1}
                    onChange={(e, value) =>
                      handleInputChange(index, "dimension1", value)
                    }
                    step={null}
                    min={1}
                    max={10}
                    marks={marcasDeslizador}
                    color="secondary"
                    sx={{ width: "97%", ml: "auto" }}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Integridad
                  </Typography>
                  <Slider
                    value={vul.dimension2}
                    onChange={(e, value) =>
                      handleInputChange(index, "dimension2", value)
                    }
                    step={null}
                    min={1}
                    max={10}
                    marks={marcasDeslizador}
                    sx={{ width: "97%", ml: "auto" }}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Confidencialidad
                  </Typography>
                  <Slider
                    value={vul.dimension3}
                    onChange={(e, value) =>
                      handleInputChange(index, "dimension3", value)
                    }
                    step={null}
                    min={1}
                    max={10}
                    marks={marcasDeslizador}
                    color="secondary"
                    sx={{ width: "97%", ml: "auto" }}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Costo
                  </Typography>
                  <TextField
                    type="text"
                    value={vul.costo}
                    onChange={(e) => {
                      // Solo permite números positivos y opcionalmente un punto decimal
                      let value = e.target.value.replace(/[^0-9.]/g, "");
                      // Evita más de un punto decimal
                      if ((value.match(/\./g) || []).length > 1) {
                        value = value.substring(0, value.length - 1);
                      }
                      // Evita ceros a la izquierda (excepto "0." para decimales)
                      if (value.length > 1 && value[0] === "0" && value[1] !== ".") {
                        value = value.replace(/^0+/, "");
                        if (value === "") value = "0";
                      }
                      handleInputChange(index, "costo", value);
                    }}
                    label="Ingrese el costo (en USD) del activo"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleEliminarVulnerabilidad(index)}
                  disabled={!vul.vulnerabilidad}
                  sx={{ borderRadius: 2, mt: 1 }}
                >
                  Eliminar Vulnerabilidad
                </Button>
              </Box>
            ))}

            <Button
              onClick={handleAddVulnerabilidad}
              variant="outlined"
              disabled={!rowData.activo}
              sx={{
                mt: 1,
                borderRadius: 2,
                borderColor: "#3b82f6",
                color: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#eff6ff",
                  borderColor: "#3b82f6",
                },
              }}
            >
              Añadir Vulnerabilidad
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleGuardarClick}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Guardar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancelarProceso}
          sx={{
            borderRadius: 2,
            px: 3,
            borderColor: "#94a3b8",
            color: "#475569",
            "&:hover": { backgroundColor: "#f1f5f9" },
          }}
        >
          Cancelar
        </Button>
      </Box>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="light"
      />
    </Box>
  );
};
