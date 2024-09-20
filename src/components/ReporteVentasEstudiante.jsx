import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  Alert,
  Paper,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useCompras } from "../hooks/useCompras";
import { useEstudiantes } from "../hooks/useEstudiantes";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

export const ReporteVentasEstudiante = () => {
  const [estudianteId, setEstudianteId] = useState("");
  const [alert, setAlert] = useState(null);
  const { getReporte } = useCompras();
  const { estudiantes, getEstudiante } = useEstudiantes();

  useEffect(() => {
    getEstudiante();
  }, []);

  const handleGenerarPDF = async (opcion) => {
    let fechaI, fechaF;

    switch (opcion) {
      case "hoy":
        fechaI = dayjs().startOf("day").format("YYYY-MM-DD");
        fechaF = dayjs().endOf("day").format("YYYY-MM-DD");
        break;
      case "mesActual":
        fechaI = dayjs().startOf("month").format("YYYY-MM-DD");
        fechaF = dayjs().endOf("month").format("YYYY-MM-DD");
        break;
      case "mesAnterior":
        fechaI = dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD");
        fechaF = dayjs()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD");
        break;
      default:
        return;
    }

    if (!estudianteId) {
      setAlert({
        type: "error",
        message: "Por favor seleccione un estudiante.",
      });
      return;
    }

    try {
      const result = await getReporte(fechaI, fechaF, estudianteId);

      if (!result || result.length === 0) {
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

      doc.text(`Reporte de Ventas`, 10, 10);
      doc.text(`Alumno(a): ${nombre}`, 10, 20);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 25);
      doc.setFontSize(8);
      let y = 35;

      result.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.text("================================", 10, y + 5);
        doc.setFont("helvetica", "normal");

        doc.text(
          `Fecha de la Venta: ${new Date(item.fecha).toLocaleDateString()}`,
          10,
          y
        );
        doc.text(`Detalles:`, 10, y + 10);
        item.detallesCompra.forEach((detalle, detalleIndex) => {
          const cantidad = detalle.cantidad || 0;
          const precioUnitario = detalle.precio_unitario
            ? `$${parseFloat(detalle.precio_unitario).toFixed(2)}`
            : "$0.00";
          const total = detalle.total
            ? `$${parseFloat(detalle.total).toFixed(2)}`
            : "$0.00";

          doc.text(
            `- Producto : ${detalle.nombre_producto}, Cantidad: ${cantidad}, Precio Unitario: ${precioUnitario}, Total: ${total}`,
            10,
            y + 15 + detalleIndex * 5
          );
        });

        const totalCompra = item.detallesCompra.reduce((sum, detalle) => {
          return sum + parseFloat(detalle.total || 0);
        }, 0);
        doc.setFont("helvetica", "bold");
        const leng = item.detallesCompra.length;
        doc.text(
          `Total Compra: $${totalCompra.toFixed(2)}`,
          10,
          y + 5 + (leng === 1 ? 2 : leng) * 10
        );
        doc.text(
          "================================",
          10,
          y + 10 + (leng === 1 ? 2 : leng) * 10
        );
        doc.setFont("helvetica", "normal");

        y += 20 + (leng === 1 ? 2 : leng) * 10;

        // Verificar si es necesario agregar una nueva página
        if (y > 280) { // Ajusta este valor según el margen inferior
          doc.addPage();
          y = 10; // Restablecer la posición y en la nueva página
        }
      });

      doc.setFontSize(8);
      doc.text("Gracias por su compra!", 10, y);
      doc.setFont("helvetica", "bold");
      doc.text("================================", 10, y + 5);

      doc.save("reporte_ventas_ticket.pdf");

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
            renderInput={(params) => (
              <TextField {...params} label="Estudiante" />
            )}
            onChange={(event, newValue) => {
              if (newValue) {
                setEstudianteId(newValue.id_estudiante);
              } else {
                setEstudianteId("");
              }
            }}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGenerarPDF("hoy")}
          fullWidth
          sx={{ mb: 2 }}
        >
          Descargar PDF (Hoy)
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGenerarPDF("mesActual")}
          fullWidth
          sx={{ mb: 2 }}
        >
          Descargar PDF (Mes Actual)
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGenerarPDF("mesAnterior")}
          fullWidth
        >
          Descargar PDF (Mes Anterior)
        </Button>
      </Paper>
    </Box>
  );
};
