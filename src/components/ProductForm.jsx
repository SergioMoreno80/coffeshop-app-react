import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Typography,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useProductos } from "../hooks/useProductos";

// Categorías para los productos
const categories = [
  "Bebidas",
  "Desayunos",
  "Postres",
  "Ensaladas",
  "Snacks",
  "Otros",
];

export const ProductForm = () => {
  // const [formData, setFormData] = useState({
  //   nombre: "",
  //   categoria: "",
  //   precio: "",
  //   imagenDireccion: null,
  //   imagen: null,
  // });

  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  const {initialForm,
    productos,
    productoSelected,
    handlerAddProducto,
    handlerProductoSelectedForm,
    handlerOpenForm,
    handlerCloseForm,
    getProducto,
  } = useProductos();
  const [productoForm, setProductoForm] = useState(initialForm);
  const {
    nombre,
    categoria,
    precio,
    imagenDireccion,
    imagen,
  } = productoForm;

  useEffect(() => {
    getProducto();
  }, []);

  useEffect(() => {
    if (productoSelected) {
      setProductoForm({
        nombre: productoSelected.nombre || "",
        categoria: productoSelected.categoria || "",
        precio: productoSelected.precio || "",
        imagenDireccion: productoSelected.imagenDireccion
          ? `${apiUrl}/${productoSelected.imagenDireccion}`
          : null,
        imagen: null,
      });
    } else {
      setProductoForm({
        nombre: "",
        categoria: "",
        precio: "",
        imagenDireccion: null,
        imagen: null,
      });
    }
  }, [productoSelected]);

  const handleImageChange = (e) => {
    const archivo = e.target.files[0];
    setProductoForm((prev) => ({
      ...prev,
      imagenDireccion: URL.createObjectURL(archivo),
      imagen: archivo,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id_producto: productoSelected ? productoSelected.id_producto : 0,
      nombre: productoForm.nombre,
      categoria: productoForm.categoria,
      precio: productoForm.precio,
      imagenDireccion: productoForm.imagenDireccion,
      imagen: productoForm.imagen,
    };

    handlerAddProducto(newProduct)
      .then(() => {
        // Limpiar el formulario
        setProductoForm({
          nombre: "",
          categoria: "",
          precio: "",
          imagenDireccion: null,
          imagen: null,
        });
        getProducto(); // Obtener productos actualizados
      })
      .catch((error) => {
        console.error("Error al guardar el producto:", error);
      });
  };

  const handleProductSelect = (event, value) => {
    if (value) {
      handlerProductoSelectedForm(value);
      setProductoForm({
        nombre: value.nombre,
        categoria: value.categoria,
        precio: value.precio,
        imagenDireccion: value.imagenDireccion
          ? `${apiUrl}/${value.imagenDireccion}`
          : null,
        imagen: null,
      });
    } else {
      handlerCloseForm();
      setProductoForm({
        nombre: "",
        categoria: "",
        precio: "",
        imagenDireccion: null,
        imagen: null,
      });
    }
  };

  const filteredProductos = productos.filter((producto) =>
    producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        {productoSelected ? "Editar Producto" : "Registro de Producto"}
      </Typography>
      <Autocomplete
        options={filteredProductos || []}
        getOptionLabel={(option) => option.nombre || ""}
        isOptionEqualToValue={(option, value) =>
          option.id_producto === value.id_producto
        }
        onChange={handleProductSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Producto"
            variant="outlined"
            fullWidth
          />
        )}
        style={{ marginBottom: "20px" }}
      />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nombre del Producto"
              variant="outlined"
              fullWidth
              value={productoForm.nombre}
              onChange={(e) =>
                setProductoForm((prev) => ({
                  ...prev,
                  nombre: e.target.value,
                }))
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={productoForm.categoria || ""}
                onChange={(e) =>
                  setProductoForm((prev) => ({
                    ...prev,
                    categoria: e.target.value,
                  }))
                }
                label="Categoría"
              >
                {categories.map((cat, index) => (
                  <MenuItem key={`${cat}-${index}`} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Precio"
              variant="outlined"
              type="number"
              fullWidth
              value={productoForm.precio}
              onChange={(e) =>
                setProductoForm((prev) => ({
                  ...prev,
                  precio: e.target.value,
                }))
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Subir Imagen
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {productoForm.imagenDireccion && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={productoForm.imagenDireccion}
                  alt="Previsualización"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                />
                {/* <Typography variant="body2" style={{ marginTop: "10px" }}>
                  {productoForm.imagen?.name || productoForm.imagenDireccion}
                </Typography> */}
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {productoSelected ? "Guardar Cambios" : "Registrar Producto"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
