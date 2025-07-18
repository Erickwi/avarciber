import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import Toolbar from '@mui/material/Toolbar';
import { alpha } from '@mui/material/styles';

import { Button, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/*function createData(codigo, nombre, opciones) {
  return {
    codigo,
    nombre,
    opciones,
  };
}

//INSERTAR DATOS 
const rows = [
  createData(305, 3.7, 67),
  createData(305, 3.7, 67),
  createData(305, 3.7, 67),
];*/


//ORGANIZAR DATOS 
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

//COLUMNAS - FILTROS 
const headCells = [
  {
    id: 'codigo',
    numeric: true,
    disablePadding: false,
    label: 'Codigo',
    hasFilter: true,
  },
  {
    id: 'nombre',
    numeric: true,
    disablePadding: false,
    label: 'Nombre',
    hasFilter: true,
  },
  {
    id: 'opciones',
    numeric: true,
    disablePadding: false,
    label: 'Opciones',
    hasFilter: false,
  },
  {
    id: 'modificar',
    numeric: true,
    disablePadding: false,
    label: 'Modificar',
    hasFilter: false,
  },
  {
    id: 'eliminar',
    numeric: true,
    disablePadding: false,
    label: 'Eliminar',
    hasFilter: false,
  },
];

//HEAD DE TABLA CON O SIN FILTRO 
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.slice(1).map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.hasFilter ? ( // Mostrar filtro si hasFilter es true
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : ( // Mostrar solo el texto si hasFilter es false
              <Typography>{headCell.label}</Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

//TABLA 
function EnhancedTableToolbar(props) {
  const [modalOpen, setModalOpen] = React.useState(false);// Estado para controlar la apertura/cierre de la ventana emergente
  const { numSelected } = props;
  const [busqueda, setSearchValue] = React.useState(''); // Nuevo estado para el valor de búsqueda
  const [modificarIndex, setModificarIndex] = React.useState(-1); // Función para manejar el ingreso de datos nuevos

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value); // Actualizar el valor de búsqueda al escribir en el TextField
    //props.onSearch(event.target.value); // Llamar a la función onSearch proporcionada por props
  };

  //INSERTAR ---------------------------
  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
    setModalOpen(true);
  };


  //VENTANA EMERGENTE---------------------

  const [formulario, setFormulario] = React.useState({ // Estado para almacenar los valores del formulario de la ventana emergente
    Codigo: '',
    Nombre: '',
    Opciones: '',
  });

  // Función para manejar el cambio de valores en el formulario
  const handleFormChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  const [datos, setDatos] = React.useState([]);

  // Función para guardar los datos ingresados en el formulario
  const handleGuardar = () => {
    if (modificarIndex !== -1) {
      // Modificar el dato existente en la posición 'modificarIndex'
      const nuevosDatos = [...datos];
      nuevosDatos[modificarIndex] = formulario;
      setDatos(nuevosDatos);
    } else {
      // Agregar un nuevo dato
      setDatos([...datos, formulario]);
    }
    setModalOpen(false);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
  };

  // Función para cancelar y cerrar la ventana emergente
  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
  };


  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <Button variant="contained" color="primary" onClick={handleInsert}>
            Insertar Nuevo
          </Button>
        </Typography>
      )}

      <TextField
        label="Buscar"
        variant="outlined"
        size="small"
        value={busqueda}
        onChange={handleSearchChange}
      />

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
          }}>

          <Typography variant="h6" gutterBottom paddingBottom={1}>
            {modificarIndex !== -1 ? 'Modificar Elemento' : 'Nuevo Elemento'}
          </Typography>

          <Box paddingBottom={2}>
            <TextField
              label="ID"
              name="ID"
              fullWidth
              value={formulario.ID}
              onChange={handleFormChange}

            />
          </Box>

          <Box paddingBottom={2}>
            <TextField
              label="Nombre"
              name="Nombre"
              fullWidth
              value={formulario.Nombre}
              onChange={handleFormChange}
            />
          </Box>

          {modificarIndex !== -1 && (
            <Box paddingBottom={2}>
              <TextField label="Opciones" name="Opciones" fullWidth value={formulario.Opciones} onChange={handleFormChange} />
            </Box>
          )}

          <Box >
            <Button variant="contained" color="primary" onClick={handleCancelar} sx={{ mr: 10 }}>
              Guardar
            </Button>

            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Toolbar>
  );

}

/*const handleFormChange = (event) => {
  setFormulario({
    ...formulario,
    [event.target.name]: event.target.value,
  });
};*/


EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ tableTitle }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [busqueda, setBusqueda] = React.useState('');

  //const [searchTerm, setSearchTerm] = React.useState('');

  const [formulario, setFormulario] = React.useState({
    Codigo: '',
    Nombre: '',
    Opciones: '',
  });

  // Estado para almacenar los datos
  const [rows, setDatos] = React.useState([
    { filtro1: '1', filtro2: 'Valor2', descripcion: 'Descripción1' },
    { filtro1: '3', filtro2: 'Valor4', descripcion: 'Descripción2' },
    { filtro1: '5', filtro2: 'Valor6', descripcion: 'Descripción3' },
    { filtro1: 'Valor7', filtro2: 'Valor8', descripcion: 'Descripción4' },
    // Agrega más datos de ejemplo aquí
  ]);

  // Estado para controlar la apertura/cierre de la ventana emergente
  const [modalOpen, setModalOpen] = React.useState(false);

  // Estado para manejar el índice del elemento a modificar
  const [modificarIndex, setModificarIndex] = React.useState(-1);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  // Función para manejar el cambio de valores en el formulario
  const handleFormChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  // Función para guardar los datos ingresados en el formulario
  const handleGuardar = () => {
    if (modificarIndex !== -1) {
      // Modificar el dato existente en la posición 'modificarIndex'
      const nuevosDatos = [...rows];
      nuevosDatos[modificarIndex] = formulario;
      setDatos(nuevosDatos);
    } else {
      // Agregar un nuevo dato
      setDatos([...rows, formulario]);
    }
    setModalOpen(false);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
  };

  // Función para cancelar y cerrar la ventana emergente
  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
  };

  // Función para modificar el dato en la posición 'index' del arreglo 'rows'
  const handleModificar = (index) => {
    if (rows[index]?.filtro1 && rows[index]?.filtro2 && rows[index]?.descripcion) {
      setModificarIndex(index);
      setFormulario({
        Codigo: rows[index].filtro1,
        Nombre: rows[index].filtro2,
        Opciones: rows[index].descripcion,
      });
      setModalOpen(true);
    }
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      Codigo: '',
      Nombre: '',
      Opciones: '',
    });
    setModalOpen(true);
  };

  const datosFiltrados = rows.filter((dato) => {
    return (
      (dato.filtro1 && dato.filtro1.includes(busqueda)) ||
      (dato.filtro2 && dato.filtro2.includes(busqueda))
    );
  });

  // Función para eliminar el dato en la posición 'index' del arreglo 'datos'
  const handleEliminar = (index) => {
    const nuevosDatos = [...rows];
    nuevosDatos.splice(index, 1);
    setDatos(nuevosDatos);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} tableTitle={tableTitle} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((dato, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{dato.filtro1}</TableCell>
                    <TableCell align="center">{dato.filtro2}</TableCell>
                    <TableCell align="center">{dato.descripcion}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" color="primary" onClick={handleInsert}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="contained" color="secondary" onClick={() => handleEliminar(index)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} align="center"> {/* Ajustamos el atributo align */}
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Ajuste"
      />
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
          }}>

          <Typography variant="h6" gutterBottom paddingBottom={1}>
            {modificarIndex !== -1 ? 'Modificar Elemento' : 'Modificar Elemento'}
          </Typography>

          <Box paddingBottom={2}>
            <TextField
              label="Nombre"
              name="Nombre"
              fullWidth
              value={formulario.nombre}
              onChange={handleFormChange}

            />
          </Box>

          <Box paddingBottom={2}>
            <TextField
              label="Opciones"
              name="Opciones"
              fullWidth
              value={formulario.opciones}
              onChange={handleFormChange}
            />
          </Box>

          {modificarIndex !== -1 && (
            <Box paddingBottom={2}>
              <TextField label="Opciones" name="Opciones" fullWidth value={formulario.Opciones} onChange={handleFormChange} />
            </Box>
          )}

          <Box >
            <Button variant="contained" color="primary" onClick={handleCancelar} sx={{ mr: 10 }}>
              Guardar
            </Button>

            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>

  );
}
