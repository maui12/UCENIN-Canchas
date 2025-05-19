const Cancha = require("../models/cancha");

exports.listarCanchasActivas = async (req, res) => {
  const canchas = await Cancha.obtenerActivas();
  res.json(canchas);
};

exports.crearCancha = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nueva = await Cancha.create({ nombre });
    res.status(201).json(nueva);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.desactivarCancha = async (req, res) => {
  const cancha = await Cancha.findByPk(req.params.id);
  if (!cancha) return res.status(404).json({ msg: "No existe" });
  await cancha.desactivar();
  res.json({ msg: "Desactivada" });
};

exports.activarCancha = async (req, res) => {
  const cancha = await Cancha.findByPk(req.params.id);
  if (!cancha) return res.status(404).json({ msg: "No existe" });
  await cancha.activar();
  res.json({ msg: "Activada" });
};

