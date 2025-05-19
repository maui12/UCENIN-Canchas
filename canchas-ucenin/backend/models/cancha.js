const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Usuario = sequelize.define("Usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  saldo: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  esAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Métodos personalizados

Usuario.prototype.añadirSaldo = async function (monto) {
  this.saldo += monto;
  await this.save();
};

Usuario.prototype.tieneSaldoSuficiente = function (monto) {
  return this.saldo >= monto;
};

Usuario.prototype.descontarSaldo = async function (monto) {
  if (!this.tieneSaldoSuficiente(monto)) {
    throw new Error("Saldo insuficiente");
  }
  this.saldo -= monto;
  await this.save();
};

module.exports = Usuario;
