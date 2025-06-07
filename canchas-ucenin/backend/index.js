require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models"); // 👈 importar sequelize correctamente

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Rutas
const canchaRoutes = require("./routes/canchas");
const reservaRoutes = require("./routes/reservas");

app.use("/api/canchas", canchaRoutes);
app.use("/api/reservas", reservaRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.json({ message: "hola soy el backend" });
});

// Conexión y sincronización
sequelize.authenticate()
  .then(() => {
    console.log("✅ Conexión a la base de datos exitosa");

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("🧱 Tablas sincronizadas correctamente");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al iniciar el servidor o conectar a la base de datos:", error);
  });
