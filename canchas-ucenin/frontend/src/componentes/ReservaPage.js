import { useEffect, useState } from "react";
import axios from "axios";

function ReservationsList({ selectedDate }) {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      axios
        .get(`/api/reservas?date=${selectedDate}`)
        .then(res => setReservas(res.data))
        .catch(err => console.error("Error cargando reservas:", err));
    }
  }, [selectedDate]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Reservas para el {selectedDate}
      </h2>
      <div className="space-y-3">
        {reservas.map((r, i) => (
          <div key={i} className="border p-3 rounded shadow-sm">
            <p><strong>Cancha:</strong> {r.cancha}</p>
            <p><strong>Horario:</strong> {r.hora_inicio}</p>
            <p><strong>Estado:</strong> {r.reservada ? "Reservada" : "Disponible"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReservationsList;