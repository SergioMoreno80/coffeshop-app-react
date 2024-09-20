import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { findAll, save, update } from "../services/estudiantesService";
import { useDispatch, useSelector } from "react-redux";
import {
  initialForm,
  addEstudiante,
  removeEstudiante,
  updateEstudiante,
  loadingData,
  onSelectedForm,
  onOpenForm,
  onCloseForm,
  loadingError,
} from "../store/slices/estudiantes/estudiantesSlice";

import { useAuth } from "../auth/hooks/useAuth";

export const useEstudiantes = () => {
  const {
    estudiantes,
    estudianteselected,
    visibleForm,
    errors,
    isLoading,
    paginator,
  } = useSelector((state) => state.estudiantes);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { login, handlerLogout } = useAuth();

  const getEstudiante = async (page = 0) => {
    try {
      const result = await findAll(page);
      console.log("login estudiante:", result);

      dispatch(loadingData(result.data));
    } catch (error) {
      if (error.response?.status == 401) {
        handlerLogout();
      }
    }
  };

  const handlerAddEstudiante = async (fab) => {
    // console.log(fab);

    if (!login.isAdmin) return;
    console.log("handlerAddEstudiante", fab);

    let response;
    try {
      if (fab.id_estudiante === 0) {
        response = await save(fab);
        dispatch(addEstudiante(response.data));
      } else {
        response = await update(fab);
        dispatch(updateEstudiante(response.data));
      }

      Swal.fire(
        fab.id_estudiante === 0 ? "Estudiante Creado" : "Estudiante Actualizado",
        fab.id_estudiante === 0
          ? "El Estudiante ha sido creado con exito!"
          : "El Estudiante ha sido actualizado con exito!",
        "success"
      );
      handlerCloseForm();
      navigate("/users/estudiantes");
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

  const handlerRemoveEstudiante = (id) => {
    // console.log(id);

    if (!login.isAdmin) return;

    Swal.fire({
      title: "Esta seguro que desea eliminar?",
      text: "Cuidado el estudiante sera eliminado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(id);

          dispatch(removeEstudiante(id));

          Swal.fire(
            "Estudiante Eliminado!",
            "El Estudiante ha sido eliminado con exito!",
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

  const handlerEstudianteSelectedForm = (prov) => {
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
    estudiantes,
    estudianteselected,
    initialForm,
    visibleForm,
    errors,
    isLoading,
    paginator,
    handlerAddEstudiante,
    handlerRemoveEstudiante,
    handlerEstudianteSelectedForm,
    handlerOpenForm,
    handlerCloseForm,
    getEstudiante,
  };
};
