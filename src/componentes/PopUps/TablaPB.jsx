import { useEffect, useState } from 'react';
import {
  MenuItem,
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
  Modal,Slider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createProbabilidad, deleteProbabilidad, getProbabilidad, updateProbabilidad } from '../../services/probabilidad/probabilidadData';
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const FRECUENCIAS = ["Diario", "Semanal", "Mensual", "Anual"];
const PROBABILIDAD = ["Muy Baja", "Baja", "Media", "Alta", "Muy Alta"];
const RANGO_MIN = 0;
const RANGO_MAX = 100;

const TablaPB = () => {
  const [datos, setDatos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposIds, setTiposIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);
  const [rangoSlider, setRangoSlider] = useState([0, 0]);
  const {user} = useAuth();
  const emp_codigo = user?.emp_codigo;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (emp_codigo) {
          const probabilidadData = await getProbabilidad(emp_codigo);
          setDatos(probabilidadData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [emp_codigo]);

  const [formulario, setFormulario] = useState({
    ame_codigo: '',
    pro_descripcion: '',
    pro_probabilidad: '',
    pro_rangos: '',
    pro_valor: '',
    pro_frecuencia: '',
  });

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      ame_codigo: '',
      pro_descripcion: '',
      pro_probabilidad: '',
      pro_rangos: '',
      pro_valor: '',
      pro_frecuencia: '',
    });
    setRangoSlider([0, 0]);
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  const handleRangoChange = (event, newValue) => {
    setRangoSlider(newValue);
    setFormulario({
      ...formulario,
      pro_rangos: `${newValue[0]}-${newValue[1]}%`,
    });
  };

  const handleGuardar = async () => {
    const camposFaltantes = [];
    if (!formulario.pro_probabilidad) camposFaltantes.push("Probabilidad");
    if (!formulario.pro_rangos) camposFaltantes.push("Rango");
    if (!formulario.pro_valor) camposFaltantes.push("Valor");
    if (!formulario.pro_frecuencia) camposFaltantes.push("Frecuencia");

    if (camposFaltantes.length > 0) {
      toast.error(`Faltan campos obligatorios: ${camposFaltantes.join(", ")}`);
      return;
    }
    const dataToSend = {
      emp_codigo: emp_codigo,
      pro_probabilidad: formulario.pro_probabilidad,
      pro_rangos: formulario.pro_rangos,
      pro_valor: formulario.pro_valor,
      pro_frecuencia: formulario.pro_frecuencia,
    };
    if (modificarIndex !== -1) {
      await updateProbabilidad(modificarIndex, dataToSend);
      const probabilidadData = await getProbabilidad(emp_codigo);
      setDatos(probabilidadData);
      toast.success("Probabilidad modificada correctamente");
    } else {
      await createProbabilidad(dataToSend);
      const probabilidadData = await getProbabilidad(emp_codigo);
      setDatos(probabilidadData);
      toast.success("Probabilidad creada correctamente");
    }

    setModalOpen(false);
    setFormulario({
      ame_codigo: '',
      pro_descripcion: '',
      pro_probabilidad: '',
      pro_rangos: '',
      pro_valor: '',
      pro_frecuencia: '',
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      ame_codigo: '',
      pro_descripcion: '',
      pro_probabilidad: '',
      pro_rangos: '',
      pro_valor: '',
      pro_frecuencia: '',
    });
  };

  const handleModificar = (index) => {
    const probabilidad = datos[index];
    let min = 0, max = 0;
    if (probabilidad.pro_rangos) {
      const match = probabilidad.pro_rangos.match(/(\d+)-(\d+)%/);
      if (match) {
        min = parseInt(match[1], 10);
        max = parseInt(match[2], 10);
      }
    }
    setRangoSlider([min, max]);
    setModificarIndex(probabilidad.pro_codigo);
    setFormulario({
      pro_codigo: probabilidad.pro_codigo,
      pro_descripcion: probabilidad.pro_descripcion,
      pro_probabilidad: probabilidad.pro_probabilidad,
      pro_rangos: probabilidad.pro_rangos,
      pro_valor: probabilidad.pro_valor,
      pro_frecuencia: probabilidad.pro_frecuencia,
    });
    setModalOpen(true);
  };

  const handleEliminar = async (index) => {
    const idToDelete = datos[index].pro_codigo;

    await deleteProbabilidad(idToDelete);
    toast.success("Probabilidad eliminada correctamente");

    const probabilidadData = await getProbabilidad();
    setDatos(probabilidadData);

    setModalOpen(false);
    setFormulario({
      ame_codigo: '',
      pro_descripcion: '',
      pro_probabilidad: '',
      pro_rangos: '',
      pro_valor: '',
      pro_frecuencia: '',
    });
  };

  const datosFiltrados = datos.filter((dato) => {
    const busq = busqueda.toLowerCase();
    return (
      dato.pro_probabilidad?.toString().toLowerCase().includes(busq) ||
      dato.pro_valor?.toString().toLowerCase().includes(busq)
    );
  });

  return (
    <Box>
      <Box sx={{ border: 'none', p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '97%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <TableBody>
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Button variant="contained" color="primary" onClick={handleInsert}>
                      Insertar Nuevo
                    </Button>
                    <TextField
                      label="Buscar por probabilidad o valor"
                      variant="outlined"
                      value={busqueda}
                      onChange={handleBusquedaChange}
                      sx={{ width: 350 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={1} align="center">
                  Código
                </TableCell>
                <TableCell colSpan={1} align="center">
                  Probabilidad
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Rango
                </TableCell>
                <TableCell colSpan={3} align="center">
                  Valor
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Fecuencia
                </TableCell>
                <TableCell align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {datosFiltrados.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={1} align="center">
                    {dato.pro_codigo}
                  </TableCell>
                  <TableCell colSpan={1} align="center">
                    {dato.pro_probabilidad}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.pro_rangos}
                  </TableCell>
                  <TableCell colSpan={3} align="center">
                    {dato.pro_valor}
                  </TableCell>
                  <TableCell colSpan={4} align="center">
                    {dato.pro_frecuencia}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button variant="contained" color="primary" onClick={() => handleModificar(index)}>
                        <EditIcon />
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleEliminar(index)} sx={{ backgroundColor: 'red' }}>
                        <DeleteIcon />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} align="left">
                  Total de probabilidades ingresadas: {datos.length}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
          <Typography variant="h6" gutterBottom paddingBottom={1}>
            {modificarIndex !== -1 ? 'Modificar Probabilidad' : 'Nueva Probabilidad'}
          </Typography>
          <TextField
            select
            label="Probabilidad"
            name="pro_probabilidad"
            fullWidth
            value={formulario.pro_probabilidad}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          >
          {PROBABILIDAD.map((prob) => (
              <MenuItem key={prob} value={prob}>
                {prob}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Rango ({rangoSlider[0]}-{rangoSlider[1]}%)</Typography>
            <Slider
              value={rangoSlider}
              onChange={handleRangoChange}
              valueLabelDisplay="auto"
              min={RANGO_MIN}
              max={RANGO_MAX}
              step={1}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' },
              ]}
              disableSwap
            />
          </Box>
          <TextField
            label="Valor"
            name="pro_valor"
            fullWidth
            value={formulario.pro_valor}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Frecuencia"
            name="pro_frecuencia"
            fullWidth
            value={formulario.pro_frecuencia}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          >
            {FRECUENCIAS.map((freq) => (
              <MenuItem key={freq} value={freq}>
                {freq}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <Button variant="contained" color="primary" onClick={handleCancelar} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TablaPB;
