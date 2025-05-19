const Reserva = require("../models/reserva");
const Usuario = require("../models/usuario");

exports.crearReserva = async (req, res) => {
  try {
    const { usuarioId, canchaId, fecha, horaInicio, horaFin } = req.body;

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) throw new Error("Usuario no válido");

    const costoReserva = 5000; // Puedes cambiarlo
    await usuario.descontarSaldo(costoReserva);

    const reserva = await Reserva.crearConValidacion({ usuarioId, canchaId, fecha, horaInicio, horaFin });
    res.status(201).json(reserva);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

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