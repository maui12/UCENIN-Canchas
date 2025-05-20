const express = require("express");
const app = express();
app.use(express.json());

// Rutas
const usuarioRoutes = require("./routes/usuarios");
const canchaRoutes = require("./routes/canchas");
const reservaRoutes = require("./routes/reservas");

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/canchas", canchaRoutes);
app.use("/api/reservas", reservaRoutes);

module.exports = app;

// Ejecutar solo si no está en test
if (require.main === module) {
  app.listen(5000, () => {
    console.log("Servidor corriendo en http://localhost:5000");
  });
}
