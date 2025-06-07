const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");
const { verificarToken, soloAdmin } = require("../middleware/auth");

router.get("/usuario/:usuarioId", verificarToken, reservaController.reservasDeUsuario);
router.get("/:id", verificarToken, reservaController.obtenerReservaPorId);
router.post("/", verificarToken, reservaController.crearReserva);
router.delete("/:id", verificarToken, soloAdmin, reservaController.eliminarReserva);


module.exports = router;
