//Define un servicio para realizar la llamada a la API y cargar las sucursales.
// src/services/sucursalesService.js
import recargasApi from "../apis/recargasApi";

const BASE_URL = "";

export const findAll = async () => {
  try {
    const response = await recargasApi.get(BASE_URL);

    console.log("response data recargas: ", response);

    return response;
  } catch (error) {
    throw new Error("Error al cargar los recargas ");
  }
};

export const save = async ({ id_estudiante, fecha, monto, observaciones }) => {
  try {
    //envio en ForData, ya que en backend se utiliza modelAttribute.
    const formData = new FormData();
    formData.append("id_estudiante", id_estudiante);
    formData.append("fecha", fecha);
    formData.append("monto", monto);
    formData.append("Observaciones", observaciones);
    console.log("guardado de recarga:", fecha);
    console.log("guardado de recarga:", formData);
    console.log("guardado de recarga:", id_estudiante);
    console.log("guardado de id recarga id:", monto);
    return await recargasApi.post(BASE_URL, formData);
  } catch (error) {
    throw error;
  }
};

export const update = async ({
  id_recarga,
  id_estudiante,
  fecha,
  monto,
  observaciones,
}) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Establece el tipo de contenido a multipart/form-data
      },
    };
    const formData = new FormData();
    formData.append("id_recarga", id_recarga);
    formData.append("id_estudiante", id_estudiante);
    formData.append("fecha", fecha);
    formData.append("monto", monto);
    formData.append("Observaciones", observaciones);
    console.log("guardado de recarga:", formData);
    console.log("guardado de recarga:", id_estudiante);
    console.log("guardado de id recarga id:", id_recarga);
    console.log("guardado de recarga id:", recarga_id);

    return await recargasApi.put(`${BASE_URL}/${id_recarga}`, formData, config);
  } catch (error) {
    throw error;
  }
};

export const fetchReporte = async ({ id_estudiante }) => {
  try {
    
    console.log("reporte ventas Estudiante id:", id_estudiante);
  

    const response = await recargasApi.get(`/reporte`, {
      params: { id_estudiante },
    });
    console.log("Reporte generado:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error al generar el reporte");
  }
};
