const express = require("express");
const router = express.Router();
const canchaController = require("../controllers/canchaController");
const { verificarToken, soloAdmin } = require("../middleware/auth");


router.get("/", canchaController.listarCanchasActivas, verificarToken);
router.post("/", canchaController.crearCancha, verificarToken); // Admin
router.patch("/:id/desactivar", canchaController.desactivarCancha, verificarToken);
router.patch("/:id/activar", canchaController.activarCancha, verificarToken);

module.exports = router;