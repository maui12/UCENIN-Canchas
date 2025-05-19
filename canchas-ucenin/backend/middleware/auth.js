const jwt = require("jsonwebtoken");
const SECRET = "clave_secreta_123"; // usa env variable en producción

exports.verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "Token requerido" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token inválido" });
  }
};

exports.soloAdmin = (req, res, next) => {
  if (!req.usuario?.esAdmin) {
    return res.status(403).json({ msg: "Solo administradores" });
  }
  next();
};

exports.generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, correo: usuario.correo, esAdmin: usuario.esAdmin },
    SECRET,
    { expiresIn: "2h" }
  );
};
