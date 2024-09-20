import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  Autocomplete,
  Paper,
  Alert,
} from "@mui/material";
import { useEstudiantes } from "../hooks/useEstudiantes";
import { usePadres } from "../hooks/usePadres";

export const CrearPadre = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { estudiantes, getEstudiante } = useEstudiantes();
  const {
    handlerAddPadre,
    errors,
    padreSelected,
  } = usePadres();
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);
  const [estudiantesSinPadre, setEstudiantesSinPadre] = useState([]);

  useEffect(() => {
    getEstudiante();
  }, []);

  useEffect(() => {
    if (Array.isArray(estudiantes) && estudiantes.length > 0) {
      const sinPadre = estudiantes.filter(
        (estudiante) => !estudiante.id_padre
      );
      setEstudiantesSinPadre(sinPadre);
    }
  }, [estudiantes]);

  useEffect(() => {
    if (padreSelected && padreSelected.id_padre !== 0) {
      setNombre(padreSelected.nombre || "");
      setEmail(padreSelected.email || "");
      setContraseña(padreSelected.password || "");
      setSelectedEstudiantes(padreSelected.estudiantesIds || []);
    }
  }, [padreSelected]);

  const handleCrearPadre = () => {
    const padreData = {
      id_padre: padreSelected.id_padre,
      nombre,
      email,
      contraseña: contraseña,
      estudiantesIds: selectedEstudiantes.map((est) => est.id_estudiante),
    };
    handlerAddPadre(padreData);
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {padreSelected.id_padre === 0 ? "Crear Cuenta de Padre" : "Editar Padre"}
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Nombre"
          fullWidth
          variant="outlined"
          value={nombre || ""}
          onChange={(e) => setNombre(e.target.value)}
          error={Boolean(errors.nombre)}
          helperText={errors.nombre}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          variant="outlined"
          value={contraseña || ""}
          onChange={(e) => setContraseña(e.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            multiple
            options={estudiantesSinPadre}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField {...params} label="Seleccionar Estudiantes" />
            )}
            onChange={(event, newValue) => setSelectedEstudiantes(newValue)}
            value={selectedEstudiantes || []}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCrearPadre}
          fullWidth
        >
          {padreSelected.id_padre === 0 ? "Crear Padre" : "Actualizar Padre"}
        </Button>
      </Box>
    </Paper>
  );
};
