import { Navigate, Route, Routes } from "react-router-dom";
import { MenuAppBar } from "../components/layout/MenuAppBar";
import { MiniDrawer } from "../components/layout/MiniDrawer";
import { RegisterPage } from "../pages/RegisterPage";
import { RecipeReviewCard } from "../components/RecipeReviewCard";
import { TitlebarBelowImageList } from "../components/TitlebarBelowImageList";
import { Menu } from "../components/Menu";

import { RechargeBalance } from "../components/RechargeBalance"; // Importa tu componente de recarga
import { ProductForm } from "../components/ProductForm"; // Importa tu componente de recarga
import { EstudiantesForm } from "../components/EstudiantesForm"; // Importa tu componente de recarga
import { CrearPadre } from "../components/CrearPadre"; // Importa tu componente Crear Padres

import { ReporteVentas } from "../components/ReporteVentas"; // Importa tu componente de recarga

import { ReporteVentasEstudiante } from "../components/ReporteVentasEstudiante"; // Importa tu componente de recarga
import { ReporteRecargasEstudiante } from "../components/ReporteRecargasEstudiante"; // Importa tu componente de recarga

import { UsersPage } from "../pages/UsersPage";
import { useSelector } from "react-redux";


export const UserRoutes = () => {
  // const { isAdmin } = useSelector((state) => state.auth);
  const { isAdmin, user } = useSelector((state) => state.auth);

  return (
    <>
      <MenuAppBar user={user} />

      {/* <MenuAppBar /> */}
      {/* <MiniDrawer /> */}

      <Routes>
        {/* <Route path="movimientos" element={<MovimientosPage />} /> */}
        {/* <Route path="activos" element={<ActivosPage />} /> */}
        {/* <Route path="proveedores" element={<ProveedoresPage />} />
        <Route path="fabricantes" element={<BrandPage />} /> */}
        <Route path="users" element={<UsersPage />} />
        <Route path="users/page/:page" element={<UsersPage />} />
        {/* <Route path="users" element={<RecipeReviewCard />} /> */}
        {/* <Route path="users/compras" element={<TitlebarBelowImageList />} /> */}
        <Route path="users/compras" element={<Menu />} />

         {/* Nueva ruta para la recarga de saldo */}
         <Route path="users/recharge" element={<RechargeBalance />} />
         <Route path="users/products" element={<ProductForm />} />
         <Route path="users/estudiantes" element={<EstudiantesForm />} />
         <Route path="users/padres" element={<CrearPadre />} />

         <Route path="compras/Reporte" element={<ReporteVentas />} />
         <Route path="compras/ReporteEstudiante" element={<ReporteVentasEstudiante />} />
         <Route path="recargas/ReporteRecargasEstudiante" element={<ReporteRecargasEstudiante />} />

        {!isAdmin || (
          <>
            <Route path="users/register" element={<RegisterPage />} />
            <Route path="users/edit/:id" element={<RegisterPage />} />
            {/* <Route path="activos/edit/:id" element={<AssetReg />} />
            <Route path="proveedores/edit/:id" element={<ProveedorReg />} />
            <Route path="fabricantes/edit/:id" element={<BrandReg />} />
            <Route path="Assets/kardex/:id" element={<Kardex />} /> */}
          </>
        )}
        {/* <Route path="/" element={<Navigate to="/AssetPage/register" />} /> */}

      </Routes>
    </>
  );
};
