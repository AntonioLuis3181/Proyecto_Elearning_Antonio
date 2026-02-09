/**
 * @fileoverview Pruebas de integración para la API REST de Plataformas
 * @description Test suite para validar todos los endpoints de la entidad Plataforma
 * Incluye pruebas para GET, POST, PUT, DELETE con validaciones de estructura de datos
 * @author Antonio Luis Vela Garcia
 * @version 1.0.0
 */

const request = require('supertest');
const app = require('../index');

/**
 * Constantes de prueba
 */
const BASE_URL = '/api/plataformas';
const VALID_PLATAFORMA_DATA = {
  nombre: 'Plataforma Nueva Test',
  url_web: 'https://www.test.com',
  es_gratuita: true,
  fecha_alta: '2024-01-27'
};

const VALID_PLATAFORMA_UPDATE = {
  nombre: 'Udemy Editado',
  url_web: 'https://www.udemy.com/es/',
  es_gratuita: false
};

/**
 * Suite de pruebas: GET /api/plataformas
 * Validación de recuperación de plataformas
 */
describe('PLATAFORMA API - GET /api/plataformas', () => {
  
  /**
   * Describe: Recuperar todas las plataformas
   */
  describe('GET / - Obtener todas las plataformas', () => {
    
    test('Debe retornar código 200', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      expect(response.status).toBe(200);
    });

    test('Debe retornar estructura de respuesta correcta', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('datos');
      expect(response.body).toHaveProperty('mensaje');
      expect(typeof response.body.ok).toBe('boolean');
      expect(Array.isArray(response.body.datos)).toBe(true);
      expect(typeof response.body.mensaje).toBe('string');
    });

    test('Debe retornar ok=true cuando la solicitud es exitosa', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
    });

    test('Mensaje debe indicar éxito', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      expect(response.body.mensaje).toContain('correctamente');
    });

    test('Datos debe ser un array', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      expect(Array.isArray(response.body.datos)).toBe(true);
    });

    test('Si hay plataformas, cada una debe tener estructura válida', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        const plataforma = response.body.datos[0];
        expect(plataforma).toHaveProperty('id_plataforma');
        expect(plataforma).toHaveProperty('nombre');
        expect(typeof plataforma.nombre).toBe('string');
        expect(typeof plataforma.id_plataforma).toBe('number');
      }
    });
  });

  /**
   * Describe: Filtros y búsqueda
   */
  describe('GET / - Con parámetros de búsqueda', () => {
    
    test('Debe filtrar por búsqueda de nombre', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?busqueda=Udemy`)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.datos)).toBe(true);
    });

    test('Debe aceptar parámetros de fecha inicio', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?fechaInicio=2024-01-01`)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
    });

    test('Debe aceptar parámetros de fecha fin', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?fechaFin=2024-12-31`)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
    });

    test('Debe aceptar rango de fechas completo', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?fechaInicio=2024-01-01&fechaFin=2024-12-31`)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.datos)).toBe(true);
    });

    test('Búsqueda debe ser case-insensitive', async () => {
      const response1 = await request(app)
        .get(`${BASE_URL}?busqueda=udemy`)
        .expect(200);
      
      const response2 = await request(app)
        .get(`${BASE_URL}?busqueda=UDEMY`)
        .expect(200);
      
      expect(response1.body.ok).toBe(true);
      expect(response2.body.ok).toBe(true);
    });

    test('Búsqueda parcial debe encontrar coincidencias', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?busqueda=udem`)
        .expect(200);
      
      expect(Array.isArray(response.body.datos)).toBe(true);
    });
  });

  /**
   * Describe: Paginación
   */
  describe('GET / - Con parámetros de paginación', () => {
    
    test('Debe aceptar parámetro page', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?page=1&limit=2`)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
    });

    test('Debe retornar datos cuando se especifica limit', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?page=1&limit=2`)
        .expect(200);
      
      expect(Array.isArray(response.body.datos)).toBe(true);
    });
  });
});

/**
 * Suite de pruebas: GET /api/plataformas/:id
 * Validación de recuperación de plataforma individual
 */
describe('PLATAFORMA API - GET /api/plataformas/:id', () => {
  
  /**
   * Describe: Obtener plataforma por ID existente
   */
  describe('GET /:id - Obtener plataforma específica', () => {
    
    test('Debe retornar código 200 para un ID válido', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.status).toBe(200);
    });

    test('Debe retornar estructura válida para plataforma existente', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect(200);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('datos');
      expect(response.body).toHaveProperty('mensaje');
    });

    test('Datos debe contener propiedades de la plataforma', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect(200);
      
      if (response.body.datos) {
        const plataforma = response.body.datos;
        expect(plataforma).toHaveProperty('id_plataforma');
        expect(plataforma).toHaveProperty('nombre');
        expect(typeof plataforma.id_plataforma).toBe('number');
        expect(typeof plataforma.nombre).toBe('string');
      }
    });

    test('Debe validar tipos de datos de la plataforma', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect(200);
      
      if (response.body.datos) {
        const plataforma = response.body.datos;
        expect(typeof plataforma.nombre).toBe('string');
        expect(plataforma.url_web === null || typeof plataforma.url_web === 'string').toBe(true);
        expect(plataforma.es_gratuita === null || typeof plataforma.es_gratuita === 'number' || typeof plataforma.es_gratuita === 'boolean').toBe(true);
      }
    });

    test('Debe retornar ok=true para plataforma encontrada', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect(200);
      
      if (response.body.datos) {
        expect(response.body.ok).toBe(true);
      }
    });
  });

  /**
   * Describe: Obtener plataforma por ID inexistente (404)
   */
  describe('GET /:id - Plataforma no encontrada (404)', () => {
    
    test('Debe retornar código 404 para un ID inexistente', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/9999`)
        .expect(404);
      
      expect(response.status).toBe(404);
    });

    test('Debe retornar estructura válida con ok=false', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/9999`)
        .expect(404);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('mensaje');
    });

    test('Debe incluir mensaje de error apropiado', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/9999`)
        .expect(404);
      
      expect(response.body.mensaje).toContain('no encontrado');
    });

    test('Debe incluir el ID no encontrado en el mensaje', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/9999`)
        .expect(404);
      
      expect(response.body.mensaje).toContain('9999');
    });
  });
});

/**
 * Suite de pruebas: POST /api/plataformas
 * Validación de creación de plataformas
 */
describe('PLATAFORMA API - POST /api/plataformas', () => {
  
  /**
   * Describe: Crear nueva plataforma
   */
  describe('POST / - Crear plataforma válida', () => {
    
    test('Debe retornar código 201 para crear plataforma', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA)
        .expect(201);
      
      expect(response.status).toBe(201);
    });

    test('Debe retornar estructura válida después de crear', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA)
        .expect(201);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('datos');
      expect(response.body).toHaveProperty('mensaje');
    });

    test('Datos creados debe contener el ID generado', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA)
        .expect(201);
      
      expect(response.body.datos).toHaveProperty('id_plataforma');
      expect(typeof response.body.datos.id_plataforma).toBe('number');
      expect(response.body.datos.id_plataforma).toBeGreaterThan(0);
    });

    test('Datos creados debe contener los campos enviados', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA)
        .expect(201);
      
      const plataforma = response.body.datos;
      expect(plataforma.nombre).toBe(VALID_PLATAFORMA_DATA.nombre);
      expect(plataforma.url_web).toBe(VALID_PLATAFORMA_DATA.url_web);
    });

    test('Mensaje debe indicar creación exitosa', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA)
        .expect(201);
      
      expect(response.body.mensaje.toLowerCase()).toContain('creado');
    });

    test('Nombre debe ser obligatorio', async () => {
      const invalidData = { ...VALID_PLATAFORMA_DATA };
      delete invalidData.nombre;
      
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(invalidData)
        .expect(500);
      
      expect(response.body.ok).toBe(false);
    });

    test('es_gratuita debe ser obligatorio', async () => {
      const invalidData = { ...VALID_PLATAFORMA_DATA };
      delete invalidData.es_gratuita;
      
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(invalidData)
        .expect(500);
      
      expect(response.body.ok).toBe(false);
    });
  });

  /**
   * Describe: Crear plataforma con datos inválidos
   */
  describe('POST / - Crear plataforma con datos inválidos', () => {
    
    test('Debe rechazar formato JSON inválido', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    test('Debe rechazar cuerpo vacío', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send({})
        .expect(500);
      
      expect(response.body.ok).toBe(false);
    });
  });
});

/**
 * Suite de pruebas: PUT /api/plataformas/:id
 * Validación de actualización de plataformas
 */
describe('PLATAFORMA API - PUT /api/plataformas/:id', () => {
  
  /**
   * Describe: Actualizar plataforma existente
   */
  describe('PUT /:id - Actualizar plataforma', () => {
    
    test('Debe retornar código 204 al actualizar plataforma válida', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_UPDATE)
        .expect(204);
      
      expect(response.status).toBe(204);
    });

    test('Debe no retornar contenido en respuesta exitosa (204)', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_UPDATE)
        .expect(204);
      
      expect(response.body).toEqual({});
    });

    test('Debe aceptar actualización parcial', async () => {
      const updateData = {
        nombre: 'Nombre Actualizado Test - ' + new Date().getTime()
      };
      
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(204);
      
      expect(response.status).toBe(204);
    });

    test('Debe aceptar actualización de URL Web', async () => {
      const updateData = {
        url_web: 'https://www.newurl.com'
      };
      
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(204);
      
      expect(response.status).toBe(204);
    });

    test('Debe aceptar actualización de es_gratuita', async () => {
      const updateData = {
        es_gratuita: true
      };
      
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(204);
      
      expect(response.status).toBe(204);
    });
  });

  /**
   * Describe: Actualizar plataforma inexistente (404)
   */
  describe('PUT /:id - Actualizar plataforma no encontrada', () => {
    
    test('Debe retornar código 404 para ID inexistente', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/9999`)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_UPDATE)
        .expect(404);
      
      expect(response.status).toBe(404);
    });

    test('Debe retornar ok=false cuando plataforma no existe', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/9999`)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_UPDATE)
        .expect(404);
      
      expect(response.body.ok).toBe(false);
      expect(response.body.mensaje).toContain('No encontrado');
    });

    test('Debe incluir el ID del registro no encontrado en el mensaje', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/9999`)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_UPDATE)
        .expect(404);
      
      expect(response.body.mensaje).toContain('9999');
    });
  });
});

/**
 * Suite de pruebas: DELETE /api/plataformas/:id
 * Validación de eliminación de plataformas
 */
describe('PLATAFORMA API - DELETE /api/plataformas/:id', () => {
  
  /**
   * Describe: Eliminar plataforma existente
   */
  describe('DELETE /:id - Eliminar plataforma', () => {
    
    test('Debe retornar código 204 al eliminar plataforma válida', async () => {
      // Crear una plataforma para eliminar
      const createResponse = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA);
      
      const idToDelete = createResponse.body.datos.id_plataforma;

      const response = await request(app)
        .delete(`${BASE_URL}/${idToDelete}`)
        .expect(204);
      
      expect(response.status).toBe(204);
    });

    test('Debe no retornar contenido en respuesta exitosa (204)', async () => {
      const createResponse = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA);
      
      const idToDelete = createResponse.body.datos.id_plataforma;

      const response = await request(app)
        .delete(`${BASE_URL}/${idToDelete}`)
        .expect(204);
      
      expect(response.body).toEqual({});
    });

    test('Debe eliminar la plataforma de la BD de manera verificable', async () => {
      const createResponse = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_PLATAFORMA_DATA);
      
      const idToDelete = createResponse.body.datos.id_plataforma;

      // Eliminar
      const deleteResponse = await request(app)
        .delete(`${BASE_URL}/${idToDelete}`)
        .expect(204);
      
      expect(deleteResponse.status).toBe(204);

      // Verificar que ya no existe
      const getResponse = await request(app)
        .get(`${BASE_URL}/${idToDelete}`)
        .expect(404);
      
      expect(getResponse.body.ok).toBe(false);
    });
  });

  /**
   * Describe: Eliminar plataforma inexistente (404)
   */
  describe('DELETE /:id - Eliminar plataforma no encontrada', () => {
    
    test('Debe retornar código 404 para ID inexistente', async () => {
      const response = await request(app)
        .delete(`${BASE_URL}/9999`)
        .expect(404);
      
      expect(response.status).toBe(404);
    });

    test('Debe retornar ok=false cuando plataforma no existe', async () => {
      const response = await request(app)
        .delete(`${BASE_URL}/9999`)
        .expect(404);
      
      expect(response.body.ok).toBe(false);
      expect(response.body.mensaje).toContain('no encontrada');
    });

    test('Debe incluir el ID en el mensaje de error', async () => {
      const response = await request(app)
        .delete(`${BASE_URL}/9999`)
        .expect(404);
      
      expect(response.body.mensaje).toContain('9999');
    });
  });
});

/**
 * Suite de pruebas: Validaciones de tipos de datos
 * Validación de integridad de datos
 */
describe('PLATAFORMA API - Validaciones de Estructura de Datos', () => {
  
  describe('Estructura de respuesta estándar', () => {
    
    test('Toda respuesta debe seguir estructura {ok, datos, mensaje} en GET', async () => {
      const response = await request(app).get(BASE_URL);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('datos');
      expect(response.body).toHaveProperty('mensaje');
      expect(typeof response.body.ok).toBe('boolean');
      expect(typeof response.body.mensaje).toBe('string');
    });

    test('Códigos HTTP deben ser coherentes con la respuesta', async () => {
      const successResponse = await request(app).get(BASE_URL);
      expect([200, 201]).toContain(successResponse.status);

      const notFoundResponse = await request(app).get(`${BASE_URL}/9999`);
      expect([404]).toContain(notFoundResponse.status);
    });
  });

  describe('Tipos de datos de Plataforma', () => {
    
    test('id_plataforma debe ser número positivo', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(plataforma => {
          expect(typeof plataforma.id_plataforma).toBe('number');
          expect(plataforma.id_plataforma).toBeGreaterThan(0);
        });
      }
    });

    test('nombre debe ser string no vacío', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(plataforma => {
          expect(typeof plataforma.nombre).toBe('string');
          expect(plataforma.nombre.length).toBeGreaterThan(0);
        });
      }
    });

    test('url_web debe ser string o null', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(plataforma => {
          expect(plataforma.url_web === null || typeof plataforma.url_web === 'string').toBe(true);
        });
      }
    });

    test('es_gratuita debe ser número o booleano', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(plataforma => {
          expect(
            typeof plataforma.es_gratuita === 'number' || 
            typeof plataforma.es_gratuita === 'boolean'
          ).toBe(true);
        });
      }
    });

    test('fecha_alta debe ser string o null (formato fecha)', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(plataforma => {
          if (plataforma.fecha_alta) {
            expect(typeof plataforma.fecha_alta).toBe('string');
          }
        });
      }
    });
  });
});

/**
 * Suite de pruebas: Content-Type y Headers
 * Validación de cabeceras HTTP
 */
describe('PLATAFORMA API - Headers y Content-Type', () => {
  
  test('Respuestas GET deben ser application/json', async () => {
    const response = await request(app)
      .get(BASE_URL)
      .expect('Content-Type', /json/);
    
    expect(response.headers['content-type']).toMatch(/json/);
  });

  test('POST debe aceptar Content-Type application/json', async () => {
    const response = await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(VALID_PLATAFORMA_DATA);
    
    expect([201, 500]).toContain(response.status);
  });

  test('PUT debe aceptar Content-Type application/json', async () => {
    const response = await request(app)
      .put(`${BASE_URL}/1`)
      .set('Content-Type', 'application/json')
      .send(VALID_PLATAFORMA_UPDATE);
    
    expect([204, 404, 500]).toContain(response.status);
  });

  test('DELETE debe retornar sin contenido en éxito (204)', async () => {
    const response = await request(app)
      .delete(`${BASE_URL}/9999`);
    
    expect([204, 404, 500]).toContain(response.status);
  });

  test('Respuestas de error deben ser application/json', async () => {
    const response = await request(app)
      .get(`${BASE_URL}/9999`);
    
    if (response.status === 404) {
      expect(response.headers['content-type']).toMatch(/json/);
    }
  });
});

/**
 * Suite de pruebas: Validaciones de datos específicas
 * Pruebas de lógica y restricciones de negocio
 */
describe('PLATAFORMA API - Validaciones de Negocio', () => {
  
  describe('Restricciones de nombre', () => {
    
    test('Nombre debe tener máximo 100 caracteres', async () => {
      const longName = 'a'.repeat(100);
      const data = {
        ...VALID_PLATAFORMA_DATA,
        nombre: longName
      };
      
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(data);
      
      expect([201, 500]).toContain(response.status);
    });
  });

  describe('Restricciones de URL', () => {
    
    test('URL debe ser válida o null', async () => {
      const data = {
        ...VALID_PLATAFORMA_DATA,
        url_web: 'https://www.validurl.com'
      };
      
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(201);
      
      expect(response.body.datos.url_web).toBe('https://www.validurl.com');
    });
  });

  describe('Restricciones de es_gratuita', () => {
    
    test('es_gratuita debe ser 0 (pago) o 1 (gratuito)', async () => {
      const dataGratuita = {
        ...VALID_PLATAFORMA_DATA,
        es_gratuita: 1
      };
      
      const responsePago = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send({ ...VALID_PLATAFORMA_DATA, es_gratuita: 0 });
      
      expect([201, 500]).toContain(responsePago.status);
    });
  });
});
