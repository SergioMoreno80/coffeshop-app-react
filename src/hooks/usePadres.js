import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { findAllPages, remove, save, update } from "../services/padreService";
import { useDispatch, useSelector } from "react-redux";
import { initialPadreForm, addPadre, removePadre, updatePadre, loadingPadres, onPadreSelectedForm, onOpenForm, onCloseForm, loadingError } from "../store/slices/padres/padresSlice";
import { useAuth } from "../auth/hooks/useAuth";

export const usePadres = () => {
    
    const { padres, padreSelected, visibleForm, errors, isLoading, paginator } = 
    useSelector(state => state.padres);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { login, handlerLogout } = useAuth();

    const getPadres = async (page = 0) => {
        try {            
            const result = await findAllPages(page);
            dispatch(loadingPadres(result.data));
        } catch (error) {
            if (error.response?.status === 401) {
                handlerLogout();
            }
        }
    }

    const handlerAddPadre = async (padre) => {
        console.log(padre);

        if (!login.isAdmin) return;
        let response;
        try {
            if (padre.id_padre === 0) {
                response = await save(padre);
                dispatch(addPadre(response.data));
            } else {
                response = await update(padre);
                dispatch(updatePadre(response.data));
            }

            Swal.fire(
                (padre.id_padre === 0) ?
                    'Usuario Creado' :
                    'Usuario Actualizado',
                (padre.id_padre === 0) ?
                    'El usuario ha sido creado con éxito!' :
                    'El usuario ha sido actualizado con éxito!',
                'success'
            );
            handlerCloseForm();
            navigate('/padres');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                dispatch(loadingError(error.response.data));
            } else if (error.response && error.response.status === 500 &&
                error.response.data?.message?.includes('constraint')) {
            
                if (error.response.data?.message?.includes('UK_nombre')) {
                    dispatch(loadingError({ nombre: 'El nombre ya existe!' }));
                }
                if (error.response.data?.message?.includes('UK_email')) {
                    dispatch(loadingError({ email: 'El email ya existe!' }));
                }
            } else if (error.response?.status === 401) {
                handlerLogout();
            } else {
                throw error;
            }
        }
    }

    const handlerRemovePadre = (id_padre) => {
        console.log(id_padre);
        if (!login.isAdmin) return;

        Swal.fire({
            title: '¿Está seguro que desea eliminar?',
            text: "¡Cuidado, el usuario será eliminado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    await remove(id_padre);

                    dispatch(removePadre(id_padre));

                    Swal.fire(
                        'Usuario Eliminado!',
                        '¡El usuario ha sido eliminado con éxito!',
                        'success'
                    );
                } catch (error) {
                    if (error.response?.status === 401) {
                        handlerLogout();
                    }
                }
            }
        });
    }

    const handlerPadreSelectedForm = (padre) => {
        dispatch(onPadreSelectedForm({ ...padre }));
    }

    const handlerOpenForm = () => {
        dispatch(onOpenForm());
    }

    const handlerCloseForm = () => {
        dispatch(onCloseForm());
        dispatch(loadingError({}));
    }

    return {
        padres,
        padreSelected,
        initialPadreForm,
        visibleForm,
        errors,
        isLoading,
        paginator,
        handlerAddPadre,
        handlerRemovePadre,
        handlerPadreSelectedForm,
        handlerOpenForm,
        handlerCloseForm,
        getPadres,
    }
}
