import padresApi from "../apis/padresApi";

// Definir la URL base si es necesario
const BASE_URL = "";

export const findAll = async () => {
  try {
    const response = await padresApi.get(BASE_URL);
    return response.data; // Asumiendo que deseas solo los datos, no el objeto Response completo
  } catch (error) {
    console.error("Error fetching all padres:", error);
    throw error;
  }
};

export const findAllPages = async (page = 0) => {
  try {
    const response = await padresApi.get(`${BASE_URL}/page/${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching paged padres:", error);
    throw error;
  }
};

export const save = async ({
  id_padre,
  nombre,
  email,
  contraseña,
  estudiantesIds,
}) => {
  try {
    const response = await padresApi.post(BASE_URL, {
      id_padre,
      nombre,
      email,
      contraseña,
      estudiantesIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving padre:", error);
    throw error;
  }
};

export const update = async ({ id_padre, nombre, email, admin }) => {
  try {
    const response = await padresApi.put(`${BASE_URL}/${id_padre}`, {
      nombre,
      email,
      admin,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating padre:", error);
    throw error;
  }
};

export const remove = async (id_padre) => {
  try {
    await padresApi.delete(`${BASE_URL}/${id_padre}`);
  } catch (error) {
    console.error("Error removing padre:", error);
    throw error;
  }
};
