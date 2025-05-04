const express = require("express");
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.json({ message: "hola soy el backend" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});