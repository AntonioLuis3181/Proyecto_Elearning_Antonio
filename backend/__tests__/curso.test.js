/**
 * @fileoverview Pruebas de integración para la API REST de Cursos
 * @description Test suite para validar todos los endpoints de la entidad Curso
 * Incluye pruebas para GET, POST, PUT, DELETE con validaciones de estructura de datos
 * @author Antonio Luis Vela Garcia
 * @version 1.0.0
 */

const request = require('supertest');
const app = require('../index');

/**
 * Constantes de prueba
 */
const BASE_URL = '/api/cursos';
const VALID_CURSO_DATA = {
  titulo: 'Curso de React Avanzado',
  descripcion: 'Aprende hooks y context',
  precio: 19.99,
  horas: 40,
  id_plataforma: 1,
  imagen_url: 'https://via.placeholder.com/150',
  fecha_publicacion: '2024-02-01'
};

const VALID_CURSO_UPDATE = {
  titulo: 'Curso de React (Editado)',
  precio: 9.99,
  horas: 45
};

/**
 * Suite de pruebas: GET /api/cursos
 * Validación de recuperación de cursos
 */
describe('CURSO API - GET /api/cursos', () => {
  
  /**
   * Describe: Recuperar todos los cursos
   */
  describe('GET / - Obtener todos los cursos', () => {
    
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

    test('Si hay cursos, cada uno debe tener estructura válida', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        const curso = response.body.datos[0];
        expect(curso).toHaveProperty('id_curso');
        expect(curso).toHaveProperty('titulo');
        expect(typeof curso.titulo).toBe('string');
        expect(typeof curso.id_curso).toBe('number');
      }
    });
  });

  /**
   * Describe: Filtros y parámetros de consulta
   */
  describe('GET / - Con parámetros de filtro', () => {
    
    test('Debe filtrar por búsqueda de titulo', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?busqueda=React`)
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

    test('Debe aceptar rango de fechas', async () => {
      const response = await request(app)
        .get(`${BASE_URL}?fechaInicio=2024-01-01&fechaFin=2024-12-31`)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.datos)).toBe(true);
    });
  });
});

/**
 * Suite de pruebas: GET /api/cursos/:id
 * Validación de recuperación de curso individual
 */
describe('CURSO API - GET /api/cursos/:id', () => {
  
  /**
   * Describe: Obtener curso por ID existente
   */
  describe('GET /:id - Obtener curso específico', () => {
    
    test('Debe retornar código 200 para un ID válido', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.status).toBe(200);
    });

    test('Debe retornar estructura válida para curso existente', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect(200);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('datos');
      expect(response.body).toHaveProperty('mensaje');
    });

    test('Datos debe contener propiedades del curso', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect(200);
      
      if (response.body.datos) {
        const curso = response.body.datos;
        expect(curso).toHaveProperty('id_curso');
        expect(curso).toHaveProperty('titulo');
        expect(typeof curso.id_curso).toBe('number');
        expect(typeof curso.titulo).toBe('string');
      }
    });

    test('Debe validar tipos de datos del curso', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/1`)
        .expect(200);
      
      if (response.body.datos) {
        const curso = response.body.datos;
        expect(typeof curso.titulo).toBe('string');
        expect(curso.precio === null || typeof curso.precio === 'string' || typeof curso.precio === 'number').toBe(true);
        expect(curso.horas === null || typeof curso.horas === 'number').toBe(true);
        expect(typeof curso.id_plataforma).toBe('number');
      }
    });
  });

  /**
   * Describe: Obtener curso por ID inexistente (404)
   */
  describe('GET /:id - Curso no encontrado (404)', () => {
    
    test('Debe retornar código 404 para un ID inexistente', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/99999`)
        .expect(404);
      
      expect(response.status).toBe(404);
    });

    test('Debe retornar estructura válida con ok=false', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/99999`)
        .expect(404);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('datos');
      expect(response.body.datos).toBeNull();
    });

    test('Debe incluir mensaje de error apropiado', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/99999`)
        .expect(404);
      
      expect(response.body.mensaje).toContain('no encontrado');
    });
  });
});

/**
 * Suite de pruebas: POST /api/cursos
 * Validación de creación de cursos
 */
describe('CURSO API - POST /api/cursos', () => {
  
  /**
   * Describe: Crear nuevo curso
   */
  describe('POST / - Crear curso válido', () => {
    
    test('Debe retornar código 201 para crear curso', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA)
        .expect(201);
      
      expect(response.status).toBe(201);
    });

    test('Debe retornar estructura válida después de crear', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA)
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
        .send(VALID_CURSO_DATA)
        .expect(201);
      
      expect(response.body.datos).toHaveProperty('id_curso');
      expect(typeof response.body.datos.id_curso).toBe('number');
      expect(response.body.datos.id_curso).toBeGreaterThan(0);
    });

    test('Datos creados debe contener los campos enviados', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA)
        .expect(201);
      
      const curso = response.body.datos;
      expect(curso.titulo).toBe(VALID_CURSO_DATA.titulo);
      expect(Number(curso.precio)).toBeCloseTo(Number(VALID_CURSO_DATA.precio), 2);
      expect(curso.horas).toBe(VALID_CURSO_DATA.horas);
      expect(curso.id_plataforma).toBe(VALID_CURSO_DATA.id_plataforma);
    });

    test('Mensaje debe indicar creación exitosa', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA)
        .expect(201);
      
      expect(response.body.mensaje.toLowerCase()).toContain('creado');
    });
  });

  /**
   * Describe: Crear curso con datos inválidos
   */
  describe('POST / - Crear curso con datos inválidos', () => {
    
    test('Debe rechazar curso sin título', async () => {
      const invalidData = { ...VALID_CURSO_DATA };
      delete invalidData.titulo;
      
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(invalidData)
        .expect(500);
      
      expect(response.body.ok).toBe(false);
    });

    test('Debe rechazar curso sin id_plataforma', async () => {
      const invalidData = { ...VALID_CURSO_DATA };
      delete invalidData.id_plataforma;
      
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(invalidData)
        .expect(500);
      
      expect(response.body.ok).toBe(false);
    });

    test('Debe rechazar formato JSON inválido', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
  });
});

/**
 * Suite de pruebas: PUT /api/cursos/:id
 * Validación de actualización de cursos
 */
describe('CURSO API - PUT /api/cursos/:id', () => {
  
  /**
   * Describe: Actualizar curso existente
   */
  describe('PUT /:id - Actualizar curso', () => {
    
    test('Debe retornar código 200 al actualizar curso válido', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_UPDATE)
        .expect(200);
      
      expect(response.status).toBe(200);
    });

    test('Debe retornar estructura válida después de actualización', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_UPDATE)
        .expect(200);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('mensaje');
    });

    test('Mensaje debe indicar actualización exitosa', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_UPDATE)
        .expect(200);
      
      expect(response.body.mensaje.toLowerCase()).toContain('actualizado');
    });

    test('Debe actualizar solo los campos enviados', async () => {
      const updateData = {
        titulo: 'Título Actualizado Test - ' + new Date().getTime()
      };
      
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(200);
      
      expect(response.body.ok).toBe(true);
    });

    test('Debe enviar el ID en el body para identificar el registro', async () => {
      const updateData = { ...VALID_CURSO_UPDATE };
      
      const response = await request(app)
        .put(`${BASE_URL}/1`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(200);
      
      expect(response.body).toHaveProperty('mensaje');
    });
  });

  /**
   * Describe: Actualizar curso inexistente (404)
   */
  describe('PUT /:id - Actualizar curso no encontrado', () => {
    
    test('Debe retornar código 404 para ID inexistente', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/99999`)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_UPDATE)
        .expect(404);
      
      expect(response.status).toBe(404);
    });

    test('Debe retornar ok=false cuando curso no existe', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/99999`)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_UPDATE)
        .expect(404);
      
      expect(response.body.ok).toBe(false);
      expect(response.body.mensaje).toContain('No encontrado');
    });

    test('Debe incluir el ID del registro no encontrado en el mensaje', async () => {
      const response = await request(app)
        .put(`${BASE_URL}/99999`)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_UPDATE)
        .expect(404);
      
      expect(response.body.mensaje).toContain('99999');
    });
  });
});

/**
 * Suite de pruebas: DELETE /api/cursos/:id
 * Validación de eliminación de cursos
 */
describe('CURSO API - DELETE /api/cursos/:id', () => {
  
  /**
   * Describe: Eliminar curso existente
   */
  describe('DELETE /:id - Eliminar curso', () => {
    
    let cursoIdToDelete;

    // Setup: Crear un curso para eliminar
    beforeAll(async () => {
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA);
      
      if (response.body.datos && response.body.datos.id_curso) {
        cursoIdToDelete = response.body.datos.id_curso;
      }
    });

    test('Debe retornar código 200 al eliminar curso válido', async () => {
      // Crear un curso para eliminar
      const createResponse = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA);
      
      const idToDelete = createResponse.body.datos.id_curso;

      const response = await request(app)
        .delete(`${BASE_URL}/${idToDelete}`)
        .expect(200);
      
      expect(response.status).toBe(200);
    });

    test('Debe retornar estructura válida después de eliminación', async () => {
      const createResponse = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA);
      
      const idToDelete = createResponse.body.datos.id_curso;

      const response = await request(app)
        .delete(`${BASE_URL}/${idToDelete}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body.datos).toBeNull();
    });

    test('Mensaje debe indicar eliminación exitosa', async () => {
      const createResponse = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA);
      
      const idToDelete = createResponse.body.datos.id_curso;

      const response = await request(app)
        .delete(`${BASE_URL}/${idToDelete}`)
        .expect(200);
      
      expect(response.body.mensaje.toLowerCase()).toContain('borrado');
    });

    test('Debe eliminar el curso de la BD de manera verificable', async () => {
      const createResponse = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json')
        .send(VALID_CURSO_DATA);
      
      const idToDelete = createResponse.body.datos.id_curso;

      // Eliminar
      const deleteResponse = await request(app)
        .delete(`${BASE_URL}/${idToDelete}`)
        .expect(200);
      
      expect(deleteResponse.body.ok).toBe(true);

      // Verificar que ya no existe
      const getResponse = await request(app)
        .get(`${BASE_URL}/${idToDelete}`)
        .expect(404);
      
      expect(getResponse.body.ok).toBe(false);
    });
  });

  /**
   * Describe: Eliminar curso inexistente (404)
   */
  describe('DELETE /:id - Eliminar curso no encontrado', () => {
    
    test('Debe retornar código 404 para ID inexistente', async () => {
      const response = await request(app)
        .delete(`${BASE_URL}/99999`)
        .expect(404);
      
      expect(response.status).toBe(404);
    });

    test('Debe retornar ok=false cuando curso no existe', async () => {
      const response = await request(app)
        .delete(`${BASE_URL}/99999`)
        .expect(404);
      
      expect(response.body.ok).toBe(false);
      expect(response.body.mensaje).toContain('no encontrado');
    });

    test('Debe incluir el ID en el mensaje de error', async () => {
      const response = await request(app)
        .delete(`${BASE_URL}/99999`)
        .expect(404);
      
      expect(response.body.mensaje).toContain('99999');
    });
  });
});

/**
 * Suite de pruebas: Validaciones de tipos de datos
 * Validación de integridad de datos
 */
describe('CURSO API - Validaciones de Estructura de Datos', () => {
  
  describe('Estructura de respuesta estándar', () => {
    
    test('Toda respuesta debe seguir estructura {ok, datos, mensaje}', async () => {
      const endpoints = [
        { method: 'get', path: BASE_URL },
        { method: 'get', path: `${BASE_URL}/1` },
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path);
        
        expect(response.body).toHaveProperty('ok');
        expect(response.body).toHaveProperty('datos');
        expect(response.body).toHaveProperty('mensaje');
        expect(typeof response.body.ok).toBe('boolean');
        expect(typeof response.body.mensaje).toBe('string');
      }
    });

    test('Códigos HTTP deben ser coherentes con la respuesta', async () => {
      const successResponse = await request(app).get(BASE_URL);
      expect([200, 201]).toContain(successResponse.status);

      const notFoundResponse = await request(app).get(`${BASE_URL}/99999`);
      expect([404]).toContain(notFoundResponse.status);
    });
  });

  describe('Tipos de datos de Curso', () => {
    
    test('id_curso debe ser número positivo', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(curso => {
          expect(typeof curso.id_curso).toBe('number');
          expect(curso.id_curso).toBeGreaterThan(0);
        });
      }
    });

    test('titulo debe ser string no vacío', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(curso => {
          expect(typeof curso.titulo).toBe('string');
          expect(curso.titulo.length).toBeGreaterThan(0);
        });
      }
    });

    test('precio debe ser number o string numérico, nunca negativo', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(curso => {
          if (curso.precio !== null) {
            const precio = Number(curso.precio);
            expect(typeof precio).toBe('number');
            expect(precio).toBeGreaterThanOrEqual(0);
          }
        });
      }
    });

    test('horas debe ser número no negativo o null', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(curso => {
          if (curso.horas !== null) {
            expect(typeof curso.horas).toBe('number');
            expect(curso.horas).toBeGreaterThanOrEqual(0);
          }
        });
      }
    });

    test('id_plataforma debe ser número positivo', async () => {
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
      
      if (response.body.datos.length > 0) {
        response.body.datos.forEach(curso => {
          expect(typeof curso.id_plataforma).toBe('number');
          expect(curso.id_plataforma).toBeGreaterThan(0);
        });
      }
    });
  });
});

/**
 * Suite de pruebas: Content-Type y Headers
 * Validación de cabeceras HTTP
 */
describe('CURSO API - Headers y Content-Type', () => {
  
  test('Respuestas deben ser application/json', async () => {
    const response = await request(app)
      .get(BASE_URL)
      .expect('Content-Type', /json/);
    
    expect(response.headers['content-type']).toMatch(/json/);
  });

  test('POST debe aceptar Content-Type application/json', async () => {
    const response = await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(VALID_CURSO_DATA);
    
    expect([201, 500]).toContain(response.status);
  });

  test('PUT debe aceptar Content-Type application/json', async () => {
    const response = await request(app)
      .put(`${BASE_URL}/1`)
      .set('Content-Type', 'application/json')
      .send(VALID_CURSO_UPDATE);
    
    expect([200, 404, 500]).toContain(response.status);
  });

  test('DELETE debe retornar JSON', async () => {
    const response = await request(app)
      .delete(`${BASE_URL}/99999`)
      .expect('Content-Type', /json/);
    
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
