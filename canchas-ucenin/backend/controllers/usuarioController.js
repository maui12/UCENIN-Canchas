const Usuario = require("../models/usuario");
const { generarToken } = require("../middleware/auth");

exports.registrarUsuario = async (req, res) => {
  try {
    console.log("Llamando a registrarUsuario")
    const { nombre, apellido, rut, edad, correo, password } = req.body;

    // Validar que vengan todos los datos
    if (!nombre || !apellido || !rut || !edad || !correo || !password) {
      return res.status(400).json({ msg: "Faltan datos para el registro" });
    }

    // Validar que rut y correo sean únicos
    const existeRut = await Usuario.findOne({ where: { rut } });
    if (existeRut) {
      return res.status(409).json({ msg: "Ya existe un usuario con ese RUT" });
    }

    const existeCorreo = await Usuario.findOne({ where: { correo } });
    if (existeCorreo) {
      return res.status(409).json({ msg: "Ya existe un usuario con ese correo" });
    }

    // Crear nuevo usuario
    const nuevo = await Usuario.create({ nombre, apellido, rut, edad, correo, password });

    // Generar token si usas JWT (puedes omitir si no quieres)
    const token = generarToken(nuevo);

    res.status(201).json({ token, usuario: nuevo });
  } catch (e) {
  console.error("Error en registro:", e);  // 👈 Agrega esto
  res.status(500).json({ error: e.message });
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

// Login con correo y contraseña
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario || !(await usuario.validarPassword(password))) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }
    const token = generarToken(usuario);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
