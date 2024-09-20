import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { findAll, save, update, fetchReporte } from "../services/recargasService";
import { useDispatch, useSelector } from "react-redux";
import {
  initialForm,
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
} from "../store/slices/recargas/recargasSlice";

import { useAuth } from "../auth/hooks/useAuth";

export const useRecargas = () => {
  const {
    recargas,
    recargaselected,
    visibleForm,
    errors,
    isLoading,
    paginator,
  } = useSelector((state) => state.recargas);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { login, handlerLogout } = useAuth();

  const getRecarga = async (page = 0) => {
    try {
      const result = await findAll(page);
      console.log("login recarga:", result);

      dispatch(loadingData(result.data));
    } catch (error) {
      if (error.response?.status == 401) {
        handlerLogout();
      }
    }
  };

  // const getRecargasPorEstudiante = async (idEstudiante) => {
  //   try {
  //     const response = await axios.get(
  //       `/api/recargas/estudiante/${idEstudiante}`
  //     );
  //     setRecargas(response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error al obtener las recargas:", error);
  //     return [];
  //   }
  // };
  const getRecargasPorEstudiante = async (id_estudiante) => {
    try {
      console.log("Reporte de ventas:", id_estudiante);

      const result = await fetchReporte({ id_estudiante });
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

  const handlerAddRecarga = async (fab) => {
    console.log("addRecarga", fab);
    console.log("addRecarga", fab.id_recarga);

    if (!login.isAdmin) return;

    let response;
    try {
      if (fab.id_recarga === 0) {
        response = await save(fab);
        dispatch(addRecarga(response.data));
      } else {
        response = await update(fab);
        dispatch(updateRecarga(response.data));
      }

      Swal.fire(
        fab.id_recarga === 0 ? "Recarga Creado" : "Recarga Actualizado",
        fab.id_recarga === 0
          ? "El Recarga ha sido creado con exito!"
          : "El Recarga ha sido actualizado con exito!",
        "success"
      );
      handlerCloseForm();
      navigate("/recargas");
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

  const handlerRemoveRecarga = (id) => {
    // console.log(id);

    if (!login.isAdmin) return;

    Swal.fire({
      title: "Esta seguro que desea eliminar?",
      text: "Cuidado el recarga sera eliminado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(id);

          dispatch(removeRecarga(id));

          Swal.fire(
            "Recarga Eliminado!",
            "El Recarga ha sido eliminado con exito!",
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

  const handlerRecargaselectedForm = (prov) => {
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
    recargas,
    recargaselected,
    initialForm,
    visibleForm,
    errors,
    isLoading,
    paginator,
    handlerAddRecarga,
    handlerRemoveRecarga,
    handlerRecargaselectedForm,
    handlerOpenForm,
    handlerCloseForm,
    getRecarga,
    getRecargasPorEstudiante,
  };
};
