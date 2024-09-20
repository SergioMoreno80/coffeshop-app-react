import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography, FormControl, Alert, Paper, Autocomplete } from "@mui/material";
import { useCompras } from "../hooks/useCompras";
import { useEstudiantes } from "../hooks/useEstudiantes";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const ReporteVentas = () => {
  const [fechaI, setFechaInicio] = useState("");
  const [fechaF, setFechaFin] = useState("");
  const [estudianteId, setEstudianteId] = useState("");
  const [alert, setAlert] = useState(null);
  const { getReporte } = useCompras();
  const { estudiantes, getEstudiante } = useEstudiantes();

  useEffect(() => {
    getEstudiante();
  }, []);

  const handleGenerarPDF = async () => {
    if (!fechaI || !fechaF || !estudianteId) {
      setAlert({ type: "error", message: "Por favor seleccione la fecha de inicio, la fecha de fin y un estudiante." });
      return;
    }

    try {
      const result = await getReporte(fechaI, fechaF, estudianteId);

      if (!result || result.length === 0) {
        setAlert({ type: "error", message: "No hay datos para generar el reporte en PDF." });
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const estudiante = estudiantes.find(est => est.id_estudiante === estudianteId);
      const nombre = estudiante ? estudiante.nombre : "Desconocido";

      doc.text(`Reporte de Ventas`, 10, 10);
      doc.text(`Alumno(a): ${nombre}`, 10, 20);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 30);

      doc.setFontSize(8);
      let y = 40;
 
      result.forEach((item, index) => {
        doc.text(`Fecha de la Venta: ${new Date(item.fecha).toLocaleDateString()}`, 10, y);
        doc.text(`Detalles:`, 10, y + 10);
        item.detallesCompra.forEach((detalle, detalleIndex) => {
          const cantidad = detalle.cantidad || 0;
          const precioUnitario = detalle.precio_unitario ? `$${parseFloat(detalle.precio_unitario).toFixed(2)}` : "$0.00";
          const total = detalle.total ? `$${parseFloat(detalle.total).toFixed(2)}` : "$0.00";

          doc.text(`- Producto : ${detalle.nombre_producto}, Cantidad: ${cantidad}, Precio Unitario: ${precioUnitario}, Total: ${total}`, 10, y + 20 + (detalleIndex * 10));
        });

        const totalCompra = item.detallesCompra.reduce((sum, detalle) => {
          return sum + parseFloat(detalle.total || 0);
        }, 0);

        doc.text(`Total Compra: $${totalCompra.toFixed(2)}`, 10, y + 30 + (item.detallesCompra.length * 10));
        doc.text("================================", 10, y + 40 + (item.detallesCompra.length * 10));
        y += 50 + (item.detallesCompra.length * 10);
      });

      doc.setFontSize(8);
      doc.text("Gracias por su compra!", 10, y);
      doc.text("================================", 10, y + 10);

      doc.save("reporte_ventas_ticket.pdf");

      setAlert({ type: "success", message: "Reporte generado y descargado con éxito." });
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      setAlert({ type: "error", message: "Hubo un problema al generar el reporte." });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Generar Reporte de Ventas
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
            renderInput={(params) => <TextField {...params} label="Estudiante" />}
            onChange={(event, newValue) => {
              if (newValue) {
                setEstudianteId(newValue.id_estudiante);
              } else {
                setEstudianteId("");
              }
            }}
          />
        </FormControl>

        <TextField
          label="Fecha de Inicio"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fechaI}
          onChange={(e) => setFechaInicio(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Fecha de Fin"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fechaF}
          onChange={(e) => setFechaFin(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleGenerarPDF} fullWidth>
          Descargar PDF
        </Button>
      </Paper>
    </Box>
  );
};
