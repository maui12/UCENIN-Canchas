const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Reserva = require("./Reserva");

const JugadorReserva = sequelize.define("JugadorReserva", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rut: {
    type: DataTypes.STRING,
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Relación: un jugador pertenece a una reserva
Reserva.hasMany(JugadorReserva, { foreignKey: "reservaId", onDelete: "CASCADE" });
JugadorReserva.belongsTo(Reserva, { foreignKey: "reservaId" });

module.exports = JugadorReserva;
