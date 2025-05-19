const { DataTypes, Op } = require("sequelize");
const sequelize = require("./models/index");
const Usuario = require("./models/Usuario");
const Cancha = require("./models/Cancha");

const Reserva = sequelize.define("Reserva", {
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  horaFin: {
    type: DataTypes.TIME,
    allowNull: false
  }
});

// Relaciones
Usuario.hasMany(Reserva, { foreignKey: "usuarioId" });
Reserva.belongsTo(Usuario, { foreignKey: "usuarioId" });

Cancha.hasMany(Reserva, { foreignKey: "canchaId" });
Reserva.belongsTo(Cancha, { foreignKey: "canchaId" });

// Métodos auxiliares
Reserva.verificarDisponibilidad = async function ({ canchaId, fecha, horaInicio, horaFin }) {
  const solapamiento = await Reserva.findOne({
    where: {
      canchaId,
      fecha,
      [Op.or]: [
        {
          horaInicio: {
            [Op.lt]: horaFin,
            [Op.gte]: horaInicio
          }
        },
        {
          horaFin: {
            [Op.gt]: horaInicio,
            [Op.lte]: horaFin
          }
        }
      ]
    }
  });
  return !solapamiento;
};

Reserva.usuarioTieneReservaEseDia = async function (usuarioId, fecha) {
  const existente = await Reserva.findOne({
    where: { usuarioId, fecha }
  });
  return !!existente;
};

Reserva.crearConValidacion = async function ({ usuarioId, canchaId, fecha, horaInicio, horaFin }) {
  // 1 semana de anticipación
  const hoy = new Date();
  const fechaReserva = new Date(fecha);
  const msDiferencia = fechaReserva - hoy;
  const dias = msDiferencia / (1000 * 60 * 60 * 24);

  if (dias < 7) {
    throw new Error("La reserva debe hacerse con al menos 1 semana de anticipación");
  }

  const yaTiene = await this.usuarioTieneReservaEseDia(usuarioId, fecha);
  if (yaTiene) {
    throw new Error("Ya tienes una reserva ese día");
  }

  const disponible = await this.verificarDisponibilidad({ canchaId, fecha, horaInicio, horaFin });
  if (!disponible) {
    throw new Error("Cancha no disponible en ese horario");
  }

  return await this.create({ usuarioId, canchaId, fecha, horaInicio, horaFin });
};

module.exports = Reserva;

