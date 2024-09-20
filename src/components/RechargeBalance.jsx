import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import { useEstudiantes } from "../hooks/useEstudiantes";
import { useRecargas } from "../hooks/useRecargas";

export const RechargeBalance = () => {
  const [student, setStudent] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { estudiantes, getEstudiante } = useEstudiantes();
  const { handlerAddRecarga, recargaselected, errors, initialForm } = useRecargas();

  const [recargaForm, setRecargaForm] = useState(initialForm);

  // Obtiene la fecha actual en formato ISO al montar el componente
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19); // Formato yyyy-MM-ddTHH:mm:ss
    setRecargaForm({
      ...recargaForm,
      fecha: formattedDate,
    });
  }, []);

  // Obtiene los estudiantes al montar el componente
  useEffect(() => {
    getEstudiante();
  }, []);

  // Actualiza el formulario de recarga cuando cambia el estudiante seleccionado o el monto
  useEffect(() => {
    if (student) {
      setRecargaForm({
        ...recargaForm,
        id_estudiante: student.id_estudiante,
        monto: rechargeAmount,
      });
    }
  }, [student, rechargeAmount]);

  // Actualiza el formulario de recarga cuando cambia recargaselected
  useEffect(() => {
    if (recargaselected && recargaselected.id_estudiante) {
      setRecargaForm(recargaselected);
    }
  }, [recargaselected]);
  console.log("Formulario student ", student); // Verificar el formulario antes de enviarlo

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setRecargaForm({
      ...recargaForm,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Formulario recarga antes de envio", recargaForm); // Verificar el formulario antes de enviarlo

    try {
      await handlerAddRecarga(recargaForm);
      setRecargaForm(initialForm);
      setAlertMessage("Saldo recargado exitosamente.");
      setAlertSeverity("success");
    } catch (error) {
      setAlertMessage("Error al realizar la recarga.");
      setAlertSeverity("error");
    }
  };

  const handleStudentSelect = (event, value) => {
    setStudent(value);
    setAlertMessage("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRechargeAmountChange = (event) => {
    setRechargeAmount(event.target.value);
  };

  // Filtra los estudiantes basándose en el término de búsqueda
  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3, maxWidth: 400, margin: "0 auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Recargar Saldo
      </Typography>
      
      <Autocomplete
        options={filteredEstudiantes || []}
        getOptionLabel={(option) => option.nombre || ""}
        onChange={handleStudentSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Estudiante"
            variant="outlined"
            fullWidth
          />
        )}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Fecha"
        fullWidth
        value={recargaForm.fecha}
        name="fecha"
        disabled // Campo no editable
        sx={{ mb: 2 }}
      />
      <TextField
        label="Monto a Recargar"
        fullWidth
        value={recargaForm.monto || ""}
        onChange={handleRechargeAmountChange}
        type="number"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Observaciones"
        fullWidth
        value={recargaForm.observaciones || ""}
        name="observaciones"
        onChange={onInputChange}
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Recargar
      </Button>
      {alertMessage && (
        <Alert severity={alertSeverity} sx={{ mt: 2 }}>
          {alertMessage}
        </Alert>
      )}
      
    </Box>
  );
};
