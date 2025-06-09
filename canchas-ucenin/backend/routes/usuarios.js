const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verificarToken} = require("../middleware/auth");

router.post("/registro", usuarioController.registrarUsuario);
router.post("/saldo", verificarToken, usuarioController.cargarSaldo);
router.post("/login", usuarioController.login); // Login no debería requerir token

module.exports = router;