//DEFINE UN SLICE REDUX PARA MENJAR EL ESTADO DE Estudiantes.
import { createSlice } from "@reduxjs/toolkit";
export const initialForm = {
  id_estudiante: 0,
  nombre: "",
  apellido: "",
  saldo: "",
  numeroIdentificacion: "",
  gradoEstudios: "",
  padre: 0,

};
const initialErrors = {
    nombre: "",
    apellido: "",
    saldo: "",
    numeroIdentificacion: "",
    gradoEstudios: "",
    padre: "",
};
export const estudiantesSlice = createSlice({
  name: 'estudiantes',
  initialState: {
    estudiantes: [],
    paginator: {},//paginacion
    estudianteselected: initialForm,
    visibleForm: false,
    errors: initialErrors,//errores
    isLoading: true,
  },
  reducers: {
    addEstudiante: (state, action) => {
      //acciones
      state.estudiantes = [
        ...state.estudiantes,
        {
          ...action.payload,
        },
      ];
      state.estudianteselected = initialForm; //reiniciar estado
      state.visibleForm = false;
    },
    removeEstudiante: (state, action) => {
      state.estudiantes = state.estudiantes.filter(
        (prov) => prov.id_estudiante !== action.payload
      );
    },
    updateEstudiante: (state, action) => {
      state.estudiantes = state.estudiantes.map((prov) => {
        if (prov.id_estudiante === action.payload.id_estudiante) {
          return action.payload;
        }
        return prov;
      });
      state.estudianteselected = initialForm; // reiniciar estado
      state.visibleForm = false;
    },
    loadInitialData: (state) => {
      state.isLoading = true;
      state.errors = null;
    },
    loadingData: (state, { payload }) => {
      state.estudiantes = payload;
      state.isLoading = false;
    },
    onSelectedForm: (state, { payload }) => {
      state.estudianteselected = payload;
      state.visibleForm = true;
    },
    onOpenForm: (state) => {
      state.visibleForm = true;
    },
    onCloseForm: (state) => {
      state.visibleForm = false;
      state.estudianteselected = initialForm;
    },
    loadingError: (state, { payload }) => {
      state.isLoading = false;
      state.errors = payload;
    },
  },
});

export const {
  addEstudiante,
  removeEstudiante,
  updateEstudiante,
  loadingData,
  onSelectedForm,
  onOpenForm,
  onCloseForm,
  loadingError,
} = estudiantesSlice.actions;


