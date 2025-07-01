const { Reserva, Usuario, Cancha, JugadorReserva } = require("../models");

exports.crearReserva = async (req, res) => {
  try {
    const { usuarioId, canchaId, fecha, horaInicio, horaFin, jugadores } = req.body;

    // 1. Validar existencia de usuario
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) throw new Error("Usuario no válido");

    // 2. Validar existencia de cancha
    const cancha = await Cancha.findByPk(canchaId);
    if (!cancha) throw new Error("Cancha no válida");

    // 3. Validar duración y que no exceda 3 horas acumuladas ese día
    const duracion = calcularDuracion(horaInicio, horaFin); // helper (abajo)
    if (duracion <= 0 || duracion > 3) throw new Error("Duración inválida");

    const reservasDia = await Reserva.findAll({
      where: {
        usuarioId,
        canchaId,
        fecha
      }
    });
  const { pool } = require("../db");
  exports.obtenerHorariosPorDia = async (req, res) => {
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
        SELECT r.canchaId AS id_cancha, r.horaInicio AS hora_inicio
        FROM reservas r
        WHERE r.fecha = $1
      )
      SELECT 
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
    console.error("❌ Error al obtener horarios del día:", error);
    res.status(500).json({ error: "Error al obtener reservas del día" });
  }
};

    const totalHoras = reservasDia.reduce((suma, r) => {
      return suma + calcularDuracion(r.horaInicio, r.horaFin);
    }, 0);

    if (totalHoras + duracion > 3) {
      throw new Error("Excede el límite de 3 horas por día para esta cancha.");
    }

    // 4. Validar número de jugadores
    if (!jugadores || jugadores.length === 0) throw new Error("Debes ingresar jugadores.");
    if (jugadores.length > cancha.maxJugadores) {
      throw new Error(`La cancha permite máximo ${cancha.maxJugadores} jugadores.`);
    }

    // 5. Descontar saldo (opcional)
    const costoReserva = cancha.precioReserva ?? 5000;
    await usuario.descontarSaldo(costoReserva);

    // 6. Crear la reserva
    const nuevaReserva = await Reserva.create({
      usuarioId,
      canchaId,
      fecha,
      horaInicio,
      horaFin
    });

    // 7. Insertar jugadores
    for (const jugador of jugadores) {
      const { nombre, apellido, rut, edad } = jugador;
      await JugadorReserva.create({
        reservaId: nuevaReserva.id,
        nombre,
        apellido,
        rut,
        edad
      });
    }

    res.status(201).json(nuevaReserva);
  } catch (e) {
    console.error("❌ Error al crear reserva:", e);
    res.status(400).json({ error: e.message });
  }
};

function calcularDuracion(inicio, fin) {
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  return (h2 + m2 / 60) - (h1 + m1 / 60);
}

exports.reservasDeUsuario = async (req, res) => {
  const reservas = await Reserva.findAll({ where: { usuarioId: req.params.usuarioId } });
  res.json(reservas);
};

exports.eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ msg: "No encontrada" });

    await reserva.destroy();
    res.json({ msg: "Reserva eliminada" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo", "esAdmin"]
        },
        {
          model: Cancha,
          attributes: ["id", "nombre", "precioReserva", "maxJugadores"]
        },
        {
          model: JugadorReserva,
          attributes: ["id", "nombre", "apellido", "rut", "edad"]
        }
      ]
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Validar que sea el dueño o un admin
    const usuarioAutenticado = req.usuario;

    const esPropietario = usuarioAutenticado.id === reserva.usuarioId;
    const esAdmin = usuarioAutenticado.esAdmin;

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ error: "No tienes permiso para ver esta reserva" });
    }

    res.json(reserva);
  } catch (error) {
    console.error("Error al obtener reserva:", error);
    res.status(500).json({ error: "Error al obtener la reserva" });
  }
};