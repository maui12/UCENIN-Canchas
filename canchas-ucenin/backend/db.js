const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("reservas", "postgres", "bubu", {
  host: "localhost",
  dialect: "postgres"
});

module.exports = sequelize;
