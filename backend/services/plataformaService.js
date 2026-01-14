// services/plataformaService.js
// Servicio para interactuar con el modelo Sequelize `plataformas`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo plataforma
const Plataforma = models.plataforma;

class PlataformaService {
  async getAllPlataformas() {
    // Devuelve todos los plataformaes. Ajusta atributos si tu modelo usa otros nombres.
    const result = await Plataforma.findAll();
    return result;
  }
  async getPlataformaById(id_plataforma) {
    // Devuelve un plataforma por su id
    const result = await Plataforma.findByPk(id_plataforma);
    return result;
  }
  async createPlataforma(plataforma) {
    //Crea un plataforma
    const result = await Plataforma.create(plataforma);
    return result;
  }
  async deletePlataforma(id_plataforma) {
    //Borrar un plataforma
    const numFilas = await Plataforma.destroy({
      where: { id_plataforma: id_plataforma },
    });
    return numFilas;
  }
  async updatePlataforma(plataforma) {
    //Actualizar un plataforma
    let numFilas = await Plataforma.update(plataforma, {
      where: { id_plataforma: plataforma.id_plataforma },
    });
    // Si el numero de filas afectadas por la actualización es cero
    // y existe el registro para ese plataforma, es que no hay cambios en los datos
    // la actualización
    if(numFilas == 0 && await Plataforma.findByPk(plataforma.id_plataforma)){
      numFilas = 1; // Devuelvo uno para indicar que todo ha ido bien
    }

    return numFilas;
  }
}

module.exports = new PlataformaService();
