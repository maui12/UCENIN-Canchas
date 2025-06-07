const Reserva = require("../models/reserva");
const Usuario = require("../models/usuario");
const Cancha = require("../models/cancha");
const JugadorReserva = require("../models/JugadorReserva");
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