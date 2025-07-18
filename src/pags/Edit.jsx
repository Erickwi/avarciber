import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Slider from '@mui/material/Slider';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Column from "../componentes/Column";
import { DragDropContext } from "react-beautiful-dnd";
import { styled } from "@stitches/react"; // Corregido el import
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SaveIcon from "@mui/icons-material/Save";
import Select from "react-select";
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { getAmenazasVulnerabilidades, getAmenazasVulnerabilidadesTotal, getFechaAmenazaVulnerabilidad } from "../services/amenazas/amenazasVulnerabilidades/amenazasVulnerabilidadesData";
import { getActivoPorNombre, getActivos } from "../services/activos/activosData";
import { getVulnerabilidades } from "../services/vulnerabilidades/vulnerabilidadesData";
import { getAmenazasPorEmpresa } from "../services/amenazas/amenazasData";
import { createVulnerabilidadActivo } from "../services/vulnerabilidades/vulnerabilidadActivo/vulnerabilidadActivo";
import { createValorImpacto } from "../services/valorImpacto/valorImpactoData";
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

export const Edit = () => {

  const steps = ["HISTORICO"];
  const getStepContent = (step, handleEditClick) => {
    switch (step) {
      case 0:
        return <TablaAmenaza onEditClick={handleEditClick} />;/*
        
      case 1:
        return <SeleccionarActivo onRowsUpdate={handleActualizacion} />;
      case 2:
        return <TablaResultado />;
      case 3:
        return <TablaAmenaza />;*/
      default:
        throw new Error("Unknown step");
    }
  }
  const [editSectionVisible, setEditSectionVisible] = useState(false);
  const [selectedActivo, setSelectedActivo] = useState("");

  const handleEditClick = (activo) => {
    setSelectedActivo(activo);
    setEditSectionVisible(true);
  };

  const StyledColumns = styled("div", {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    margin: "5vh auto",
    width: "80%",
    height: "80vh",
    gap: "8px",
  });

  const toFixed = (num, digits = 2) => {
    if (num === undefined || num === null || isNaN(num)) return '';
    return Number(num).toFixed(digits);
  };

  const TablaAmenaza = ({ onEditClick }) => {
    const [tableData, setTableData] = useState([]);
    const [editSectionVisible, setEditSectionVisible] = useState(false);
    const [selectedActivo, setSelectedActivo] = useState("");

    const handleEdit = (row) => {
      onEditClick(row.activo);
    };

    useEffect(() => {
      async function fetchData() {
        try {
          const activoVulnerabilidadResponse = await getAmenazasVulnerabilidadesTotal();

          const mappedData = activoVulnerabilidadResponse.map((item) => {
            const fechaLocal = new Date(item.vac_fecha_inicio).toLocaleDateString('es-ES', { timeZone: 'America/Bogota' });

            return {
              amenaza: item.ame_nombre,
              vulnerabilidad: item.vul_nombre,
              activo: item.act_nombre,
              activocodigo : item.act_codigo,
              promedio: toFixed(item.promedio_grupo),
              costo: item.vac_costo,
              fecha: fechaLocal,
            };
          });

          setTableData(mappedData);
        } catch (error) {
          console.error(error);
        }
      }

      fetchData();
    }, []);

    // Agrupa los datos por fecha
    const groupedData = tableData.reduce((acc, row) => {
      const date = row.fecha;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(row);
      return acc;
    }, {});

    return (
      <Grid container spacing={3}>
        {Object.keys(groupedData).map((date, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="h6" gutterBottom>
              {`Relación de Activo - Vulnerabilidad - Amenaza realizado el : ${date}`}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Amenaza</TableCell>
                    <TableCell align="center">Vulnerabilidad</TableCell>
                    <TableCell align="center">Activo</TableCell>
                    <TableCell align="center" style={{ minWidth: '150px' }}>Valor Impacto Promedio</TableCell>
                    <TableCell align="center">Costo</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {groupedData[date].map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell align="center">{row.amenaza}</TableCell>
                      <TableCell align="center">{row.vulnerabilidad}</TableCell>
                      <TableCell align="center">{row.activo}</TableCell>
                      <TableCell align="center">{row.promedio}</TableCell>
                      <TableCell align="center">{row.costo}</TableCell>
                      <TableCell align="center">
                        <Button onClick={() => handleEdit(row)} variant="outlined" color="primary">
                          Editar
                        </Button>
                        {editSectionVisible && selectedActivo === row.activo && (
                          <div>
                            <Typography variant="subtitle1">
                              Nombre del Activo: {selectedActivo}
                            </Typography>
                            {/* Agrega aquí el contenido de la sección de edición */}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))}
      </Grid>
    );
  };

  const SeleccionarActivo = ({ activo }) => {
    const [tableData, setTableData] = useState([{ activo: { value: activo, label: activo }, vulnerabilidades: [] }]);
    const [allVulnerabilidadFechas, setAllVulnerabilidadFechas] = useState({});
    const [activos, setActivos] = useState([]);
    const [vulnerabilidades, setVulnerabilidades] = useState([]);
    const [guardarPressed, setGuardarPressed] = useState(false);
    const [amenazas, setAmenazas] = useState([]);
    const [amenazasVulnerabilidades, setAmenazasVulnerabilidades] = useState([]);
    const [deslizador1, setDeslizador1] = useState(1);
    const [deslizador2, setDeslizador2] = useState(1);
    const [deslizador3, setDeslizador3] = useState(1);
    const [showAddVulnerabilidadButton, setShowAddVulnerabilidadButton] = useState(true);
    const [selectedVulnerabilidadFecha, setSelectedVulnerabilidadFecha] = useState(null);
    const [showAddActivoButton, setShowAddActivoButton] = useState(true);
    const [showFechaBox, setShowFechaBox] = useState([]);
    const [selectedActivoIds, setSelectedActivoIds] = useState(Array(tableData.length).fill(null));
    const [activoid, setActivoid] = useState([]);
    const [activoIds, setActivoIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      async function fetchData() {
        try {
          const activosData = await getActivos();
          setActivos(
            activosData.data.map((item) => ({
              value: item.act_codigo,
              label: item.act_nombre,
            }))
          );

          const vulnerabilidadesData = await getVulnerabilidades();
          setVulnerabilidades(
            vulnerabilidadesData.map((item) => ({
              value: item.vul_codigo,
              label: item.vul_nombre,
            }))
          );

          const amenazasData = await getAmenazasPorEmpresa();
          setAmenazas(
            amenazasData.map((item) => ({
              value: item.ame_codigo,
              label: item.ame_nombre,
            }))
          );

          const amenazasVulnerabilidadesData = await getAmenazasVulnerabilidades();

          // Obtener todas las IDs de vulnerabilidades (pueden estar repetidas)
          const allVulnerabilityCodes = amenazasVulnerabilidadesData.map(item => item.vul_codigo);
          setAmenazasVulnerabilidades(allVulnerabilityCodes);

          // Obtener fechas para cada código de vulnerabilidad
          const fechasPorVulnerabilidad = {};

          for (const codigo of allVulnerabilityCodes) {
            const fechaVulnerabilidad = await obtenerFechaVulnerabilidad(codigo);
            fechasPorVulnerabilidad[codigo] = fechaVulnerabilidad;
          }

          // Puedes utilizar fechasPorVulnerabilidad para mostrar las fechas correspondientes en tu aplicación
          console.log(fechasPorVulnerabilidad);

          // Puedes seleccionar la fecha de la primera vulnerabilidad (puedes ajustar esto según tus necesidades)
          if (allVulnerabilityCodes.length > 0) {
            const fechaVulnerabilidad = fechasPorVulnerabilidad[allVulnerabilityCodes[0]];
            setSelectedVulnerabilidadFecha(fechaVulnerabilidad);
          }
        } catch (error) {
          console.log(error);
        }
      }

      fetchData();
    }, []);


    
    const formatearFecha = (fecha) => {
      const date = new Date(fecha);
      const opcionesDeFormato = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString(undefined, opcionesDeFormato);
    };

    const obtenerFechaVulnerabilidad = async (vulnerabilidadCodigo) => {
      try {
        const FechaAmenazaVulnerabilidadData = await getFechaAmenazaVulnerabilidad(vulnerabilidadCodigo);

        if (FechaAmenazaVulnerabilidadData && FechaAmenazaVulnerabilidadData.length > 0 && FechaAmenazaVulnerabilidadData[0].AMV_FECHA_INICION) {
          const fechaVulnerabilidad = formatearFecha(FechaAmenazaVulnerabilidadData[0].AMV_FECHA_INICION);
          return fechaVulnerabilidad;
        } else {
          console.error("La respuesta de la API no contiene la propiedad esperada.");
          return null;
        }
      } catch (error) {
        console.error("Error obteniendo la fecha de la vulnerabilidad:", error);
        return null;
      }
    };


    const sacarIddeActivo = async (activo) => {
      try {
        const activoData = await getActivoPorNombre(activo);
        console.log("Respuesta de la API en sacarIddeActivo:", activoData.data);
    
        // Verifica si la respuesta tiene la propiedad act_codigo
        if (activoData.hasOwnProperty('act_codigo')) {
          const actCodigo = activoData.act_codigo;
    
          // Puedes devolver el actCodigo si es necesario
          return actCodigo;
        } else {
          console.error("La respuesta de la API no contiene la propiedad act_codigo");
          return null;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    
      
    const handleAddRow = () => {
      setTableData((prevData) => [
        ...prevData,
        { activo: null, vulnerabilidades: [] },
      ]);
    };

    const handleActivoSelect = async (index) => {
      try {
        const activoId = await sacarIddeActivo(activo);
    
        setSelectedActivoIds((prevIds) => {
          const newIds = [...prevIds];
          newIds[index] = { value: activoId, label: activo };
          return newIds;
        });
    
        setActivoIds((prevActivoIds) => {
          const newActivoIds = [...prevActivoIds];
          newActivoIds[index] = activoId;
          return newActivoIds;
        });
    
        setTableData((prevData) => {
          const newData = [...prevData];
          const selectedActivo = { value: activoId, label: activo };
          newData[index].activo = selectedActivo;
    
          newData[index].vulnerabilidades.push({
            vulnerabilidad: null,
            amenaza: null,
            dimension1: 1,
            dimension2: 1,
            dimension3: 1,
            costo: "",
          });
    
          setTableData(newData);
          return newData;
        });
      } catch (error) {
        console.error("Error al seleccionar el activo:", error);
      }
    };
    
    
    
    const handleAddVulnerabilidad = (rowIndex) => {
      const selectedActivo = tableData[rowIndex].activo;

      if (!selectedActivo) {
        alert("Debe seleccionar un activo antes de agregar una vulnerabilidad.");
        return;
      }

      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades.push({
          vulnerabilidad: null,
          amenaza: null,
          dimension1: 1,
          dimension2: 1,
          dimension3: 1,
          costo: "",
        });
        return newData;
      });

      setShowAddVulnerabilidadButton(false);
      setShowAddActivoButton(false);
    };


    const handleVulnerabilidadSelect = async (rowIndex, vulIndex, selected) => {
      try {
        const fechaVulnerabilidad = await obtenerFechaVulnerabilidad(selected.value);

        setTableData((prevData) => {
          const newData = [...prevData];
          newData[rowIndex].vulnerabilidades[vulIndex].vulnerabilidad = selected;
          newData[rowIndex].vulnerabilidades[vulIndex].fechaVulnerabilidad = fechaVulnerabilidad;

          // Actualiza el estado showFechaBox para mostrar la fecha al seleccionar la vulnerabilidad
          const updatedShowFechaBox = [...showFechaBox];
          updatedShowFechaBox[rowIndex] = true;
          setShowFechaBox(updatedShowFechaBox);

          return newData;
        });

        // Actualiza el estado selectedVulnerabilidadFecha con la fecha de la vulnerabilidad seleccionada
        setSelectedVulnerabilidadFecha(fechaVulnerabilidad);

        // Agrega este console.log para verificar si selectedVulnerabilidadFecha se está actualizando correctamente
        console.log("Fecha de la vulnerabilidad seleccionada:", fechaVulnerabilidad);
      } catch (error) {
        console.error("Error obteniendo la fecha de la vulnerabilidad:", error);
      }
    };

    const handleInputChange = (rowIndex, vulIndex, field, value) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades[vulIndex][field] = value;
        return newData;
      });
    };

    const handleEliminarActivo = (rowIndex) => {
      const confirmDelete = window.confirm(
        "¿Está seguro de que desea eliminar este activo?"
      );
      if (confirmDelete) {
        setTableData((prevData) => {
          const newData = [...prevData];
          newData.splice(rowIndex, 1);
          return newData;
        });
      }
    };

    const handleGuardarClick = async () => {
      try {
        for (let i = 0; i < tableData.length; i++) {
          const rowData = tableData[i];
          const activoId = activoIds[i];
    
          // Verificar si se seleccionó un activo para la fila actual
          if (!rowData.activo) {
            alert("Debe seleccionar un activo para cada fila antes de guardar.");
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
              alert("Debe completar todos los campos antes de guardar.");
              return;
            }
          }
        }
    
        console.log(tableData);
    
        const activoId = await sacarIddeActivo(activo);
    
        if (!activoId) {
          alert("Error al obtener el ID del activo.");
          return;
        }
    
        // Espera a que se resuelvan las funciones asincrónicas antes de continuar
        await saveDataToApi(activoId); // Pasar activoId como parámetro
        await saveData2(activoId); 
    
        setGuardarPressed(true);
        alert("Se actualizo la vulnerabilidad con exito.");
        navigate("/gestionar/editar-vulnerabilidades");
      } catch (error) {
        console.error("Error al guardar datos:", error);
      }
    };
  
    const saveDataToApi = async (activoId) => {
      try {
        const dataToSend = [];
    
        for (let i = 0; i < tableData.length; i++) {
          const rowData = tableData[i];
    
          if (!rowData.activo || !rowData.vulnerabilidades.every(vul => vul.vulnerabilidad && rowData.activo && vul.costo !== "")) {
            console.log(`Fila ${i + 1} contiene datos inválidos. No se envía.`);
            continue; // Skip invalid data
          }
    
          for (const vul of rowData.vulnerabilidades) {
            const data = {
              vul_codigo: vul.vulnerabilidad.value,
              act_codigo: activoId, // Usa el ID del activo obtenido
              VAC_COSTO: vul.costo,
              vac_fecha_inicio: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato 'YYYY-MM-DD HH:MM:SS'
              VAC_FECHA_INACTIVIDAD: null,
              VAC_OBSERVACION: null,
            };
    
            dataToSend.push(data);
          }
        }
    
        if (dataToSend.length === 0) {
          console.log("No hay datos válidos para enviar.");
          return;
        }
    
        console.log("Datos enviados a la API:", dataToSend);
    
        for (const data of dataToSend) {
          console.log("Enviando datos:", data);
          await createVulnerabilidadActivo(data);
          console.log("Datos enviados con éxito.");
        }
    
        console.log("Guardado exitoso.");
      } catch (error) {
        console.error("Error al guardar datos:", error);
      }
    };
    
    const saveData2 = async (activoId) => {
      try {
        const dataToSend = [];
    
        for (let i = 0; i < tableData.length; i++) {
          const rowData = tableData[i];
    
          if (!rowData.vulnerabilidades.every(vul =>
            vul.vulnerabilidad && rowData.activo && vul.dimension1 && vul.dimension2 && vul.dimension3 !== ""
          )) {
            console.log(`Fila ${i + 1} contiene datos inválidos. No se envía.`);
            continue; // Skip invalid data
          }
    
          for (const vul of rowData.vulnerabilidades) {
            let divCodigoValue = 0; // Reset divCodigoValue for each asset
    
            if (vul.dimension1 !== "") {
              divCodigoValue = 1;
            } else if (vul.dimension2 !== "") {
              divCodigoValue = 2;
            } else if (vul.dimension3 !== "") {
              divCodigoValue = 3;
            }
    
            const dimensions = [vul.dimension1, vul.dimension2, vul.dimension3];
    
            for (const dimension of dimensions) {
              if (dimension !== "") {
                const data = {
                  DIV_CODIGO: divCodigoValue,
                  vul_codigo: vul.vulnerabilidad.value,
                  act_codigo: activoId, // Usa el ID del activo
                  VAI_FECHA: new Date().toISOString().slice(0, 19).replace('T', ' '),
                  VAI_VALOR: dimension,
                };
                dataToSend.push(data);
    
                // Incrementa divCodigoValue para la próxima iteración
                divCodigoValue++;
              }
            }
          }
        }
    
        if (dataToSend.length === 0) {
          console.log("No hay datos válidos para enviar.");
          return;
        }
    
        console.log("Datos enviados a la API:", dataToSend);
    
        for (const data of dataToSend) {
          console.log("Enviando datos:", data);
          await createValorImpacto(data);
          console.log("Datos enviados con éxito.");
        }
    
        console.log("Guardado exitoso.");
      } catch (error) {
        console.error("Error al guardar datos:", error);
      }
    };
    
    
     const handleEliminarVulnerabilidad = (rowIndex, vulIndex) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades.splice(vulIndex, 1);
        return newData;
      });
    };

    const marcasDeslizador = [];
    for (let i = 1; i <= 10; i++) {
      marcasDeslizador.push({
        value: i,
        label: String(i),
      });
    }


    const handleCancelarProceso = () => {
      //como puedo hacer para regresar a la pagina principal
      navigate("/gestionar/editar-vulnerabilidades");
    };

    return (
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Activo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Vulnerabilidades
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Select
                    value={row.activo}
                    options={[{ value: activo, label: activo }]}
                    isDisabled={true}  // Agrega esta línea para desactivar el Select
                    placeholder="Seleccione un Activo"
                    onChange={() => handleActivoSelect(rowIndex)}
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  {row.vulnerabilidades.map((vul, vulIndex) => (
                    <Box
                      key={vulIndex}
                      display="flex"
                      flexDirection="column"
                      sx={{ marginBottom: "16px" }}
                    >
                      <Select
                        value={vul.vulnerabilidad}
                        options={vulnerabilidades.filter(option => amenazasVulnerabilidades.includes(option.value))}
                        onChange={(selected) => handleVulnerabilidadSelect(rowIndex, vulIndex, selected)}
                        placeholder="Seleccione una Vulnerabilidad"
                        isSearchable
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        sx={{
                          marginBottom: "8px",
                          zIndex: 1
                        }}
                      />
                      <br />
                      {/* Mostrar la caja de fecha condicionalmente */}
                      {showFechaBox[rowIndex] && (
                        <TextField
                          type="text"
                          value={vul.fechaVulnerabilidad || selectedVulnerabilidadFecha || ""}
                          label="Fecha de Vulnerabilidad Seleccionada"
                          disabled
                          sx={{
                            marginBottom: "8px",
                            zIndex: 0
                          }}
                        />
                      )}
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px">Dimensiones de Seguridad</Typography>
                      <Typography variant="subtitle1" marginTop="10px" style={{ fontStyle: 'italic', color: 'gray' }}>Estime con un valor de 1-10 para cada caso, donde 1 es el menor impacto.</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Disponibilidad</Typography>
                      <Slider
                        defaultValue={1}
                        step={null}
                        min={1}
                        max={10}
                        marks={marcasDeslizador}
                        value={vul.dimension1}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "dimension1",
                            e.target.value
                          )
                        }
                        color="secondary"
                        sx={{
                          width: "97%",
                          marginLeft: "auto"
                        }}
                      />
                      { }
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Integridad</Typography>
                      <Slider
                        defaultValue={1}
                        step={null}
                        min={1}
                        max={10}
                        marks={marcasDeslizador}
                        value={vul.dimension2}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "dimension2",
                            e.target.value
                          )
                        }
                        sx={{
                          width: "97%",
                          marginLeft: "auto"
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Confidencialidad</Typography>
                      <Slider
                        defaultValue={1}
                        step={null}
                        min={1}
                        max={10}
                        marks={marcasDeslizador}
                        value={vul.dimension3}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "dimension3",
                            e.target.value
                          )
                        }
                        color="secondary"
                        sx={{
                          width: "97%",
                          marginLeft: "auto"
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Costo</Typography>
                      <TextField
                        type="text"
                        value={vul.costo}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "costo",
                            e.target.value
                          )
                        }
                        label="Ingrese el costo (en USD) del activo."
                        sx={{
                          marginBottom: "8px",
                          zIndex: 0
                        }}
                      />
                      <br />
                      <Button
                        startIcon={<SaveIcon />}
                        color="success"
                        variant="contained"
                        onClick={handleGuardarClick}>
                        Guardar
                      </Button>
                      <br />
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleCancelarProceso()
                        }
                      >
                        Cancelar
                      </Button>

                    </Box>
                  ))}
                  <Box display="flex" sx={{ marginBottom: "8px" }}>
                    <Button
                      variant="contained"
                      onClick={() => handleAddVulnerabilidad(rowIndex)}
                      disabled={
                        !row.vulnerabilidades.every((vul) => vul.vulnerabilidad !== null)
                      }
                      sx={{ marginRight: "8px", display: showAddVulnerabilidadButton ? 'block' : 'none' }}
                    >
                      Editar Vulnerabilidad
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleCancelarProceso()
                      }
                      sx={{ marginRight: "8px", display: showAddVulnerabilidadButton ? 'block' : 'none' }}
                    >
                      Cancelar
                    </Button>

                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );

  };


  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
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
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
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
              {editSectionVisible ? (
                <SeleccionarActivo activo={selectedActivo} />
              ) : (
                getStepContent(activeStep, (activo) => {
                  setSelectedActivo(activo);
                  setEditSectionVisible(true);
                })
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Regresar
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