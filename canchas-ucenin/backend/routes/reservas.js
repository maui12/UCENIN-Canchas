const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");
const { verificarToken, soloAdmin } = require("../middleware/auth");
const pool = require("../db"); // asegúrate de tener `pool` configurado
router.get("/usuario/:usuarioId", verificarToken, reservaController.reservasDeUsuario);
router.get("/:id", verificarToken, reservaController.obtenerReservaPorId);
router.post("/", verificarToken, reservaController.crearReserva);
router.delete("/:id", verificarToken, soloAdmin, reservaController.eliminarReserva);
router.get("/horarios", reservaController.obtenerHorariosPorDia);
router.get("/horarios", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Falta el parámetro 'date'" });
  }

  try {
    const query = `
      WITH horarios AS (
        SELECT generate_series('08:00'::time, '21:00'::time, '1 hour') AS hora_inicio
      ),
      canchas_horarios AS (
        SELECT c.id AS id_cancha, c.nombre AS cancha, h.hora_inicio
        FROM canchas c
        CROSS JOIN horarios h
      ),
      reservas_dia AS (
        SELECT r.id_cancha, r.hora_inicio
        FROM reservas r
        WHERE r.fecha = $1
      )
      SELECT 
        ch.id_cancha,
        ch.cancha,
        ch.hora_inicio,
        CASE WHEN rd.id_cancha IS NULL THEN false ELSE true END AS reservada
      FROM canchas_horarios ch
      LEFT JOIN reservas_dia rd
        ON ch.id_cancha = rd.id_cancha AND ch.hora_inicio = rd.hora_inicio
      ORDER BY ch.cancha, ch.hora_inicio;
    `;

    const result = await pool.query(query, [date]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reservas del día" });
  }
});
module.exports = router;
