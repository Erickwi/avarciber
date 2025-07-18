import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@stitches/react"; // Corregido el import
import "react-datepicker/dist/react-datepicker.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment-timezone";
import FunctionsIcon from "@mui/icons-material/Functions";
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Cell,
  LabelList,
  Dot,
} from "recharts";
import { useWindowSize } from "react-use";
import {
  Grid
} from "@mui/material";
import {
  getAmenazasVulnerabilidadesRangos,
  getTablaAmenazasVulnerabilidades,
} from "../services/amenazas/amenazasVulnerabilidades/amenazasVulnerabilidadesData";
import { useNavigate } from "react-router-dom";
import SeleccionarActivo from "./CalculoRiesgo/SeleccionarActivo";
import TablaAmenaza from "./CalculoRiesgo/TablaAmenaza";
/*function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit">
        AVARCIBER
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}*/

export const Riesgo = () => {
  const navigate = useNavigate(); // ✅ Aquí sí
  const [lista2, setLista2] = useState([]);
  const [resetKey, setResetKey] = useState(0);
  const steps = [
    "Seleccionar Activos",
    "Visualizacion",
    "Calculo de Probabilidad",
  ];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <SeleccionarActivo
            key={resetKey}
            onRowsUpdate={handleActualizacion}
            setSelectedIds={setSelectedIds}
            setSelectedDates={setSelectedDates}
            lista2={lista2}
            setLista2={setLista2}
          />
        );
      case 1:
        return (
          <TablaAmenaza
            selectedIds={selectedIds}
            selectedDates={selectedDates}
          />
        );
      case 2:
        return (
          <TablaResultado
            selectedIds={selectedIds}
            selectedDates={selectedDates}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  const StyledColumns = styled("div", {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    margin: "5vh auto",
    width: "80%",
    height: "80vh",
    gap: "8px",
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [guardado, setGuardado] = useState(false);

 
  function createData(item1, item2, item3) {
    return {
      item1,
      item2,
      item3,
    };
  }

  const [rows, setRows] = useState([]);

  const handleActualizacion = (filasActualizadas) => {
    setRows(filasActualizadas);
  };

  const headCells = [
    {
      id: "item1",
      numeric: false,
      label: "Activo",
    },
    {
      id: "item2",
      numeric: false,
      label: "Vulnerabilidad",
    },
    {
      id: "item3",
      numeric: false,
      label: "Amenaza",
    },
  ];

  

  const TablaResultado = ({ selectedIds, selectedDates }) => {
    const [tablaFinal, setTablaFinal] = useState([]);
    const [frecuenciaOptions] = useState([
      { label: "Muy Baja", value: "Muy Baja" },
      { label: "Baja", value: "Baja" },
      { label: "Media", value: "Media" },
      { label: "Alta", value: "Alta" },
      { label: "Muy Alta", value: "Muy Alta" },
    ]);
    const { width } = useWindowSize();
    const [riesgoData, setRiesgoData] = useState([]);
    const [data, setData] = useState([]);
    const riesgoOrder = [
      "Despreciable",
      "Bajo",
      "Medio",
      "Alto",
      "Muy Alto",
      "Daño Extremo",
    ];

    const sortedTablaFinal = [...tablaFinal].sort(
      (a, b) => riesgoOrder.indexOf(a.riesgo) - riesgoOrder.indexOf(b.riesgo)
    );

    useEffect(() => {
      async function fetchData() {
        try {
          console.log("IDs en TablaResultado:", selectedIds);
          console.log("Fechas en TablaResultado:", selectedDates);

          const responses = [];

          for (let i = 0; i < selectedIds.length; i++) {
            const currentId = selectedIds[i];
            let currentDate = selectedDates[i];

            if (!currentDate) {
              console.error(
                `No hay fecha correspondiente para el ID ${currentId}`
              );
              continue;
            }

            currentDate = moment
              .utc(currentDate)
              .tz("America/Bogota")
              .format("YYYY-MM-DD");

            console.log(
              `Solicitando datos para id: ${currentId}, fecha: ${currentDate}`
            );

            try {
              const activoVulnerabilidadData =
                await getTablaAmenazasVulnerabilidades(currentId, currentDate);

              console.log("Datos de TablaResultado:", activoVulnerabilidadData);

              if (!Array.isArray(activoVulnerabilidadData)) {
                console.error(
                  `La respuesta para ID ${currentId}, fecha ${currentDate} no es un arreglo`
                );
                continue;
              }

              const mappedData = activoVulnerabilidadData.map((item) => ({
                amenaza: item.ame_nombre,
                vulnerabilidad: item.vul_nombre,
                promedio: Number(item.promedio_grupo),
                costo: Number(item.vac_costo),
                frecuencia1: item.amv_probabilidad,
                riesgo: "",
                riesgoNumerico: 0,
              }));

              responses.push(mappedData);
            } catch (error) {
              console.error(
                `Error en la solicitud para ID ${currentId}, fecha ${currentDate}:`,
                error
              );
            }
          }

          const combinedData = responses.flat();

          const frecuenciaOrder = {
            "Muy Baja": 1,
            Baja: 2,
            Media: 3,
            Alta: 4,
            "Muy Alta": 5,
          };

          const groupedByThreatAndVuln = combinedData.reduce((acc, item) => {
            const key = `${item.amenaza}|${item.vulnerabilidad}`;
            if (!acc[key]) {
              acc[key] = {
                amenaza: item.amenaza,
                vulnerabilidad: item.vul_nombre,
                promedios: [item.promedio],
                costos: [item.costo],
                frecuencia1: item.frecuencia1,
              };
            } else {
              acc[key].promedios.push(item.promedio);
              acc[key].costos.push(item.costo);
              acc[key].frecuencia1 =
                frecuenciaOrder[item.frecuencia1] >
                frecuenciaOrder[acc[key].frecuencia1]
                  ? item.frecuencia1
                  : acc[key].frecuencia1;
            }
            return acc;
          }, {});

          const consolidatedByThreatAndVuln = Object.values(
            groupedByThreatAndVuln
          ).map((group) => {
            const promedioMedia = Number(
              (
                group.promedios.reduce((acc, val) => acc + val, 0) /
                group.promedios.length
              ).toFixed(2)
            );
            const costoTotal = group.costos.reduce((acc, val) => acc + val, 0);
            return {
              amenaza: group.amenaza,
              vulnerabilidad: group.vul_nombre,
              promedio: promedioMedia,
              costo: costoTotal,
              frecuencia1: group.frecuencia1,
            };
          });

          const groupedByThreat = consolidatedByThreatAndVuln.reduce(
            (acc, item) => {
              const key = item.amenaza;
              if (!acc[key]) {
                acc[key] = {
                  amenaza: item.amenaza,
                  promedios: [item.promedio],
                  costos: [item.costo],
                  frecuencias: [item.frecuencia1],
                };
              } else {
                acc[key].promedios.push(item.promedio);
                acc[key].costos.push(item.costo);
                acc[key].frecuencias.push(item.frecuencia1);
              }
              return acc;
            },
            {}
          );

          const calculatedData = Object.values(groupedByThreat).map((group) => {
            const promedioMedia = Math.round(
              group.promedios.reduce((acc, val) => acc + val, 0) /
                group.promedios.length
            );
            const costoTotal = group.costos.reduce((acc, val) => acc + val, 0);
            const frecuenciaMasAlta = group.frecuencias.reduce((max, curr) => {
              return frecuenciaOrder[curr] > frecuenciaOrder[max] ? curr : max;
            }, group.frecuencias[0]);
            return {
              amenaza: group.amenaza,
              frecuencia1: frecuenciaMasAlta,
              promedio: promedioMedia,
              costo: costoTotal,
              riesgo: "",
              riesgoNumerico: 0,
            };
          });

          setTablaFinal(calculatedData);

          const riesgoData = await getAmenazasVulnerabilidadesRangos();
          const riesgoMapeado = riesgoData.map((item) => ({
            VAL_IMPACTO: item.VAL_IMPACTO,
            VA_FRECUENCIA: item.VA_FRECUENCIA,
            VA_IMPACTO: item.VA_IMPACTO,
            VAL_RIESGO: item.VAL_RIESGO,
          }));
          console.log("Datos de riesgo:", riesgoMapeado);
          setRiesgoData(riesgoMapeado);
        } catch (error) {
          console.error("Error general:", error);
        }
      }

      fetchData();
    }, [selectedIds, selectedDates]);

    const handleFrecuenciaChange = (selectedFrecuencia, rowIndex) => {
      const promedio = tablaFinal[rowIndex].promedio;

      const matchingData = riesgoData.find(
        (data) =>
          data.VA_FRECUENCIA === selectedFrecuencia &&
          data.VAL_IMPACTO === promedio
      );

      if (matchingData) {
        const updatedTablaFinal = [...tablaFinal];
        updatedTablaFinal[rowIndex].frecuencia = selectedFrecuencia;
        updatedTablaFinal[rowIndex].riesgo = matchingData.VA_IMPACTO;
        updatedTablaFinal[rowIndex].riesgoNumerico = matchingData.VAL_RIESGO;
        setTablaFinal(updatedTablaFinal);
      }
    };

    const handleCalculoAutomatico = () => {
      setTablaFinal((prevTablaFinal) => {
        const updatedTablaFinal = prevTablaFinal.map((row) => {
          const promedio = row.promedio;

          console.log(`Procesando amenaza ${row.amenaza}`);
          console.log(
            `row.frecuencia1: ${row.frecuencia1}, promedio: ${promedio}`
          );

          const closestMatchingDataList = riesgoData.reduce(
            (closestList, data) => {
              const diffFrecuencia = Math.abs(
                frecuenciaOptions.findIndex(
                  (opt) => opt.value === data.VA_FRECUENCIA
                ) -
                  frecuenciaOptions.findIndex(
                    (opt) => opt.value === row.frecuencia1
                  )
              );
              const diffPromedio = Math.abs(data.VAL_IMPACTO - promedio);
              const distance = Math.sqrt(
                diffFrecuencia ** 2 + diffPromedio ** 2
              );

              if (distance < 1) {
                closestList.push({ data, distance });
              }

              return closestList;
            },
            []
          );

          if (closestMatchingDataList.length > 0) {
            closestMatchingDataList.sort((a, b) => a.distance - b.distance);
            const closestMatchingData = closestMatchingDataList[0];

            console.log(`Actualizando fila para amenaza ${row.amenaza}`);
            return {
              ...row,
              frecuencia: closestMatchingData.data.VA_FRECUENCIA,
              riesgo: closestMatchingData.data.VA_IMPACTO,
              riesgoNumerico: closestMatchingData.data.VAL_RIESGO,
            };
          } else {
            console.log(
              `No se encontraron datos coincidentes para amenaza ${row.amenaza}`
            );
            return row;
          }
        });
        const updatedChartData = mapRiskToChartData(updatedTablaFinal);
        setData(updatedChartData);
        const sortedChartData = updatedChartData.sort(
          (a, b) => riesgoOrder.indexOf(a.x) - riesgoOrder.indexOf(b.x)
        );

        setData(sortedChartData);

        console.log("Datos grafica:", updatedChartData);
        console.log("Tabla Final Actualizada:", updatedTablaFinal);

        return updatedTablaFinal;
      });
    };

    const CustomDot = (props) => {
      const { cx, cy, payload } = props;
      const riesgo = payload.x;
      const backgroundColor = getTextColor(riesgo);

      return (
        <Dot
          cx={cx}
          cy={cy}
          fill={backgroundColor}
          r={4}
          strokeWidth={2}
          stroke="#fff"
        />
      );
    };

    const getTextColor = (riesgo) => {
      switch (riesgo) {
        case "Despreciable":
          return "gray";
        case "Bajo":
          return "green";
        case "Medio":
          return "#FFC133";
        case "Alto":
          return "orange";
        case "Muy Alto":
          return "red";
        case "Daño Extremo":
          return "red";
        default:
          return "inherit";
      }
    };

    const mapRiskToChartData = (tablaFinal) => {
      return tablaFinal.map((row) => ({
        x: row.riesgo,
        y: row.riesgoNumerico,
        amenaza: row.amenaza,
        costo: row.costo,
      }));
    };

    const convertRiesgoToNumeric = (riesgo) => {
      switch (riesgo) {
        case "Despreciable":
          return 0;
        case "Bajo":
          return 1;
        case "Medio":
          return 2;
        case "Alto":
          return 3;
        case "Muy Alto":
          return 4;
        case "Daño Extremo":
          return 5;
        default:
          return 0;
      }
    };

    const renderTooltipContent = (props) => {
      const { payload } = props;

      if (payload && payload.length > 0) {
        const costo = payload[0].payload.costo;
        const xValue = payload[0].payload.x;

        return (
          <div>
            <p>Costo: {costo}</p>
            <p>Valor del Riesgo: {xValue}</p>
          </div>
        );
      }

      return null;
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} container justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FunctionsIcon />}
            onClick={handleCalculoAutomatico}
            style={{ marginTop: "10px" }}
          >
            Realizar Cálculo
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <b>Amenaza</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Impacto</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Costo</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Frecuencia</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Riesgo</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Valor del Riesgo</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTablaFinal.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{row.amenaza}</TableCell>
                    <TableCell>{row.promedio}</TableCell>
                    <TableCell>{row.costo}</TableCell>
                    <TableCell align="center">{row.frecuencia1}</TableCell>
                    <TableCell align="center">
                      <b style={{ color: getTextColor(row.riesgo) }}>
                        {row.riesgo}
                      </b>
                    </TableCell>
                    <TableCell align="center">
                      <b style={{ color: getTextColor(row.riesgo) }}>
                        {row.riesgoNumerico}
                      </b>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Gráfica del Riesgo
          </Typography>
          <ScatterChart
            width={width && width < 600 ? "100%" : 950}
            height={400}
            margin={{ top: 50, right: 20, bottom: 20, left: 50 }}
            style={{ margin: "0 auto" }}
          >
            <CartesianGrid />
            <YAxis
              type="number"
              dataKey="y"
              name="Valor del Riesgo"
              domain={[0, 10]}
            />
            <XAxis
              type="category"
              dataKey="x"
              name="Riesgo"
              ticks={riesgoOrder}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={renderTooltipContent}
            />
            <Scatter name="Riesgos" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getTextColor(entry.x)} />
              ))}
              <LabelList
                dataKey="amenaza"
                position="top"
                fill="#000"
                fontSize="10"
              />
            </Scatter>
          </ScatterChart>
        </Grid>
      </Grid>
    );
  };

  const refrescarPagina = () => {
    //como puedo hacer para regresar a la pagina principal
    navigate("/gestionar/Calculo-Riesgo");
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    if (activeStep === steps.length - 1) {
      // Last step, pass selectedIds to TablaResultado
      setRows(selectedIds);
      setRows(selectedDates); // Set rows state if needed
    }
    if (activeStep === steps.length - 2) {
      // Second to last step, pass selectedDates to TablaResultado
      setRows(selectedIds);
      setRows(selectedDates);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    if (activeStep === 1) {
      setSelectedIds([]);
      setSelectedDates([]);
      setLista2([]);
      setResetKey(prev => prev + 1);
    }
    if (activeStep === steps.length - 1) {
      console.log("TablaAmenaza");
    }
    if (activeStep === steps.length - 2) {
      refrescarPagina();
    }
  };

  return (
    <React.Fragment>
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      />
      <Container component="main" maxWidth="xl" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Gracias.
              </Typography>
              <Typography variant="subtitle1">
                Gracias por usar AvarCiber.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Regresar
                  </Button>
                )}
                {activeStep !== steps.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                    disabled={activeStep === steps.length - 1 || (activeStep === 0 && lista2.length === 0)}
                  >
                    {activeStep === steps.length - 2 ? "Confirmar" : "Siguiente"}
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );
};
