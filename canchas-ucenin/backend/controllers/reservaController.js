// reservaController.js

const { Reserva, Usuario, Cancha, JugadorReserva } = require("../models");
// Si necesitas 'pool' para otras funciones que usen SQL crudo, impórtalo aquí una sola vez.
// const pool = require("../db");

// Función auxiliar para calcular duración de la reserva
function calcularDuracion(inicio, fin) {
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  return (h2 + m2 / 60) - (h1 + m1 / 60);
}

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
    const duracion = calcularDuracion(horaInicio, horaFin);
    if (duracion <= 0 || duracion > 3) throw new Error("Duración inválida");

    const reservasDia = await Reserva.findAll({
      where: {
        usuarioId,
        canchaId,
        fecha
      }
    });

    const totalHoras = reservasDia.reduce((suma, r) => {
      return suma + calcularDuracion(r.horaInicio, r.horaFin);
    }, 0);

    if (totalHoras + duracion > 3) {
      throw new Error("Excede el límite de 3 horas por día para esta cancha.");
    }

    // 4. Validar número de jugadores
    //if (!jugadores || jugadores.length === 0) throw new Error("Debes ingresar jugadores.");
    //if (jugadores.length > cancha.maxJugadores) {
    //  throw new Error(`La cancha permite máximo ${cancha.maxJugadores} jugadores.`);
    //}

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
    if (jugadores && jugadores.length > 0) { // Solo intenta insertar si hay jugadores
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
    }

    res.status(201).json(nuevaReserva);
  } catch (e) {
    console.error("❌ Error al crear reserva:", e);
    res.status(400).json({ error: e.message });
  }
};

exports.reservasDeUsuario = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({ where: { usuarioId: req.params.usuarioId } });
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas de usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ msg: "No encontrada" });

    await reserva.destroy();
    res.json({ msg: "Reserva eliminada" });
  } catch (e) {
    console.error("Error al eliminar reserva:", e);
    res.status(500).json({ error: e.message });
  }
};

// ESTA ES LA FUNCIÓN QUE DEBE MANEJAR /api/reservas/horarios
exports.obtenerHorariosDisponibles = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Falta el parámetro de fecha (date).' });
    }

    const fechaConsulta = date;

    // Horarios posibles del día (ajusta si tus horarios son diferentes)
    const horasDelDia = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
    ];

    // Obtener todas las canchas disponibles
    const canchas = await Cancha.findAll({
      where: { disponible: true } // Filtrar solo canchas activas/disponibles
    });

    // Obtener todas las reservas para la fecha específica
    const reservasDelDia = await Reserva.findAll({
      where: {
        fecha: fechaConsulta
      },
      attributes: ['canchaId', 'horaInicio']
    });

    // Crear un mapa de las horas ya reservadas por cancha
    const reservasMap = new Map(); // { canchaId: Set<horaInicio> }
    reservasDelDia.forEach(reserva => {
      if (!reservasMap.has(reserva.canchaId)) {
        reservasMap.set(reserva.canchaId, new Set());
      }
      reservasMap.get(reserva.canchaId).add(reserva.horaInicio);
    });

    // Formatear la respuesta para el frontend
    const dataParaFrontend = [];
    canchas.forEach(cancha => {
      horasDelDia.forEach(hora => {
        const reservada = reservasMap.has(cancha.id) && reservasMap.get(cancha.id).has(hora);
        dataParaFrontend.push({
          id_cancha: cancha.id,
          cancha: cancha.nombre,
          hora_inicio: hora,
          reservada: reservada
        });
      });
    });

    res.status(200).json(dataParaFrontend);

  } catch (error) {
    console.error("Error al obtener horarios disponibles:", error);
    res.status(500).json({ error: 'Error al obtener horarios disponibles.' });
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