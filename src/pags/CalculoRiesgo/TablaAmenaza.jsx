import React, { useState, useEffect } from "react";
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import moment from "moment-timezone";
import { getTablaAmenazasVulnerabilidades } from "../../services/amenazas/amenazasVulnerabilidades/amenazasVulnerabilidadesData"; 

const TablaAmenaza = ({ selectedIds, selectedDates }) => {
  const [tableData, setTableData] = useState([]);

  const formatDate = (dateString, timeZone) => {
    const date = moment.utc(dateString).tz(timeZone);
    return date.format("YYYY-MM-DD");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("IDs en TablaAmenaza:", selectedIds);
        console.log("Fechas en TablaAmenaza:", selectedDates);

        // Crear un conjunto de combinaciones únicas de act_codigo y vac_fecha_inicio
        const uniqueCombinations = new Set();
        const requests = [];
        
        for (let i = 0; i < selectedIds.length; i++) {
          const currentId = selectedIds[i];
          const currentDate = selectedDates[i];

          if (!currentDate) {
            console.error(`No hay fecha correspondiente para el ID ${currentId}`);
            continue;
          }

          const formattedDate = formatDate(currentDate, "America/Bogota");
          const key = `${currentId}-${formattedDate}`;

          if (!uniqueCombinations.has(key)) {
            uniqueCombinations.add(key);
            requests.push({ id: currentId, date: formattedDate });
          }
        }

        // Mapear los datos de la API, eliminando duplicados por amenaza, vulnerabilidad y activo
        const allData = new Map();
        for (const { id, date } of requests) {
          console.log(`Solicitando datos para id: ${id}, fecha: ${date}`);
          try {
            const response = await getTablaAmenazasVulnerabilidades(id, date);
            console.log("Respuesta de la API:", response);

            response.forEach((item) => {
              const dataKey = `${item.ame_nombre}-${item.vul_nombre}-${item.act_nombre}`;
              if (!allData.has(dataKey)) {
                allData.set(dataKey, {
                  amenaza: item.ame_nombre,
                  vulnerabilidad: item.vul_nombre,
                  activo: item.act_nombre,
                  promedio: item.promedio_grupo,
                  costo: item.vac_costo,
                  fecha: formatDate(item.vac_fecha_inicio, "America/Bogota"),
                });
              }
            });
          } catch (error) {
            console.error(`Error en la solicitud para ID ${id}, fecha ${date}:`, error);
          }
        }

        const mappedData = Array.from(allData.values());
        console.log("Datos mapeados:", mappedData);
        setTableData(mappedData);
      } catch (error) {
        console.error("Error general:", error);
      }
    };

    fetchData();
  }, [selectedIds, selectedDates]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Tabla de Amenazas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"><b>Amenaza</b></TableCell>
                <TableCell align="center"><b>Vulnerabilidad</b></TableCell>
                <TableCell align="center"><b>Activo</b></TableCell>
                <TableCell align="center"><b>Valor Impacto Promedio</b></TableCell>
                <TableCell align="center"><b>Costo</b></TableCell>
                <TableCell align="center"><b>Fecha</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={`${row.amenaza}-${row.vulnerabilidad}-${row.activo}-${index}`}>
                  <TableCell>{row.amenaza}</TableCell>
                  <TableCell>{row.vulnerabilidad}</TableCell>
                  <TableCell>{row.activo}</TableCell>
                 <TableCell align="center">{Number(row.promedio).toFixed(2)}</TableCell>
                  <TableCell>{row.costo}</TableCell>
                  <TableCell>{row.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default TablaAmenaza;