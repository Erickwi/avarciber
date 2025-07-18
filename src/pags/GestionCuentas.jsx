import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { deleteUserRequest, disableUserRequest, editUserRequest, enableUserRequest, getUsuariosRequest, registerRequest } from '../services/auth/authData';
import { getEmpresasRequest } from '../services/empresas/empresasData';
import {
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { green, red } from "@mui/material/colors";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const CuentaModal = ({
  open,
  onClose,
  onSubmit,
  initialData = { emp_codigo: '', usu_nombre: '', usu_apellido: '', usu_rol: '', usu_email: '', usu_password: '' },
  empresas = [],
  isEdit = false,
}) => {
  const [form, setForm] = useState(initialData);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setForm(initialData);
    setEmailError('');
    setPasswordError('');
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "usu_email") {
      // Validación simple de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? '' : 'Correo electrónico inválido');
    }
    if (name === "usu_password") {
      setPasswordError(value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres');
    }
  };

  const handleSubmit = () => {
    if (emailError || passwordError) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? "Editar Cuenta" : "Crear Cuenta"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="empresa-label">Empresa</InputLabel>
          <Select
            labelId="empresa-label"
            label="Empresa"
            name="emp_codigo"
            value={form.emp_codigo}
            onChange={handleChange}
          >
            {empresas.map((empresa) => (
              <MenuItem key={empresa.emp_codigo} value={empresa.emp_codigo}>
                {empresa.emp_nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Nombre"
          name="usu_nombre"
          value={form.usu_nombre}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Apellido"
          name="usu_apellido"
          value={form.usu_apellido}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            label="Rol"
            name="usu_rol"
            value={form.usu_rol}
            onChange={handleChange}
          >
            <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Usuario">Usuario</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Correo Electrónico"
          name="usu_email"
          value={form.usu_email}
          onChange={handleChange}
          fullWidth
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          margin="dense"
          label="Contraseña"
          name="usu_password"
          type="password"
          value={form.usu_password}
          onChange={handleChange}
          fullWidth
          error={!!passwordError}
          helperText={passwordError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!!emailError || !!passwordError}>
          {isEdit ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const GestionCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCuenta, setEditCuenta] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { errors: apiErrors } = useAuth();
  const navigate = useNavigate();

  // Simulación de fetch de cuentas (deberías reemplazar con tu API real)
  const fetchCuentas = async () => {
  try {
    const res = await getUsuariosRequest();
    setCuentas(res.data); // Asumiendo que la respuesta viene en res.data
  } catch (error) {
    setCuentas([]);
  }
};

  useEffect(() => {
    const fetchEmpresasAsync = async () => {
      try {
        const res = await getEmpresasRequest();
        setEmpresas(res.data);
      } catch (error) {
        console.log('Error fetching empresas:', error.response?.data);
      }
    };
    fetchEmpresasAsync();
    fetchCuentas();
  }, []);

  const handleCreate = () => {
    setEditCuenta(null);
    setModalOpen(true);
  };

  const handleEdit = (cuenta) => {
    console.log("Editando cuenta:", cuenta);
    setEditCuenta({ ...cuenta });
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editCuenta) {
        await editUserRequest(editCuenta.usu_codigo, data);
      } else {
        await registerRequest(data);
      }
      setModalOpen(false);
      fetchCuentas();
    } catch (error) {
      alert("Error al guardar la cuenta.");
    }
  };

  const handleToggleHabilitado = async (user) => {
    try {
      if (user.usu_status) {
        await disableUserRequest(user.usu_codigo);
      } else {
        await enableUserRequest(user.usu_codigo);
      }
      fetchCuentas();
    } catch (error) {
      alert("Error al cambiar el estado de habilitación.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserRequest(deleteId);
      setConfirmOpen(false);
      fetchCuentas();
    } catch (error) {
      alert("Error al eliminar el empleado.");
      setConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ margin: 5 }}>
      <Typography variant="h4" gutterBottom>Gestionar Cuentas</Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Crear Cuenta
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Empresa</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cuentas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay cuentas registradas.
              </TableCell>
            </TableRow>
          ) : (
            cuentas.map((cuenta) => (
              <TableRow 
                key={cuenta.usu_codigo}
                sx={{
                  color: cuenta.usu_status ? "inherit" : "#888",
                  backgroundColor: cuenta.usu_status ? "inherit" : "#f0f0f0",
                  "& td": {
                    color: cuenta.usu_status ? "inherit" : "#888",
                  },
                }}
              >
                <TableCell>
                  {empresas.find(e => e.emp_codigo === cuenta.emp_codigo)?.emp_nombre || "Sin empresa"}
                </TableCell>
                <TableCell>{cuenta.usu_nombre}</TableCell>
                <TableCell>{cuenta.usu_apellido}</TableCell>
                <TableCell>{cuenta.usu_rol}</TableCell>
                <TableCell>{cuenta.usu_email}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => handleEdit(cuenta)}
                      sx={{
                        color: "#1976d2",
                        border: "1px solid #1976d2",
                        marginRight: 1,
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                          borderColor: "#1565c0",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => {
                        setDeleteId(cuenta.usu_codigo);
                        setConfirmOpen(true);           
                      }}
                      sx={{
                        color: "#d32f2f", // Rojo Material UI
                        border: "1px solid #d32f2f",
                        marginRight: 1,
                        "&:hover": {
                          backgroundColor: "#ffebee",
                          borderColor: "#b71c1c",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  {/* Aquí podrías agregar un switch de habilitado si lo necesitas */}
                  <Tooltip title={cuenta.usu_status ? "Deshabilitar Usuario" : "Habilitar Usuario"}>
                    <Switch
                      checked={cuenta.usu_status}
                      onChange={() => handleToggleHabilitado(cuenta)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: green[500],
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: green[500],
                        },
                        '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                          color: red[500],
                        },
                        '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                          backgroundColor: red[500],
                        },
                      }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal para crear/editar */}
      <CuentaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editCuenta || { emp_codigo: '', usu_nombre: '', usu_apellido: '', usu_rol: '', usu_email: '', usu_password: '' }}
        empresas={empresas}
        isEdit={!!editCuenta}
      />

      {/* Confirmación de eliminación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>¿Estás seguro de que deseas eliminar esta cuenta?</DialogTitle>
        <DialogContent>
          <Typography>Si acepta, se eliminarán todos los datos relacionados con esta cuenta</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};