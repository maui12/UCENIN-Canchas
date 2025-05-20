require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 5000;

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const canchaRoutes = require("./routes/canchas");
const reservaRoutes = require("./routes/reservas");

// Usar rutas
app.use("/api/canchas", canchaRoutes);
app.use("/api/reservas", reservaRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.json({ message: "hola soy el backend" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("padel_db", "usuario", "password", {
  host: "localhost",
  dialect: "postgres"
});

module.exports = sequelize;
