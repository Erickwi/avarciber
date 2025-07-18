import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function crearDatos(item1, item2, item3, item4, item5) {
  return {
    item1,
    item2,
    item3,
    item4,
    item5,
  };
}

const filas = [
  crearDatos("Cupcake", 305, 3.7, 67, 4.3),
  crearDatos("Donut", 452, 25.0, 51, 4.9),
  crearDatos("Eclair", 262, 16.0, 24, 6.0),
];

const celdasCabecera = [
  {
    id: "item1",
    numerico: false,
    etiqueta: "Titulo1",
  },
  {
    id: "item2",
    numerico: true,
    etiqueta: "Titulo2",
  },
  {
    id: "item3",
    numerico: true,
    etiqueta: "Titulo3",
  },
  {
    id: "item4",
    numerico: true,
    etiqueta: "Titulo4",
  },
  {
    id: "item5",
    numerico: true,
    etiqueta: "Titulo5",
  },
];

export default function TablaMejorada() {
  const [pagina, setPagina] = React.useState(0);
  const [filasPorPagina, setFilasPorPagina] = React.useState(5);

  const cambiarPagina = (evento, nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const cambiarFilasPorPagina = (evento) => {
    setFilasPorPagina(parseInt(evento.target.value, 10));
    setPagina(0);
  };

  const filasVisibles = React.useMemo(
    () => filas.slice(pagina * filasPorPagina, pagina * filasPorPagina + filasPorPagina),
    [pagina, filasPorPagina]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 400 }} aria-labelledby="tituloTabla" size="medium">
            <TableHead>
              <TableRow>
                {celdasCabecera.map((celdaCabecera) => (
                  <TableCell key={celdaCabecera.id} align="right">
                    {celdaCabecera.etiqueta}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filasVisibles.map((fila, indiceFila) => (
                <TableRow key={fila.item1} sx={{ cursor: 'pointer' }}>
                  {celdasCabecera.map((celdaCabecera) => (
                    <TableCell key={celdaCabecera.id} align="right">
                      {fila[celdaCabecera.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filas.length}
          rowsPerPage={filasPorPagina}
          page={pagina}
          onPageChange={cambiarPagina}
          onRowsPerPageChange={cambiarFilasPorPagina}
        />
      </Paper>
    </Box>
  );
}
