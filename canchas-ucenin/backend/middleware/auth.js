const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "clave_secreta_123"; // usa la variable de entorno

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Token requerido" });

  // Esperar formato "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token mal formado" });

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
