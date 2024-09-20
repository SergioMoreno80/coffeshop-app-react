import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export const TitlebarBelowImageList = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [totalCost, setTotalCost] = React.useState(0);
  const [studentCode, setStudentCode] = React.useState('');
  const [student, setStudent] = React.useState(null);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [ticketNumber, setTicketNumber] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [productSearch, setProductSearch] = React.useState('');

  const students = {
    '123': { name: 'Juan Pérez', balance: 500 },
    '456': { name: 'María Gómez', balance: 300 },
    '789': { name: 'Pedro López', balance: 800 }, // Corrección en el nombre del estudiante
  };

  const itemData = [
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSADL9_8eNS9We3-NCYDCF6dapvVefQxKGhDw&s', title: 'Tacos de Maiz', cost: 59, category: 'Desayunos' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ph1q1rdENg4n3DpOrsl9oFIhV1-hqsiheg&s', title: 'Flautas', cost: 60, category: 'Desayunos' },
    { img: 'https://img-global.cpcdn.com/recipes/02480f77264c715c/680x482cq70/bocoles-veracruzanos-foto-principal.jpg', title: 'Bocoles', cost: 54, category: 'Desayunos' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDMS0uU3schxtP1EMlCjWbkBTq8PImVmjaQQ&s', title: 'Molletes', cost: 20, category: 'Desayunos' },
    { img: 'https://laroussecocina.mx/wp-content/uploads/2021/11/Flautas-de-pollo.jpg.webp', title: 'Huevo con Jamon', cost: 45, category: 'Desayunos' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIKMnl6527MHGyyvX83LpKHd9Z6usK25fR-A&s', title: 'Hot Cakes', cost: 65, category: 'Food' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLGUIiOCRDQR7Z3ik4vlPuMPpqIUb5ouDmA&s', title: 'Chilaquiles Verdes con pollo', cost: 75, category: 'Desayunos' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoq7jRXNGmhy2fQ2WI0oczlIu7ANW4xNJLkQ&s', title: 'Chilaquiles rojos con pollo', cost: 35, category: 'Food' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz0buwHsRv5g8gDcnoXQPTxorZCMKmaCQQnQ&s', title: 'Enfrijoladas', cost: 215, category: 'Desayunos' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRiwB2RNY9mxG6IwMWGQLi8U_AHbV1R_3iRw&s', title: 'Entomatadas', cost: 105, category: 'Desayunos' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2riIDfhGjP1h0pzaRA7RRrn5YYImui0-YYg&s', title: 'Sandwich de jamon con queso', cost: 510, category: 'Desayunos' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYAyCjD8WGhqFOO8z_8FlPWP9bizzBNZGhjg&s', title: 'Sandwich de ensalada de pollo', cost: 510, category: 'Food' },
  ];

  const handleImageClick = (item) => {
    if (!student) {
      setAlertMessage('Seleccione un estudiante primero.');
      return;
    }

    const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
    let updatedCartItems;

    if (existingItem) {
      updatedCartItems = cartItems.map(cartItem =>
        cartItem.title === item.title
          ? { ...cartItem, quantity: cartItem.quantity + 1, total: (cartItem.quantity + 1) * cartItem.cost }
          : cartItem
      );
    } else {
      updatedCartItems = [...cartItems, { ...item, quantity: 1, total: item.cost }];
    }

    const newTotalCost = updatedCartItems.reduce((sum, cartItem) => sum + cartItem.total, 0);

    if (newTotalCost > student.balance) {
      setAlertMessage('Saldo insuficiente para cubrir el monto total.');
    } else {
      setAlertMessage('');
    }

    setCartItems(updatedCartItems);
    setTotalCost(newTotalCost);
  };

  const handleStudentCodeChange = (event) => {
    const code = event.target.value;
    setStudentCode(code);

    if (students[code]) {
      setStudent(students[code]);
      setAlertMessage('');
    } else {
      setStudent(null);
      setAlertMessage('Código de estudiante no válido.');
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleProductSearchChange = (event) => {
    setProductSearch(event.target.value);
  };

  const generateTicketNumber = () => {
    return `TICKET-${Math.floor(Math.random() * 1000000)}`;
  };

  const handlePayment = () => {
    if (!student) {
      setAlertMessage('Seleccione un estudiante antes de pagar.');
      return;
    }

    if (totalCost > student.balance) {
      setAlertMessage('Saldo insuficiente para cubrir el monto total.');
      return;
    }

    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);
    printReceipt(newTicketNumber);
    setStudent(prev => ({ ...prev, balance: prev.balance - totalCost }));
    handleReset();
  };

  const printReceipt = (ticketNumber) => {
    if (!student) {
      setAlertMessage('Seleccione un estudiante antes de imprimir el recibo.');
      return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
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
            <p><strong>Estudiante:</strong> ${student.name}</p>
            ${cartItems.map(item => `
              <div class="item">
                <span>${item.title} (x${item.quantity})</span>
                <span>$${item.total.toFixed(2)}</span>
              </div>
            `).join('')}
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
    setAlertMessage('');
    setStudentCode('');
    setStudent(null);
    setTicketNumber(null);
  };

  const filteredItems = itemData.filter(item =>
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.title.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <Box display="flex">
      <Box sx={{ width: '70%', height: 480, overflowY: 'scroll' }}>
        <Box sx={{ marginTop: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <MenuItem value="All">Todas</MenuItem>
              <MenuItem value="Desayunos">Desayunos</MenuItem>
              <MenuItem value="Food">Comida</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ImageList cols={3} gap={8}>
          {filteredItems.map(item => (
            <ImageListItem key={item.img} onClick={() => handleImageClick(item)}>
              <img
                src={`${item.img}?w=248&fit=crop&auto=format`}
                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
              />
              <ImageListItemBar
                title={item.title}
                subtitle={
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    $ {item.cost}
                  </span>
                }
                position="below"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      
      <Box sx={{ width: '30%', paddingLeft: 2 }}>
        <Typography variant="h6">Hoja de Descripción de Venta</Typography>
        {alertMessage && <Alert severity="warning">{alertMessage}</Alert>}
        {ticketNumber && (
          <Alert severity="success">
            ¡Pago realizado con éxito! Número de Ticket: {ticketNumber}
          </Alert>
        )}
        <Box sx={{ marginTop: 2 }}>
        <TextField
          label="Código de Estudiante"
          variant="outlined"
          fullWidth
          value={studentCode}
          onChange={handleStudentCodeChange}
        />
        {student && <Typography variant="subtitle1" sx={{ marginTop: 1 }}>Estudiante: {student.name}</Typography>}
        {student && <Typography variant="subtitle1" sx={{ marginTop: 1 }}>Saldo: {student.balance}</Typography>}
        </Box>
        <List>
          {cartItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.title} (x${item.quantity})`}
                secondary={`$${item.total.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Total: ${totalCost.toFixed(2)}</Typography>
       
        <Box sx={{ marginTop: 2 }}>
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" fullWidth onClick={handlePayment}>
              Pagar
            </Button>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="secondary" fullWidth onClick={handleReset}>
              Resetear
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
