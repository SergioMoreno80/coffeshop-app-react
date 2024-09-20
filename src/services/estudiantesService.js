//Define un servicio para realizar la llamada a la API y cargar las sucursales.
// src/services/sucursalesService.js
import estudiantesApi from "../apis/estudiantesApi";

const BASE_URL = "";

export const findAll = async () => {
  try {
    const response = await estudiantesApi.get(BASE_URL);

    console.log("response data estudiantes: ", response);

    return response;
  } catch (error) {
    throw new Error("Error al cargar los estudiantes ");
  }
};

export const save = async ({ nombre, apellido, saldo, numeroIdentificacion }) => {
  try {
    //envio en ForData, ya que en backend se utiliza modelAttribute.
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("saldo", saldo);
    formData.append("numeroIdentificacion", numeroIdentificacion);
    console.log("guardado de estudiante:", formData);

    return await estudiantesApi.post(BASE_URL, formData);
  } catch (error) {
    throw error;
  }
};

export const update = async ({
  id_estudiante,
  nombre, apellido, saldo, numeroIdentificacion
}) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Establece el tipo de contenido a multipart/form-data
      },
    };
    const formData = new FormData();
    formData.append("id_estudiante", id_estudiante);
    formData.append("nombre", nombre);
    formData.append("apellido", nombre);
    formData.append("saldo", saldo);
    formData.append("numeroIdentificacion", numeroIdentificacion);
    console.log("guardado de estudiante:", id_estudiante);
    console.log("guardado de nombre:", nombre);
    console.log("guardado de apellido:", apellido);

    return await estudiantesApi.put(`${BASE_URL}/${id_estudiante}`, formData, config);
  } catch (error) {
    throw error;
  }
};
