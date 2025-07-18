import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { registerRequest, getUsuariosRequest, editUserRequest, getUsuariosByEmpresaRequest, deleteUserRequest } from '../services/auth/authData';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

const EmpleadoModal = ({
  open,
  onClose,
  onSubmit,
  initialData = { usu_nombre: '', usu_apellido: '', usu_email: '', usu_password: '' },
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
      <DialogTitle>{isEdit ? "Editar Empleado" : "Crear Empleado"}</DialogTitle>
      <DialogContent>
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

export const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmpleado, setEditEmpleado] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { user, loading } = useAuth();
  console.log("user:", user);
  // Traer solo empleados de la empresa del usuario actual
  const fetchEmpleados = async (emp_codigo) => {
    try {
      const empleadosEmpresa = await getUsuariosByEmpresaRequest(emp_codigo);
      setEmpleados(empleadosEmpresa.data);
    } catch (error) {
      setEmpleados([]);
    }
  };
  
  useEffect(() => {
    if (!loading && user?.emp_codigo) {
      fetchEmpleados(user.emp_codigo);
    }
    // eslint-disable-next-line
  }, [loading, user]);

  if (loading || !user?.emp_codigo) {
    return <Typography>Cargando...</Typography>;
  }

  const handleCreate = () => {
    setEditEmpleado(null);
    setModalOpen(true);
  };

  const handleEdit = (empleado) => {
    setEditEmpleado(empleado);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editEmpleado) {
        console.log("Editando empleado:", editEmpleado.usu_codigo, data);
        await editUserRequest(editEmpleado.usu_codigo, data);
      } else {
        const payload = {
          ...data,
          emp_codigo: user.emp_codigo,
          usu_rol: "Usuario",
        };
        console.log("Registrando empleado:", payload);
        await registerRequest(payload);
      }
      setModalOpen(false);
      fetchEmpleados(user.emp_codigo);
    } catch (error) {
      alert("Error al guardar el empleado.");
    }
  };

  const handleConfirmDelete = (empleado) => {
    setDeleteId(empleado.usu_codigo);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUserRequest(deleteId);
      setConfirmOpen(false);
      fetchEmpleados(user.emp_codigo);
    } catch (error) {
      alert("Error al eliminar el empleado.");
      setConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ margin: 5 }}>
      <Typography variant="h4" gutterBottom>Gestionar Empleados</Typography>
      <Button variant="contained" color="primary" onClick={handleCreate} startIcon={<PersonAddIcon />}>
        Crear Empleado
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empleados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No hay empleados registrados.
              </TableCell>
            </TableRow>
          ) : (
            empleados
            .filter(e => e.usu_codigo !== user.usu_codigo)
            .map((empleado) => (
              <TableRow key={empleado.usu_codigo}>
                <TableCell>{empleado.usu_nombre}</TableCell>
                <TableCell>{empleado.usu_apellido}</TableCell>
                <TableCell>{empleado.usu_email}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => handleEdit(empleado)}
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
                      onClick={() => handleConfirmDelete(empleado)}
                      sx={{
                        color: "#d32f2f",
                        border: "1px solid #d32f2f",
                        "&:hover": {
                          backgroundColor: "#ffebee",
                          borderColor: "#b71c1c",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal para crear/editar */}
      <EmpleadoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editEmpleado || { usu_nombre: '', usu_apellido: '', usu_email: '', usu_password: '' }}
        isEdit={!!editEmpleado}
      />

      {/* Confirmación de eliminación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>¿Estás seguro de que deseas eliminar este empleado?</DialogTitle>
        <DialogContent>
          <Typography>Si acepta, se eliminarán todos los datos relacionados con este empleado.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>    
    </Box>
  );
};