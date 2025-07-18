import React, { useEffect, useState, useRef } from "react";
import Switch from "@mui/material/Switch";
import { green, red } from "@mui/material/colors";
import {
  getEmpresasRequest,
  createEmpresaRequest,
  updateEmpresaRequest,
  enableEmpresa,
  disableEmpresa,
} from "../services/empresas/empresasData";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from '@mui/icons-material/Image';
import imageCompression from 'browser-image-compression';

const EmpresaModal = ({
  open,
  onClose,
  onSubmit,
  initialData = { emp_nombre: "", emp_descripcion: "", emp_campo: "", emp_logo: "" },
  isEdit = false,
}) => {
  const [form, setForm] = useState(initialData);
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. El tamaño máximo permitido es 2MB.");
        return;
      }
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, emp_logo: reader.result });
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, emp_logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setForm(initialData);
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? "Editar Empresa" : "Crear Empresa"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          name="emp_nombre"
          value={form.emp_nombre}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Descripción"
          name="emp_descripcion"
          value={form.emp_descripcion}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Campo"
          name="emp_campo"
          value={form.emp_campo}
          onChange={handleChange}
          fullWidth
        />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: "2px dashed #1976d2",
            borderRadius: 8,
            padding: 16,
            textAlign: "center",
            marginBottom: 16,
            cursor: "pointer",
            background: "#f5f5f5"
          }}
          onClick={() => fileInputRef.current.click()}
        >
          {form.emp_logo && form.emp_logo.trim() !== "" ? (
            <img src={form.emp_logo} alt="Logo" style={{ maxHeight: 80, marginBottom: 8 }} />
          ) : (
            <div style={{ color: "#1976d2", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ImageIcon style={{ fontSize: 48, marginBottom: 8 }} />
              <span>Arrastra una imagen aquí o haz clic para seleccionar</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmpresa, setEditEmpresa] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const emptyEmpresa = { emp_nombre: "", emp_descripcion: "", emp_campo: "", emp_logo: "" };
  const initialEmpresaData = editEmpresa || emptyEmpresa;

  const fetchEmpresas = async () => {
    const res = await getEmpresasRequest();
    setEmpresas(res.data);
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleCreate = () => {
    setEditEmpresa(null);
    setModalOpen(true);
  };

  const handleEdit = (empresa) => {
    setEditEmpresa(empresa);
    setModalOpen(true);
  };

  const handleToggleHabilitado = async (empresa) => {
    try {
      if (empresa.emp_status) {
        await disableEmpresa(empresa.emp_codigo);
      } else {
        await enableEmpresa(empresa.emp_codigo);
      }
      fetchEmpresas();
    } catch (error) {
      alert("Error al cambiar el estado de habilitación.");
    }
  };

  const handleModalSubmit = async (data) => {
    if (editEmpresa) {
      await updateEmpresaRequest(editEmpresa.emp_codigo, data);
    } else {
      await createEmpresaRequest(data);
    }
    setModalOpen(false);
    fetchEmpresas();
  };

  return (
    <Box sx={{ margin: 5 }}>
      <Typography variant="h4" gutterBottom>Empresas</Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Crear Empresa
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Campo</TableCell>
            <TableCell>Logo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empresas.map((empresa) => (
            <TableRow 
              key={empresa.emp_codigo}
              sx={{
                color: empresa.emp_status ? "inherit" : "#888",
                backgroundColor: empresa.emp_status ? "inherit" : "#f0f0f0",
                "& td": {
                  color: empresa.emp_status ? "inherit" : "#888",
                },
              }}
            >
              <TableCell>{empresa.emp_nombre}</TableCell>
              <TableCell>{empresa.emp_descripcion}</TableCell>
              <TableCell>{empresa.emp_campo}</TableCell>
              <TableCell>
                {empresa.emp_logo ? (
                  <img src={empresa.emp_logo} alt="logo" style={{ height: 40 }} />
                ) : (
                  "Sin logo"
                )}
              </TableCell>
              <TableCell>
                <Tooltip title="Editar">
                  <IconButton
                    onClick={() => handleEdit(empresa)}
                    sx={{
                      color: "#1976d2", // Azul Material UI
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
                <Tooltip title={empresa.emp_status ? "Deshabilitar Empresa" : "Habilitar Empresa"}>
                  <Switch
                    checked={empresa.emp_status}
                    onChange={() => handleToggleHabilitado(empresa)}
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
          ))}
        </TableBody>
      </Table>

      {/* Modal para crear/editar */}
      <EmpresaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={initialEmpresaData}
        isEdit={!!editEmpresa}
      />
    </Box>
  );
};

export { Empresas };