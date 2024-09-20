import { createSlice } from "@reduxjs/toolkit";

export const initialPadreForm = {
    id_padre: 0,
    nombre: '',
    contraseña: '',
    email: '',
    estudiantesIds: '',
}
const initialErrors = {
    nombre: '',
    contraseña: '',
    email: '',
    estudiantesIds: '',
}
export const padresSlice = createSlice({

    name: 'padres',
    initialState: {
        padres: [],
        paginator: {},
        padreSelected: initialPadreForm,
        visibleForm: false,
        errors: initialErrors,
        isLoading: true,
    },
    reducers: {
        addPadre: (state, action) => {
            state.padres = [
                ...state.padres,
                {
                    ...action.payload,
                }
            ];
            state.padreSelected = initialPadreForm;
            state.visibleForm = false;
        },
        removePadre: (state, action) => {
            state.padres = state.padres.filter
            (padre => padre.id !== action.payload);
        },
        updatePadre: (state, action) => {
            state.padres = state.padres.map(u => {
                if (u.id === action.payload.id) {
                    return {
                        ...action.payload,
                    };
                }
                return u;
            });
            state.padreSelected = initialPadreForm;
            state.visibleForm = false;
        },
        loadingPadres: (state, { payload }) => {
            state.padres = payload.content;
            state.paginator = payload;
            state.isLoading = false;
        },
        onPadreSelectedForm: (state, { payload }) => {
            state.padreSelected = payload;
            state.visibleForm = true;
        },
        onOpenForm: (state) => {
            state.visibleForm = true;
        },
        onCloseForm: (state) => {
            state.visibleForm = false;
            state.padreSelected = initialPadreForm;

        },
        loadingError: (state, {payload}) => {
            state.errors = payload;
        }
    }
});

export const {
    addPadre,
    removePadre,
    updatePadre,
    loadingPadres,
    onPadreSelectedForm,
    onOpenForm,
    onCloseForm,
    loadingError,
} = padresSlice.actions;