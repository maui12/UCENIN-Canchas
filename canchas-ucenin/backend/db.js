const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("reservas", "postgres", "pikachu2", {
  host: "localhost",
  dialect: "postgres"
});

module.exports = sequelize;
