const { DataTypes } = require("sequelize");
const sequelize = require("../db");

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
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true // Por defecto, una cancha recién creada está disponible
  }
});

// --- Métodos de clase para el modelo Cancha ---

// Método para obtener canchas que están marcadas como 'disponible: true'
Cancha.obtenerActivas = async function () {
  return await this.findAll({
    where: {
      disponible: true
    }
  });
};

// --- Métodos de instancia para una cancha específica ---

// Método para desactivar una cancha
Cancha.prototype.desactivar = async function () {
  this.disponible = false;
  await this.save();
};

// Método para activar una cancha
Cancha.prototype.activar = async function () {
  this.disponible = true;
  await this.save();
};

module.exports = Cancha;
