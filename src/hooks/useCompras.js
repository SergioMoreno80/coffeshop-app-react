import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { findAll, save, update, fetchReporte } from "../services/comprasService";
import { useDispatch, useSelector } from "react-redux";
import {
  initialForm,
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
} from "../store/slices/compras/comprasSlice";

import { useAuth } from "../auth/hooks/useAuth";

export const useCompras = () => {
  const { compras, compraSelected, visibleForm, errors, isLoading, paginator } =
    useSelector((state) => state.compras);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { login, handlerLogout } = useAuth();

  const getCompra = async (page = 0) => {
    try {
      const result = await findAll(page);
      console.log("login compra:", result);

      dispatch(loadingData(result.data));
    } catch (error) {
      if (error.response?.status == 401) {
        handlerLogout();
      }
    }
  };

  // Obtener el reporte de ventas
  const getReporte = async (fechaI, fechaF, id_estudiante) => {
    try {
      console.log("Reporte de ventas:", fechaI, fechaF, id_estudiante);

      const result = await fetchReporte({ fechaI, fechaF, id_estudiante });
      dispatch(setReporte(result.data)); // Almacena el reporte en el estado global

      console.log("Datos del reporte:", result);
      // Puedes manejar el resultado del reporte aquí (e.g., almacenar en un estado, mostrar en la UI, etc.)
      return result;
    } catch (error) {
      if (error.response?.status === 401) {
        handlerLogout();
      } else {
        console.error("Error al obtener el reporte:", error);
      }
    }
  };

  const handlerAddCompra = async (fab) => {
    console.log("addCompra", fab);
    console.log("addCompra", fab.id_compra);

    if (!login.isAdmin) return;

    let response;
    try {
      if (fab.id_compra === 0) {
        response = await save(fab);
        dispatch(addCompra(response.data));
      } else {
        response = await update(fab);
        dispatch(updateCompra(response.data));
      }

      Swal.fire(
        fab.id_compra === 0 ? "Compra Creado" : "Compra Actualizado",
        fab.id_compra === 0
          ? "El Compra ha sido creado con exito!"
          : "El Compra ha sido actualizado con exito!",
        "success"
      );
      handlerCloseForm();
      navigate("/users/compras");
    } catch (error) {
      if (error.response && error.response.status == 400) {
        dispatch(loadingError(error.response.data));
      } else if (
        error.response &&
        error.response.status == 500 &&
        error.response.data?.message?.includes("constraint")
      ) {
        if (error.response.data?.message?.includes("UK_nombre")) {
          dispatch(loadingError({ username: "El nombre ya existe!" }));
        }
      } else if (error.response?.status == 401) {
        handlerLogout();
      } else {
        throw error;
      }
    }
  };

  const handlerRemoveCompra = (id) => {
    // console.log(id);

    if (!login.isAdmin) return;

    Swal.fire({
      title: "Esta seguro que desea eliminar?",
      text: "Cuidado el compra sera eliminado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(id);

          dispatch(removeCompra(id));

          Swal.fire(
            "Compra Eliminado!",
            "El Compra ha sido eliminado con exito!",
            "success"
          );
        } catch (error) {
          if (error.response?.status == 401) {
            handlerLogout();
          }
        }
      }
    });
  };

  const handlerCompraSelectedForm = (prov) => {
    dispatch(onSelectedForm({ ...prov }));
  };

  const handlerOpenForm = () => {
    dispatch(onOpenForm());
  };

  const handlerCloseForm = () => {
    dispatch(onCloseForm());
    dispatch(loadingError({}));
  };
  return {
    compras,
    compraSelected,
    initialForm,
    visibleForm,
    errors,
    isLoading,
    paginator,
    handlerAddCompra,
    handlerRemoveCompra,
    handlerCompraSelectedForm,
    handlerOpenForm,
    handlerCloseForm,
    getCompra,
    getReporte,
  };
};
