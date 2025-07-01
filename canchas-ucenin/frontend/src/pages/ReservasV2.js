import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// URL base de tu API de Node.js
// ¡IMPORTANTE! Asegúrate de que esta URL y puerto sean los correctos para tu backend.
// Por ejemplo, si tu backend corre en el puerto 3001, sería 'http://localhost:3001/api/reservas'
const API_URL = "http://localhost:5000/api/reservas";

const Reservas = () => {
  const [fecha, setFecha] = useState("");
  const [canchasDisponibles, setCanchasDisponibles] = useState([]); // Aquí guardaremos los datos de canchas y sus horarios del backend
  const [seleccion, setSeleccion] = useState({}); // { canchaId: horaSeleccionada }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Lógica para obtener las canchas y horarios ---
  const fetchHorariosDisponibles = async (selectedDate) => {
    if (!selectedDate) {
      setCanchasDisponibles([]);
      setSeleccion({}); // Limpiar selección si no hay fecha
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No estás autenticado para ver los horarios. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/horarios?date=${selectedDate}`, {
        method: 'GET', // Generalmente es GET para obtener datos
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ¡AÑADIDO: Envía el token aquí!
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error HTTP: ${response.status} - ${errorData.message || response.statusText}`);
      }
      const data = await response.json();

      const canchasMap = new Map();
      data.forEach(item => {
        if (!canchasMap.has(item.id_cancha)) {
          canchasMap.set(item.id_cancha, {
            id: item.id_cancha,
            nombre: item.cancha,
            horarios: []
          });
        }
        canchasMap.get(item.id_cancha).horarios.push({
          hora: item.hora_inicio,
          reservada: item.reservada
        });
      });

      const canchasArray = Array.from(canchasMap.values()).sort((a, b) => a.id - b.id);
      setCanchasDisponibles(canchasArray);

    } catch (err) {
      console.error("Error al obtener horarios desde el backend:", err);
      // Mensaje de error más específico para el usuario
      setError(`No se pudieron cargar los horarios: ${err.message || 'Error desconocido'}. Por favor, asegúrate de estar logueado.`);
    } finally {
      setLoading(false);
    }
  };

  // Usar useEffect para llamar a la API cuando la fecha cambie
  useEffect(() => {
    fetchHorariosDisponibles(fecha);
  }, [fecha]);

  // --- Lógica para seleccionar horarios ---
  const seleccionarHorario = (canchaId, hora) => {
    // Si ya está seleccionado para esa cancha, lo deselecciona
    if (seleccion[canchaId] === hora) {
      setSeleccion(prev => {
        const newState = { ...prev };
        delete newState[canchaId];
        return newState;
      });
    } else {
      // Si no está seleccionado o se selecciona otro horario para la misma cancha
      setSeleccion(prev => ({
        ...prev,
        [canchaId]: hora
      }));
    }
  };

  // --- Lógica para enviar la reserva al backend ---
  const enviarReserva = async () => {
    if (!fecha || Object.keys(seleccion).length === 0) {
      alert("Por favor, selecciona una fecha y al menos un horario para reservar.");
      return;
    }

    setLoading(true);
    setError(null);

    const userData = localStorage.getItem('user');
    let usuarioIdReal = null;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        usuarioIdReal = user.id;
      } catch (e) {
        console.error("Error al parsear usuario de localStorage para reserva:", e);
        setError("Error de autenticación. Por favor, inicia sesión de nuevo.");
        setLoading(false);
        return;
      }
    }

    if (!usuarioIdReal) {
      setError("No se pudo identificar al usuario para la reserva. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    const horaDuracion = 1;

    try {
      const reservasAEnviar = Object.entries(seleccion).map(([canchaId, horaInicio]) => {
        const [horas, minutos] = horaInicio.split(":").map(Number);
        const horaFin = new Date();
        horaFin.setHours(horas + horaDuracion);
        horaFin.setMinutes(minutos);
        horaFin.setSeconds(0);
        horaFin.setMilliseconds(0);

        return {
          usuarioId: usuarioIdReal,
          canchaId: parseInt(canchaId),
          fecha: fecha,
          horaInicio: horaInicio,
          horaFin: horaFin.toTimeString().substring(0, 5),
          jugadores: []
        };
      });

      const token = localStorage.getItem('token');

      if (!token) {
        setError("No estás autenticado para realizar reservas. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      const resultadosReservas = []; // Asegurarse de que esta variable esté declarada
      for (const reservaData of reservasAEnviar) {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reservaData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Error al reservar la cancha ${reservaData.canchaId} a las ${reservaData.horaInicio}`);
        }
        resultadosReservas.push(result);
      }

      alert("¡Reserva(s) realizada(s) con éxito!");
      fetchHorariosDisponibles(fecha);
      setSeleccion({});
    } catch (err) {
      console.error("Error al enviar la reserva:", err);
      setError(`Error al reservar: ${err.message}.`);
      alert(`Error al reservar: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const gotoDashboard = () => {
    navigate('/dashboard');
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

      {loading && <p>Cargando horarios...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {fecha && !loading && !error && canchasDisponibles.length === 0 && (
        <p>No hay horarios disponibles para esta fecha.</p>
      )}

      {fecha && !loading && !error && canchasDisponibles.length > 0 && (
        canchasDisponibles.map((cancha) => (
          <div key={cancha.id} style={{ marginBottom: "20px" }}>
            <h3>{cancha.nombre}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {cancha.horarios.map((horario) => (
                <button
                  key={`${cancha.id}-${horario.hora}`}
                  onClick={() => seleccionarHorario(cancha.id, horario.hora)}
                  disabled={horario.reservada || loading}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: horario.reservada
                      ? "salmon"
                      : seleccion[cancha.id] === horario.hora
                      ? "lightgreen"
                      : "lightgray",
                    color: horario.reservada ? "white" : "black",
                    border: "1px solid #ccc",
                    cursor: horario.reservada || loading ? "not-allowed" : "pointer"
                  }}
                >
                  {horario.hora} {horario.reservada && "(Reservado)"}
                </button>
              ))}
            </div>
          </div>
        ))
      )}

      {fecha && (
        <button
          onClick={enviarReserva}
          disabled={loading || Object.keys(seleccion).length === 0}
          style={{ marginTop: "20px", padding: "10px 20px", opacity: (loading || Object.keys(seleccion).length === 0) ? 0.6 : 1 }}
        >
          {loading ? "Reservando..." : "Reservar Horario(s) Seleccionado(s)"}
        </button>
      )}
      <button onClick={gotoDashboard}>Volver</button>
    </div>
  );
};

export default Reservas;