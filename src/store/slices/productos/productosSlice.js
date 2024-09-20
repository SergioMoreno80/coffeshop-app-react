//DEFINE UN SLICE REDUX PARA MENJAR EL ESTADO DE Productos.
import { createSlice } from "@reduxjs/toolkit";
export const initialForm = {
  id_producto: 0,
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "",
  imagenDireccion: "",
  imagen: "",
};
const initialErrors = {
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagenDireccion: "",
    imagen: "",
};
export const productosSlice = createSlice({
  name: 'productos',
  initialState: {
    productos: [],
    paginator: {},//paginacion
    productoSelected: initialForm,
    visibleForm: false,
    errors: initialErrors,//errores
    isLoading: true,
  },
  reducers: {
    addProducto: (state, action) => {
      //acciones
      state.productos = [
        ...state.productos,
        {
          ...action.payload,
        },
      ];
      state.productoSelected = initialForm; //reiniciar estado
      state.visibleForm = false;
    },
    removeProducto: (state, action) => {
      state.productos = state.productos.filter(
        (prov) => prov.producto_id !== action.payload
      );
    },
    updateProducto: (state, action) => {
      state.productos = state.productos.map((prov) => {
        if (prov.producto_id === action.payload.producto_id) {
          return action.payload;
        }
        return prov;
      });
      state.productoSelected = initialForm; // reiniciar estado
      state.visibleForm = false;
    },
    loadInitialData: (state) => {
      state.isLoading = true;
      state.errors = null;
    },
    loadingData: (state, { payload }) => {
      state.productos = payload;
      state.isLoading = false;
    },
    onSelectedForm: (state, { payload }) => {
      state.productoSelected = payload;
      state.visibleForm = true;
    },
    onOpenForm: (state) => {
      state.visibleForm = true;
    },
    onCloseForm: (state) => {
      state.visibleForm = false;
      state.productoSelected = initialForm;
    },
    loadingError: (state, { payload }) => {
      state.isLoading = false;
      state.errors = payload;
    },
  },
});

export const {
  addProducto,
  removeProducto,
  updateProducto,
  loadingData,
  onSelectedForm,
  onOpenForm,
  onCloseForm,
  loadingError,
} = productosSlice.actions;


