import { configureStore } from "@reduxjs/toolkit";
import { usersSlice } from "./slices/users/usersSlice";
import { productosSlice } from "./slices/productos/productosSlice";
import { recargasSlice } from "./slices/recargas/recargasSlice";
import { estudiantesSlice } from "./slices/estudiantes/estudiantesSlice";
import { comprasSlice } from "./slices/compras/comprasSlice";
import { padresSlice } from "./slices/padres/padresSlice";

// import { activosSlice } from "./slices/users/activosSlice";
import { authSlice } from "./slices/auth/authSlice";
// import { empleadosSlice } from "./slices/empleados/empleadosSlice";
// import { sucursalesSlice } from "./slices/sucursales/sucursalesSlice";
// import { departamentosSlice } from "./slices/departamentos/departamentosSlice";
// import { movimientosSlice } from "./slices/movimiento/movmientosSlice";
// import { proveedorSlice } from "./slices/proveedores/proveedorSlice";
// import { marcasSlice} from "./slices/marcas/marcasSlice";
// import { DetallesMovimientoSlice } from "./slices/movimiento/DetallesMovimientoSlice"; // Importa correctamente el slice

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
    // proveedor: proveedorSlice.reducer,
    padres: padresSlice.reducer, // Asegúrate de que 'padres' coincide con el uso en useSelector
     productos: productosSlice.reducer,
     recargas: recargasSlice.reducer,
     compras: comprasSlice.reducer,
     estudiantes: estudiantesSlice.reducer,
    auth: authSlice.reducer,
  },
});
