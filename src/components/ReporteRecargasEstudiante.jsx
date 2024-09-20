import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  Alert,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useRecargas } from "../hooks/useRecargas";
import { useEstudiantes } from "../hooks/useEstudiantes";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const ReporteRecargasEstudiante = () => {
  const [fechaI, setFechaInicio] = useState("");
  const [fechaF, setFechaFin] = useState("");
  const [estudianteId, setEstudianteId] = useState("");
  const [saldo, setSaldo] = useState("");

  const [alert, setAlert] = useState(null);
  const { getRecargasPorEstudiante } = useRecargas();
  const { estudiantes, getEstudiante } = useEstudiantes();

  useEffect(() => {
    getEstudiante();
  }, []);

  const handleGenerarPDF = async () => {
    if (!estudianteId) {
      setAlert({
        type: "error",
        message: "Por favor seleccione un estudiante.",
      });
      return;
    }

    try {
      const recargas = await getRecargasPorEstudiante(estudianteId);

      if (!recargas || recargas.length === 0) {
        setAlert({
          type: "error",
          message: "No hay datos para generar el reporte en PDF.",
        });
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      const estudiante = estudiantes.find(
        (est) => est.id_estudiante === estudianteId
      );
      const nombre = estudiante ? estudiante.nombre : "Desconocido";

      doc.text(`Reporte de Recargas`, 10, 10);
      doc.text(`Alumno(a): ${nombre}`, 10, 20);
      doc.text(`Saldo Actual: $${saldo.toFixed(2)}`, 10, 25);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 30);
      doc.setFont("helvetica", "normal");

      doc.setFontSize(8);
      let y = 40;
      const lineHeight = 15; // Altura de cada sección de recarga
      const pageHeight = doc.internal.pageSize.height; // Altura de la página

      recargas.forEach((recarga, index) => {
        if (y + lineHeight > pageHeight - 20) { // Si la posición `y` excede el espacio en la página
          doc.addPage(); // Añadir una nueva página
          y = 10; // Reiniciar la posición `y` al inicio de la nueva página
        }

        doc.text(
          `Fecha de Recarga: ${new Date(recarga.fecha).toLocaleDateString()}`,
          10,
          y
        );
        doc.setFont("helvetica", "bold");
        doc.text(`Monto: $${recarga.monto.toFixed(2)}`, 10, y + 5);
        doc.text("================================", 10, y + 10);
        doc.setFont("helvetica", "normal");

        y += lineHeight;
      });

      doc.setFontSize(8);
      if (y + lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 10;
      }
      doc.text("Reporte generado con éxito", 10, y);

      doc.save("reporte_recargas.pdf");

      setAlert({
        type: "success",
        message: "Reporte generado y descargado con éxito.",
      });
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      setAlert({
        type: "error",
        message: "Hubo un problema al generar el reporte.",
      });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={3}
        style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}
      >
        <Typography variant="h4" gutterBottom>
          Generar Reporte de Recargas
        </Typography>

        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={estudiantes}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField {...params} label="Estudiante" />
            )}
            onChange={(event, newValue) => {
              if (newValue) {
                setEstudianteId(newValue.id_estudiante);
                setSaldo(newValue.saldo);
              } else {
                setEstudianteId("");
                setSaldo("");
              }
            }}
          />
        </FormControl>
        {saldo && (
          <Typography variant="body1" gutterBottom>
            Saldo Actual: ${saldo.toFixed(2)}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerarPDF}
          fullWidth
        >
          Descargar PDF
        </Button>
      </Paper>
    </Box>
  );
};
