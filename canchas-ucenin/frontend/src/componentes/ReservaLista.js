import React, { useEffect, useState } from "react";

function ReservationsList({ selectedDate }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/reservas?fecha=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setReservas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener reservas:", err);
        setLoading(false);
      });
  }, [selectedDate]);

  if (loading) return <p>Cargando reservas...</p>;

  if (reservas.length === 0)
    return <p>No hay reservas para el {selectedDate}</p>;

  return (
    <div>
      <h3>Reservas para {selectedDate}</h3>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            <strong>Cancha:</strong> {reserva.cancha?.nombre || "Desconocida"} <br />
            <strong>Hora:</strong> {reserva.hora_inicio.slice(0, 5)} <br />
            <strong>Duración:</strong> {reserva.duracion_horas} hora(s)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReservationsList;