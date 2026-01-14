var DataTypes = require("sequelize").DataTypes;
var _plataformas = require("./plataformas");
var _cursos = require("./cursos");

function initModels(sequelize) {
  var plataformas = _plataformas(sequelize, DataTypes);
  var cursos = _cursos(sequelize, DataTypes);

  cursos.belongsTo(plataformas, { as: "id_plataformas_plataformas", foreignKey: "id_plataforma"});
  plataformas.hasMany(cursos, { as: "cursos", foreignKey: "id_plataforma"});

  return {
    plataformas,
    curso,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
