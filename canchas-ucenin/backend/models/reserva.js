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
  const hoy = new Date();
  const fechaReserva = new Date(fecha);
  const diferenciaDias = (fechaReserva - hoy) / (1000 * 60 * 60 * 24);

  if (diferenciaDias < 7) {
    throw new Error("La reserva debe hacerse con al menos 1 semana de anticipación");
  }

  // Calcular duración
  const duracionHoras = calcularDuracion(horaInicio, horaFin);
  if (duracionHoras <= 0 || duracionHoras > 3) {
    throw new Error("Duración inválida");
  }

  // Sumar horas previas en esa cancha y fecha
  const reservas = await Reserva.findAll({
    where: {
      usuarioId,
      canchaId,
      fecha
    }
  });

  const totalHoras = reservas.reduce((suma, r) => {
    return suma + calcularDuracion(r.horaInicio, r.horaFin);
  }, 0);

  if (totalHoras + duracionHoras > 3) {
    throw new Error("Excede el máximo de 3 horas por día para esta cancha.");
  }

  // Validar solapamiento más robusto
  const haySolapamiento = await Reserva.findOne({
    where: {
      canchaId,
      fecha,
      [Op.or]: [
        {
          horaInicio: {
            [Op.lt]: horaFin
          },
          horaFin: {
            [Op.gt]: horaInicio
          }
        }
      ]
    }
  });

  if (haySolapamiento) {
    throw new Error("Ya existe una reserva en ese horario para esta cancha.");
  }

  return await this.create({ usuarioId, canchaId, fecha, horaInicio, horaFin });
}
function calcularDuracion(inicio, fin) {
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  return (h2 + m2 / 60) - (h1 + m1 / 60);
}
module.exports = Reserva;

