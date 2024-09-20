//Define un servicio para realizar la llamada a la API y cargar las sucursales.
// src/services/sucursalesService.js
import comprasApi from "../apis/comprasApi";

const BASE_URL = "";

export const findAll = async () => {
  try {
    const response = await comprasApi.get(BASE_URL);

    console.log("response data compras: ", response);

    return response;
  } catch (error) {
    throw new Error("Error al cargar los compras ");
  }
};

// export const save = async ({ id_estudiante, fecha, detallesCompra }) => {
//   try {
//     //envio en ForData, ya que en backend se utiliza modelAttribute.
//     const formData = new FormData();
//     formData.append("id_estudiante", id_estudiante);
//     formData.append("fecha", fecha);
//     // Convertir detallesCompra a JSON y luego a una cadena
//     formData.append("detallesCompra", JSON.stringify(detallesCompra));
//     // formData.append("detallesCompra", detallesCompra);
//     console.log("guardado de compra detallesCompra :", detallesCompra);

//     console.log("guardado de compra:", formData);

//     return await comprasApi.post(BASE_URL, formData);
//   } catch (error) {
//     throw error;
//   }
// };

export const save = async ({
  id_estudiante,
  fecha,
  detallesCompra,
  nuevoSaldo,
}) => {
  console.log("guardado de id_estudiante:", id_estudiante);
  console.log("guardado de fecha:", fecha);
  console.log("guardado de detallesCompra:", detallesCompra);
  console.log("guardado de nuevoSaldo:", nuevoSaldo);
  try {
    const compraData = [
      { key: "id_estudiante", value: id_estudiante },
      { key: "fecha", value: fecha },
      { key: "detallesCompra", value: detallesCompra },
      { key: "nuevoSaldo", value: nuevoSaldo },
    ];
    // Convert the array to an object with the correct property order
    const compraDataObject = {};
    compraData.forEach((item) => {
      compraDataObject[item.key] = item.value;
    });

    console.log("guardado de compra:", compraDataObject);

    return await comprasApi.post(BASE_URL, compraDataObject, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const update = async ({
  id_compra,
  id_estudiante,
  fecha,
  detalesCompra,
}) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Establece el tipo de contenido a multipart/form-data
      },
    };
    const formData = new FormData();
    formData.append("id_compra", id_compra);
    formData.append("id_estudiante", id_estudiante);
    formData.append("fecha", fecha);
    formData.append("detalesCompra", detalesCompra);
    console.log("guardado de compra:", formData);
    console.log("guardado de id compra detalles:", detalesCompra);

    return await comprasApi.put(`${BASE_URL}/${id_compra}`, formData, config);
  } catch (error) {
    throw error;
  }
};

export const fetchReporte = async ({ fechaI, fechaF, id_estudiante }) => {
  try {
    console.log("reporte ventas Param 1:", fechaI);
    console.log("reporte ventas Param 2:", fechaF);
    console.log("reporte ventas Estudiante id:", id_estudiante);
  // Formatea las fechas como ISO 8601 (incluso si sólo necesitas la fecha)
  const fechaInicio = new Date(fechaI).toISOString();
  const fechaFin = new Date(fechaF).toISOString();

    const response = await comprasApi.get(`/reporte`, {
      params: { fechaInicio, fechaFin, id_estudiante },
    });
    console.log("Reporte generado:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error al generar el reporte");
  }
};

