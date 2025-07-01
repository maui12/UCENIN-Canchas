import React, { useState } from "react";

const canchas = [
  { id: 1, nombre: "Cancha 1" },
  { id: 2, nombre: "Cancha 2" }
];

const horarios = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00"
];

const Reservas = () => {
  const [fecha, setFecha] = useState("");
  const [seleccion, setSeleccion] = useState({});

  const seleccionarHorario = (canchaId, hora) => {
    setSeleccion((prev) => ({
      ...prev,
      [canchaId]: hora
    }));
  };

  const enviarReserva = () => {
    console.log("Reserva simulada:", {
      fecha,
      reservas: seleccion
    });
    alert("Reserva simulada, revisa la consola.");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Reserva de Canchas</h1>

      <label>Selecciona una fecha:</label><br />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        style={{ marginBottom: "20px", marginTop: "5px" }}
      />

      {fecha && canchas.map((cancha) => (
        <div key={cancha.id} style={{ marginBottom: "20px" }}>
          <h3>{cancha.nombre}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {horarios.map((hora) => (
              <button
                key={hora}
                onClick={() => seleccionarHorario(cancha.id, hora)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: seleccion[cancha.id] === hora ? "lightgreen" : "lightgray",
                  border: "1px solid #ccc",
                  cursor: "pointer"
                }}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>
      ))}

      {fecha && (
        <button onClick={enviarReserva} style={{ marginTop: "20px", padding: "10px 20px" }}>
          Reservar
        </button>
      )}
    </div>
  );
};

export default Reservas;