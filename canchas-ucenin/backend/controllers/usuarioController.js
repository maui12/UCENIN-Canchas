const Usuario = require("../models/usuario");
const { generarToken } = require("../middleware/auth");

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña} = req.body;
    const nuevo = await Usuario.create({ nombre, correo, contraseña });
    const token = generarToken(nuevo);
    res.status(201).json({ token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.cargarSaldo = async (req, res) => {
  try {
    const { idUsuario, monto } = req.body;
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    await usuario.añadirSaldo(monto);
    res.json({ saldo: usuario.saldo });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// login solo básico si no usas JWT
exports.login = async (req, res) => {
  const { correo, contraseña } = req.body;
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario || !(await usuario.validarPassword(contraseña))) {
    return res.status(401).json({ msg: "Credenciales incorrectas" });
  }
  const token = generarToken(usuario);
  res.json({ token });
};