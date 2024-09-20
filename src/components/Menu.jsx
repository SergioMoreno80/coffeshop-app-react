import React, { useState, useEffect } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { useCompras } from "../hooks/useCompras";
import { useProductos } from "../hooks/useProductos";
import { useEstudiantes } from "../hooks/useEstudiantes";

export const Menu = () => {
  const { handlerAddCompra, getCompra } = useCompras();
  const { productos, getProducto } = useProductos();
  const { estudiantes, getEstudiante } = useEstudiantes();

  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [studentCode, setStudentCode] = useState("");
  const [student, setStudent] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [ticketNumber, setTicketNumber] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [refreshEstudiantes, setRefreshEstudiantes] = useState(false);

  const categories = [
    "Bebidas",
    "Desayunos",
    "Postres",
    "Ensaladas",
    "Snacks",
    "Otros",
  ];

  useEffect(() => {
    getCompra();
    getProducto();
    getEstudiante();
  }, [refreshEstudiantes]);

  const handleImageClick = (item) => {
    if (!student) {
      setAlertMessage("Seleccione un estudiante primero.");
      return;
    }

    const existingItem = cartItems.find(
      (cartItem) => cartItem.id_producto === item.id_producto
    );
    let updatedCartItems;

    if (existingItem) {
      updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id_producto === item.id_producto
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              total: (cartItem.quantity + 1) * item.precio,
            }
          : cartItem
      );
    } else {
      updatedCartItems = [
        ...cartItems,
        { ...item, quantity: 1, total: item.precio },
      ];
    }

    const newTotalCost = updatedCartItems.reduce(
      (sum, cartItem) => sum + cartItem.total,
      0
    );

    if (newTotalCost > student.saldo) {
      setAlertMessage("Saldo insuficiente para cubrir el monto total.");
    } else {
      setAlertMessage("");
    }

    setCartItems(updatedCartItems);
    setTotalCost(newTotalCost);
    setRemainingBalance(student.saldo - newTotalCost);
  };

  const handleStudentCodeChange = (event) => {
    const code = event.target.value;
  
    if (code !== studentCode) {
      handleReset(); // Reinicia la venta si el código de estudiante cambia
    }
  
    setStudentCode(code);
  
    const estudiante = estudiantes.find(
      (est) => est.numeroIdentificacion === code
    );
    
    if (estudiante) {
      setStudent(estudiante);
      setRemainingBalance(estudiante.saldo);
      setAlertMessage("");
    } else {
      setStudent(null);
      setRemainingBalance(0);
      setAlertMessage("Código de estudiante no válido.");
    }
  };
  

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const generateTicketNumber = () => {
    return `TICKET-${Math.floor(Math.random() * 1000000)}`;
  };

  const handlePayment = () => {
    if (!student) {
      setAlertMessage("Seleccione un estudiante antes de pagar.");
      return;
    }

    if (totalCost > student.saldo) {
      setAlertMessage("Saldo insuficiente para cubrir el monto total.");
      return;
    }

    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);

    const nuevoSaldo = student.saldo - totalCost;

    const detallesCompra = cartItems.map((item) => ({
      id_producto: item.id_producto,
      cantidad: item.quantity,
      precio_unitario: item.precio,
      total: item.total,
    }));

    const compraData = {
      id_compra: 0,
      id_estudiante: student.id_estudiante,
      fecha: new Date().toISOString(),
      detallesCompra,
      nuevoSaldo,
    };

    handlerAddCompra(compraData)
      .then(() => {
        setRefreshEstudiantes((prev) => !prev);
        handleReset();
      })
      .catch(() => {
        setAlertMessage("Error al procesar el pago.");
      });
  };

  const printReceipt = (ticketNumber) => {
    const printWindow = window.open("", "", "height=600,width=800");
    const receiptContent = `
      <html>
        <head>
          <title>Recibo de Venta</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .receipt { width: 100%; margin: 0 auto; padding: 20px; }
            .item { margin-bottom: 10px; display: flex; justify-content: space-between; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
            .footer { margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h2>Recibo de Venta</h2>
            <p><strong>Ticket:</strong> ${ticketNumber}</p>
            <p><strong>Estudiante:</strong> ${student.nombre}</p>
            ${cartItems
              .map(
                (item) => `
              <div class="item">
                <span>${item.nombre} (x${item.quantity})</span>
                <span>$${item.total.toFixed(2)}</span>
              </div>
            `
              )
              .join("")}
            <div class="total">
              Total General: $${totalCost.toFixed(2)}
            </div>
            <div class="footer">
              Gracias por su compra.
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleReset = () => {
    setCartItems([]);
    setTotalCost(0);
    setAlertMessage("");
    setStudentCode("");
    setStudent(null);
    setRemainingBalance(0);
    setTicketNumber(null);
  };

  const filteredItems = productos.filter(
    (item) => selectedCategory === "All" || item.categoria === selectedCategory
  );

  const apiUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      height="100vh"
    >
      <Box
        sx={{
          width: { xs: "100%", md: "70%" },
          height: "100%",
          overflowY: "auto",
          padding: 5,
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1000,
          }}
        >
          <TextField
            label="Código de Estudiante"
            variant="outlined"
            fullWidth
            value={studentCode}
            onChange={handleStudentCodeChange}
            margin="normal"
          />
          {student && (
            <Typography variant="h9" marginY={0}>
              Nombre del Estudiante: {student.nombre}
            </Typography>
          )}
          <FormControl fullWidth sx={{ marginY: 1 }}>
            <InputLabel>Categoría</InputLabel>
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              <MenuItem value="All">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <ImageList cols={3} gap={8}>
          {filteredItems.map((item) => (
            <ImageListItem
              key={item.id_producto}
              onClick={() => handleImageClick(item)}
              sx={{ cursor: "pointer" }}
            >
              <img
                src={`${apiUrl}/${item.imagenDireccion}`}
                alt={item.nombre}
                loading="lazy"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
              <ImageListItemBar
                title={item.nombre}
                subtitle={
                  <Typography variant="body2">
                    ${item.precio.toFixed(2)}
                  </Typography>
                }
                sx={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
          backgroundColor: "#f0f0f0",
        }}
      >
        {alertMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {alertMessage}
          </Alert>
        )}
        <Box>
          <Typography variant="h6" gutterBottom>
            Resumen de Compra
          </Typography>
          {cartItems.map((item, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: 1 }}
            >
              <Typography variant="body1">
                {item.nombre} (x{item.quantity})
              </Typography>
              <Typography variant="body1">${item.total.toFixed(2)}</Typography>
            </Box>
          ))}
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Total: ${totalCost.toFixed(2)}
          </Typography>
          <Typography
            variant="body1"
            color={remainingBalance <= 0 ? "red" : "blue"}
          >
            Saldo Restante: ${remainingBalance.toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayment}
            sx={{ marginBottom: 2 }}
          >
            Pagar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleReset}
          >
            Cancelar
          </Button>
          {/* <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => printReceipt(ticketNumber)}
          >
            Imprimir Recibo
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};
