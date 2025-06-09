const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const bcrypt = require("bcryptjs");

const Usuario = sequelize.define("Usuario", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  rut: { type: DataTypes.STRING, allowNull: false, unique: true },
  edad: { type: DataTypes.INTEGER, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  saldo: { type: DataTypes.FLOAT, defaultValue: 0 },
  esAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'usuarios',
  freezeTableName: true
});

// Hashear contraseña automáticamente antes de crear o actualizar
Usuario.beforeCreate(async (usuario) => {
  usuario.password = await bcrypt.hash(usuario.password, 10);
});
Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed('password')) {
    usuario.password = await bcrypt.hash(usuario.password, 10);
  }
});

// Métodos personalizados

Usuario.prototype.validarPassword = async function (plainText) {
  return await bcrypt.compare(plainText, this.password);
};

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
