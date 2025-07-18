import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getActivosPorEmpresa } from "../services/activos/activosData";
import { getVulnerabilidadPorEmpresa } from "../services/vulnerabilidades/vulnerabilidadesData";
import { getAmenazasPorEmpresa } from "../services/amenazas/amenazasData";
import { createAmenazaVulnerabilidad } from "../services/amenazas/amenazasVulnerabilidades/amenazasVulnerabilidadesData";
import { useAuth } from "../context/AuthContext";

export const VulnerabilidadAmenaza = () => {
  const [rowData, setRowData] = useState({
    vulnerabilidad: null,
    amenazas: [],
  });
  const [activos, setActivos] = useState([]);
  const [vulnerabilidades, setVulnerabilidades] = useState([]);
  const [amenazas, setAmenazas] = useState([]);
  const [frecuenciaOptions] = useState([
    { label: "Muy Baja", value: "Muy Baja" },
    { label: "Baja", value: "Baja" },
    { label: "Media", value: "Media" },
    { label: "Alta", value: "Alta" },
    { label: "Muy Alta", value: "Muy Alta" },
  ]);
  const { user } = useAuth();
  const emp_codigo = user?.emp_codigo;

  useEffect(() => {
    async function fetchData() {
      try {
        const activosData = await getActivosPorEmpresa(emp_codigo);
        setActivos(
          activosData.map((item) => ({
            value: item.act_codigo,
            label: item.act_nombre,
          }))
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

        const amenazasData = await getAmenazasPorEmpresa(emp_codigo);
        setAmenazas(
          amenazasData.map((item) => ({
            value: item.ame_codigo,
            label: item.ame_nombre,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos.");
      }
    }
    fetchData();
  }, [emp_codigo]);

  const handleVulnerabilidadSelect = (selected) => {
    setRowData((prev) => ({
      ...prev,
      vulnerabilidad: selected,
      amenazas: [], // Reset amenazas when selecting a new vulnerabilidad
    }));
  };

  const handleAgregarAmenaza = () => {
    if (!rowData.vulnerabilidad) {
      toast.warn(
        "Debe seleccionar una vulnerabilidad antes de agregar amenazas."
      );
      return;
    }
    setRowData((prev) => ({
      ...prev,
      amenazas: [...prev.amenazas, { amenaza: null, frecuencia: null }],
    }));
  };

  const handleAmenazaSelect = (amenazaIndex, selected) => {
    setRowData((prev) => {
      const newAmenazas = [...prev.amenazas];
      newAmenazas[amenazaIndex].amenaza = selected;
      return { ...prev, amenazas: newAmenazas };
    });
  };

  const handleInputChange = (amenazaIndex, field, value) => {
    setRowData((prev) => {
      const newAmenazas = [...prev.amenazas];
      newAmenazas[amenazaIndex][field] = value;
      return { ...prev, amenazas: newAmenazas };
    });
  };

  const handleEliminarAmenaza = (amenazaIndex) => {
    if (rowData.amenazas.length <= 1) {
      toast.warn(
        "No puede eliminar la única amenaza. Debe haber al menos una amenaza."
      );
      return;
    }
    setRowData((prev) => {
      const newAmenazas = [...prev.amenazas];
      newAmenazas.splice(amenazaIndex, 1);
      return { ...prev, amenazas: newAmenazas };
    });
  };

  const handleGuardarClick = async () => {
    if (!rowData.vulnerabilidad || rowData.amenazas.length === 0) {
      toast.error(
        "Debe seleccionar una vulnerabilidad y al menos una amenaza."
      );
      return;
    }
    for (const amenaza of rowData.amenazas) {
      if (!amenaza.amenaza || !amenaza.frecuencia) {
        toast.error("Por favor, complete todos los campos antes de guardar.");
        return;
      }
    }

    try {
      await saveDataAmenaza();
      toast.success("Información guardada con éxito.");
      setRowData({ vulnerabilidad: null, amenazas: [] });
    } catch (error) {
      toast.error("Error al guardar los datos.");
    }
  };

  const saveDataAmenaza = async () => {
    const dataToSend = rowData.amenazas
      .filter((amenaza) => amenaza.amenaza && amenaza.frecuencia)
      .map((amenaza) => ({
        vul_codigo: rowData.vulnerabilidad.value,
        ame_codigo: amenaza.amenaza.value,
        amv_probabilidad: amenaza.frecuencia,
        amv_fecha_inicion: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        amv_fecha_inactividad: null,
        amv_valor_dano_promedio: null,
      }));

    if (dataToSend.length === 0) {
      throw new Error("No valid data to send.");
    }

    for (const data of dataToSend) {
      await createAmenazaVulnerabilidad(data);
    }
  };

  const handleCancelarProceso = () => {
    setRowData({ vulnerabilidad: null, amenazas: [] });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Asociar Vulnerabilidades a Amenazas
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          p: 3,
          backgroundColor: "#f9fafb",
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            Vulnerabilidad
          </Typography>
          <Select
            value={rowData.vulnerabilidad}
            options={vulnerabilidades}
            onChange={handleVulnerabilidadSelect}
            placeholder="Seleccione una Vulnerabilidad"
            isDisabled={!!rowData.vulnerabilidad}
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
            Amenazas Asociadas
          </Typography>

          {rowData.amenazas.map((amenaza, index) => (
            <Box
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: 2,
                p: 2,
                mb: 2,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Select
                value={amenaza.amenaza}
                options={amenazas}
                onChange={(selected) => handleAmenazaSelect(index, selected)}
                placeholder="Seleccione una Amenaza"
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

              <Select
                options={frecuenciaOptions}
                value={frecuenciaOptions.find(
                  (opt) => opt.value === amenaza.frecuencia
                )}
                onChange={(selectedValue) =>
                  handleInputChange(index, "frecuencia", selectedValue.value)
                }
                placeholder="Frecuencia"
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

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleEliminarAmenaza(index)}
                disabled={rowData.amenazas.length === 1}
                sx={{ height: "100%", borderRadius: 2 }}
              >
                Eliminar
              </Button>
            </Box>
          ))}

          <Button
            onClick={handleAgregarAmenaza}
            variant="outlined"
            disabled={!rowData.vulnerabilidad}
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
            Agregar Amenaza
          </Button>
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
