//DEFINE UN SLICE REDUX PARA MENJAR EL ESTADO DE Compras.
import { createSlice } from "@reduxjs/toolkit";
export const initialForm = {
  id_compra: 0,
  id_estudiante: 0,
  fecha: "",
  detallesCompra: "",
};
const initialErrors = {
    id_estudiante: 0,
    fecha: "",
    detallesCompra: "",
};
export const comprasSlice = createSlice({
  name: 'compras',
  initialState: {
    compras: [],
    paginator: {},//paginacion
    compraSelected: initialForm,
    visibleForm: false,
    errors: initialErrors,//errores
    isLoading: true,
  },
  reducers: {
    addCompra: (state, action) => {
      //acciones
      state.compras = [
        ...state.compras,
        {
          ...action.payload,
        },
      ];
      state.compraSelected = initialForm; //reiniciar estado
      state.visibleForm = false;
    },
    removeCompra: (state, action) => {
      state.compras = state.compras.filter(
        (prov) => prov.compra_id !== action.payload
      );
    },
    updateCompra: (state, action) => {
      state.compras = state.compras.map((prov) => {
        if (prov.compra_id === action.payload.compra_id) {
          return action.payload;
        }
        return prov;
      });
      state.compraSelected = initialForm; // reiniciar estado
      state.visibleForm = false;
    },
    loadInitialData: (state) => {
      state.isLoading = true;
      state.errors = null;
    },
    loadingData: (state, { payload }) => {
      state.compras = payload;
      state.isLoading = false;
    },
    onSelectedForm: (state, { payload }) => {
      state.compraSelected = payload;
      state.visibleForm = true;
    },
    onOpenForm: (state) => {
      state.visibleForm = true;
    },
    onCloseForm: (state) => {
      state.visibleForm = false;
      state.compraSelected = initialForm;
    },
    loadingError: (state, { payload }) => {
      state.isLoading = false;
      state.errors = payload;
    },
    setReporte: (state, { payload }) => {
      state.reporte = payload;
      state.isLoading = false;
    },
    clearReporte: (state) => {
      state.reporte = null;
    },
  },
});

export const {
  addCompra,
  removeCompra,
  updateCompra,
  loadingData,
  onSelectedForm,
  onOpenForm,
  onCloseForm,
  loadingError,
  setReporte,
  clearReporte,
} = comprasSlice.actions;


