const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Cancha = sequelize.define("Cancha", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precioReserva: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5000
  },
  maxJugadores: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4
  }
});

module.exports = Cancha;
