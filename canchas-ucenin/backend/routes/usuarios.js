const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verificarToken} = require("../middleware/auth");

router.post("/registro", usuarioController.registrarUsuario, verificarToken);
router.post("/saldo", usuarioController.cargarSaldo, verificarToken);
router.post("/login", usuarioController.login, verificarToken); // Si usas JWT

module.exports = router;