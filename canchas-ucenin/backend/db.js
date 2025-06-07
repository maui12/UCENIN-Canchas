// backend/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sistema_reservas", "postgres", "tu_clave", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;

