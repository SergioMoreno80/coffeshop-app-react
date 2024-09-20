//Define un servicio para realizar la llamada a la API y cargar las sucursales.
// src/services/sucursalesService.js
import productosApi from "../apis/productosApi";

const BASE_URL = '';


  export const findAll = async () => {
    try {
      const response = await productosApi.get(BASE_URL);

      console.log("response data productos: ", response);

      return response;
    } catch (error) {
      throw new Error('Error al cargar los productos ');
    }
  };

export const save2 = async ({ nombre, descripcion, precio, categoria, imagenDireccion }) => {
    try {
      //envio en ForData, ya que en backend se utiliza modelAttribute.
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('precio', precio);
      formData.append('categoria', categoria);
      formData.append('imagenDireccion', imagenDireccion);
      console.log("guardado de producto:", formData);

        return await productosApi.post(BASE_URL, formData);

    } catch (error) {
        throw error;
    }
}

export const update = async({ id_producto, nombre, descripcion, precio, categoria, imagenDireccion, imagen }) => {

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data' // Establece el tipo de contenido a multipart/form-data
        }
      };
      const formData = new FormData();
      formData.append('id_producto', id_producto);
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('precio', precio);
      formData.append('categoria', categoria);
      formData.append('imagenDireccion', imagenDireccion);

       // Agrega la imagen si está presente
     if (imagen) {
      formData.append('imagen', imagen);
    }

      console.log("guardado de producto:", formData);
      console.log("guardado de producto:", id_producto);
      console.log("guardado de nombre:", nombre);
      console.log("guardado de precio:", precio);
      console.log("guardado de producto:", categoria);
      console.log("guardado de producto:", imagenDireccion);

      return await productosApi.put(`${BASE_URL}/${id_producto}`, formData, config);

    } catch (error) {
        throw error;
    }
}
  
//CODE FOR TESTING MODE
export const save = async ({ 
  nombre, descripcion, precio, categoria, imagenDireccion,
  imagen}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data' // Establece el tipo de contenido a multipart/form-data
      }
    };
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('imagenDireccion', imagenDireccion);
//Pruebas de almacenamiento
    console.log("guardado de data save:", formData);
    console.log("guardado de nombre:", nombre);
    console.log("guardado de precio:", precio);
    console.log("guardado de producto:", categoria);
    console.log("guardado de direccion:", imagenDireccion);
    console.log("guardado de imagen:", imagen);

    
     // Agrega la imagen si está presente
     if (imagen) {
      formData.append('imagen', imagen);
    }

    return await productosApi.post(BASE_URL, formData);
      //return await activosApi.post(BASE_URL, formData, config);
  } catch (error) {
    console.error('Error al guardar el producto:', error.message);
    throw error;
  }
}