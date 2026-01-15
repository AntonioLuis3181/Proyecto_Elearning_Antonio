const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
const Curso = models.curso
const Plataforma = models.plataforma

class CursoService {
    async getAllCursos() {
        const result = await Curso.findAll({
            include : [
                {
                    model: Plataforma,
                    as : "plataforma"
                }
            ]
        })
        return result;
    }
    async getCursoById(id_curso) {
        const result = await Curso.findByPK(id_curso);
        return result;
    }
    async createCurso(curso) {
        const result = await Curso.create(curso);
        return result;
    }
    async deleteCurso(curso) {
        const numFilas = await Curso.destroy({
            where : {id_curso : id_curso},
        });
        return numFilas;
    }
    async updateCurso(curso) {
        let numFilas = await Curso.update(curso, {
            where : {id_curso: curso.id_curso},
        });

        if(numFilas == 0 && await Curso.findByPK(curso.id_curso)){
            numFilas = 1;
        }
        return numFilas;
    }
}

module.exports = new CursoService();