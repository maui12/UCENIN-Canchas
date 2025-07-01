  const { Sequelize } = require("sequelize");

  const sequelize = new Sequelize("reservas", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
    logging: console.log
  });

  module.exports = sequelize;
