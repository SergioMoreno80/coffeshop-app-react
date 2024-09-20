import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { findAll, save, update } from "../services/productosService";
import { useDispatch, useSelector } from "react-redux";
import {
  initialForm,
  addProducto,
  removeProducto,
  updateProducto,
  loadingData,
  onSelectedForm,
  onOpenForm,
  onCloseForm,
  loadingError,
} from "../store/slices/productos/productosSlice";

import { useAuth } from "../auth/hooks/useAuth";

export const useProductos = () => {
  const {
    productos,
    productoSelected,
    visibleForm,
    errors,
    isLoading,
    paginator,
  } = useSelector((state) => state.productos);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { login, handlerLogout } = useAuth();

  const getProducto = async (page = 0) => {
    try {
      const result = await findAll(page);
      console.log("login producto:", result);

      dispatch(loadingData(result.data));
    } catch (error) {
      if (error.response?.status == 401) {
        handlerLogout();
      }
    }
  };

  const handlerAddProducto = async (fab) => {

    if (!login.isAdmin) return;
    console.log("handlerAddProducto: ", fab);

    let response;
    try {
      if (fab.id_producto === 0) {
        response = await save(fab);
        dispatch(addProducto(response.data));
      } else {
        response = await update(fab);
        dispatch(updateProducto(response.data));
      }

      Swal.fire(
        fab.id_producto === 0 ? "Producto Creado" : "Producto Actualizado",
        fab.id_producto === 0
          ? "El Producto ha sido creado con exito!"
          : "El Producto ha sido actualizado con exito!",
        "success"
      );
      handlerCloseForm();
      navigate("/users/products");
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

  const handlerRemoveProducto = (id) => {
    // console.log(id);

    if (!login.isAdmin) return;

    Swal.fire({
      title: "Esta seguro que desea eliminar?",
      text: "Cuidado el producto sera eliminado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(id);

          dispatch(removeProducto(id));

          Swal.fire(
            "Producto Eliminado!",
            "El Producto ha sido eliminado con exito!",
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

  const handlerProductoSelectedForm = (prov) => {
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
    productos,
    productoSelected,
    initialForm,
    visibleForm,
    errors,
    isLoading,
    paginator,
    handlerAddProducto,
    handlerRemoveProducto,
    handlerProductoSelectedForm,
    handlerOpenForm,
    handlerCloseForm,
    getProducto,
  };
};
