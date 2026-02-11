import axios from 'axios';

/**
 * Usamos la variable de entorno VITE_API_URL definida en Railway.
 * Si por alguna razón no la encuentra, usará la IP de AWS por defecto.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://98.95.205.77:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de respuesta para manejo centralizado de errores
 */
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornamos los datos directamente
    return response.data;
  },
  (error) => {
    let respuestaError = {
      ok: false,
      datos: null,
      mensaje: 'Error desconocido',
    };

    if (error.response) {
      respuestaError.mensaje = error.response.data?.mensaje || 
                               `Error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      // Este es el error que ves cuando el navegador bloquea la conexión (Mixed Content)
      respuestaError.mensaje = 'No hay respuesta del servidor. Verifica el permiso de "Contenido no seguro" en tu navegador.';
      console.error('No hay respuesta del servidor (Posible bloqueo HTTPS/HTTP):', error.request);
    } else {
      respuestaError.mensaje = error.message || 'Error al realizar la solicitud';
    }

    return Promise.reject(respuestaError);
  }
);

export default api;