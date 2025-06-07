// models/index.js

const sequelize = require("../db"); // Asegúrate que este sea tu archivo de conexión Sequelize

// Importar modelos
const Usuario = require("./usuario");
const Cancha = require("./cancha");
const Reserva = require("./Reserva");
const JugadorReserva = require("./JugadorReserva");

// Asociaciones (si no están definidas dentro de cada modelo)
Usuario.hasMany(Reserva, { foreignKey: "usuarioId" });
Reserva.belongsTo(Usuario, { foreignKey: "usuarioId" });

Cancha.hasMany(Reserva, { foreignKey: "canchaId" });
Reserva.belongsTo(Cancha, { foreignKey: "canchaId" });

Reserva.hasMany(JugadorReserva, { foreignKey: "reservaId", onDelete: "CASCADE" });
JugadorReserva.belongsTo(Reserva, { foreignKey: "reservaId" });

// Exportar todo
module.exports = {
  sequelize,
  Usuario,
  Cancha,
  Reserva,
  JugadorReserva
};
