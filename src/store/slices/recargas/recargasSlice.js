//DEFINE UN SLICE REDUX PARA MENJAR EL ESTADO DE Recargas.
import { createSlice } from "@reduxjs/toolkit";
export const initialForm = {
  id_recarga: 0,
  id_estudiante: 0,
  fecha: "",
  monto: "",
  observaciones: "",
};
const initialErrors = {
  id_estudiante: "",
  fecha: "",
  monto: "",
  observaciones: "",
};
export const recargasSlice = createSlice({
  name: "recargas",
  initialState: {
    recargas: [],
    paginator: {}, //paginacion
    recargaSelected: initialForm,
    visibleForm: false,
    errors: initialErrors, //errores
    isLoading: true,
  },
  reducers: {
    addRecarga: (state, action) => {
      //acciones
      state.recargas = [
        ...state.recargas,
        {
          ...action.payload,
        },
      ];
      state.recargaSelected = initialForm; //reiniciar estado
      state.visibleForm = false;
    },
    removeRecarga: (state, action) => {
      state.recargas = state.recargas.filter(
        (prov) => prov.recarga_id !== action.payload
      );
    },
    updateRecarga: (state, action) => {
      state.recargas = state.recargas.map((prov) => {
        if (prov.recarga_id === action.payload.recarga_id) {
          return action.payload;
        }
        return prov;
      });
      state.recargaSelected = initialForm; // reiniciar estado
      state.visibleForm = false;
    },
    loadInitialData: (state) => {
      state.isLoading = true;
      state.errors = null;
    },
    loadingData: (state, { payload }) => {
      state.recargas = payload;
      state.isLoading = false;
    },
    onSelectedForm: (state, { payload }) => {
      state.recargaSelected = payload;
      state.visibleForm = true;
    },
    onOpenForm: (state) => {
      state.visibleForm = true;
    },
    onCloseForm: (state) => {
      state.visibleForm = false;
      state.recargaSelected = initialForm;
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
  addRecarga,
  removeRecarga,
  updateRecarga,
  loadingData,
  onSelectedForm,
  onOpenForm,
  onCloseForm,
  loadingError,
  setReporte,
  clearReporte,
} = recargasSlice.actions;
