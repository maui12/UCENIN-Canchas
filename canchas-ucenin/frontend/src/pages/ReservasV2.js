import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// URL base de tu API de Node.js
// ¡IMPORTANTE! Asegúrate de que esta URL y puerto sean los correctos para tu backend.
// Por ejemplo, si tu backend corre en el puerto 3001, sería 'http://localhost:3001/api/reservas'
const API_URL = "http://localhost:3001/api/reservas";

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
    try {
      // Tu endpoint de backend para obtener horarios es '/horarios?date='
      const response = await fetch(`${API_URL}/horarios?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();

      // Procesar los datos para agrupar por cancha y mostrar en el frontend
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

      // Ordenar las canchas por ID para una visualización consistente
      const canchasArray = Array.from(canchasMap.values()).sort((a, b) => a.id - b.id);
      setCanchasDisponibles(canchasArray);

    } catch (err) {
      console.error("Error al obtener horarios desde el backend:", err);
      setError("No se pudieron cargar los horarios. Inténtalo de nuevo más tarde.");
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

    // Aquí, para simplificar, asumiremos un usuario de prueba y que la reserva es de 1 hora
    // y que no necesitas ingresar jugadores en esta interfaz.
    // **NOTA:** Deberás adaptar esto según cómo manejes la autenticación
    // y la información del usuario en tu aplicación real.
    const usuarioIdSimulado = 1; // Reemplaza con el ID del usuario logueado
    const horaDuracion = 1; // Asumimos que cada bloque de reserva es de 1 hora

    try {
      // Preparamos las reservas individuales a enviar
      const reservasAEnviar = Object.entries(seleccion).map(([canchaId, horaInicio]) => {
        const [horas, minutos] = horaInicio.split(":").map(Number);
        const horaFin = new Date();
        horaFin.setHours(horas + horaDuracion);
        horaFin.setMinutes(minutos);
        horaFin.setSeconds(0);
        horaFin.setMilliseconds(0);

        return {
          usuarioId: usuarioIdSimulado,
          canchaId: parseInt(canchaId), // Asegúrate que sea un número
          fecha: fecha, // La fecha seleccionada
          horaInicio: horaInicio,
          horaFin: horaFin.toTimeString().substring(0, 5), // Formato "HH:MM"
          jugadores: [] // Si los jugadores se manejan en otra parte o no son obligatorios aquí
        };
      });

      // Puedes enviar las reservas una por una o un array, dependiendo de tu API
      // Para este ejemplo, las enviaremos de una en una.
      const resultadosReservas = [];
      for (const reservaData of reservasAEnviar) {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Si usas tokens de autenticación (JWT), deberías enviarlo aquí:
            // 'Authorization': `Bearer ${tuTokenDeAutenticacion}`
          },
          body: JSON.stringify(reservaData)
        });

        const result = await response.json();

        if (!response.ok) {
          // Si una reserva falla, lanzamos un error que será capturado por el catch
          throw new Error(result.error || `Error al reservar la cancha ${reservaData.canchaId} a las ${reservaData.horaInicio}`);
        }
        resultadosReservas.push(result);
      }

      alert("¡Reserva(s) realizada(s) con éxito!");
      // Volver a cargar los horarios para que se reflejen los cambios (reservas)
      fetchHorariosDisponibles(fecha);
      setSeleccion({}); // Limpiar la selección actual
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
                  disabled={horario.reservada || loading} // Deshabilita si está reservado o cargando
                  style={{
                    padding: "5px 10px",
                    backgroundColor: horario.reservada
                      ? "salmon" // Rojo si está reservado
                      : seleccion[cancha.id] === horario.hora
                      ? "lightgreen" // Verde si está seleccionado
                      : "lightgray", // Gris si está disponible
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
          disabled={loading || Object.keys(seleccion).length === 0} // Deshabilita si está cargando o no hay nada seleccionado
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