import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Autocomplete } from "@mui/material";
import { useEstudiantes } from "../hooks/useEstudiantes"; // Hook para manejar estudiantes

export const EstudiantesForm = () => {
  const [formData, setFormData] = useState({
    id_estudiante: 0, // Incluir id_estudiante en el estado inicial
    nombre: "",
    gradoEstudios: "",
    numeroIdentificacion: "",
    saldo: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Estado para manejar el término de búsqueda

  const {
    estudiantes,
    estudianteSelected,
    handlerAddEstudiante,
    handlerEstudianteSelectedForm,
    handlerCloseForm,
    getEstudiante,
  } = useEstudiantes();

  useEffect(() => {
    getEstudiante(); // Obtener estudiantes cuando el componente se monte
  }, []);

  useEffect(() => {
    if (estudianteSelected) {
      setFormData({
        id_estudiante: estudianteSelected.id_estudiante, // Actualizar el ID del estudiante
        nombre: estudianteSelected.nombre || "",
        gradoEstudios: estudianteSelected.gradoEstudios || "",
        numeroIdentificacion: estudianteSelected.numeroIdentificacion || "",
        saldo: estudianteSelected.saldo || "",
      });
    } else {
      setFormData({
        id_estudiante: 0,
        nombre: "",
        gradoEstudios: "",
        numeroIdentificacion: "",
        saldo: "",
      });
    }
  }, [estudianteSelected]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEstudiante = {
      id_estudiante: formData.id_estudiante, // Asegurarse de que el ID sea parte de los datos enviados
      nombre: formData.nombre,
      gradoEstudios: formData.gradoEstudios,
      numeroIdentificacion: formData.numeroIdentificacion,
      saldo: formData.saldo,
    };

    handlerAddEstudiante(newEstudiante);

    // Limpiar el formulario después de enviar
    setFormData({
      id_estudiante: 0,
      nombre: "",
      gradoEstudios: "",
      numeroIdentificacion: "",
      saldo: "",
    });
    setSearchTerm(""); // Limpiar el término de búsqueda
    handlerCloseForm(); // Cerrar el formulario si es necesario
  };

  const handleEstudianteSelect = (event, value) => {
    if (value) {
      handlerEstudianteSelectedForm(value);
      setFormData({
        id_estudiante: value.id_estudiante, // Actualizar el ID del estudiante seleccionado
        nombre: value.nombre,
        gradoEstudios: value.gradoEstudios,
        numeroIdentificacion: value.numeroIdentificacion,
        saldo: value.saldo,
      });
    } else {
      handlerCloseForm();
      setFormData({
        id_estudiante: 0,
        nombre: "",
        gradoEstudios: "",
        numeroIdentificacion: "",
        saldo: "",
      });
    }
  };

  // Filtrar estudiantes en función del término de búsqueda
  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    estudiante.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        {estudianteSelected ? "Editar Estudiante" : "Registro de Estudiante"}
      </Typography>

      <Autocomplete
        options={filteredEstudiantes || []} // Utiliza los estudiantes filtrados
        getOptionLabel={(option) => option.nombre || ""}
        onChange={handleEstudianteSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Estudiante"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        style={{ marginBottom: "20px" }}
      />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nombre del Estudiante"
              variant="outlined"
              fullWidth
              value={formData.nombre}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nombre: e.target.value,
                }))
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Número de Estudiante"
              variant="outlined"
              fullWidth
              value={formData.numeroIdentificacion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numeroIdentificacion: e.target.value,
                }))
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Saldo"
              variant="outlined"
              type="number"
              fullWidth
              value={formData.saldo}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  saldo: e.target.value,
                }))
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {estudianteSelected ? "Guardar Cambios" : "Registrar Estudiante"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
